// hooks.js - RPC 오류 해결 및 최적화 버전
/* global BigInt */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt, 
  useReadContracts,
  useFeeData,
  useBalance,
  usePublicClient
} from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { 
  VAULT_ADDRESS, 
  VAULT_ABI, 
  ERC20_ABI, 
  BGSC_TOKEN_ADDRESS, 
  WBNB_ADDRESS,
  ROUND_CONFIG,
  UI_CONFIG,
  GAS_CONFIG,
  EVENT_FILTERS,
  VAULT_DEPLOY_BLOCK,
} from './constants';
import { 
  parseAmount, 
  calculateBGSCFromPoints, 
  calculatePointsFromBGSC, 
  getMerkleProof,
  safeBigInt,
  parseError,
  formatAmount,
  formatFullAmount,
  getDynamicText,
  SecurityUtils,
  createSimpleCache,
  MobileWalletUtils
} from './utils';
import toast from 'react-hot-toast';
import { getToastMessage } from './toastMessages';

// ✅ 이벤트 캐시 - RPC 호출 최소화
const eventCache = createSimpleCache(300000); // 5분 캐시
const pendingTxCache = new Map(); // 대기 중인 트랜잭션 추적
const rpcErrorCount = new Map(); // RPC 에러 카운트 추적

// ✅ Rate limiting 방지를 위한 지연 함수
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ 요청 큐 시스템 - Rate limiting 스마트 방지
class RequestQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.lastRequestTime = 0;
    this.minInterval = 100; // 최소 100ms 간격
  }

  async add(fn, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject, priority });
      this.queue.sort((a, b) => b.priority - a.priority); // 우선순위 정렬
      this.process();
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    // 마지막 요청으로부터 충분한 시간이 지났는지 확인
    if (timeSinceLastRequest < this.minInterval) {
      await delay(this.minInterval - timeSinceLastRequest);
    }
    
    const { fn, resolve, reject } = this.queue.shift();
    this.lastRequestTime = Date.now();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        // 다음 요청을 비동기로 처리
        setTimeout(() => this.process(), 0);
      }
    }
  }
}

const requestQueue = new RequestQueue();

// ✅ 커스텀 트랜잭션 확인 훅 - 400ms마다 한 번씩만 확인
const useOptimizedTransactionReceipt = (hash, refreshCallback) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const publicClient = usePublicClient();
  const intervalRef = useRef(null);
  const checkCountRef = useRef(0);

  useEffect(() => {
    if (!hash || !publicClient) {
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    checkCountRef.current = 0;

    const checkTransaction = async () => {
      try {
        checkCountRef.current += 1;
        console.log(` Checking transaction ${hash} (attempt ${checkCountRef.current})`);
        
        const receipt = await publicClient.getTransactionReceipt({ hash });
        
        if (receipt) {
          console.log(`✅ Transaction confirmed: ${hash}`);
          setIsSuccess(receipt.status === 'success');
          setIsLoading(false);
          
          // 트랜잭션 확인 후 즉시 데이터 업데이트
          if (refreshCallback && receipt.status === 'success') {
            setTimeout(() => {
              refreshCallback();
            }, 100); // 블록이 완전히 처리되도록 약간의 지연
          }
          
          // 인터벌 정리
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
        // 계속 시도
      }
    };

    // 즉시 첫 번째 확인
    checkTransaction();

    // 400ms마다 확인
    intervalRef.current = setInterval(checkTransaction, 400);

    // 30초 후 타임아웃
    const timeoutId = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsLoading(false);
        console.warn(`⏱️ Transaction check timeout: ${hash}`);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [hash, publicClient, refreshCallback]);

  return { isLoading, isSuccess };
};

// ✅ 스마트 재시도 로직 - 모바일 최적화
const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 0,      // 첫 시도는 지연 없이
    maxDelay = 5000,       // 최대 5초
    multiplier = 2,
    context = 'transaction'
  } = options;
  
  const isMobile = MobileWalletUtils.isMobile();
  const walletType = MobileWalletUtils.detectWalletApp();
  
  let lastError;
  let currentDelay = initialDelay;
  
  // 모바일에서는 더 긴 재시도 간격
  if (isMobile) {
    options.maxRetries = 5; // 모바일은 더 많은 재시도
    options.maxDelay = 10000; // 모바일은 최대 10초
  }
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      // 첫 번째 시도는 즉시, 재시도만 지연
      if (i > 0) {
        console.log(`Retry attempt ${i}/${maxRetries} after ${currentDelay}ms for ${context}`);
        await delay(currentDelay);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorCode = error?.code;
      
      // Rate limit 에러인 경우에만 재시도
      if (errorMessage.includes('rate limit') || errorCode === -32603 || errorCode === 429) {
        // 모바일은 더 긴 지연
        if (isMobile) {
          currentDelay = i === 0 ? 1000 : Math.min(currentDelay * multiplier, options.maxDelay);
        } else {
          currentDelay = i === 0 ? 500 : Math.min(currentDelay * multiplier, maxDelay);
        }
        
        if (i < maxRetries) {
          // 모바일에서는 더 구체적인 메시지
          if (isMobile) {
            toast.loading('네트워크가 혼잡합니다. 재시도 중...', {
              id: 'rate-limit',
              duration: 3000
            });
          } else {
            toast.loading('처리 중...', {
              id: 'rate-limit',
              duration: 1500
            });
          }
        }
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
        // 사용자 취소는 즉시 실패
        throw error;
      } else if (errorMessage.includes('nonce too low')) {
        // Nonce 에러는 짧은 지연 후 재시도
        currentDelay = isMobile ? 500 : 300;
      } else if (isMobile && (errorMessage.includes('walletconnect') || errorMessage.includes('session'))) {
        // 모바일 WalletConnect 에러는 더 긴 지연 후 재시도
        currentDelay = 2000;
        if (i < maxRetries) {
          toast.error('지갑 연결을 확인해주세요', { id: 'wallet-connection', duration: 2000 });
        }
      } else if (isMobile && errorMessage.includes('timeout')) {
        // 모바일 타임아웃은 재시도
        currentDelay = 3000;
      } else {
        // 기타 에러는 재시도하지 않음
        throw error;
      }
      
      if (i === maxRetries) {
        throw error;
      }
    }
  }
  
  throw lastError;
};

// ✅ RPC 에러 관리 함수
const handleRpcError = (error, context = '') => {
  const errorKey = `${context}_${Date.now()}`;
  const count = (rpcErrorCount.get(context) || 0) + 1;
  rpcErrorCount.set(context, count);
  
  // 에러가 너무 많이 발생하면 일시적으로 비활성화
  if (count > 5) {
    console.warn(`Too many RPC errors in ${context}, temporarily disabling...`);
    return true; // 비활성화 신호
  }
  
  // 특정 에러는 무시
  if (error?.message?.includes('filter not found')) {
    return false;
  }
  
  console.warn(`RPC Error in ${context}:`, error.message || error);
  return false;
};

// ✅ 가스비 조회 훅
export const useGasPrice = () => {
  const { data: feeData, isLoading: isGasLoading } = useFeeData({
    formatUnits: 'gwei',
    // watch: true, // 비활성화 - 과도한 RPC 조회 방지
    staleTime: 300000, // 5 minutes - gas prices don't change that quickly
  });

  const [gasPrices, setGasPrices] = useState({
    slow: GAS_CONFIG.FALLBACK_PRICES.slow,
    standard: GAS_CONFIG.FALLBACK_PRICES.standard,
    fast: GAS_CONFIG.FALLBACK_PRICES.fast,
    lastUpdated: Date.now(),
  });

  useEffect(() => {
    if (feeData?.gasPrice) {
      const basePrice = feeData.gasPrice;
      const basePriceNum = Number(basePrice.toString());
      
      const slowPrice = Math.floor(basePriceNum * GAS_CONFIG.SPEED_SETTINGS.slow.multiplier).toString();
      const standardPrice = Math.floor(basePriceNum * GAS_CONFIG.SPEED_SETTINGS.standard.multiplier).toString();
      const fastPrice = Math.floor(basePriceNum * GAS_CONFIG.SPEED_SETTINGS.fast.multiplier).toString();

      setGasPrices({
        slow: slowPrice,
        standard: standardPrice,
        fast: fastPrice,
        lastUpdated: Date.now(),
      });
    }
  }, [feeData]);

  const calculateGasFee = useCallback((gasLimit, speed = 'standard') => {
    try {
      const gasPrice = gasPrices[speed] || gasPrices.standard;
      const gasFee = BigInt(gasPrice) * BigInt(gasLimit);
      return formatUnits(gasFee, 18);
    } catch (error) {
      console.warn('Gas fee calculation failed:', error);
      return '0.002';
    }
  }, [gasPrices]);

  return {
    gasPrices,
    calculateGasFee,
    isLoading: isGasLoading
  };
};

// ✅ 트랜잭션 히스토리 훅 - 심플 버전
export const useTransactionHistory = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const HISTORY_API_BASE = 'https://v2-indexer-api.aden.io/api';

  const loadTransactions = useCallback(async (page = 1) => {
    if (!address || isLoadingHistory) return;
    
    setIsLoadingHistory(true);
    
    try {
      const currentOffset = (page - 1) * itemsPerPage;
      const response = await fetch(
        `${HISTORY_API_BASE}/user/history/${address.toLowerCase()}?limit=${itemsPerPage}&offset=${currentOffset}&include_count=true`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data = await response.json();
      
      console.log('History API Response:', data); // 디버깅용
      
      // API 응답 구조 확인 (data 또는 data.data)
      const transactions = Array.isArray(data) ? data : (data.data || data.items || []);
      
      // Transform API response to match expected format
      const transformedTransactions = transactions.map(tx => {
        // API에서 오는 amount와 shares는 이미 사람이 읽을 수 있는 형식의 숫자
        // BigInt로 변환하려면 18 decimals를 곱해야 함
        let amountBigInt = null;
        let sharesBigInt = null;
        
        if (tx.amount !== null && tx.amount !== undefined) {
          try {
            // 소수점 숫자를 문자열로 변환 후 parseUnits 사용
            amountBigInt = parseUnits(tx.amount.toString(), 18);
          } catch (e) {
            console.warn('Failed to parse amount:', tx.amount, e);
            // 실패시 0으로 설정
            amountBigInt = 0n;
          }
        }
        
        if (tx.shares !== null && tx.shares !== undefined) {
          try {
            // 소수점 숫자를 문자열로 변환 후 parseUnits 사용
            sharesBigInt = parseUnits(tx.shares.toString(), 18);
          } catch (e) {
            console.warn('Failed to parse shares:', tx.shares, e);
            // 실패시 0으로 설정
            sharesBigInt = 0n;
          }
        }
        
        return {
          txHash: tx.tx_hash,
          type: mapEventType(tx.event_type, tx.display_type),
          amount: amountBigInt,
          shares: sharesBigInt,
          round: tx.round,
          timestamp: new Date(tx.timestamp).getTime() / 1000,
          blockNumber: tx.block_number,
          status: tx.status || 'confirmed',
          methodName: tx.method_name,
          displayType: tx.display_type,
          eventType: tx.event_type
        };
      });
      
      setTransactions(transformedTransactions);
      setCurrentPage(page);
      setOffset(currentOffset);
      
      // Total count 처리 - API 응답 구조에 따라 조정
      const totalFromApi = data.total || data.count || data.total_count || 
                          (data.pagination && data.pagination.total) || 0;
      setTotalCount(totalFromApi);
      
      // hasMore 처리
      const hasMore = data.has_more !== undefined ? data.has_more : 
                     (totalFromApi > currentOffset + transformedTransactions.length);
      setHasMoreHistory(hasMore);
      setHasInitialLoad(true);
      
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoadingHistory(false);
    }
  }, [address, itemsPerPage, isLoadingHistory]);

  const refreshHistory = useCallback(() => {
    setCurrentPage(1);
    setOffset(0);
    loadTransactions(1);
  }, [loadTransactions]);

  const changeItemsPerPage = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setOffset(0);
  }, []);

  const goToPage = useCallback((page) => {
    loadTransactions(page);
  }, [loadTransactions]);

  // Map API event types to display types
  const mapEventType = (eventType, displayType) => {
    // Handle MaxRedeem special case
    if (displayType === 'MaxRedeem' || eventType === 'max_redeem') {
      return 'redeem';
    }
    
    const typeMap = {
      'deposit': 'deposit',
      'deposit_bnb': 'deposit',
      'deposit_for': 'deposit',
      'private_deposit': 'deposit',
      'withdraw': 'withdraw',
      'instant_withdraw': 'instantWithdraw',
      'complete_withdraw': 'withdraw',
      'initiate_withdraw': 'initiateWithdraw',
      'initiate_withdraw_transfer': 'initiateWithdraw',
      'redeem_transfer': 'redeem',  // 포인트 토큰 수령
      'redeem': 'redeem',
      'max_redeem': 'redeem',
      'approval': 'approval'
    };
    
    return typeMap[eventType] || eventType;
  };

  // Initial load
  useEffect(() => {
    if (address && !hasInitialLoad && !isLoadingHistory) {
      loadTransactions(1);
    }
  }, [address]); // 초기 로드는 address 변경시에만

  // Reset on address change
  useEffect(() => {
    if (address) {
      setTransactions([]);
      setOffset(0);
      setCurrentPage(1);
      setHasInitialLoad(false);
      setHasMoreHistory(false);
      setTotalCount(0);
    }
  }, [address]);

  // Reload when items per page changes
  useEffect(() => {
    if (address && hasInitialLoad && itemsPerPage) {
      loadTransactions(1);
    }
  }, [itemsPerPage]); // loadTransactions를 종속성에서 제거

  return { 
    transactions, 
    isLoadingHistory, 
    refreshHistory, 
    hasMoreHistory,
    currentPage,
    totalCount,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
    totalPages: Math.ceil(totalCount / itemsPerPage)
  };
};

// ✅ 통합 볼트 데이터 훅 - 실시간 업데이트 강화
export const useVaultData = () => {
  const { address } = useAccount();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  // ✅ 볼트 전체 데이터 배치 조회 - 한 번의 RPC 호출로 모든 데이터 가져오기
  const vaultContracts = [
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'vaultParams',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'isPublic',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'round',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'WBNB',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'totalBalance',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'totalSupply',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'vaultState',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'lastQueuedWithdrawAmount',
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'pricePerShare',
    },
  ];

  const { data: vaultBatchData, refetch: refetchVaultBatch } = useReadContracts({
    contracts: vaultContracts,
    watch: true, // 실시간 데이터 필요
  });

  // 배치 데이터 파싱
  const vaultParams = vaultBatchData?.[0]?.result;
  const isPublic = vaultBatchData?.[1]?.result;
  const currentRound = vaultBatchData?.[2]?.result;
  const wbnbAddress = vaultBatchData?.[3]?.result;
  const totalBalance = vaultBatchData?.[4]?.result;
  const totalSupply = vaultBatchData?.[5]?.result;
  const vaultState = vaultBatchData?.[6]?.result;
  const lastQueuedWithdrawAmount = vaultBatchData?.[7]?.result;
  const pricePerShare = vaultBatchData?.[8]?.result;
  
  const vaultParamsError = vaultBatchData?.[0]?.error;

  // ✅ 사용자별 데이터 배치 조회 - 한 번의 RPC 호출로 모든 사용자 데이터 가져오기
  const userContracts = address ? [
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'shareBalances',
      args: [address],
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'depositReceipts',
      args: [address],
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'withdrawals',
      args: [address],
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'accountVaultBalance',
      args: [address],
    },
    {
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'canDeposit',
      args: [address, []],
    },
  ] : [];

  const { data: userBatchData, refetch: refetchUserBatch } = useReadContracts({
    contracts: userContracts,
    enabled: !!address,
    watch: true, // 실시간 데이터 필요
  });

  // 사용자 데이터 파싱
  const shareBalances = userBatchData?.[0]?.result;
  const depositReceipt = userBatchData?.[1]?.result;
  const withdrawal = userBatchData?.[2]?.result;
  const accountVaultBalance = userBatchData?.[3]?.result;
  const canDeposit = userBatchData?.[4]?.result;

  // ✅ 전체 데이터 리프레시 함수 - 배치 처리로 최적화
  const refreshAllData = useCallback(async () => {
    console.log('🔄 Refreshing all vault data...');
    setIsForceRefreshing(true);

    try {
      // 배치로 한번에 리페치 - 2개의 RPC 호출만 필요
      await Promise.all([
        refetchVaultBatch(),
        address && refetchUserBatch(),
      ].filter(Boolean));

      console.log('✅ All data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsForceRefreshing(false);
    }
  }, [address, refetchVaultBatch, refetchUserBatch]);

  // 볼트 정보 파싱
  const vaultInfo = useMemo(() => {
    const defaultVaultInfo = {
      decimals: UI_CONFIG.DEFAULT_DECIMALS,
      asset: BGSC_TOKEN_ADDRESS || null,
      minimumSupply: '0',
      cap: '1000000000000000000000000',
      isPublic: true,
      currentRound: 1,
      isWBNB: false,
      hasError: false
    };

    if (vaultParamsError) {
      console.error('Vault params error:', vaultParamsError);
      // Return default values instead of error state
      return defaultVaultInfo;
    }

    try {
      const parsedInfo = {
        decimals: vaultParams ? Number(vaultParams[0]) : UI_CONFIG.DEFAULT_DECIMALS,
        asset: vaultParams ? vaultParams[1] : (BGSC_TOKEN_ADDRESS || null),
        minimumSupply: vaultParams ? vaultParams[2].toString() : '0',
        cap: vaultParams ? vaultParams[3].toString() : '1000000000000000000000000',
        isPublic: Boolean(isPublic ?? true),
        currentRound: Math.max(1, Number(currentRound || 1)),
        isWBNB: vaultParams && vaultParams[1] && wbnbAddress ? 
          vaultParams[1].toLowerCase() === wbnbAddress.toLowerCase() : false,
        hasError: false
      };
      
      return parsedInfo;
    } catch (error) {
      console.error('Error parsing vault info:', error);
      // Return default values instead of error state
      return defaultVaultInfo;
    }
  }, [vaultParams, vaultParamsError, isPublic, currentRound, wbnbAddress]);

  // 볼트 메트릭스 파싱
  const vaultMetrics = useMemo(() => {
    const defaultMetrics = {
      totalValueLocked: '0',
      totalPointsSupply: '0',
      pendingDeposits: '0',
      queuedWithdrawAmount: '0',
      pricePerPoint: '1000000000000000000',
      lockedAmount: '0',
      availableBalance: '0',
      hasError: false
    };

    try {
      const lockedAmount = vaultState ? (vaultState[1] || 0n) : 0n;
      const pendingDeposits = vaultState ? (vaultState[3] || 0n) : 0n;
      const availableBalance = safeBigInt(totalBalance || 0n) - safeBigInt(lockedAmount);
      
      const parsedMetrics = {
        totalValueLocked: (totalBalance || 0n).toString(),
        totalPointsSupply: (totalSupply || 0n).toString(),
        pendingDeposits: pendingDeposits.toString(),
        queuedWithdrawAmount: (lastQueuedWithdrawAmount || 0n).toString(),
        pricePerPoint: (pricePerShare || BigInt(10) ** BigInt(18)).toString(),
        lockedAmount: lockedAmount.toString(),
        availableBalance: Math.max(0, Number(availableBalance)).toString(),
        hasError: false
      };
      
      return parsedMetrics;
    } catch (error) {
      console.error('Error parsing vault metrics:', error);
      // Return default values instead of error state
      return defaultMetrics;
    }
  }, [totalBalance, totalSupply, vaultState, lastQueuedWithdrawAmount, pricePerShare]);

  // 사용자 잔액 파싱
  const userBalance = useMemo(() => {
    const defaultUserBalance = {
      walletPoints: '0',
      unredeemedPoints: '0',
      pendingDepositAmount: '0',
      queuedWithdrawPoints: '0',
      totalPoints: '0',
      totalValue: '0',
      canInstantWithdraw: false,
      withdrawableAmount: '0',
      claimableBGSC: '0',
      hasWithdrawalRequest: false,
      withdrawalRound: 0,
      isWhitelisted: true,
      hasError: false
    };

    if (!address) {
      return defaultUserBalance;
    }

    try {
      const walletPoints = shareBalances ? shareBalances[0] || 0n : 0n;
      const vaultPoints = shareBalances ? shareBalances[1] || 0n : 0n;
      const totalPoints = safeBigInt(walletPoints) + safeBigInt(vaultPoints);
      
      const depositRound = depositReceipt ? Number(depositReceipt[0]) : 0;
      const depositAmount = depositReceipt ? (depositReceipt[1] || 0n) : 0n;
      
      // 디버깅: 실제 값 확인
      if (depositAmount > 0n) {
        console.log('Deposit Amount from Contract:', depositAmount.toString());
        console.log('Deposit Amount in BGSC:', formatUnits(depositAmount, vaultInfo.decimals));
      }
      
      // 현재 라운드에 입금한 경우에만 즉시 출금 가능
      const canInstantWithdraw = depositRound === vaultInfo.currentRound && safeBigInt(depositAmount) > 0n;
      
      // 실제로 출금 가능한 금액 (현재 라운드 입금분만)
      const actualWithdrawableAmount = canInstantWithdraw ? depositAmount : 0n;
      
      const withdrawalRound = withdrawal ? Number(withdrawal[0]) : 0;
      const withdrawalPoints = withdrawal ? (withdrawal[1] || 0n) : 0n;
      const hasWithdrawalRequest = safeBigInt(withdrawalPoints) > 0n;
      
      let claimableBGSC = 0n;
      if (hasWithdrawalRequest && withdrawalRound < vaultInfo.currentRound && vaultMetrics.pricePerPoint !== '0') {
        try {
          claimableBGSC = calculateBGSCFromPoints(
            withdrawalPoints,
            vaultMetrics.pricePerPoint,
            vaultInfo.decimals
          );
        } catch (error) {
          console.warn('Failed to calculate claimable BGSC:', error);
        }
      }

      const parsedBalance = {
        walletPoints: walletPoints.toString(),
        unredeemedPoints: vaultPoints.toString(),
        pendingDepositAmount: depositAmount.toString(),
        queuedWithdrawPoints: withdrawalPoints.toString(),
        totalPoints: totalPoints.toString(),
        totalValue: (accountVaultBalance || 0n).toString(),
        canInstantWithdraw,
        withdrawableAmount: actualWithdrawableAmount.toString(),
        claimableBGSC: claimableBGSC.toString(),
        hasWithdrawalRequest,
        withdrawalRound,
        depositRound, // 입금 라운드 추가
        currentRound: vaultInfo.currentRound, // 현재 라운드 추가
        isWhitelisted: Boolean(canDeposit ?? true),
        hasError: false
      };

      return parsedBalance;
    } catch (error) {
      console.error('Error parsing user balance:', error);
      // Return default values instead of error state
      return defaultUserBalance;
    }
  }, [address, shareBalances, depositReceipt, withdrawal, accountVaultBalance, canDeposit, vaultInfo, vaultMetrics]);

  // 수동 새로고침 함수
  const refreshData = useCallback(() => {
    console.log('🔄 Manual data refresh triggered');
    setRefreshTrigger(prev => prev + 1);
    refreshAllData();
  }, [refreshAllData]);

  // 초기 로딩 상태 추적
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  
  // 초기 로딩 완료 감지
  useEffect(() => {
    if (vaultParams !== undefined && totalBalance !== undefined && !hasInitialLoad) {
      setHasInitialLoad(true);
    }
  }, [vaultParams, totalBalance, hasInitialLoad]);
  
  // Check for errors in data fetching (초기 로딩 후에만 에러 체크)
  const hasError = hasInitialLoad && !!(vaultParamsError || 
    (vaultParams === undefined && !isForceRefreshing) ||
    (totalBalance === undefined && !isForceRefreshing));
  const isLoading = isForceRefreshing || !hasInitialLoad;
  
  // ✅ 선택적 데이터 리프레시 함수들 (최적화)
  const refreshUserData = useCallback(async () => {
    if (!address) return;
    
    console.log('🔄 Refreshing user data only...');
    try {
      // 사용자 관련 데이터만 업데이트 - 배치로 1개 RPC 호출
      await refetchUserBatch();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [address, refetchUserBatch]);
  
  const refreshCriticalData = useCallback(async () => {
    console.log('🔄 Refreshing critical data only...');
    try {
      // 볼트 전체 데이터와 사용자 데이터 배치 업데이트 - 최대 2개 RPC 호출
      await Promise.all([
        refetchVaultBatch(),
        address && refetchUserBatch(),
      ].filter(Boolean));
    } catch (error) {
      console.error('Failed to refresh critical data:', error);
    }
  }, [address, refetchVaultBatch, refetchUserBatch]);

  return {
    vaultInfo,
    vaultMetrics,
    userBalance,
    hasError,
    isLoading,
    refreshData,
    refreshAllData,
    refreshUserData,
    refreshCriticalData
  };
};

// ✅ 토큰 잔액 훅 - 실시간 업데이트 및 승인 상태 추적
export const useTokenBalance = (vaultInfo) => {
  const { address } = useAccount();
  const [approvalStatus, setApprovalStatus] = useState('idle'); // idle, pending, approved
  
  // BNB 잔액 조회
  const { data: bnbBalance, refetch: refetchBnb } = useBalance({
    address: address,
    watch: true, // 실시간 데이터 필요
  });

  // ✅ BGSC 토큰 데이터 배치 조회 - 한 번의 RPC 호출로 잔액과 허용량 가져오기
  const tokenContracts = address && !vaultInfo.isWBNB ? [
    {
      address: BGSC_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    },
    {
      address: BGSC_TOKEN_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: [address, VAULT_ADDRESS],
    },
  ] : [];

  const { data: tokenBatchData, refetch: refetchTokenBatch } = useReadContracts({
    contracts: tokenContracts,
    enabled: !!address && !vaultInfo.isWBNB,
    watch: true, // 실시간 데이터 필요
  });

  // 토큰 데이터 파싱
  const tokenBalance = tokenBatchData?.[0]?.result;
  const allowance = tokenBatchData?.[1]?.result;

  const balances = useMemo(() => ({
    token: (tokenBalance || 0n).toString(),
    bnb: bnbBalance ? bnbBalance.value.toString() : '0',
    allowance: (allowance || 0n).toString(),
  }), [tokenBalance, bnbBalance, allowance]);

  // 잔액 리프레시 함수 - 배치 처리로 최적화
  const refreshBalances = useCallback(async () => {
    await Promise.all([
      refetchBnb(),
      refetchTokenBatch && refetchTokenBatch() // 토큰 잔액과 허용량을 한번에
    ].filter(Boolean));
  }, [refetchBnb, refetchTokenBatch]);

  // ✅ 토큰 승인 - 개선된 버전
  const { writeContractAsync: approveWrite, isLoading: isApprovePending } = useWriteContract();
  const [approveHash, setApproveHash] = useState(null);
  
  // 커스텀 트랜잭션 확인 훅 사용 - 400ms마다 확인하고 성공시 데이터 업데이트
  const { isLoading: isApproving, isSuccess: approveSuccess } = useOptimizedTransactionReceipt(
    approveHash,
    refreshBalances // 승인 후 자동으로 잔액과 허용량 업데이트
  );

  const approve = useCallback(async (amount) => {
    if (vaultInfo.isWBNB) return true;
    
    // 이미 승인 처리 중인 경우 중복 방지
    if (approvalStatus === 'pending' || isApproving) {
      return false;
    }
    
    try {
      setApprovalStatus('pending');
      const hash = await retryWithBackoff(async () => {
        return await approveWrite({
          address: BGSC_TOKEN_ADDRESS,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [VAULT_ADDRESS, amount],
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'token approval'
      });
      
      if (hash) {
        setApproveHash(hash);
        return true;
      }
      return false;
    } catch (error) {
      console.error('BGSC approval failed:', error);
      const errorMsg = parseError(error);
      setApprovalStatus('idle');
      return false;
    }
  }, [vaultInfo.isWBNB, approveWrite, approvalStatus, isApproving]);

  // 승인 성공 시 처리
  useEffect(() => {
    console.log(' Approval transaction status:', { approveSuccess, approveHash });
    if (approveSuccess && approveHash) {
      console.log('✅ Setting approval status to approved');
      setApproveHash(null);
      setApprovalStatus('approved');
      
      // 승인 후 즉시 잔액 및 허용량 업데이트
      setTimeout(() => {
        refreshBalances();
      }, 500);
    }
  }, [approveSuccess, approveHash, setApprovalStatus, refreshBalances]);
  
  // Allowance 변경 감지하여 승인 상태 업데이트
  useEffect(() => {
    console.log('💰 Allowance check:', { 
      allowance: allowance?.toString(), 
      approvalStatus,
      decimals: vaultInfo.decimals 
    });
    
    if (allowance !== undefined) {
      const currentAllowance = safeBigInt(allowance);
      
      if (currentAllowance > 0n) {
        // 충분한 allowance가 있고 pending 상태일 때만 approved로 변경
        if (approvalStatus === 'pending') {
          console.log('✅ Allowance confirmed, setting approved status');
          setApprovalStatus('approved');
        }
      } else {
        // allowance가 0이면 무조건 idle로 리셋 (상태와 무관하게)
        if (approvalStatus !== 'idle') {
          console.log('🔴 Allowance is 0, resetting to idle');
          setApprovalStatus('idle');
        }
      }
    }
  }, [allowance, approvalStatus, vaultInfo.decimals]);

  const isApprovalSufficient = useCallback((amount) => {
    if (vaultInfo.isWBNB) return true;
    if (!amount || amount === '0') return true;
    
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      const currentAllowance = safeBigInt(balances.allowance);
      const isSufficient = currentAllowance >= parsedAmount;
      
      console.log(' Approval sufficiency check:', {
        amount,
        parsedAmount: parsedAmount.toString(),
        currentAllowance: currentAllowance.toString(),
        isSufficient,
        approvalStatus
      });
      
      return isSufficient;
    } catch (error) {
      console.error('Error checking approval status:', error);
      return false;
    }
  }, [vaultInfo.isWBNB, vaultInfo.decimals, balances.allowance, approvalStatus]);

  return { 
    balances, 
    approve, 
    isApproving: isApproving || isApprovePending,
    approveSuccess,
    isApprovalSufficient,
    refreshBalances,
    approvalStatus,
    setApprovalStatus
  };
};

// Action hooks removed - use hooks-actions.js instead
/*
  const { vaultInfo, refreshAllData, refreshUserData } = useVaultData();
  const { 
    balances, 
    approve, 
    isApproving, 
    approveSuccess,
    isApprovalSufficient,
    refreshBalances,
    approvalStatus,
    setApprovalStatus
  } = useTokenBalance();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [depositParams, setDepositParams] = useState(null);

  const { writeContractAsync: writeDeposit } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const executeDepositTransaction = useCallback(async (amount, isBNB, recipient) => {
    setIsLoading(true);
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      
      // 입금 트랜잭션 실행 with retry logic
      const merkleProof = await getMerkleProof(address);
      
      const hash = await retryWithBackoff(async () => {
        if (vaultInfo.isWBNB && isBNB) {
          if (recipient) {
            return vaultInfo.isPublic 
              ? await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'depositBNBFor',
                  args: [recipient],
                  value: parsedAmount,
                })
              : await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'privateDepositBNB',
                  args: [merkleProof],
                  value: parsedAmount,
                });
          } else {
            return vaultInfo.isPublic
              ? await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'depositBNB',
                  value: parsedAmount,
                })
              : await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'privateDepositBNB',
                  args: [merkleProof],
                  value: parsedAmount,
                });
          }
        } else {
          if (recipient) {
            return vaultInfo.isPublic
              ? await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'depositFor',
                  args: [parsedAmount, recipient],
                })
              : await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'privateDeposit',
                  args: [parsedAmount, merkleProof],
                });
          } else {
            return vaultInfo.isPublic
              ? await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'deposit',
                  args: [parsedAmount],
                })
              : await writeDeposit({
                  address: VAULT_ADDRESS,
                  abi: VAULT_ABI,
                  functionName: 'privateDeposit',
                  args: [parsedAmount, merkleProof],
                });
          }
        }
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'deposit transaction'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'deposit', amount: parsedAmount.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('deposit.loading'), { id: 'deposit' });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Deposit failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [address, vaultInfo, writeDeposit]);

  // Monitor approval success and execute pending deposit immediately
  useEffect(() => {
    if (pendingApproval && approvalStatus === 'approved' && depositParams) {
      const executeDeposit = async () => {
        // 승인 완료 후 즉시 실행 (짧은 지연만 추가)
        await new Promise(resolve => setTimeout(resolve, 500));
        setPendingApproval(false);
        const { amount, isBNB, recipient } = depositParams;
        setDepositParams(null);
        await executeDepositTransaction(amount, isBNB, recipient);
      };
      executeDeposit();
    }
  }, [pendingApproval, approvalStatus, depositParams, executeDepositTransaction]);

  const handleDeposit = useCallback(async (amount, isBNB = false, recipient = null) => {
    if (!address || !amount || amount === '0') {
      toast.error(getToastMessage('deposit.emptyAmount'));
      return false;
    }
    
    // 이미 처리 중인 경우 중복 실행 방지
    if (isLoading || isApproving || pendingApproval) {
      toast.error(getToastMessage('deposit.alreadyProcessing'));
      return false;
    }
    
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      if (parsedAmount <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }
      
      // 최소 10000 BGSC 검증
      const minAmount = parseAmount('10000', vaultInfo.decimals);
      if (parsedAmount < minAmount) {
        toast.error(getToastMessage('deposit.minimumAmount', formatAmount(parsedAmount, vaultInfo.decimals)));
        return false;
      }

      // 토큰 승인 체크 (BNB가 아닌 경우)
      if (!isBNB && !vaultInfo.isWBNB) {
        if (!isApprovalSufficient(amount)) {
          // 승인이 필요한 경우
          setIsLoading(true);
          setPendingApproval(true);
          setDepositParams({ amount, isBNB, recipient });
          
          const approved = await approve(parsedAmount);
          if (!approved) {
            setIsLoading(false);
            setPendingApproval(false);
            setDepositParams(null);
            return false;
          }
          
          // 승인 트랜잭션은 제출됨, useEffect에서 승인 완료 후 자동으로 입금 실행
          return 'APPROVAL_SUBMITTED';
        }
      }

      // 승인이 이미 되어있거나 BNB인 경우 바로 입금 실행
      return await executeDepositTransaction(amount, isBNB, recipient);
    } catch (error) {
      console.error('Deposit preparation failed:', error);
      toast.error(getToastMessage('deposit.preparationError'));
      setIsLoading(false);
      setPendingApproval(false);
      setDepositParams(null);
      return false;
    }
  }, [address, vaultInfo, approve, isApprovalSufficient, isLoading, isApproving, pendingApproval, executeDepositTransaction]);

  // 트랜잭션 성공 시 처리
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      if (pendingTx?.type === 'deposit') {
        const amount = formatAmount(pendingTx.amount, vaultInfo.decimals);
        const round = vaultInfo.currentRound + 1;
        toast.success(getToastMessage('deposit.success', amount, round), { id: 'deposit' });
        pendingTxCache.delete(txHash);
        
        // Reset states after successful deposit
        setPendingApproval(false);
        setDepositParams(null);
        
        // 입금 후 - 캐시 무효화로 자동 업데이트됨
      }
      
      setTxHash(null);
      setApprovalStatus('idle');
    }
  }, [txSuccess, txHash, refreshBalances, refreshAllData, refreshUserData, setApprovalStatus, vaultInfo.decimals, vaultInfo.currentRound]);

  return { 
    handleDeposit, 
    isLoading: isLoading || isConfirming || pendingApproval,
    needsApproval: (amount) => !isApprovalSufficient(amount) && approvalStatus !== 'approved' && !pendingApproval,
    isApproving: isApproving || pendingApproval,
    approvalStatus
  };
};
*/

// ✅ 출금 액션 훅 - 완전 개선
export const useWithdrawActions = () => {
  const { vaultInfo, userBalance, refreshAllData, refreshCriticalData } = useVaultData();
  const { refreshBalances } = useTokenBalance();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync: writeWithdraw } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [txType, setTxType] = useState(null);
  
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleInstantWithdraw = useCallback(async (amount) => {
    if (!amount || amount === '0') {
      toast.error(getToastMessage('instantWithdraw.emptyAmount'));
      return false;
    }
    
    setIsLoading(true);
    setTxType('instant');
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      if (parsedAmount <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }

      const hash = await retryWithBackoff(async () => {
        return await writeWithdraw({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'withdrawInstantly',
          args: [parsedAmount],
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'instant withdraw'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'instantWithdraw', amount: parsedAmount.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('instantWithdraw.loading'), { id: 'instantWithdraw' });
      }
      
      return true;
    } catch (error) {
      console.error('Instant withdraw failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [vaultInfo.decimals, writeWithdraw]);

  const handleInitiateWithdraw = useCallback(async (shares) => {
    if (!shares || shares === '0') {
      toast.error(getToastMessage('withdraw.emptyAmount'));
      return false;
    }
    
    setIsLoading(true);
    setTxType('initiate');
    try {
      const parsedShares = parseAmount(shares, vaultInfo.decimals);
      if (parsedShares <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }

      const hash = await retryWithBackoff(async () => {
        return await writeWithdraw({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'initiateWithdraw',
          args: [parsedShares],
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'initiate withdraw'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'initiateWithdraw', shares: parsedShares.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('withdraw.requestingConversion'), { id: 'initiateWithdraw' });
      }
      
      return true;
    } catch (error) {
      console.error('Initiate withdraw failed:', error);
      
      // Check if the error is due to existing claimable BGSC
      const errorMsg = error?.message || error?.reason || '';
      if (errorMsg.includes('completeWithdraw') || 
          (safeBigInt(userBalance?.claimableBGSC) > 0n && errorMsg.includes('revert'))) {
        const lang = localStorage.getItem('bgsc-vault-language') || 'ko';
        if (lang === 'ko') {
          toast.error('새 변환 요청을 위해 아래 BGSC를 출금하세요.');
        } else {
          toast.error('You have claimable BGSC. Please withdraw your BGSC in Step 4 before making a new conversion request.');
        }
      } else {
        const parsedError = parseError(error);
        toast.error(parsedError);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [vaultInfo.decimals, writeWithdraw, userBalance?.claimableBGSC]);

  const handleCompleteWithdraw = useCallback(async () => {
    setIsLoading(true);
    setTxType('complete');
    try {
      const hash = await retryWithBackoff(async () => {
        return await writeWithdraw({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'completeWithdraw',
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'complete withdraw'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'completeWithdraw', amount: userBalance.claimableBGSC, timestamp: Date.now() });
        toast.loading(getToastMessage('withdraw.processing'), { id: 'completeWithdraw' });
      }
      
      return true;
    } catch (error) {
      console.error('Complete withdraw failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [writeWithdraw, userBalance.claimableBGSC]);

  // 트랜잭션 성공 시 처리
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      
      if (pendingTx?.type === 'instantWithdraw') {
        const amount = formatAmount(pendingTx.amount, vaultInfo.decimals);
        toast.success(getToastMessage('instantWithdraw.success', amount), { id: 'instantWithdraw' });
      } else if (pendingTx?.type === 'initiateWithdraw') {
        const amount = formatAmount(pendingTx.shares, vaultInfo.decimals);
        const round = vaultInfo.currentRound + 1;
        const lang = localStorage.getItem('bgsc-vault-language') || 'ko';
        const dynamicText = getDynamicText(lang);
        toast.success(getToastMessage('withdraw.conversionSuccess', amount, round, dynamicText.roundDuration), { id: 'initiateWithdraw' });
      } else if (pendingTx?.type === 'completeWithdraw') {
        const amount = formatAmount(pendingTx.amount, vaultInfo.decimals);
        toast.success(getToastMessage('withdraw.success', amount), { id: 'completeWithdraw' });
      }
      
      pendingTxCache.delete(txHash);
      
      // 출금 후 - 캐시 무효화로 자동 업데이트됨
      
      setTxHash(null);
      setTxType(null);
    }
  }, [txSuccess, txHash, refreshBalances, refreshAllData, refreshCriticalData, vaultInfo.decimals, vaultInfo.currentRound, userBalance.claimableBGSC]);

  return {
    handleInstantWithdraw,
    handleInitiateWithdraw,
    handleCompleteWithdraw,
    isLoading: isLoading || isConfirming,
  };
};

// ✅ 리딤 액션 훅 - 완전 개선
export const useRedeemActions = () => {
  const { vaultInfo, userBalance, refreshAllData, refreshUserData } = useVaultData();
  const { refreshBalances } = useTokenBalance();
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync: writeRedeem } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [txType, setTxType] = useState(null);
  
  const { isLoading: isConfirming, isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleRedeem = useCallback(async (shares) => {
    if (!shares || shares === '0') {
      toast.error(getToastMessage('redeem.emptyAmount'));
      return false;
    }
    
    setIsLoading(true);
    setTxType('redeem');
    try {
      const parsedShares = parseAmount(shares, vaultInfo.decimals);
      if (parsedShares <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }

      const hash = await retryWithBackoff(async () => {
        return await writeRedeem({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'redeem',
          args: [parsedShares],
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'redeem'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'redeem', shares: parsedShares.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('redeem.processing'), { id: 'redeem' });
      }
      
      return true;
    } catch (error) {
      console.error('Redeem failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [vaultInfo.decimals, writeRedeem]);

  const handleMaxRedeem = useCallback(async () => {
    // 현재 unredeemedPoints 값을 저장
    const currentUnredeemedPoints = userBalance.unredeemedPoints;
    
    setIsLoading(true);
    setTxType('maxRedeem');
    try {
      const hash = await retryWithBackoff(async () => {
        return await writeRedeem({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: 'maxRedeem',
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,  // 즉시 시도
        context: 'max redeem'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'maxRedeem', shares: currentUnredeemedPoints, timestamp: Date.now() });
        toast.loading(getToastMessage('redeem.processingAll'), { id: 'maxRedeem' });
      }
      
      return true;
    } catch (error) {
      console.error('Max redeem failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [writeRedeem, userBalance.unredeemedPoints]);

  // 트랜잭션 성공 시 처리
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      
      if (pendingTx?.type === 'redeem' || pendingTx?.type === 'maxRedeem') {
        const amount = formatAmount(pendingTx.shares, vaultInfo.decimals);
        const messageKey = pendingTx.type === 'redeem' ? 'redeem.success' : 'redeem.successAll';
        toast.success(getToastMessage(messageKey, amount), { id: pendingTx.type });
      }
      
      pendingTxCache.delete(txHash);
      
      // 리딤 후 - 캐시 무효화로 자동 업데이트됨
      
      setTxHash(null);
      setTxType(null);
    }
  }, [txSuccess, txHash, refreshBalances, refreshAllData, refreshUserData, vaultInfo.decimals, userBalance.unredeemedPoints]);

  return { handleRedeem, handleMaxRedeem, isLoading: isLoading || isConfirming };
};

// ✅ 라운드 카운트다운 훅
export const useRoundCountdown = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isRoundActive: false,
    isDepositLocked: false,
    timeLeft: '',
  });
  const [timeSync, setTimeSync] = useState(null);
  const [isTimeSynced, setIsTimeSynced] = useState(false);

  // TimeSync 동적 import 및 초기화
  useEffect(() => {
    let mounted = true;
    
    const initTimeSync = async () => {
      try {
        const { default: timeSyncModule } = await import('./utils/timeSync');
        if (!mounted) return;
        
        await timeSyncModule.initialize();
        setTimeSync(timeSyncModule);
        setIsTimeSynced(true);
        console.log('TimeSync initialized');
      } catch (error) {
        console.error('Failed to initialize TimeSync:', error);
        // Fallback to local time
        setIsTimeSynced(true);
      }
    };
    
    initTimeSync();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isTimeSynced) return; // TimeSync 초기화 전에는 실행하지 않음

    const updateCountdown = () => {
      // TimeSync가 없으면 로컬 시간 사용 (fallback)
      if (!timeSync) {
        // 로컬 시간 기반 계산 (기존 로직)
        const now = new Date();
        const currentTimeUTC = now.getTime();
        
        // KST 오프셋을 고려한 계산 (UTC + 9시간)
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstTime = new Date(currentTimeUTC + kstOffset);
        const kstYear = kstTime.getUTCFullYear();
        const kstMonth = kstTime.getUTCMonth();
        const kstDate = kstTime.getUTCDate();
        
        // 이번 달 마지막 날 찾기
        const lastDayOfMonth = new Date(Date.UTC(kstYear, kstMonth + 1, 0));
        const isLastDay = kstDate === lastDayOfMonth.getUTCDate();
        
        let nextRoundUTC;
        if (isLastDay) {
          nextRoundUTC = Date.UTC(kstYear, kstMonth + 1, 1, 0, 0, 0, 0) - kstOffset;
        } else {
          nextRoundUTC = Date.UTC(kstYear, kstMonth + 1, 1, 0, 0, 0, 0) - kstOffset;
        }
        
        if (currentTimeUTC >= nextRoundUTC) {
          const nextMonth = kstMonth + 2;
          const nextYear = nextMonth > 11 ? kstYear + 1 : kstYear;
          const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
          nextRoundUTC = Date.UTC(nextYear, adjustedMonth, 1, 0, 0, 0, 0) - kstOffset;
        }
        
        const diff = nextRoundUTC - currentTimeUTC;
        const totalSeconds = Math.max(0, Math.floor(diff / 1000));
        const isDepositLocked = totalSeconds <= 3600;
        
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;
        const totalHours = days * 24 + hours;
        
        setCountdown({
          days,
          hours: totalHours,
          minutes,
          seconds,
          totalSeconds,
          isRoundActive: true,
          isDepositLocked,
          timeLeft: `${totalHours}h ${minutes}m ${seconds}s`,
        });
        
        return;
      }
      
      // TimeSync를 사용하여 정확한 시간 계산
      const totalSeconds = timeSync.getSecondsUntilRoundEnd();
      const isDepositLocked = timeSync.isDepositLocked();
      
      // 디버깅 정보
      const debugInfo = timeSync.getDebugInfo();
      console.log('Round Countdown (TimeSync):', debugInfo);
      
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;
      
      // 총 시간 계산 (일수 * 24 + 시간)
      const totalHours = days * 24 + hours;
      
      setCountdown({
        days,
        hours: totalHours,
        minutes,
        seconds,
        totalSeconds,
        isRoundActive: true,
        isDepositLocked,
        timeLeft: `${totalHours}h ${minutes}m ${seconds}s`,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [isTimeSynced, timeSync]); // TimeSync가 초기화된 후에 타이머 시작

  return countdown;
};

// ✅ 가격 및 APY
export const usePriceHistory = () => {
  const [apy, setApy] = useState('0.00');
  const [priceChange, setPriceChange] = useState('0.00');

  useEffect(() => {
    setApy('15.75');
    setPriceChange('0.23');
  }, []);

  return { apy, priceChange, priceHistory: [] };
};

// ✅ 실시간 가격 표시
export const useLivePrice = () => {
  const { vaultMetrics } = useVaultData();
  const { priceChange } = usePriceHistory();
  const [livePrice, setLivePrice] = useState('1.000');

  useEffect(() => {
    if (vaultMetrics.pricePerPoint && vaultMetrics.pricePerPoint !== '0') {
      setLivePrice(formatAmount(vaultMetrics.pricePerPoint, 18, 3));
    } else {
      setLivePrice('1.000');
    }
  }, [vaultMetrics.pricePerPoint]);

  return { livePrice, priceChange };
};

// ✅ 호환성을 위한 개별 훅들
export const useVaultInfo = () => {
  const { vaultInfo } = useVaultData();
  return vaultInfo;
};

export const useVaultMetrics = () => {
  const { vaultMetrics } = useVaultData();
  return vaultMetrics;
};

export const useUserBalance = () => {
  const { userBalance } = useVaultData();
  return userBalance;
};

export const useWhitelistCheck = () => {
  const { userBalance } = useVaultData();
  return {
    isWhitelisted: userBalance.isWhitelisted,
    isChecking: false,
    checkWhitelist: () => {}
  };
};

console.log('✅ Hooks module loaded with RPC error fixes and optimizations');