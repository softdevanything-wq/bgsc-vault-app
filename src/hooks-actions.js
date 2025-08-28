/* global BigInt */
// Action hooks that receive vault data as props to avoid duplicate instances
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAccount, useWriteContract, usePublicClient } from 'wagmi';
import { VAULT_ADDRESS, VAULT_ABI, BGSC_TOKEN_ADDRESS, ERC20_ABI } from './constants';
import { parseAmount, formatAmount, formatIntegerAmount, parseError, getDynamicText, MobileWalletUtils } from './utils';
import { getToastMessage } from './toastMessages';
import { t } from './translations';
import toast from 'react-hot-toast';

// Cache for pending transactions
const pendingTxCache = new Map();

// ✅ 모바일 최적화된 트랜잭션 확인 훅
const useOptimizedTransactionReceipt = (hash, refreshCallback, action = '') => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const publicClient = usePublicClient();
  const intervalRef = useRef(null);
  const checkCountRef = useRef(0);
  const isMobile = MobileWalletUtils.isMobile();
  const walletType = MobileWalletUtils.detectWalletApp();

  useEffect(() => {
    if (!hash || !publicClient) {
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    checkCountRef.current = 0;

    // 트랜잭션 상태 저장 (페이지 새로고침 대비)
    if (action) {
      MobileWalletUtils.saveTransactionState(hash, action, 'pending');
    }

    const checkTransaction = async () => {
      try {
        checkCountRef.current += 1;
        console.log(` Checking transaction ${hash} (attempt ${checkCountRef.current})`);
        
        // 모바일에서는 추가 로깅
        if (isMobile) {
          console.log(`📱 Mobile wallet: ${walletType || 'unknown'}`);
        }
        
        const receipt = await publicClient.getTransactionReceipt({ hash });
        
        if (receipt) {
          console.log(`✅ Transaction confirmed: ${hash}`);
          const success = receipt.status === 'success';
          setIsSuccess(success);
          setIsLoading(false);
          
          // 트랜잭션 상태 업데이트
          if (action) {
            MobileWalletUtils.updateTransactionState(hash, success ? 'success' : 'failed');
          }
          
          // 트랜잭션 확인 후 즉시 데이터 업데이트
          if (refreshCallback && success) {
            // 블록체인 상태 업데이트를 위한 충분한 지연 시간
            const refreshDelay = isMobile ? 2000 : 1500;
            setTimeout(() => {
              refreshCallback();
            }, refreshDelay);
            
            // 추가로 지연된 새로고침 (확실한 상태 동기화를 위해)
            if (action === 'queue' || action === 'withdraw') {
              setTimeout(() => {
                refreshCallback();
              }, refreshDelay + 2000);
            }
          }
          
          // 인터벌 정리
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error checking transaction:', error);
        // 모바일에서는 더 자세한 에러 로깅
        if (isMobile && checkCountRef.current % 10 === 0) {
          console.log(`📱 Mobile transaction check attempt ${checkCountRef.current} for ${hash}`);
        }
      }
    };

    // 즉시 첫 번째 확인
    checkTransaction();

    // 폴링 간격 설정 (모바일은 더 느리게)
    const pollingInterval = isMobile ? 1000 : 400; // 모바일 1초, PC 400ms
    intervalRef.current = setInterval(checkTransaction, pollingInterval);

    // 타임아웃 설정 (모바일은 더 길게)
    const timeoutDuration = isMobile ? 60000 : 30000; // 모바일 60초, PC 30초
    const timeoutId = setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsLoading(false);
        console.warn(`⏱️ Transaction check timeout: ${hash}`);
        
        // 모바일에서 타임아웃 시 사용자에게 안내
        if (isMobile) {
          toast.error(
            '트랜잭션 확인이 지연되고 있습니다. 지갑 앱에서 확인해주세요.',
            { duration: 10000 }
          );
        }
      }
    }, timeoutDuration);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      clearTimeout(timeoutId);
    };
  }, [hash, publicClient, refreshCallback, action, isMobile, walletType]);

  return { isLoading, isSuccess };
};

// Retry with backoff function
const retryWithBackoff = async (fn, options = {}) => {
  const { maxRetries = 3, initialDelay = 1000, context = '' } = options;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = initialDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} for ${context} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// ✅ 입금 액션 훅 - props로 데이터 받음
export const useDepositActions = (vaultInfo, balances, approve, isApprovalSufficient, approvalStatus, setApprovalStatus, refreshUserData) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  const { writeContractAsync: writeDeposit } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  
  // 커스텀 트랜잭션 확인 훅 사용 - 모바일 최적화
  const { isLoading: isConfirming, isSuccess: txSuccess } = useOptimizedTransactionReceipt(
    txHash,
    refreshUserData, // 트랜잭션 확인 후 자동으로 사용자 데이터 업데이트
    'deposit' // 액션 타입 전달
  );

  // Execute deposit transaction
  const executeDepositTransaction = useCallback(async (amount, isBNB, recipient) => {
    setIsLoading(true);
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      const args = recipient ? [parsedAmount, recipient] : [parsedAmount];
      const value = isBNB ? parsedAmount : 0n;

      const hash = await retryWithBackoff(async () => {
        return await writeDeposit({
          address: VAULT_ADDRESS,
          abi: VAULT_ABI,
          functionName: recipient ? 'depositFor' : 'deposit',
          args,
          ...(isBNB && { value }),
        });
      }, {
        maxRetries: 3,
        initialDelay: 0,
        context: 'deposit'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'deposit', amount: parsedAmount.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('deposit.processing'), { id: 'deposit' });
        
        // 모바일에서 추가 안내 - 제거됨
        // if (MobileWalletUtils.isMobile()) {
        //   setTimeout(() => {
        //     toast(getToastMessage('mobile.checkWallet'), { 
        //       id: 'mobile-hint',
        //       duration: 8000,
        //       icon: '📱'
        //     });
        //   }, 3000);
        // }
      }
      
      return true;
    } catch (error) {
      console.error('Deposit failed:', error);
      const errorMsg = parseError(error);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [vaultInfo.decimals, writeDeposit]);

  // Handle approval separately
  const handleApproval = useCallback(async (amount) => {
    if (!amount || amount === '0') {
      toast.error(getToastMessage('deposit.emptyAmount'));
      return false;
    }
    
    // Check if any process is ongoing
    if (isLoading || pendingApproval || approvalStatus === 'pending') {
      toast.error(getToastMessage('deposit.alreadyProcessing'));
      return false;
    }
    
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      if (parsedAmount <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }
      
      setIsLoading(true);
      setPendingApproval(true);
      
      const approved = await approve(parsedAmount);
      if (!approved) {
        setIsLoading(false);
        setPendingApproval(false);
        setApprovalStatus('idle');
        return false;
      }
      
      // 승인 트랜잭션이 제출됨 - 로딩 상태 유지
      setPendingApproval(true); // 승인 대기 중 상태 유지
      return true;
    } catch (error) {
      console.error('Approval failed:', error);
      toast.error(getToastMessage('deposit.preparationError'));
      setIsLoading(false);
      setPendingApproval(false);
      setApprovalStatus('idle');
      return false;
    }
  }, [vaultInfo, approve, isLoading, pendingApproval, approvalStatus]);

  // Handle deposit only (no approval logic)
  const handleDeposit = useCallback(async (amount, isBNB = false, recipient = null) => {
    if (!amount || amount === '0') {
      toast.error(getToastMessage('deposit.emptyAmount'));
      return false;
    }
    
    // Check if any process is ongoing
    if (isLoading || isConfirming) {
      toast.error(getToastMessage('deposit.alreadyProcessing'));
      return false;
    }
    
    try {
      const parsedAmount = parseAmount(amount, vaultInfo.decimals);
      if (parsedAmount <= 0n) {
        toast.error(getToastMessage('deposit.invalidAmount'));
        return false;
      }
      
      const minAmount = parseAmount('10000', vaultInfo.decimals);
      if (parsedAmount < minAmount) {
        toast.error(getToastMessage('deposit.minimumAmount', formatIntegerAmount(parsedAmount, vaultInfo.decimals)));
        return false;
      }

      // Check token approval (not for BNB)
      if (!isBNB && !vaultInfo.isWBNB) {
        if (!isApprovalSufficient(amount)) {
          toast.error(getToastMessage('deposit.approvalRequired'));
          return false;
        }
      }

      // Execute deposit directly
      return await executeDepositTransaction(amount, isBNB, recipient);
    } catch (error) {
      console.error('Deposit preparation failed:', error);
      toast.error(getToastMessage('deposit.preparationError'));
      setIsLoading(false);
      return false;
    }
  }, [vaultInfo, isApprovalSufficient, isLoading, isConfirming, executeDepositTransaction]);

  // Handle transaction success
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      if (pendingTx?.type === 'deposit') {
        const amount = formatIntegerAmount(pendingTx.amount, vaultInfo.decimals);
        const round = vaultInfo.currentRound + 1;
        toast.success(getToastMessage('deposit.success', amount, round), { id: 'deposit' });
        pendingTxCache.delete(txHash);
        
        // Reset all states after successful deposit
        setPendingApproval(false);
        setIsLoading(false);
        // 승인 상태는 리셋하지 않음 - 페이지 새로고침으로 처리
        
        // 입금 후 사용자 데이터 즉시 업데이트
        console.log('💰 Deposit successful, refreshing user data...');
        refreshUserData();
        
        // 추가 리프레시를 위해 약간의 지연 후 다시 한번 업데이트
        setTimeout(() => {
          console.log('🔄 Additional refresh after deposit...');
          refreshUserData();
        }, 2000);
      }
      
      setTxHash(null);
    }
  }, [txSuccess, txHash, setApprovalStatus, vaultInfo.decimals, vaultInfo.currentRound, refreshUserData]);
  
  // 승인 상태 변경 감지
  useEffect(() => {
    if (approvalStatus === 'approved' && pendingApproval) {
      console.log('✅ Approval completed, resetting pending state');
      setPendingApproval(false);
      setIsLoading(false);
    }
  }, [approvalStatus, pendingApproval]);

  // 승인 성공 후 자동으로 입금 실행 - UI에서 처리하도록 변경
  // useEffect(() => {
  //   console.log(' Checking approval status:', { approvalStatus, pendingApproval, hasDepositParams: !!depositParams, isLoading, isConfirming });
  // }, [approvalStatus, pendingApproval, depositParams, isLoading, isConfirming]);

  return { 
    handleDeposit,
    handleApproval,
    isLoading: isLoading || isConfirming || pendingApproval,
    needsApproval: (amount) => !isApprovalSufficient(amount) && approvalStatus !== 'approved' && !pendingApproval,
    approvalStatus
  };
};

// ✅ 출금 액션 훅 - props로 데이터 받음
export const useWithdrawActions = (vaultInfo, userBalance, refreshCriticalData, refreshUserData, refreshBalances) => {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync: writeWithdraw } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [txType, setTxType] = useState(null);
  
  // 커스텀 트랜잭션 확인 훅 사용 - 모바일 최적화
  const { isLoading: isConfirming, isSuccess: txSuccess } = useOptimizedTransactionReceipt(
    txHash,
    refreshCriticalData, // 트랜잭션 확인 후 자동으로 중요 데이터 업데이트
    txType === 'instant' ? 'withdraw' : 'queue' // 액션 타입 전달
  );

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
        initialDelay: 0,
        context: 'instant withdraw'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'instantWithdraw', amount: parsedAmount.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('instantWithdraw.processing'), { id: 'instantWithdraw' });
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
      toast.error(getToastMessage('withdraw.emptyShares'));
      return false;
    }
    
    setIsLoading(true);
    setTxType('initiate');
    try {
      const parsedShares = parseAmount(shares, vaultInfo.decimals);
      if (parsedShares <= 0n) {
        toast.error(getToastMessage('withdraw.invalidShares'));
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
        initialDelay: 0,
        context: 'initiate withdraw'
      });
      
      if (hash) {
        setTxHash(hash);
        pendingTxCache.set(hash, { type: 'initiateWithdraw', shares: parsedShares.toString(), timestamp: Date.now() });
        toast.loading(getToastMessage('withdraw.initiating'), { id: 'initiateWithdraw' });
      }
      
      return true;
    } catch (error) {
      console.error('Initiate withdraw failed:', error);
      
      const errorMsg = error?.message || error?.reason || '';
      if (errorMsg.includes('completeWithdraw') || 
          (BigInt(userBalance?.claimableBGSC || 0) > 0n && errorMsg.includes('revert'))) {
        const lang = localStorage.getItem('bgsc-vault-language') || 'ko';
        if (lang === 'ko') {
          toast.error('새 변환 요청을 위해 4단계에서 BGSC를 출금하세요.');
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
        initialDelay: 0,
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

  // Handle transaction success
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      
      if (pendingTx?.type === 'instantWithdraw') {
        const amount = formatIntegerAmount(pendingTx.amount, vaultInfo.decimals);
        toast.success(getToastMessage('instantWithdraw.success', amount), { id: 'instantWithdraw' });
      } else if (pendingTx?.type === 'initiateWithdraw') {
        const amount = formatIntegerAmount(pendingTx.shares, vaultInfo.decimals);
        const round = vaultInfo.currentRound + 1;
        const lang = localStorage.getItem('bgsc-vault-language') || 'ko';
        const dynamicText = getDynamicText(lang);
        toast.success(getToastMessage('withdraw.conversionSuccess', amount, round, dynamicText.roundDuration), { id: 'initiateWithdraw' });
      } else if (pendingTx?.type === 'completeWithdraw') {
        const amount = formatIntegerAmount(pendingTx.amount, vaultInfo.decimals);
        toast.success(getToastMessage('withdraw.success', amount), { id: 'completeWithdraw' });
      }
      
      pendingTxCache.delete(txHash);
      
      // 출금 후 데이터 업데이트
      if (pendingTx?.type === 'instantWithdraw') {
        console.log('💸 Instant withdraw successful, refreshing critical data...');
        refreshCriticalData(); // 즉시 출금은 전체 상태 업데이트 필요
        
        // 토큰 잔액도 즉시 업데이트
        if (refreshBalances) {
          refreshBalances();
        }
        
        // 추가 리프레시
        setTimeout(() => {
          console.log('🔄 Additional refresh after instant withdraw...');
          refreshCriticalData();
          if (refreshBalances) {
            refreshBalances();
          }
        }, 2000);
      } else if (pendingTx?.type === 'initiateWithdraw') {
        console.log('📋 Withdraw initiated, refreshing user data...');
        refreshUserData(); // 포인트 변환은 사용자 데이터만 업데이트
        
        setTimeout(() => {
          console.log('🔄 Additional refresh after withdraw initiation...');
          refreshUserData();
        }, 2000);
      } else if (pendingTx?.type === 'completeWithdraw') {
        console.log('✅ Withdraw completed, refreshing critical data...');
        refreshCriticalData(); // BGSC 출금 완료는 전체 상태 업데이트 필요
        
        setTimeout(() => {
          console.log('🔄 Additional refresh after withdraw completion...');
          refreshCriticalData();
        }, 2000);
      }
      
      setTxHash(null);
      setTxType(null);
    }
  }, [txSuccess, txHash, vaultInfo.decimals, vaultInfo.currentRound, userBalance.claimableBGSC, refreshCriticalData, refreshUserData]);

  return {
    handleInstantWithdraw,
    handleInitiateWithdraw,
    handleCompleteWithdraw,
    isLoading: isLoading || isConfirming,
  };
};

// ✅ 리딤 액션 훅 - props로 데이터 받음
export const useRedeemActions = (vaultInfo, userBalance, refreshUserData) => {
  const [isLoading, setIsLoading] = useState(false);

  const { writeContractAsync: writeRedeem } = useWriteContract();
  const [txHash, setTxHash] = useState(null);
  const [txType, setTxType] = useState(null);
  
  // 커스텀 트랜잭션 확인 훅 사용 - 모바일 최적화
  const { isLoading: isConfirming, isSuccess: txSuccess } = useOptimizedTransactionReceipt(
    txHash,
    refreshUserData, // 트랜잭션 확인 후 자동으로 사용자 데이터 업데이트
    'redeem' // 액션 타입 전달
  );

  const handleRedeem = useCallback(async (shares) => {
    if (!shares || shares === '0') {
      toast.error(getToastMessage('redeem.emptyShares'));
      return false;
    }
    
    setIsLoading(true);
    setTxType('redeem');
    try {
      const parsedShares = parseAmount(shares, vaultInfo.decimals);
      if (parsedShares <= 0n) {
        toast.error(getToastMessage('redeem.invalidAmount'));
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
        initialDelay: 0,
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
    const currentUnredeemedPoints = BigInt(userBalance.unredeemedPoints || 0);
    
    if (currentUnredeemedPoints === 0n) {
      toast.error(getToastMessage('redeem.noPoints'));
      return false;
    }
    
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
        initialDelay: 0,
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

  // Handle transaction success
  useEffect(() => {
    if (txSuccess && txHash) {
      const pendingTx = pendingTxCache.get(txHash);
      
      if (pendingTx?.type === 'redeem' || pendingTx?.type === 'maxRedeem') {
        const amount = formatIntegerAmount(pendingTx.shares, vaultInfo.decimals);
        const messageKey = pendingTx.type === 'redeem' ? 'redeem.success' : 'redeem.successAll';
        toast.success(getToastMessage(messageKey, amount), { id: pendingTx.type });
      }
      
      pendingTxCache.delete(txHash);
      
      // 리딤 후 사용자 데이터 즉시 업데이트
      console.log('🔄 Redeem successful, refreshing user data...');
      refreshUserData();
      
      setTxHash(null);
      setTxType(null);
    }
  }, [txSuccess, txHash, vaultInfo.decimals, userBalance.unredeemedPoints, refreshUserData]);

  return { handleRedeem, handleMaxRedeem, isLoading: isLoading || isConfirming };
};