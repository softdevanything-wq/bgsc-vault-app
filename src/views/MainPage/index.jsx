/* global BigInt */
import { ConnectButton, useAccountModal } from "@rainbow-me/rainbowkit";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import toast from "react-hot-toast";
import { parseUnits } from "ethers";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../translations";
import DepositStepModal from "../../components/DepositStepModal";
import WalletDisconnectedAlert from "../../components/WalletDisconnectedAlert";
import HeaderLanguageToggle from "../../components/HeaderLanguageToggle";

import iconArrowRightSmall from "assets/icon-arrow-right-small.svg";
import textLogo from "assets/text_logo.png";
import messageIcon from "assets/icon-chat-bubble.svg";
import sendIcon from "assets/icon-send.svg";
import xIcon from "assets/icon-x.svg";

import { useVaultData, useTokenBalance } from "../../contexts/VaultDataContext";
import {
  useDepositActions,
  useWithdrawActions,
  useRedeemActions,
} from "../../hooks-actions";
import {
  useTransactionHistory,
  usePriceHistory,
  useLivePrice,
  useGasPrice,
  useRoundCountdown,
} from "hooks";
import {
  formatAmount,
  formatIntegerAmount,
  formatFullAmount,
  parseAmount,
  calculateBGSCFromPoints,
  calculatePointsFromBGSC,
  getTimeUntilNextRound,
  formatTimestamp,
  validateAmount,
  filterNumberInput,
  shortenAddress,
  getBSCScanLink,
  safeBigInt,
  getDynamicText,
  getCurrentRoundStatus,
  getInstantWithdrawDeadline,
  getNextRoundStartTime,
  estimateTransactionCost,
  SecurityUtils,
  MobileWalletUtils,
} from "utils";
import { getStyles } from "./styles";

import Icons from "../../components/Icons";

export default function MainPage() {
  // Language context
  const { language } = useLanguage();
  
  // Wallet connection state
  const { address, isConnected } = useAccount();
  const { openAccountModal } = useAccountModal();
  const publicClient = usePublicClient();

  // Vault data and hooks
  const {
    vaultInfo,
    vaultMetrics,
    userBalance,
    hasError,
    isLoading,
    refreshData,
    refreshAllData,
    refreshUserData,
    refreshCriticalData,
  } = useVaultData();
  const { balances, approvalStatus, approve, isApprovalSufficient, setApprovalStatus, isApproving: isApprovingFromHook, refreshBalances } = useTokenBalance();
  const { apy } = usePriceHistory();
  const { livePrice, priceChange } = useLivePrice();
  const { 
    transactions, 
    isLoadingHistory, 
    refreshHistory, 
    hasMoreHistory,
    currentPage,
    totalCount,
    itemsPerPage,
    changeItemsPerPage,
    goToPage,
    totalPages
  } = useTransactionHistory();
  const { gasPrices, calculateGasFee, isLoading: isGasLoading } = useGasPrice();
  const countdown = useRoundCountdown();
  const [isMobile, setIsMobile] = useState(false);
  const [isDappBrowser, setIsDappBrowser] = useState(false);

  // Action hooks - passing data as props to avoid duplicate instances
  const {
    handleDeposit,
    handleApproval,
    isLoading: isDepositing,
    needsApproval,
  } = useDepositActions(
    vaultInfo,
    balances,
    approve,
    isApprovalSufficient,
    approvalStatus,
    setApprovalStatus,
    refreshUserData
  );

  const {
    handleInstantWithdraw,
    handleInitiateWithdraw,
    handleCompleteWithdraw,
    isLoading: isWithdrawing,
  } = useWithdrawActions(
    vaultInfo,
    userBalance,
    refreshCriticalData,
    refreshUserData,
    refreshBalances
  );

  const {
    handleRedeem,
    handleMaxRedeem,
    isLoading: isRedeeming,
  } = useRedeemActions(
    vaultInfo,
    userBalance,
    refreshUserData
  );

  // UI state
  const [activeTab, setActiveTab] = useState(window.innerWidth <= 768 ? "deposit" : "returns");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositToken, setDepositToken] = useState("BGSC");
  const [depositForOthers, setDepositForOthers] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [instantWithdrawAmount, setInstantWithdrawAmount] = useState("");
  const [withdrawShares, setWithdrawShares] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [nextRoundTime, setNextRoundTime] = useState("");
  const [isUpdatingWithdrawBalance, setIsUpdatingWithdrawBalance] = useState(false);
  const [pendingWithdrawAmount, setPendingWithdrawAmount] = useState(0n);
  
  // 다음 라운드 시간 계산
  const nextRoundInfo = useMemo(() => getNextRoundStartTime(language), [language]);
  const [depositButtonState, setDepositButtonState] = useState("deposit");
  const [selectedGasSpeed, setSelectedGasSpeed] = useState("standard");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [modalStep, setModalStep] = useState('approval');
  
  // Track if we've auto-loaded transaction history
  const hasAutoLoadedHistory = useRef(false);
  
  // Helper function to ensure minimum TVL
  const getEffectiveTVL = () => {
    const minThreshold = BigInt('10000000000000000000000000'); // 10M BGSC (10,000,000 with 18 decimals)
    const currentTVL = safeBigInt(vaultMetrics.totalValueLocked || '0');
    
    // 실제 TVL이 10M BGSC 미만인 경우 10M 사용
    return currentTVL < minThreshold ? minThreshold.toString() : vaultMetrics.totalValueLocked;
  };

  // Dynamic text and round status
  const dynamicText = useMemo(() => getDynamicText(language), [language]);
  const roundStatus = useMemo(() => getCurrentRoundStatus(), []);
  const instantWithdrawInfo = useMemo(() => getInstantWithdrawDeadline(language), [language]);

  // BNB balance
  const { data: bnbBalance } = useBalance({
    address: address,
  });

  // scroll, responsive, mobile wallet detection
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    
    // DApp 브라우저 감지
    const isDapp = MobileWalletUtils.isDappBrowser();
    setIsDappBrowser(isDapp);
    
    // 모바일 지갑 감지
    if (MobileWalletUtils.isMobile()) {
      const walletType = MobileWalletUtils.detectWalletApp();
      
      // 펜딩 트랜잭션 복구
      const pendingTxs = MobileWalletUtils.getPendingTransactions();
      if (pendingTxs.length > 0) {
        toast.loading('이전 트랜잭션을 확인하고 있습니다...', { id: 'pending-tx-recovery' });
      }
      
      // 오래된 트랜잭션 정리
      MobileWalletUtils.cleanOldTransactions();
    }
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  

  // Transaction recovery and round time update
  useEffect(() => {
    // 펜딩 트랜잭션 복구 (연결된 상태에서만)
    if (isConnected && address) {
      const recoverPendingTransactions = async () => {
        const pendingTxs = MobileWalletUtils.getPendingTransactions();
        
        if (pendingTxs.length > 0) {
          
          for (const tx of pendingTxs) {
            try {
              // publicClient가 있으면 트랜잭션 상태 확인
              if (tx.hash && publicClient) {
                const receipt = await publicClient.getTransactionReceipt({ hash: tx.hash });
                
                if (receipt) {
                  const status = receipt.status === 'success' ? 'success' : 'failed';
                  MobileWalletUtils.updateTransactionState(tx.hash, status);
                  
                  if (status === 'success') {
                    toast.success(
                      language === 'ko'
                        ? `${tx.action} 트랜잭션이 성공적으로 완료되었습니다.`
                        : `${tx.action} transaction completed successfully`,
                      { id: `recovered-${tx.hash}` }
                    );
                    
                    // 데이터 새로고침
                    refreshAllData();
                  } else {
                    toast.error(
                      language === 'ko'
                        ? `${tx.action} 트랜잭션이 실패했습니다`
                        : `${tx.action} transaction failed`,
                      { id: `recovered-${tx.hash}` }
                    );
                  }
                } else {
                  // 아직 펜딩 중
                  if (Date.now() - tx.timestamp > 600000) { // 10분 이상 경과
                    toast.error(
                      language === 'ko'
                        ? `${tx.action} 트랜잭션이 지연되고 있습니다. 지갑에서 확인해주세요.`
                        : `${tx.action} transaction is delayed. Please check your wallet.`,
                      { id: `delayed-${tx.hash}` }
                    );
                  }
                }
              }
            } catch (error) {
              console.error('Error recovering transaction:', error);
            }
          }
        }
      };
      
      recoverPendingTransactions();
    }
    
    // 라운드 시간 업데이트
    const updateTime = () => setNextRoundTime(getTimeUntilNextRound());
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [isConnected, address, publicClient, language, refreshAllData]);

  // Mobile menu body scroll lock
  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  // Auto-refresh transaction history when entering mypage tab
  useEffect(() => {
    if (activeTab === "mypage" && !hasAutoLoadedHistory.current && isConnected) {
      // Small delay to ensure tab transition is complete
      const timer = setTimeout(() => {
        refreshHistory();
        hasAutoLoadedHistory.current = true;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, isConnected, refreshHistory]);

  // Calculated values
  const availableBalance = useMemo(() => {
    if (depositToken === "BNB" && vaultInfo.isWBNB) {
      return bnbBalance?.value?.toString() || "0";
    }
    return balances.token;
  }, [depositToken, vaultInfo.isWBNB, balances.token, bnbBalance]);

  const expectedShares = useMemo(() => {
    if (!depositAmount || !vaultMetrics.pricePerShare) {
      return 0n;
    }

    try {
      const amount = parseAmount(depositAmount, vaultInfo.decimals);
      const price = safeBigInt(vaultMetrics.pricePerShare);
      const safePrice =
        price === 0n ? BigInt(10) ** BigInt(vaultInfo.decimals) : price;

      return calculatePointsFromBGSC(amount, safePrice, vaultInfo.decimals);
    } catch (error) {
      SecurityUtils.secureLog("Expected points calculation failed:", error);
      return 0n;
    }
  }, [depositAmount, vaultMetrics.pricePerShare, vaultInfo.decimals]);

  const expectedBGSC = useMemo(() => {
    if (!withdrawShares || !vaultMetrics.pricePerShare) {
      return 0n;
    }

    try {
      const points = parseAmount(withdrawShares, vaultInfo.decimals);
      const price = safeBigInt(vaultMetrics.pricePerShare);
      const safePrice =
        price === 0n ? BigInt(10) ** BigInt(vaultInfo.decimals) : price;

      return calculateBGSCFromPoints(points, safePrice, vaultInfo.decimals);
    } catch (error) {
      SecurityUtils.secureLog("Expected BGSC calculation failed:", error);
      return 0n;
    }
  }, [withdrawShares, vaultMetrics.pricePerShare, vaultInfo.decimals]);

  // Gas fee calculation
  const estimatedGasFee = useMemo(() => {
    if (!depositAmount || isGasLoading) return null;

    const transactionType = depositToken === "BNB" ? "DEPOSIT_BNB" : "DEPOSIT";
    const hasApproval =
      !vaultInfo.isWBNB && needsApproval && needsApproval(depositAmount);

    return estimateTransactionCost(
      transactionType,
      gasPrices[selectedGasSpeed],
      hasApproval
    );
  }, [
    depositAmount,
    depositToken,
    vaultInfo.isWBNB,
    needsApproval,
    gasPrices,
    selectedGasSpeed,
    isGasLoading,
  ]);

  // Input validation - 최소 1000 BGSC
  const depositValidation = useMemo(() => {
    if (!depositAmount) return { valid: true };
    return validateAmount(
      depositAmount,
      availableBalance,
      "10000", // 최소 10000 BGSC
      vaultInfo.decimals
    );
  }, [depositAmount, availableBalance, vaultInfo.decimals]);

  const instantWithdrawValidation = useMemo(() => {
    if (!instantWithdrawAmount) return { valid: true };
    return validateAmount(
      instantWithdrawAmount,
      userBalance.pendingDepositAmount,
      "10000", // 최소 10000 BGSC
      vaultInfo.decimals
    );
  }, [
    instantWithdrawAmount,
    userBalance.pendingDepositAmount,
    vaultInfo.decimals,
  ]);

  const withdrawValidation = useMemo(() => {
    if (!withdrawShares) return { valid: true };
    // 펜딩 중인 금액을 차감한 실제 사용 가능한 포인트
    const availablePoints = safeBigInt(userBalance.walletPoints) - pendingWithdrawAmount;
    return validateAmount(
      withdrawShares,
      availablePoints.toString(),
      "0",
      vaultInfo.decimals
    );
  }, [withdrawShares, userBalance.walletPoints, vaultInfo.decimals, pendingWithdrawAmount]);

  // Handlers with debounce protection
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

  // Reset approval status when deposit amount changes significantly
  useEffect(() => {
    // 금액이 변경되고 idle 상태가 아닐 때만 확인
    if (approvalStatus === "approved" && depositAmount) {
      const needsNewApproval = needsApproval && needsApproval(depositAmount);
      if (needsNewApproval) {
        setApprovalStatus("idle");
      }
    }
  }, [depositAmount, needsApproval, approvalStatus, setApprovalStatus]);

  // Deposit button state update - simplified and more reliable
  useEffect(() => {
    
    if (!depositAmount || depositAmount === "0") {
      setDepositButtonState("deposit");
      return;
    }

    // If currently approving or approval is pending
    if (isApprovingFromHook || approvalStatus === "pending") {
      setDepositButtonState("approval_pending");
      return;
    }

    // BNB deposits don't need approval
    if (depositToken === "BNB" && vaultInfo.isWBNB) {
      setDepositButtonState("ready_to_deposit");
      return;
    }

    // Always check actual allowance, not just approval status
    const approvalNeeded = needsApproval && needsApproval(depositAmount);
    
    if (approvalNeeded) {
      setDepositButtonState("approval_needed");
    } else {
      setDepositButtonState("ready_to_deposit");
    }
  }, [
    depositAmount,
    depositToken,
    vaultInfo.isWBNB,
    needsApproval,
    approvalStatus,
    isApprovingFromHook,
  ]);

  
  const handleDepositSubmit = async () => {
    if (!depositAmount || !depositValidation.valid) return;
    
    // Prevent multiple clicks and add debounce protection
    if (isProcessingDeposit || isAnyLoading || depositButtonState === "approval_pending") return;
    
    // BNB deposits don't need approval
    if (depositToken === "BNB" && vaultInfo.isWBNB) {
      setIsProcessingDeposit(true);
      try {
        const result = await handleDeposit(
          depositAmount,
          true,
          depositForOthers ? recipientAddress : null
        );

        if (result === true) {
          setDepositAmount("");
          setRecipientAddress("");
          setDepositButtonState("deposit");
          
          // 입금 후 데이터 새로고침
          toast.loading(
            language === 'ko' 
              ? '잔액을 업데이트하는 중...' 
              : 'Deposit successful. Updating balance...',
            { 
              id: 'deposit-update',
              duration: 500 
            }
          );
          
          // 전체 데이터 새로고침
          setTimeout(async () => {
            await refreshAllData();
            await refreshBalances();
            toast.dismiss('deposit-update');
          }, 1500);
          
          // 추가 업데이트
          setTimeout(async () => {
            await refreshAllData();
            await refreshBalances();
          }, 3000);
        }
      } catch (error) {
        console.error("Deposit error:", error);
      } finally {
        setIsProcessingDeposit(false);
      }
      return;
    }
    
    // For BGSC tokens, show the modal for 2-step process
    if (depositButtonState === "approval_needed") {
      setModalStep('approval');
      setShowDepositModal(true);
    } else if (depositButtonState === "ready_to_deposit") {
      setModalStep('deposit');
      setShowDepositModal(true);
    }
  };

  const handleModalConfirm = async () => {
    setShowDepositModal(false);
    setIsProcessingDeposit(true);
    
    try {
      if (modalStep === 'approval') {
        // Handle approval
        const approved = await handleApproval(depositAmount);
        if (approved) {
          setDepositButtonState("approval_pending");
          
          // Show success message and guide for next step
          toast.success(
            language === 'ko' 
              ? '토큰 승인 완료! 이제 볼트가 BGSC를 사용할 수 있습니다.\n\n다시 버튼을 눌러 입금을 진행해주세요!' 
              : 'Token approval complete! The vault can now use BGSC.\n\nClick the button again to proceed with deposit!',
            { duration: 6000 }
          );
        }
      } else if (modalStep === 'deposit') {
        // Handle deposit
        const result = await handleDeposit(
          depositAmount,
          false,
          depositForOthers ? recipientAddress : null
        );

        if (result === true) {
          setDepositAmount("");
          setRecipientAddress("");
          setDepositButtonState("deposit");
          
          // 입금 후 데이터 새로고침
          toast.loading(
            language === 'ko' 
              ? '잔액을 업데이트하는 중...' 
              : 'Deposit successful. Updating balance...',
            { 
              id: 'deposit-update',
              duration: 500 
            }
          );
          
          // 전체 데이터 새로고침
          setTimeout(async () => {
            await refreshAllData();
            await refreshBalances();
            toast.dismiss('deposit-update');
          }, 1500);
          
          // 추가 업데이트
          setTimeout(async () => {
            await refreshAllData();
            await refreshBalances();
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Deposit error:", error);
      // Reset button state on error to allow retry
      if (approvalStatus === "approved" && depositAmount) {
        // If approval was successful but deposit failed, stay in ready_to_deposit state
        setDepositButtonState("ready_to_deposit");
      } else if (depositButtonState === "approval_needed") {
        // Stay in approval_needed state if approval failed
        setDepositButtonState("approval_needed");
      } else {
        setDepositButtonState("deposit");
        setApprovalStatus("idle");
      }
    } finally {
      setIsProcessingDeposit(false);
    }
  };

  // Removed auto-deposit after approval to prevent duplicate transactions
  // Users should manually click deposit button after approval completes

  const handleInstantWithdrawSubmit = async () => {
    if (!instantWithdrawAmount || !instantWithdrawValidation.valid) return;

    const success = await handleInstantWithdraw(instantWithdrawAmount);
    if (success) {
      setInstantWithdrawAmount("");
      
      // 참여 취소 후 데이터 새로고침
      toast.loading(
        language === 'ko' 
          ? '잔액을 업데이트하는 중...' 
          : 'Withdrawal successful. Updating balance...',
        { 
          id: 'instant-withdraw-update',
          duration: 500 
        }
      );
      
      // 전체 데이터 새로고침
      setTimeout(async () => {
        await refreshCriticalData(); // 전체 데이터 업데이트
        await refreshBalances(); // 토큰 잔액 및 allowance 업데이트
        
        // 승인 상태 확인 및 리셋
        setApprovalStatus("idle");
        toast.dismiss('instant-withdraw-update');
      }, 1500);
      
      // 추가 업데이트
      setTimeout(async () => {
        await refreshCriticalData();
        await refreshBalances();
      }, 3000);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!withdrawShares || !withdrawValidation.valid) return;

    // 요청할 포인트 금액을 BigInt로 변환
    const withdrawAmount = parseAmount(withdrawShares, vaultInfo.decimals);
    
    const success = await handleInitiateWithdraw(withdrawShares);
    if (success) {
      setWithdrawShares("");
      setIsUpdatingWithdrawBalance(true);
      setPendingWithdrawAmount(withdrawAmount);
      
      // 포인트 변환 요청 성공 후 즉시 임시 UI 업데이트
      toast.loading(
        language === 'ko' 
          ? '잔액을 업데이트하는 중...' 
          : 'Point conversion request processed. Updating balance...',
        { 
          id: 'withdraw-balance-update',
          duration: 500 
        }
      );
      
      // 블록체인 상태 업데이트를 위한 여러 번의 새로고침
      setTimeout(() => {
        refreshUserData();
      }, 1000);
      
      setTimeout(() => {
        refreshUserData();
        toast.dismiss('withdraw-balance-update');
      }, 3000);
      
      setTimeout(() => {
        refreshUserData();
        setIsUpdatingWithdrawBalance(false);
        setPendingWithdrawAmount(0n);
      }, 5000);
    }
  };

  const handleCompleteWithdrawSubmit = async () => {
    await handleCompleteWithdraw();
  };

  const copyAddress = async () => {
    if (!address) return;

    if (!SecurityUtils.rateLimiter("copy_address", 5, 60000)) {
      toast.error(t('errors.tooManyAttempts', language));
      return;
    }

    try {
      if (!SecurityUtils.validateAddress(address)) {
        toast.error(t('errors.validation', language));
        return;
      }

      await navigator.clipboard.writeText(address);
      toast.success(t('common.addressCopied', language));
    } catch (error) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = address;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success(t('common.addressCopied', language));
      } catch (fallbackError) {
        SecurityUtils.secureLog("Copy to clipboard failed:", fallbackError);
        toast.error(t('errors.copyFailed', language));
      }
    }
  };

  const setDepositPercent = (percent) => {
    const balance = safeBigInt(availableBalance);
    const amount = (balance * BigInt(percent)) / 100n;
    
    // Convert to decimal units and round to nearest 100
    const decimalAmount = Number(formatFullAmount(amount, vaultInfo.decimals));
    const roundedAmount = Math.floor(decimalAmount / 100) * 100;
    
    setDepositAmount(roundedAmount.toString());
  };

  const setInstantWithdrawMax = () => {
    setInstantWithdrawAmount(
      formatFullAmount(userBalance.withdrawableAmount, vaultInfo.decimals)
    );
  };

  const setWithdrawMax = () => {
    setWithdrawShares(
      formatFullAmount(userBalance.walletPoints, vaultInfo.decimals)
    );
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isAnyLoading =
    isDepositing || isWithdrawing || isRedeeming || isApprovingFromHook;

  // Input handlers
  const handleDepositAmountChange = (e) => {
    const value = e.target.value;
    const sanitized = SecurityUtils.sanitizeInput(value, 50);
    
    // BGSC 예치의 경우 숫자만 입력 가능
    if (depositToken === "BGSC") {
      const integerFiltered = sanitized.replace(/[^0-9]/g, '');
      // 앞자리 0 제거
      const finalValue = integerFiltered.replace(/^0+/, '') || '';
      setDepositAmount(finalValue);
    } else {
      const filtered = filterNumberInput(sanitized, vaultInfo.decimals);
      setDepositAmount(filtered);
    }
  };

  const handleRecipientAddressChange = (e) => {
    const value = e.target.value;
    const sanitized = SecurityUtils.sanitizeInput(value, 50);
    setRecipientAddress(sanitized);
  };

  // BGSC 예치 금액 blur 핸들러 - 100단위로 조정
  const handleDepositAmountBlur = () => {
    if (depositToken === "BGSC" && depositAmount) {
      const numValue = parseInt(depositAmount, 10);
      if (!isNaN(numValue)) {
        const roundedValue = Math.round(numValue / 100) * 100;
        setDepositAmount(roundedValue.toString());
      }
    }
  };

  const handleInstantWithdrawAmountChange = (e) => {
    const value = e.target.value;
    const sanitized = SecurityUtils.sanitizeInput(value, 50);
    
    // 숫자만 입력 가능
    const integerFiltered = sanitized.replace(/[^0-9]/g, '');
    // 앞자리 0 제거
    const finalValue = integerFiltered.replace(/^0+/, '') || '';
    setInstantWithdrawAmount(finalValue);
  };

  const handleWithdrawSharesChange = (e) => {
    const value = e.target.value;
    const sanitized = SecurityUtils.sanitizeInput(value, 50);
    const filtered = filterNumberInput(sanitized, vaultInfo.decimals);
    setWithdrawShares(filtered);
  };

  // 예치 취소 금액 blur 핸들러 - 100단위로 조정
  const handleInstantWithdrawAmountBlur = () => {
    if (instantWithdrawAmount) {
      const numValue = parseInt(instantWithdrawAmount, 10);
      if (!isNaN(numValue)) {
        const roundedValue = Math.round(numValue / 100) * 100;
        setInstantWithdrawAmount(roundedValue.toString());
      }
    }
  };

  // Deposit button configuration
  const getDepositButtonConfig = () => {
    // Check if currently processing to prevent duplicate actions
    if (isAnyLoading || isProcessingDeposit) {
      return {
        text: t('common.processing', language),
        icon: <Icons.Loader />,
        className: "action-button primary",
        disabled: true,
      };
    }

    switch (depositButtonState) {
      case "approval_needed":
        return {
          text: t('main.deposit.approveToken', language, { token: depositToken }),
          icon: <Icons.CheckCircle />,
          className: "action-button primary",
          disabled: !depositAmount || !depositValidation.valid || isProcessingDeposit,
        };
      case "approving":
        return {
          text: t('main.deposit.approvingToken', language),
          icon: <Icons.Loader />,
          className: "action-button primary",
          disabled: true,
        };
      case "approval_pending":
        return {
          text: t('main.deposit.processingApproval', language),
          icon: <Icons.Clock />,
          className: "action-button primary",
          disabled: true,
        };
      case "ready_to_deposit":
        return {
          text: t('main.deposit.depositWithToken', language, { token: depositToken }),
          icon: null,
          className: "action-button primary",
          disabled: !depositAmount || !depositValidation.valid || isProcessingDeposit,
        };
      default:
        return {
          text: t('main.deposit.joinWith', language, { token: depositToken }),
          icon: null,
          className: "action-button primary",
          disabled: !depositAmount || !depositValidation.valid || isProcessingDeposit,
        };
    }
  };

  // Secure balance render
  const renderSecureBalance = (balance, isPrivate, suffix = "") => {
    if (isPrivate) {
      return <span data-private="true">••••••</span>;
    }

    const sanitizedBalance = SecurityUtils.escapeHtml(balance.toString());
    return sanitizedBalance + suffix;
  };

  return (
    <div className="app">
      {/* CSS for mobile price box animation and scrollbar removal */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Remove scrollbars globally */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        *::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Ensure no horizontal scroll */
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
        
        .app {
          overflow-x: hidden;
        }
        
        .main-section {
          overflow: visible;
        }
        
        .balance-display {
          overflow: visible;
        }
        
        .main-content-wrapper {
          overflow: visible;
        }
        
        /* Adjust stats container margin */
        .stats-container {
          margin-bottom: 25px !important;
        }
        
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 4px 12px rgba(140, 90, 255, 0.1);
          }
          50% {
            box-shadow: 0 4px 20px rgba(140, 90, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.2);
          }
          100% {
            box-shadow: 0 4px 12px rgba(140, 90, 255, 0.1);
          }
        }
        
        .mobile-price-box {
          position: relative;
          overflow: hidden;
        }
        
        .mobile-price-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(140, 90, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%);
          }
          100% {
            transform: translateX(100%) translateY(100%);
          }
        }
      `}} />
      

      {/* Header */}
      <header className="header-wrapper">
        <div className="header-container" style={isMobile ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {}}>
          <div className="logo-section">
            <img
              onClick={scrollToTop}
              style={{ cursor: "pointer" }}
              src={`${process.env.PUBLIC_URL}/logo.png`}
              className="logo"
              alt="Logo"
            />
            <div className="logo-right">
              <img src={`${process.env.PUBLIC_URL}/logo-text.png`} className="logo-text" alt="Logo" />
              <div className="logo-info">
                <span style={{ color: '#FFC107', fontWeight: 'bold', marginRight: isMobile ? '10px' : '21px' }}>
                  {language === 'ko' ? '마감 롤링' : 'Final Rolling'}
                </span>
                <span style={{ marginRight: isMobile ? '10px' : '21px' }}>{t('main.stats.next', language)}: 11월 1일 00시</span>
                <span className="live-trading-highlight" style={{ marginRight: isMobile ? '0' : '21px' }}>{t('main.stats.liveTrading', language)}</span>
              </div>
            </div>
          </div>

          {isMobile && (
            <div style={{ flexShrink: 0 }}>
              <HeaderLanguageToggle />
            </div>
          )}

          {!isMobile && (
            <div className="wallet-section desktop-only">
              <HeaderLanguageToggle />
              <div className="event-badge">
                <div className="event-dot" />
                <span className="event-text">{livePrice} {t('main.stats.bgscPerPoint', language)} </span>
                <span
                  className={`price-change ${
                    parseFloat(priceChange) >= 0 ? "positive" : "negative"
                  }`}
                >
                  {parseFloat(priceChange) >= 0 ? "+" : ""}
                  {priceChange}%
                </span>
              </div>

              {isConnected && address ? (
                <button
                  onClick={openAccountModal}
                  className="address-display desktop-only"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: 'inherit',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {shortenAddress(address)}
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ opacity: 0.6 }}
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>

                </button>
              ) : (
                <ConnectButton 
                  label={language === 'ko' ? '지갑 연결' : 'Connect Wallet'}
                  accountStatus="address"
                  chainStatus="none"
                  showBalance={false}
                />
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <section className="main-section">
          <div className="main-background">
            <div className="main-background-triangle" />
            <div className="main-background-up" />
          </div>
          <div className="main-content-wrapper">
            <div className="balance-display">
              {isMobile && (
                <>
                  <div className="wallet-section mobile-only">
                    <div className="event-badge mobile-price-box" style={{
                      background: 'rgba(24, 27, 37, 0.4)',
                      border: '1px solid #181B25',
                      borderRadius: '20px',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginTop: '12px',
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(140, 90, 255, 0.1)',
                      animation: 'pulseGlow 3s ease-in-out infinite',
                      width: '100%',
                      maxWidth: '343px',
                      
                    }}>
                      <div className="event-wrap" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div className="event-dot" style={{
                          width: '4px',
                          height: '4px'
                        }} />
                        <span className="event-text" style={{
                          fontSize: '16px', 
                          fontWeight: '500',
                          color: '#ffffff'
                        }}>
                          {livePrice} {t('main.stats.bgscPerPoint', language)}{" "}
                        </span>
                      </div>
                      
                      <span
                        className={`price-change ${
                          parseFloat(priceChange) >= 0 ? "positive" : "negative"
                        }`}
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          lineHeight: '20px',
                          letterSpacing: '-2%',
                          padding: '4px 12px',
                          borderRadius: '18px',
                          background: parseFloat(priceChange) >= 0 ? 'rgba(18, 185, 131, 0.04)' : 'rgba(239, 68, 68, 0.15)',
                          border: parseFloat(priceChange) >= 0 ? '1px solid rgba(18, 185, 131, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        {parseFloat(priceChange) >= 0 ? "+" : ""}
                        {priceChange}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                      {isConnected && address ? (
                        <button
                          onClick={openAccountModal}
                          className="address-display"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {shortenAddress(address)}
                          <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.3125 5.99255C13.3125 6.37225 13.0047 6.68005 12.625 6.68005L5.29437 6.68005C4.91468 6.68005 4.60687 6.37225 4.60687 5.99255C4.60687 5.61286 4.91468 5.30505 5.29437 5.30505L12.625 5.30505C13.0047 5.30505 13.3125 5.61286 13.3125 5.99255Z" fill="#666666"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.86815 9.74862C8.59971 9.48008 8.5998 9.04478 8.86833 8.77634L11.6526 5.99311L8.86824 3.20871C8.59975 2.94022 8.59975 2.50492 8.86824 2.23644C9.13673 1.96795 9.57203 1.96795 9.84051 2.23644L13.1111 5.50706C13.2401 5.63601 13.3125 5.8109 13.3125 5.99326C13.3125 6.17562 13.24 6.3505 13.111 6.47943L9.84042 9.7488C9.57188 10.0172 9.13658 10.0172 8.86815 9.74862Z" fill="#666666"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M5.10187 10.55C5.31736 10.55 5.52402 10.4644 5.67639 10.3121C5.82877 10.1597 5.91437 9.95304 5.91437 9.73755L5.91437 8.6788C5.91437 8.2991 6.22217 7.9913 6.60187 7.9913C6.98156 7.9913 7.28937 8.2991 7.28937 8.6788L7.28937 9.73755C7.28937 10.3177 7.0589 10.8741 6.64866 11.2843C6.23843 11.6946 5.68203 11.925 5.10187 11.925L2.32187 11.925C1.74171 11.925 1.18531 11.6946 0.775071 11.2843C0.364834 10.8741 0.134368 10.3177 0.134368 9.73755L0.134369 2.24692C0.134611 1.66692 0.365185 1.11047 0.775394 0.700429C1.1856 0.290391 1.74187 0.0600467 2.32187 0.0600467L5.10187 0.060047C5.68203 0.060047 6.23843 0.290518 6.64866 0.700753C7.0589 1.11099 7.28937 1.66739 7.28937 2.24755L7.28937 3.3038C7.28937 3.68349 6.98156 3.9913 6.60187 3.9913C6.22217 3.9913 5.91437 3.68349 5.91437 3.3038L5.91437 2.24755C5.91437 2.03206 5.82877 1.8254 5.67639 1.67302C5.52402 1.52065 5.31736 1.43505 5.10187 1.43505L2.32187 1.43505C2.10644 1.43505 1.89983 1.5206 1.74746 1.6729C1.5951 1.8252 1.50946 2.03178 1.50937 2.24721L1.50937 9.73755C1.50937 9.95304 1.59497 10.1597 1.74734 10.3121C1.89972 10.4644 2.10638 10.55 2.32187 10.55L5.10187 10.55Z" fill="#666666"/>
                          </svg>
                        </button>
                      ) : (
                        <div>
                          {isMobile && !isDappBrowser ? (
                          // 모바일 브라우저에서 커스텀 지갑 선택 UI
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(140, 90, 255, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%)',
                            border: '1px solid rgba(140, 90, 255, 0.3)',
                            borderRadius: '16px',
                            padding: '20px',
                            textAlign: 'center'
                          }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
                              {language === 'ko' ? '지갑 선택' : 'Select Wallet'}
                            </h3>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr',
                              gap: '12px',
                              marginBottom: '16px'
                            }}>
                              <button
                                onClick={() => {
                                  const deepLink = MobileWalletUtils.generateDeepLink('metamask', window.location.href);
                                  if (deepLink) window.location.href = deepLink;
                                }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '12px',
                                  padding: '16px 8px',
                                  color: '#fff',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                MetaMask
                              </button>
                              <button
                                onClick={() => {
                                  const deepLink = MobileWalletUtils.generateDeepLink('imtoken', window.location.href);
                                  if (deepLink) window.location.href = deepLink;
                                }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '12px',
                                  padding: '16px 8px',
                                  color: '#fff',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                imToken
                              </button>
                              <button
                                onClick={() => {
                                  const deepLink = MobileWalletUtils.generateDeepLink('binance', window.location.href);
                                  if (deepLink) window.location.href = deepLink;
                                }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)',
                                  borderRadius: '12px',
                                  padding: '16px 8px',
                                  color: '#fff',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease'
                                }}
                              >
                                Binance
                              </button>
                            </div>
                            <p style={{ fontSize: '13px', opacity: 0.7, margin: 0 }}>
                              {language === 'ko' 
                                ? '지갑 앱이 설치되어 있어야 합니다' 
                                : 'Wallet app must be installed'}
                            </p>
                          </div>
                        ) : (
                          // DApp 브라우저 또는 데스크톱에서는 RainbowKit 사용
                          <ConnectButton 
                            label={language === 'ko' ? '지갑 연결' : 'Connect Wallet'}
                            accountStatus="address"
                            chainStatus="none"
                            showBalance={false}
                          />
                        )}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Professional Hero Section - Complete Redesign */}
            <div className="hero-section-pro">

                  <div className="hero-main-grid">
                      {/* Premium Reward Pool Card */}
                      <div className="hero-card reward-pool-card">
                        {vaultInfo.currentRound === 2 && (
                          <div className="bonus-badge-corner">
                            <div className="bonus-main-text">
                              {language === 'ko' ? '1라운드 특별 +50% 보너스' : 'Round 1 Special +50% Bonus'}
                            </div>
                            <div className="bonus-sub-text">
                              {language === 'ko' ? '+50,000,000 BGSC' : '+50M BGSC'}
                            </div>
                          </div>
                        )}
                        <div className="card-inner">
                          <div className="reward-icon-wrapper">
                            <svg width="36" height="35" viewBox="0 0 36 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M19.9235 1.21172L23.8018 9.07006C24.1135 9.70172 24.7168 10.1401 25.4151 10.2417L34.0868 11.5017C35.8435 11.7567 36.5468 13.9184 35.2735 15.1567L28.9985 21.2734C28.7498 21.516 28.5637 21.8153 28.4563 22.1457C28.3489 22.4761 28.3233 22.8276 28.3818 23.1701L29.8635 31.8067C30.1635 33.5584 28.3268 34.8917 26.7551 34.0667L18.9985 29.9884C18.6911 29.8266 18.3491 29.7421 18.0018 29.7421C17.6545 29.7421 17.3124 29.8266 17.0051 29.9884L9.24846 34.0667C7.67512 34.8917 5.83846 33.5584 6.13846 31.8067L7.62012 23.1701C7.67847 22.8276 7.65284 22.4761 7.54543 22.1458C7.43802 21.8154 7.25204 21.516 7.00346 21.2734L0.728457 15.1567C-0.54321 13.9184 0.158457 11.7567 1.91679 11.5017L10.5868 10.2417C11.2851 10.1401 11.8901 9.70172 12.2018 9.07006L16.0785 1.21172C16.8651 -0.38161 19.1368 -0.38161 19.9235 1.21172Z" fill="#9095FB"/>
                            </svg>
                          </div>
                          <div className="reward-content">
                            <h3 className="reward-label">{language === 'ko' ? '총 보상 풀' : 'Total Reward Pool'}</h3>
                            <div className="reward-amount">
                              <span className="amount-number">350,000,000</span>
                              <span className="amount-unit">BGSC</span>
                            </div>
                            <div className="reward-details">
                              {language === 'ko' 
                                ? '총 350,000,000 BGSC' 
                                : 'Total 350,000,000 BGSC'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* TVL Card */}
                      <div className="hero-card tvl-card">
                        <div className="card-inner">
                          <div className="tvl-header">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 16.5001C5.879 16.5001 2.397 15.3951 0.377 13.6541C0.138 14.0831 0 14.5331 0 15.0001C0 17.7621 4.478 20.0001 10 20.0001C15.522 20.0001 20 17.7621 20 15.0001C20 14.5331 19.862 14.0831 19.623 13.6541C17.604 15.3951 14.121 16.5001 10 16.5001Z" fill="#8B95A1"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 16.5001C5.879 16.5001 2.397 15.3951 0.377 13.6541C0.138 14.0831 0 14.5331 0 15.0001C0 17.7621 4.478 20.0001 10 20.0001C15.522 20.0001 20 17.7621 20 15.0001C20 14.5331 19.862 14.0831 19.623 13.6541C17.604 15.3951 14.121 16.5001 10 16.5001Z" fill="url(#paint0_linear_6261_531)"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 11.5001C5.879 11.5001 2.397 10.3951 0.377 8.65405C0.138 9.08305 0 9.53305 0 10.0001C0 12.7621 4.478 15.0001 10 15.0001C15.522 15.0001 20 12.7621 20 10.0001C20 9.53305 19.862 9.08305 19.623 8.65405C17.604 10.3951 14.121 11.5001 10 11.5001Z" fill="#8B95A1"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 11.5001C5.879 11.5001 2.397 10.3951 0.377 8.65405C0.138 9.08305 0 9.53305 0 10.0001C0 12.7621 4.478 15.0001 10 15.0001C15.522 15.0001 20 12.7621 20 10.0001C20 9.53305 19.862 9.08305 19.623 8.65405C17.604 10.3951 14.121 11.5001 10 11.5001Z" fill="url(#paint1_linear_6261_531)"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 10C15.522 10 20 7.762 20 5C20 2.239 15.522 0 10 0C4.478 0 0 2.239 0 5C0 7.762 4.478 10 10 10Z" fill="#8B95A1"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M10 10C15.522 10 20 7.762 20 5C20 2.239 15.522 0 10 0C4.478 0 0 2.239 0 5C0 7.762 4.478 10 10 10Z" fill="url(#paint2_linear_6261_531)"/>
                              <defs>
                              <linearGradient id="paint0_linear_6261_531" x1="0" y1="13.6541" x2="16.7454" y2="25.4565" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#12B983"/>
                              <stop offset="1" stopColor="#06B6D3"/>
                              </linearGradient>
                              <linearGradient id="paint1_linear_6261_531" x1="0" y1="8.65405" x2="16.7454" y2="20.4565" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#12B983"/>
                              <stop offset="1" stopColor="#06B6D3"/>
                              </linearGradient>
                              <linearGradient id="paint2_linear_6261_531" x1="0" y1="0" x2="20.8856" y2="9.34162" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#12B983"/>
                              <stop offset="1" stopColor="#06B6D3"/>
                              </linearGradient>
                              </defs>
                            </svg>

                            <span className="tvl-label">{language === 'ko' ? '총 예치 금액' : 'Total Value Locked'}</span>
                            <span className="live-indicator">
                              <span className="live-dot"></span>
                              LIVE
                            </span>
                          </div>
                          <div className="tvl-amount">
                            <span className="tvl-number">
                              {Number(formatFullAmount(vaultMetrics.totalValueLocked || '0', vaultInfo.decimals)).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
                            </span>
                            <span className="tvl-unit">BGSC</span>
                          </div>
                          <div className="tvl-progress">
                            <div className="progress-bar">

                            </div>
                            <div className="progress-label">
                              {language === 'ko' ? '현재 볼트에 있는 총 BGSC' : 'Deposited BGSC'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Round Timer Card - 2025년 11월 이전만 표시 */}
                      {countdown.shouldShowCountdown && (
                        <div className="hero-card timer-card">
                          <div className="card-inner">
                            <div className="timer-header">

                              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path className="timer-icon" fillRule="evenodd" clipRule="evenodd" d="M12 10.761C12 10.794 11.984 10.823 11.981 10.855C11.9754 10.9227 11.9616 10.9895 11.94 11.054C11.9038 11.1736 11.8447 11.285 11.766 11.382C11.722 11.435 11.676 11.482 11.622 11.526C11.597 11.546 11.582 11.575 11.555 11.593L6.829 14.743C6.60832 14.8846 6.34086 14.9338 6.08423 14.8801C5.8276 14.8264 5.60233 14.6741 5.45692 14.4559C5.31152 14.2377 5.25761 13.9712 5.30682 13.7136C5.35602 13.4561 5.5044 13.2282 5.72 13.079L10 10.226V5.556C10 5.29078 10.1054 5.03643 10.2929 4.84889C10.4804 4.66136 10.7348 4.556 11 4.556C11.2652 4.556 11.5196 4.66136 11.7071 4.84889C11.8946 5.03643 12 5.29078 12 5.556V10.761ZM11 0.5C5.201 0.5 0.5 5.201 0.5 11C0.5 16.799 5.201 21.5 11 21.5C16.799 21.5 21.5 16.799 21.5 11C21.5 5.201 16.799 0.5 11 0.5Z" fill="url(#paint0_linear_6265_710)"/>
                                <defs>
                                <linearGradient id="paint0_linear_6265_710" x1="0.5" y1="0.5" x2="25.5636" y2="6.10516" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#BF52FF"/>
                                <stop offset="1" stopColor="#6C52FF"/>
                                </linearGradient>
                                </defs>
                              </svg>

                              <span className="round-label">
                                {language === 'ko' ? '최종 마감 롤링' : 'Final Rolling'}
                              </span>
                              <span className="round-badge">FINAL</span>
                            </div>
                            <div className="timer-countdown">
                              <div className="time-unit">
                                <div className="time-value">{countdown.hours.toString().padStart(2, '0')}</div>
                                <div className="time-label">{language === 'ko' ? '시간' : 'HRS'}</div>
                              </div>
                              <div className="time-separator">:</div>
                              <div className="time-unit">
                                <div className="time-value">{countdown.minutes.toString().padStart(2, '0')}</div>
                                <div className="time-label">{language === 'ko' ? '분' : 'MIN'}</div>
                              </div>
                              <div className="time-separator">:</div>
                              <div className="time-unit">
                                <div className="time-value">{countdown.seconds.toString().padStart(2, '0')}</div>
                                <div className="time-label">{language === 'ko' ? '초' : 'SEC'}</div>
                              </div>
                            </div>
                            <div className="timer-footer">
                              {language === 'ko' ? '최종 출금 종료까지' : 'Until final ends'}
                              <span style={{ fontSize: '12px', opacity: 0.88, marginLeft: '8px' }}>
                                {language === 'ko' ? '(최종 변환 마감까지)' : '(Convert finish)'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Round Closing Notice Card */}
                      <div className="hero-card apy-card">
                        <div className="card-inner" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                          <div className="apy-header" style={{ justifyContent: 'center' }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M11 8.2C10.6817 8.2 10.3765 8.07357 10.1515 7.84853C9.92643 7.62348 9.8 7.31826 9.8 7C9.8 6.68174 9.92643 6.37652 10.1515 6.15147C10.3765 5.92643 10.6817 5.8 11 5.8C11.3183 5.8 11.6235 5.92643 11.8485 6.15147C12.0736 6.37652 12.2 6.68174 12.2 7C12.2 7.31826 12.0736 7.62348 11.8485 7.84853C11.6235 8.07357 11.3183 8.2 11 8.2ZM12 15.635C12 15.9002 11.8946 16.1546 11.7071 16.3421C11.5196 16.5296 11.2652 16.635 11 16.635C10.7348 16.635 10.4804 16.5296 10.2929 16.3421C10.1054 16.1546 10 15.9002 10 15.635V10.635C10 10.3698 10.1054 10.1154 10.2929 9.92789C10.4804 9.74036 10.7348 9.635 11 9.635C11.2652 9.635 11.5196 9.74036 11.7071 9.92789C11.8946 10.1154 12 10.3698 12 10.635V15.635ZM11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0Z" fill="#FFC107"/>
                            </svg>

                            <span className="apy-label" style={{ color: '#FFC107', fontWeight: 'bold' }}>
                              {language === 'ko' ? '마감 라운드 중요 안내' : 'Important Notice'}
                            </span>
                          </div>
                          <div style={{ padding: '16px 0', textAlign: 'center', lineHeight: '1.7' }}>
                            <p style={{ margin: '0 0 14px 0', fontSize: '17px', color: '#FFFFFF', fontWeight: 'bold' }}>
                              {language === 'ko'
                                ? '현재 최종 라운드가 진행 중입니다.'
                                : 'Final round is in progress'}
                            </p>
                            <p style={{ margin: '0 0 14px 0', fontSize: '15px', color: '#10b981', fontWeight: '600' }}>
                              {language === 'ko'
                                ? '지금 반드시 포인트 수령 후 즉시 변환을 신청하세요'
                                : 'Apply for conversion immediately after redeeming points'}
                            </p>
                            <p style={{ margin: '0', fontSize: '25px', color: '#ef4444', fontWeight: 'bold' }}>
                              {language === 'ko'
                                ? '지금 즉시, 포인트 수령 및 변환 신청을 완료하세요!'
                                : 'Complete redeem all right now!'}
                            </p>
                          </div>
                        </div>
                      </div>
                  </div>



                {/* Notice Banner */}
                {isMobile ? (
                  
                  <div className="hero-mobile-notice">
                    <div className="notice-icon">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11 8.2C10.6817 8.2 10.3765 8.07357 10.1515 7.84853C9.92643 7.62348 9.8 7.31826 9.8 7C9.8 6.68174 9.92643 6.37652 10.1515 6.15147C10.3765 5.92643 10.6817 5.8 11 5.8C11.3183 5.8 11.6235 5.92643 11.8485 6.15147C12.0736 6.37652 12.2 6.68174 12.2 7C12.2 7.31826 12.0736 7.62348 11.8485 7.84853C11.6235 8.07357 11.3183 8.2 11 8.2ZM12 15.635C12 15.9002 11.8946 16.1546 11.7071 16.3421C11.5196 16.5296 11.2652 16.635 11 16.635C10.7348 16.635 10.4804 16.5296 10.2929 16.3421C10.1054 16.1546 10 15.9002 10 15.635V10.635C10 10.3698 10.1054 10.1154 10.2929 9.92789C10.4804 9.74036 10.7348 9.635 11 9.635C11.2652 9.635 11.5196 9.74036 11.7071 9.92789C11.8946 10.1154 12 10.3698 12 10.635V15.635ZM11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0Z" fill="#6C52FF"/>
                      </svg>
                    </div>
                    <span className="notice-text">
                      {language === 'ko' ? '라운드 전환 전 1시간 전까지 취소 가능' : 'Cancellable 1hour before round rolling'}
                    </span>
                  </div>
                  )
                  :(                  
                  <div className="hero-notice-banner">
                    <div className="notice-icon">
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M11 8.2C10.6817 8.2 10.3765 8.07357 10.1515 7.84853C9.92643 7.62348 9.8 7.31826 9.8 7C9.8 6.68174 9.92643 6.37652 10.1515 6.15147C10.3765 5.92643 10.6817 5.8 11 5.8C11.3183 5.8 11.6235 5.92643 11.8485 6.15147C12.0736 6.37652 12.2 6.68174 12.2 7C12.2 7.31826 12.0736 7.62348 11.8485 7.84853C11.6235 8.07357 11.3183 8.2 11 8.2ZM12 15.635C12 15.9002 11.8946 16.1546 11.7071 16.3421C11.5196 16.5296 11.2652 16.635 11 16.635C10.7348 16.635 10.4804 16.5296 10.2929 16.3421C10.1054 16.1546 10 15.9002 10 15.635V10.635C10 10.3698 10.1054 10.1154 10.2929 9.92789C10.4804 9.74036 10.7348 9.635 11 9.635C11.2652 9.635 11.5196 9.74036 11.7071 9.92789C11.8946 10.1154 12 10.3698 12 10.635V15.635ZM11 0C4.925 0 0 4.925 0 11C0 17.075 4.925 22 11 22C17.075 22 22 17.075 22 11C22 4.925 17.075 0 11 0Z" fill="#6C52FF"/>
                      </svg>
                    </div>
                    <span className="notice-text" style={{ color: '#FFC107', fontWeight: 'bold' }}>
                      {language === 'ko'
                        ? '최종 마감 라운드! 마감 롤링전 포인트 수령 및 변환을 반드시 신청하세요!'
                        : 'Final round in progress! You MUST apply for point redemption and conversion!'}
                    </span>
                  </div>
                  )}

            </div>
          </div>
        </section>
      </main>
      
      {/* Tabs */}
      <div className="tabs-container">
        <div className={`tabs-wrapper ${isMobile ? "two-row-tabs" : ""}`}>
          {isMobile ? (
            <>
              {/* Mobile: First Row - 2 tabs */}
              <div className="tabs-row">
                <button
                  className={`tab-button ${activeTab === "deposit" ? "active" : ""}`}
                  onClick={() => setActiveTab("deposit")}
                >
                  {t('main.tabs.deposit', language)}
                </button>
                <button
                  className={`tab-button ${activeTab === "redeem" ? "active" : ""}`}
                  onClick={() => setActiveTab("redeem")}
                >
                  {t('main.tabs.redeem', language)}
                </button>
              </div>
              {/* Mobile: Second Row - 3 tabs */}
              <div className="tabs-row">
                <button
                  className={`tab-button ${activeTab === "convert" ? "active" : ""}`}
                  onClick={() => setActiveTab("convert")}
                >
                  {t('main.tabs.convert', language)}
                </button>
                <button
                  className={`tab-button ${activeTab === "withdraw" ? "active" : ""}`}
                  onClick={() => setActiveTab("withdraw")}
                >
                  {t('main.tabs.withdraw', language)}
                </button>
                <button
                  className={`tab-button ${activeTab === "mypage" ? "active" : ""}`}
                  onClick={() => setActiveTab("mypage")}
                >
                  {t('main.tabs.mypage', language)}
                  {isLoadingHistory && (
                    <Icons.Loader
                      style={{ marginLeft: "8px", width: "16px", height: "16px" }}
                    />
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* PC: All tabs in one row */}
              <button
                className={`tab-button ${activeTab === "deposit" ? "active" : ""}`}
                onClick={() => setActiveTab("deposit")}
              >
                {t('main.tabs.deposit', language)}
              </button>
              <button
                className={`tab-button ${activeTab === "redeem" ? "active" : ""}`}
                onClick={() => setActiveTab("redeem")}
              >
                {t('main.tabs.redeem', language)}
              </button>
              <button
                className={`tab-button ${activeTab === "convert" ? "active" : ""}`}
                onClick={() => setActiveTab("convert")}
              >
                {t('main.tabs.convert', language)}
              </button>
              <button
                className={`tab-button ${activeTab === "withdraw" ? "active" : ""}`}
                onClick={() => setActiveTab("withdraw")}
              >
                {t('main.tabs.withdraw', language)}
              </button>
              <button
                className={`tab-button ${activeTab === "mypage" ? "active" : ""}`}
                onClick={() => setActiveTab("mypage")}
              >
                {t('main.tabs.mypage', language)}
                {isLoadingHistory && (
                  <Icons.Loader
                    style={{ marginLeft: "8px", width: "16px", height: "16px" }}
                  />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Contents */}
      <div className={`tab-content ${activeTab === "deposit" ? "active" : ""}`}>
        <div className="tab-content-wrapper">
          {!isConnected ? (
            <WalletDisconnectedAlert />
          ) : (
            // 신규 예치 서비스 종료 안내
            <div className="main-content deposit-withdraw-container">
              <div className="deposit-locked-standalone">
                <div className="lock-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V12C2 16.5 5 20.7 12 22C19 20.7 22 16.5 22 12V7L12 2Z" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="lock-title" style={{ fontSize: '24px', marginBottom: '16px' }}>
                  {language === 'ko' ? '신규 예치 서비스 마감' : 'Deposit Service Closed'}
                </h3>
                <p className="lock-description" style={{ fontSize: '16px', marginBottom: '20px' }}>
                  {language === 'ko'
                    ? '볼트 프로토콜의 신규 예치 서비스가 마감되었습니다.'
                    : 'The vault protocol deposit service has been closed.'
                  }
                </p>
                <div className="info-box" style={{
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <p style={{ color: '#FFC107', fontWeight: 'bold', marginBottom: '12px' }}>
                    {language === 'ko' ? '중요 안내' : 'Important Notice'}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '8px' }}>
                      {language === 'ko'
                        ? '• 볼트 이벤트 참여는 마감되었습니다.'
                        : '• Vault events is closed.'
                      }
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      {language === 'ko'
                        ? '• 10월 31일 이전, 반드시 전액 수령 및 변환 신청을 해야합니다.'
                        : '• You must apply for full redeem and conversion before 31th October'
                      }
                    </li>
                    <li style={{ fontWeight: 'bold', color: '#FFC107' }}>
                      {language === 'ko'
                        ? '• 포인트 수령 및 변환 탭에서 반드시 신청하세요!'
                        : '• You MUST apply in the Redeem & Convert tabs!'
                      }
                    </li>
                                        <li style={{ fontWeight: 'bold', color: '#FFC107' }}>
                      {language === 'ko'
                        ? '• 10월 내 미신청시 전체 자금이 동결될 수 있습니다.'
                        : '• If you dont apply in oct, the entire fund may be frozen.'
                      }
                    </li>
                  </ul>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '24px',
                  justifyContent: 'center'
                }}>
                  <button
                    className="action-button secondary"
                    onClick={() => setActiveTab('redeem')}
                    style={{ minWidth: '140px' }}
                  >
                    {language === 'ko' ? '포인트 수령' : 'Redeem Points'}
                  </button>
                  <button
                    className="action-button primary"
                    onClick={() => setActiveTab('convert')}
                    style={{ minWidth: '140px' }}
                  >
                    {language === 'ko' ? '변환 신청' : 'Convert'}
                  </button>
                </div>
              </div>
            </div>
          )}
          {false && (
            // 정상 시간 - 예치 폼 표시
            <div className="main-content deposit-withdraw-container">
            <div className="form-card deposit-card">
              <div className="form-header">
                <h2 className="form-title">{t('main.deposit.formTitle', language)}</h2>
              </div>

              <div className="token-selector">
                <div
                  className={`token-option ${
                    depositToken === "BGSC" ? "active" : ""
                  }`}
                  onClick={() => setDepositToken("BGSC")}
                >
                  BGSC
                </div>
                {vaultInfo.isWBNB && (
                  <div
                    className={`token-option ${
                      depositToken === "BNB" ? "active" : ""
                    }`}
                    onClick={() => setDepositToken("BNB")}
                  >
                    BNB
                  </div>
                )}
              </div>

              {/* Two-step process explanation for BGSC deposits */}
              {depositToken === "BGSC" && (
                <div className="info-box" style={{
                  backgroundColor: 'rgba(140, 90, 255, 0.05)',
                  border: '1px solid rgba(140, 90, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <Icons.Info style={{ fontSize: '16px', color: '#8C5AFF', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: '#ffffff' }}>
                        {language === 'ko' ? '1단계: 지출 한도 승인 → 2단계: 입금 실행' : 'Step 1: Approve token → Step 2: Deposit'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="input-group">
                <div className="input-header">
                  <span className="input-label">{t('main.deposit.participationAmount', language)}</span>
                  <span className="input-info">{t('main.deposit.minimumAmount', language)}: 10,000 BGSC</span>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className={`input-value ${
                      !depositValidation.valid ? "input-error" : ""
                    }`}
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={handleDepositAmountChange}
                    onBlur={handleDepositAmountBlur}
                    maxLength={30}
                    autoComplete="off"
                  />
                  <span className="input-suffix">
                    {SecurityUtils.escapeHtml(depositToken)}
                  </span>
                </div>
                {!depositValidation.valid && (
                  <div className="error-message">
                    <Icons.AlertTriangle />
                    <span>
                      {depositValidation.params
                        ? t(depositValidation.error, language, depositValidation.params)
                        : t(depositValidation.error, language)
                      }
                    </span>
                  </div>
                )}
                {depositToken === "BGSC" && (
                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#888888' }}>
                    {language === 'ko' 
                      ? '※ 100 단위 참여 가능'
                      : '※ Please enter in increments of 100'
                    }
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-header with-buttons">
                  <span className="input-label">
                    {t('main.deposit.availableBalance', language)}:{" "}
                    {SecurityUtils.escapeHtml(
                      formatIntegerAmount(availableBalance, vaultInfo.decimals)
                    )}{" "}
                    {SecurityUtils.escapeHtml(depositToken)}
                  </span>
                  <div className="amount-buttons">
                    <button
                      className="amount-button"
                      onClick={() => setDepositPercent(25)}
                    >
                      25%
                    </button>
                    <button
                      className="amount-button"
                      onClick={() => setDepositPercent(50)}
                    >
                      50%
                    </button>
                    <button
                      className="amount-button"
                      onClick={() => setDepositPercent(100)}
                    >
                      MAX
                    </button>
                  </div>
                </div>


                <button
                  className={getDepositButtonConfig().className}
                  onClick={handleDepositSubmit}
                  disabled={getDepositButtonConfig().disabled}
                >
                  {getDepositButtonConfig().icon}
                  {getDepositButtonConfig().text}
                </button>
              </div>
            </div>

            <div className="form-card instant-withdraw-card">
              <div className="form-header">
                <h2 className="form-title">
                  {t('main.instantWithdraw.title', language)}
                </h2>
              </div>

              <div className="input-group">
                <div className="input-header">
                  <span className="input-label">{t('main.instantWithdraw.withdrawAmountLabel', language)}</span>
                  <span className="input-info">{t('main.deposit.minimumAmount', language)}: 10,000 BGSC</span>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className={`input-value ${
                      !instantWithdrawValidation.valid ? "input-error" : ""
                    }`}
                    placeholder="0.00"
                    value={instantWithdrawAmount}
                    onChange={handleInstantWithdrawAmountChange}
                    onBlur={handleInstantWithdrawAmountBlur}
                    maxLength={30}
                    autoComplete="off"
                  />
                  <span className="input-suffix">{t('common.bgsc', language)}</span>
                </div>
                {!instantWithdrawValidation.valid && (
                  <div className="error-message">
                    <Icons.AlertTriangle />
                    <span>
                      {instantWithdrawValidation.params
                        ? t(instantWithdrawValidation.error, language, instantWithdrawValidation.params)
                        : t(instantWithdrawValidation.error, language)
                      }
                    </span>
                  </div>
                )}
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#888888' }}>
                  {language === 'ko' 
                    ? '※ 100 단위 참여 가능'
                    : '※ Please enter in increments of 100'
                  }
                </div>
              </div>

              <div className="input-group">
                <div className="input-header">
                  <span className="input-label">
                    {t('main.instantWithdraw.availableLabel', language)}:{" "}
                    {SecurityUtils.escapeHtml(
                      formatIntegerAmount(
                        safeBigInt(userBalance.withdrawableAmount) > 0n 
                          ? (BigInt(userBalance.withdrawableAmount) + 1n).toString()
                          : userBalance.withdrawableAmount,
                        vaultInfo.decimals
                      )
                    )}{" "}
                    BGSC
                  </span>
                  <div className="amount-buttons">
                    <button
                      className="amount-button"
                      onClick={setInstantWithdrawMax}
                      disabled={
                        safeBigInt(userBalance.withdrawableAmount) === 0n
                      }
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <button
                  className="action-button secondary"
                  onClick={handleInstantWithdrawSubmit}
                  disabled={
                    !instantWithdrawAmount ||
                    !instantWithdrawValidation.valid ||
                    isAnyLoading ||
                    !userBalance.canInstantWithdraw ||
                    !instantWithdrawInfo.canWithdraw
                  }
                >
                  {isAnyLoading ? (
                    <>
                      <Icons.Loader />
                      {t('common.processing', language)}
                    </>
                  ) : !instantWithdrawInfo.canWithdraw ? (
                    t('main.instantWithdraw.notAvailable', language)
                  ) : !userBalance.canInstantWithdraw ? (
                    t('main.instantWithdraw.noDepositToCancel', language)
                  ) : (
                    <span style={{ letterSpacing: "0.2em" }}>
                      {t('main.instantWithdraw.cancelAndWithdraw', language)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      <div
        className={`tab-content ${
          activeTab === "redeem" ? "active" : ""
        } tab-content-small`}
      >
        <div className="tab-content-wrapper">
          {!isConnected ? (
            <WalletDisconnectedAlert />
          ) : countdown.isDepositLocked ? (
            // 라운드 종료 1시간 전 - 수령 차단 화면만 표시
            <div className="main-content">
              <div className="deposit-locked-standalone">
                <div className="lock-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="lock-title">
                  {language === 'ko' ? '마감됨, 라운드 롤링 처리 대기 중' : 'Round Rolling Processing'}
                </h3>
                <p className="lock-description">
                  {language === 'ko' 
                    ? '종료 1시간 전부터는 수령이 중단됩니다.'
                    : 'Redemption is suspended 1 hour before round ends.'
                  }
                </p>
                <p className="lock-info" style={{ whiteSpace: 'pre-line' }}>
                  {language === 'ko' 
                    ? '다음 라운드는 롤링 과정이 끝난 이후 시작됩니다.\n다음날 확인해 주세요.'
                    : 'Next round will start after the rolling process.\nPlease check tomorrow.'
                  }
                </p>
              </div>
            </div>
          ) : (
          <div className="main-content">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">{t('main.redeem.title', language)}</h2>
                <p className="form-description redeem-description">
                  {t('main.redeem.description', language)}
                </p>
                <div className="info-box" style={{
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                    {language === 'ko' ? '⚠️ 반드시 즉시 포인트 수령하세요!' : '⚠️ MUST Apply Redeem!'}
                  </p>
                  <p style={{ color: '#FFC107', fontSize: '14px', marginTop: '8px', marginBottom: 0 }}>
                    {language === 'ko'
                      ? '즉시 포인트 수령 후, 즉시 포인트 변환 신청 하세요! 신청하지 않으면 출금이 불가능합니다.'
                      : 'Point redemption is mandatory. You cannot withdraw without applying.'
                    }
                  </p>
                </div>
                <div style={{ marginTop: '16px', fontSize: '16px', color: '#999999' }}>
                  {language === 'ko' ? '포인트수령 까지 남은시간: ' : 'Time remaining until point collection: '}
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
                    {countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>


              <div
                className="input-field"
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span className="input-label">{t('main.redeem.unredeemedPointsLabel', language)}</span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {SecurityUtils.escapeHtml(
                    formatIntegerAmount(
                      userBalance.unredeemedPoints,
                      vaultInfo.decimals
                    )
                  )}{" "}
                  {t('main.redeem.points', language)}
                </span>
              </div>

              {/* Expected Points Calculation */}
              {safeBigInt(userBalance.pendingDepositAmount) > 0n && userBalance.depositRound === vaultInfo.currentRound && (
                <div
                  className="input-field"
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    marginTop: "20px",
                    padding: "16px",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <span className="input-label" style={{ fontSize: "14px", color: "#10b981" }}>
                    {language === 'ko' ? '다음 라운드 예상 수령 포인트' : 'Expected Points to Receive'}
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#10b981",
                    }}
                  >
                    {SecurityUtils.escapeHtml(
                      formatIntegerAmount(
                        calculatePointsFromBGSC(
                          userBalance.pendingDepositAmount,
                          vaultMetrics.pricePerPoint,
                          vaultInfo.decimals
                        ),
                        vaultInfo.decimals
                      )
                    )}{" "}
                    {t('main.redeem.points', language)}
                  </span>
                  <span style={{ 
                    fontSize: "12px", 
                    color: "rgba(255, 255, 255, 0.6)",
                    marginTop: "8px",
                    textAlign: "center",
                    fontStyle: "italic"
                  }}>
                    {language === 'ko' 
                      ? '* 다음 라운드 포인트 가격 변동에 따라 수량이 달라질 수 있습니다.' 
                      : '* The amount may vary depending on the next round\'s point price fluctuations.'}
                  </span>
                </div>
              )}

              {safeBigInt(userBalance.unredeemedPoints) === 0n && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "14px",
                    color: "#666666",
                    fontStyle: "italic",
                  }}
                >
                  {t('main.redeem.noPointsAvailable', language)}
                </div>
              )}
              
              {userBalance.depositRound < vaultInfo.currentRound && safeBigInt(userBalance.pendingDepositAmount) > 0n && safeBigInt(userBalance.unredeemedPoints) > 0n && (
                <div
                  style={{
                    marginTop: "16px",
                    marginBottom: "16px",
                    padding: "12px",
                    backgroundColor: "#1a2332",
                    borderRadius: "8px",
                    border: "1px solid #2a3441",
                    fontSize: "14px",
                    color: "#10b981",
                  }}
                >
                  {t('main.redeem.bgscConvertedMessage', language)}
                </div>
              )}


              <button
                className="action-button primary"
                onClick={async () => {
                  const success = await handleMaxRedeem();
                  if (success) {
                    // 상환 성공 후 추가 새로고침
                    setTimeout(() => refreshData(), 500);
                    setTimeout(() => refreshData(), 2000);
                  }
                }}
                disabled={
                  safeBigInt(userBalance.unredeemedPoints) === 0n ||
                  isAnyLoading
                }
              >
                {isAnyLoading ? (
                  <>
                    <Icons.Loader />
                    {t('common.processing', language)}
                  </>
                ) : safeBigInt(userBalance.unredeemedPoints) > 0n ? (
                  t('main.redeem.redeemAllPoints', language)
                ) : (
                  t('main.redeem.noPointsToRedeem', language)
                )}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Convert Tab - Point Conversion (Previous STEP 1) */}
      <div
        className={`tab-content ${activeTab === "convert" ? "active" : ""}`}
      >
        <div className="tab-content-wrapper">
          {!isConnected ? (
            <WalletDisconnectedAlert />
          ) : countdown.isDepositLocked ? (
            // 라운드 종료 1시간 전 - 변환 차단 화면만 표시
            <div className="main-content">
              <div className="deposit-locked-standalone">
                <div className="lock-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="lock-title">
                  {language === 'ko' ? '마감됨, 라운드 롤링 처리 대기 중' : 'Round Rolling Processing'}
                </h3>
                <p className="lock-description">
                  {language === 'ko' 
                    ? '종료 1시간 전부터는 변환이 중단됩니다.'
                    : 'Conversion is suspended 1 hour before round ends.'
                  }
                </p>
                <p className="lock-info" style={{ whiteSpace: 'pre-line' }}>
                  {language === 'ko' 
                    ? '다음 라운드는 롤링 과정이 끝난 이후 시작됩니다.\n다음날 확인해 주세요.'
                    : 'Next round will start after the rolling process.\nPlease check tomorrow.'
                  }
                </p>
              </div>
            </div>
          ) : (
          <div className="main-content">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">{t('main.withdraw.step1Title', language)}</h2>
                <div className="info-box" style={{
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginTop: '16px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#FFC107', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>
                    {language === 'ko' ? '⚠️ 반드시 신청하세요!' : '⚠️ MUST Apply!'}
                  </p>
                  <p style={{ color: '#FFC107', fontSize: '14px', marginTop: '8px', marginBottom: 0 }}>
                    {language === 'ko'
                      ? '변환 신청은 필수 절차입니다. 즉시 신청하지 않으면 출금이 불가능합니다.'
                      : 'Conversion is mandatory. You cannot withdraw without applying.'
                    }
                  </p>
                </div>
                <p className="form-description withdraw-description" style={{ whiteSpace: 'pre-line' }}>
                  {(() => {
                    const nextRound = getNextRoundStartTime(language);
                    const date = nextRound.nextRoundDate;
                    const monthNames = {
                      ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                    };
                    const nextRoundDateStr = language === 'ko' 
                      ? `${monthNames.ko[date.getMonth()]} ${date.getDate()}일`
                      : `${monthNames.en[date.getMonth()]} ${date.getDate()}`;
                    
                    return t('main.withdraw.step1Description', language, { nextRoundDate: nextRoundDateStr }).split('\n\n').map((text, index) => (
                    index === 1 ? (
                      <span key={index} style={{ 
                        display: 'block', 
                        marginTop: '12px', 
                        padding: '12px 16px', 
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid rgba(239, 68, 68, 0.3)', 
                        borderRadius: '8px',
                        color: '#ef4444',
                        fontWeight: '700',
                        fontSize: '14px'
                      }}>
                        {text}
                      </span>
                    ) : (
                      <span key={index}>{text}</span>
                    )
                  ));
                  })()}
                </p>
              </div>

              <div
                className="input-field"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "20px",
                }}
              >
                <span className="input-label">{t('main.withdraw.yourPointsLabel', language)}</span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#FFFFFF",
                  }}
                >
                  {isUpdatingWithdrawBalance ? (
                    <>
                      <Icons.Loader style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                      {language === 'ko' ? '업데이트 중' : 'Updating'}...
                    </>
                  ) : (
                    <>
                      {SecurityUtils.escapeHtml(
                        formatIntegerAmount(
                          safeBigInt(userBalance.walletPoints) - pendingWithdrawAmount,
                          vaultInfo.decimals
                        )
                      )}{" "}
                      {t('main.redeem.points', language)}
                    </>
                  )}
                </span>
                <span style={{ fontSize: "12px", color: "#999999" }}>
                  {isUpdatingWithdrawBalance 
                    ? (language === 'ko' ? '잔액 업데이트 중...' : 'Updating balance...')
                    : t('main.withdraw.currentPoints', language)}
                </span>
              </div>

              <div className="input-group" style={{ marginTop: "20px" }}>
                <div className="input-header">
                  <span className="input-label">{t('main.withdraw.participationAmount', language)}</span>
                  <span className="input-info"></span>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className={`input-value ${
                      !withdrawValidation.valid ? "input-error" : ""
                    }`}
                    placeholder="0.00"
                    value={withdrawShares}
                    onChange={handleWithdrawSharesChange}
                    maxLength={30}
                    autoComplete="off"
                  />
                  <span className="input-suffix">Points</span>
                </div>
                {!withdrawValidation.valid && (
                  <div className="error-message">
                    <Icons.AlertTriangle />
                    <span>
                      {withdrawValidation.params
                        ? t(withdrawValidation.error, language, withdrawValidation.params)
                        : t(withdrawValidation.error, language)
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-header">
                  <span className="input-label">
                    {t('main.withdraw.availableLabel', language)}:{" "}
                    {SecurityUtils.escapeHtml(
                      formatIntegerAmount(
                        userBalance.walletPoints,
                        vaultInfo.decimals
                      )
                    )}{" "}
                    Points
                  </span>
                  <div className="amount-buttons">
                    <button className="amount-button" onClick={setWithdrawMax}>
                      MAX
                    </button>
                  </div>
                </div>

                {/* Warning if claimable BGSC exists */}
                {safeBigInt(userBalance.claimableBGSC) > 0n && (
                  <div className="alert-box warning" style={{ marginBottom: "16px" }}>
                    <Icons.AlertTriangle />
                    <div>
                      {language === 'ko' 
                        ? '새 변환 요청을 위해 4단계에서 BGSC를 출금하세요.'
                        : 'Please withdraw your BGSC in Step 4 before making a new conversion request.'}
                    </div>
                  </div>
                )}


                <button
                  className={`action-button ${withdrawShares && withdrawValidation.valid ? 'primary' : 'secondary'}`}
                  onClick={handleWithdrawSubmit}
                  disabled={
                    !withdrawShares ||
                    !withdrawValidation.valid ||
                    isAnyLoading ||
                    safeBigInt(userBalance.walletPoints) === 0n ||
                    safeBigInt(userBalance.claimableBGSC) > 0n
                  }
                >
                  {isAnyLoading ? (
                    <>
                      <Icons.Loader />
                      {t('common.processing', language)}
                    </>
                  ) : safeBigInt(userBalance.walletPoints) === 0n ? (
                    t('main.withdraw.noPointsAvailable', language)
                  ) : safeBigInt(userBalance.claimableBGSC) > 0n ? (
                    language === 'ko' ? '먼저 BGSC를 출금하세요' : 'Withdraw BGSC first'
                  ) : (
                    t('main.withdraw.requestPointConversion', language)
                  )}
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Withdraw Tab - BGSC Withdrawal (Previous STEP 2) */}
      <div
        className={`tab-content ${activeTab === "withdraw" ? "active" : ""}`}
      >
        <div className="tab-content-wrapper">
          {!isConnected ? (
            <WalletDisconnectedAlert />
          ) : countdown.isDepositLocked ? (
            // 라운드 종료 1시간 전 - 출금 차단 화면만 표시
            <div className="main-content">
              <div className="deposit-locked-standalone">
                <div className="lock-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="#8C5AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="lock-title">
                  {language === 'ko' ? '마감됨, 라운드 롤링 처리 대기 중' : 'Round Rolling Processing'}
                </h3>
                <p className="lock-description">
                  {language === 'ko' 
                    ? '종료 1시간 전부터는 출금이 중단됩니다.'
                    : 'Withdrawal is suspended 1 hour before round ends.'
                  }
                </p>
                <p className="lock-info" style={{ whiteSpace: 'pre-line' }}>
                  {language === 'ko' 
                    ? '다음 라운드는 롤링 과정이 끝난 이후 시작됩니다.\n다음날 확인해 주세요.'
                    : 'Next round will start after the rolling process.\nPlease check tomorrow.'
                  }
                </p>
              </div>
            </div>
          ) : (
          <div className="main-content">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">{t('main.withdraw.step2Title', language)}</h2>
                {(safeBigInt(userBalance.queuedWithdrawPoints) + pendingWithdrawAmount) > 0n && 
                 safeBigInt(userBalance.claimableBGSC) === 0n && (
                  <div style={{ marginTop: '16px', fontSize: '16px', color: '#999999' }}>
                    {language === 'ko' ? 'BGSC으로 변환 대기 시간: ' : 'BGSC withdrawal available in: '}
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#FFFFFF' }}>
                      {countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              <div
                className="alert-box"
                style={{
                  background:
                    safeBigInt(userBalance.claimableBGSC) > 0n
                      ? "rgba(18, 185, 131, 0.1)"
                      : (safeBigInt(userBalance.queuedWithdrawPoints) + pendingWithdrawAmount) > 0n
                      ? "rgba(245, 158, 11, 0.1)"
                      : "rgba(255, 255, 255, 0.02)",
                  borderColor:
                    safeBigInt(userBalance.claimableBGSC) > 0n
                      ? "#12B983"
                      : (safeBigInt(userBalance.queuedWithdrawPoints) + pendingWithdrawAmount) > 0n
                      ? "#F59E0B"
                      : "#374151",
                }}
              >
                {safeBigInt(userBalance.claimableBGSC) > 0n ? (
                  <>
                    <Icons.CheckCircle />
                    <div>
                      <span style={{ color: "#12B983" }}>{t('main.withdraw.withdrawAvailable', language)}</span>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "#12B983",
                        }}
                      >
                        {SecurityUtils.escapeHtml(
                          formatIntegerAmount(
                            userBalance.claimableBGSC,
                            vaultInfo.decimals
                          )
                        )}{" "}
                        {language === 'ko' 
                          ? 'BGSC가 즉시 출금 가능합니다.'
                          : 'BGSC available for withdrawal. You can withdraw immediately.'}
                      </div>
                    </div>
                  </>
                ) : (safeBigInt(userBalance.queuedWithdrawPoints) + pendingWithdrawAmount) > 0n ? (
                  <>
                    <Icons.Clock />
                    <div>
                      <span style={{ color: "#F59E0B" }}>{t('main.withdraw.conversionPending', language)}</span>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "#F59E0B",
                        }}
                      >
                        {SecurityUtils.escapeHtml(
                          formatIntegerAmount(
                            safeBigInt(userBalance.queuedWithdrawPoints) + pendingWithdrawAmount,
                            vaultInfo.decimals
                          )
                        )}{" "}
                        {(() => {
                          const nextRound = getNextRoundStartTime(language);
                          const date = nextRound.nextRoundDate;
                          const monthNames = {
                            ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                            en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                          };
                          
                          if (language === 'ko') {
                            return `포인트가 ${monthNames.ko[date.getMonth()]} ${date.getDate()}일에 BGSC로 최종 라운드 변환 후 출금 가능`;
                          } else {
                            return `Points will be converted to BGSC on ${monthNames.en[date.getMonth()]} ${date.getDate()} for withdrawal.`;
                          }
                        })()}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Icons.Info />
                    <div>
                      <span style={{ color: "#666666" }}>{t('main.withdraw.noConversionRequest', language)}</span>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "#666666",
                        }}
                      >
                        {t('main.withdraw.noWithdrawRequest', language)}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="input-field" style={{ flexDirection: "column", alignItems: "center", gap: "8px", padding: "20px" }}>
                <span style={{ fontSize: "24px", fontWeight: "700", color: safeBigInt(userBalance.claimableBGSC) > 0n ? "#12B983" : "#666666" }}>
                  {SecurityUtils.escapeHtml(formatIntegerAmount(userBalance.claimableBGSC, vaultInfo.decimals))} BGSC
                </span>
              </div>

              <button
                className="action-button primary"
                onClick={handleCompleteWithdrawSubmit}
                disabled={
                  isAnyLoading || safeBigInt(userBalance.claimableBGSC) === 0n
                }
                style={{ marginTop: "24px" }}
              >
                {isAnyLoading ? (
                  <>
                    <Icons.Loader />
                    {t('main.withdraw.processingWithdraw', language)}
                  </>
                ) : safeBigInt(userBalance.claimableBGSC) === 0n ? (
                  t('main.withdraw.noBgscToWithdraw', language)
                ) : (
                  t('main.withdraw.withdrawBgscAmount', language, {
                    amount: SecurityUtils.escapeHtml(
                      formatIntegerAmount(
                        userBalance.claimableBGSC,
                        vaultInfo.decimals
                      )
                    )
                  })
                )}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      <div
        className={`tab-content ${
          activeTab === "mypage" ? "active" : ""
        } tab-content-small`}
      >
        <div className="tab-content-wrapper">
          {!isConnected ? (
            <WalletDisconnectedAlert />
          ) : (
          <div className="main-content">
            <div className="form-card">
              <div className="form-header">
                <h2 className="form-title">{language === 'ko' ? '내 정보' : 'My Page'}</h2>
                <p className="form-description">
                  {language === 'ko' ? '내 자산 현황을 확인하세요' : 'Check your asset status'}
                </p>
              </div>

              {/* Landing Page Link Button */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  className="action-button primary"
                  onClick={() => {
                    // Open landing page in new tab
                    window.open(window.location.origin + '#landing', '_blank');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #8C52FF 0%, #6C52FF 100%)',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                  </svg>
                  {language === 'ko' ? 'BGSC 볼트 랜딩페이지' : 'BGSC Vault Information'}
                </button>
              </div>

              {/* My Asset Status Cards */}
              <div className="cards-grid" style={{ marginBottom: '40px' }}>
                {isMobile ? (
                  <>
                    <div className="info-card-wrap">
                      <div className="info-card">
                        <div className="card-value">
                          {renderSecureBalance(
                            formatIntegerAmount(
                              userBalance.walletPoints,
                              vaultInfo.decimals
                            ),
                            isPrivate
                          )}
                        </div>
                        <div className="card-title">{t('main.stats.ownedPoints', language)}</div>
                        <div className="card-subtitle">{t('main.stats.annualOperatingProfit', language)}</div>
                      </div>
                      <div className="info-card">
                        <div className="card-value">
                          {renderSecureBalance(
                            formatIntegerAmount(
                              userBalance.unredeemedPoints,
                              vaultInfo.decimals
                            ),
                            isPrivate
                          )}
                        </div>
                        <div className="card-title">{t('main.stats.unredeemed', language)}</div>
                        <div className="card-subtitle">{t('main.stats.vaultStored', language)}</div>
                      </div>
                    </div>
                    <div className="info-card-wrap">
                      <div className="info-card">
                        <div className="card-value">
                          {renderSecureBalance(
                            formatIntegerAmount(
                              userBalance.pendingDepositAmount,
                              vaultInfo.decimals
                            ),
                            isPrivate
                          )}
                        </div>
                        <div className="card-title">{t('main.stats.currentDeposit', language)}</div>
                        <div className="card-subtitle">{t('main.stats.pendingConversion', language)}</div>
                      </div>
                      <div className="info-card">
                        <div className="card-value">
                          {renderSecureBalance(
                            formatIntegerAmount(
                              userBalance.claimableBGSC,
                              vaultInfo.decimals
                            ),
                            isPrivate
                          )}
                        </div>
                        <div className="card-title">{t('main.stats.claimableBgsc', language)}</div>
                        <div className="card-subtitle">{t('main.stats.withdrawableFromVault', language)}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-card">
                      <div className="card-value">
                        {renderSecureBalance(
                          formatIntegerAmount(
                            userBalance.walletPoints,
                            vaultInfo.decimals
                          ),
                          isPrivate
                        )}
                      </div>
                      <div className="card-title">{t('main.stats.ownedPoints', language)}</div>
                      <div className="card-subtitle">{t('main.stats.annualOperatingProfit', language)}</div>
                    </div>
                    <div className="info-card">
                      <div className="card-value">
                        {renderSecureBalance(
                          formatIntegerAmount(
                            userBalance.unredeemedPoints,
                            vaultInfo.decimals
                          ),
                          isPrivate
                        )}
                      </div>
                      <div className="card-title">{t('main.stats.unredeemed', language)}</div>
                      <div className="card-subtitle">{t('main.stats.vaultStored', language)}</div>
                    </div>
                    <div className="info-card">
                      <div className="card-value">
                        {renderSecureBalance(
                          formatIntegerAmount(
                            userBalance.pendingDepositAmount,
                            vaultInfo.decimals
                          ),
                          isPrivate
                        )}
                      </div>
                      <div className="card-title">{t('main.stats.currentDeposit', language)}</div>
                      <div className="card-subtitle">{t('main.stats.pendingConversion', language)}</div>
                    </div>
                    <div className="info-card">
                      <div className="card-value">
                        {renderSecureBalance(
                          formatIntegerAmount(
                            userBalance.claimableBGSC,
                            vaultInfo.decimals
                          ),
                          isPrivate
                        )}
                      </div>
                      <div className="card-title">{t('main.stats.claimableBgsc', language)}</div>
                      <div className="card-subtitle">{t('main.stats.withdrawableFromVault', language)}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Transaction History Section */}
              <div className="form-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="form-title">{t('main.history.title', language)}</h2>
                  <button
                    className="icon-button"
                    onClick={refreshHistory}
                    disabled={isLoadingHistory}
                    style={{ 
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: isLoadingHistory ? 'not-allowed' : 'pointer',
                      opacity: isLoadingHistory ? 0.5 : 1
                    }}
                  >
                    <Icons.RefreshCw style={{ 
                      width: '16px', 
                      height: '16px',
                      animation: isLoadingHistory ? 'spin 1s linear infinite' : 'none'
                    }} />
                  </button>
                </div>
                <p className="form-description">
                  {t('main.history.description', language)}
                  <span style={{ 
                    display: 'block', 
                    marginTop: '4px', 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontStyle: 'italic'
                  }}>
                    {language === 'ko' ? '* 모든 시간은 UTC 기준으로 표시됩니다' : '* All times are displayed in UTC'}
                  </span>
                </p>
              </div>

              <div className="history-list">
                {isLoadingHistory ? (
                  <div className="empty-state">
                    <Icons.Loader />
                    <p>{t('main.history.loading', language)}</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="empty-state">
                    <Icons.History />
                    <p>{t('main.history.empty', language)}</p>
                  </div>
                ) : (
                  transactions.map((tx) => {
                    // Determine display type and icon
                    const getTransactionDisplay = () => {
                      // 더 세분화된 이벤트 타입 처리
                      const getDetailedEventType = () => {
                        // initiate_withdraw_transfer는 사용자가 포인트를 볼트로 이체
                        if (tx.eventType === 'initiate_withdraw_transfer') {
                          return {
                            icon: <Icons.ArrowDownLeft />, 
                            label: (
                              <>
                                {language === 'ko' ? '변환 신청' : 'Exchange Request'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {language === 'ko' ? ' (포인트 변환 대기)' : ' (Points → Vault Transfer)'}
                                </span>
                              </>
                            ),
                            amountType: 'points'
                          };
                        }
                        
                        // redeem_transfer는 볼트에서 사용자로 포인트 이체 (실제 상환)
                        if (tx.eventType === 'redeem_transfer') {
                          return {
                            icon: <Icons.ArrowUpRight />, 
                            label: (
                              <>
                                {language === 'ko' ? '포인트 수령 완료' : 'Points Received'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {language === 'ko' ? ' (볼트 → 내 지갑 이체)' : ' (Vault → My Wallet)'}
                                </span>
                              </>
                            ),
                            amountType: 'points'
                          };
                        }
                        
                        // max_redeem은 전체 포인트 상환
                        if (tx.eventType === 'max_redeem' || tx.displayType === 'MaxRedeem') {
                          return {
                            icon: <Icons.ArrowUpRight />, 
                            label: (
                              <>
                                {language === 'ko' ? '포인트 수령' : 'All Points Received'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {language === 'ko' ? ' (개인 지갑에 수령)' : ' (All to Wallet)'}
                                </span>
                              </>
                            ),
                            amountType: 'points'
                          };
                        }
                        
                        // complete_withdraw는 BGSC 최종 출금
                        if (tx.eventType === 'complete_withdraw') {
                          const conversionInfo = tx.shares && tx.amount ? 
                            `${Number(formatFullAmount(tx.shares, 18)).toLocaleString('ko-KR', { maximumFractionDigits: 2 })} P → ${Number(formatFullAmount(tx.amount, 18)).toLocaleString('ko-KR', { maximumFractionDigits: 2 })} BGSC` : 
                            (language === 'ko' ? '변환된 BGSC 수령' : 'Converted BGSC Received');
                          return {
                            icon: <Icons.ArrowDownLeft />, 
                            label: (
                              <>
                                {language === 'ko' ? 'BGSC 출금 완료' : 'BGSC Withdrawn'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {` (${conversionInfo})`}
                                </span>
                              </>
                            ),
                            amountType: 'bgsc',
                            displayAmount: tx.amount  // 출금된 BGSC 수량 표시
                          };
                        }
                        
                        // instant_withdraw는 즉시 출금
                        if (tx.eventType === 'instant_withdraw') {
                          return {
                            icon: <Icons.ArrowDownLeft />, 
                            label: (
                              <>
                                {language === 'ko' ? '참여 취소' : 'Instant withdraw'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {language === 'ko' ? ' (현재 라운드 참여 취소)' : ' (Cancel Current Round)'}
                                </span>
                              </>
                            ),
                            amountType: 'bgsc'
                          };
                        }
                        
                        // deposit은 예치
                        if (tx.eventType === 'deposit') {
                          return {
                            icon: <Icons.Plus />, 
                            label: (
                              <>
                                {language === 'ko' ? 'BGSC 예치' : 'BGSC Deposited'}
                                {isMobile && <br />}
                                <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8 }}>
                                  {language === 'ko' ? ' (라운드 참여 시작)' : ' (Round Participation)'}
                                </span>
                              </>
                            ),
                            amountType: 'bgsc'
                          };
                        }
                        
                        // 기본값
                        return { 
                          icon: <Icons.Activity />, 
                          label: tx.methodName || tx.type || tx.eventType,
                          amountType: tx.shares ? 'points' : 'bgsc'
                        };
                      };
                      
                      return getDetailedEventType();
                    };
                    
                    const display = getTransactionDisplay();
                    const displayAmount = tx.type === 'approval' ? null : (display.displayAmount || tx.shares || tx.amount || 0n);
                    
                    return (
                      <div key={tx.txHash} className="history-item">
                        <div className="history-left">
                          <div className="history-icon">
                            {display.icon}
                          </div>
                          <div className="history-info">
                            <div className="history-action">
                              {display.label}
                              {tx.displayType === 'MaxRedeem' && (
                                <span style={{ 
                                  marginLeft: '8px', 
                                  fontSize: '11px', 
                                  color: '#00d4ff',
                                  background: 'rgba(0, 212, 255, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}>
                                  MAX
                                </span>
                              )}
                            </div>
                            <div className="history-amount">
                              {displayAmount && (
                                <>
                                  {Number(formatFullAmount(displayAmount, vaultInfo.decimals)).toLocaleString('ko-KR', { maximumFractionDigits: 2 })}
                                  {display.amountType === 'points' 
                                    ? ` ${t('main.redeem.points', language)}` 
                                    : display.amountType === 'bgsc' 
                                    ? ` ${t('common.bgsc', language)}`
                                    : ''
                                  }
                                </>
                              )}
                              {tx.round && ` • ${t('main.history.round', language)} ${tx.round - 2}`}
                            </div>
                          </div>
                        </div>
                        <div className="history-right">
                          <div className="history-time">
                            {formatTimestamp(tx.timestamp, language)}
                          </div>
                          <div className="history-status" style={tx.eventType === 'instant_withdraw' ? { color: '#ef4444' } : {}}>
                            • {tx.eventType === 'instant_withdraw' 
                              ? (language === 'ko' ? '취소' : 'Cancelled')
                              : t('main.history.confirmed', language)}
                          </div>
                          <a
                            href={getBSCScanLink(tx.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-button"
                            style={{ marginTop: "4px" }}
                          >
                            <Icons.ExternalLink />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
                {transactions.length > 0 && (
                  <>
                    {/* Items per page selector */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'row',
                      justifyContent: isMobile ? 'center' : 'space-between', 
                      alignItems: 'center', 
                      gap: isMobile ? '16px' : '0',
                      marginTop: '24px',
                      paddingTop: '24px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
                        <span style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                          {language === 'ko' ? '페이지당' : 'Items per page'}
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => changeItemsPerPage(Number(e.target.value))}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: '#fff',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          {[10, 20, 30, 40, 50].map(num => (
                            <option key={num} value={num} style={{ background: '#1a1a1a' }}>
                              {num}{language === 'ko' ? '개' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Total count */}
                      <span style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {language === 'ko' 
                          ? `총 ${totalCount}건의 거래` 
                          : `Total ${totalCount} transactions`}
                      </span>
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: isMobile ? '4px' : '8px',
                        marginTop: '20px',
                        flexWrap: isMobile ? 'nowrap' : 'wrap',
                        overflowX: isMobile ? 'auto' : 'visible',
                        maxWidth: '100%'
                      }}>
                        <button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1 || isLoadingHistory}
                          style={{
                            padding: isMobile ? '6px 10px' : '8px 12px',
                            background: currentPage === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: currentPage === 1 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                            fontSize: isMobile ? '12px' : '14px',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {language === 'ko' ? '이전' : 'Previous'}
                        </button>
                        
                        {/* Page numbers */}
                        <div style={{ display: 'flex', gap: isMobile ? '2px' : '4px', flexWrap: 'nowrap', justifyContent: 'center' }}>
                          {(() => {
                            const pages = [];
                            const maxVisible = isMobile ? 3 : 5;
                            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                            let end = Math.min(totalPages, start + maxVisible - 1);
                            
                            if (end - start < maxVisible - 1) {
                              start = Math.max(1, end - maxVisible + 1);
                            }
                            
                            if (start > 1) {
                              pages.push(
                                <button
                                  key={1}
                                  onClick={() => goToPage(1)}
                                  disabled={isLoadingHistory}
                                  style={{
                                    padding: isMobile ? '6px 10px' : '8px 12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '14px',
                                    minWidth: isMobile ? '32px' : '40px'
                                  }}
                                >
                                  1
                                </button>
                              );
                              if (start > 2) {
                                pages.push(<span key="dots1" style={{ padding: '0 4px', color: 'rgba(255, 255, 255, 0.5)' }}>...</span>);
                              }
                            }
                            
                            for (let i = start; i <= end; i++) {
                              pages.push(
                                <button
                                  key={i}
                                  onClick={() => goToPage(i)}
                                  disabled={isLoadingHistory}
                                  style={{
                                    padding: isMobile ? '6px 10px' : '8px 12px',
                                    background: i === currentPage ? 'rgba(140, 90, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${i === currentPage ? 'rgba(140, 90, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                                    borderRadius: '8px',
                                    color: i === currentPage ? '#8C5AFF' : '#fff',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '14px',
                                    fontWeight: i === currentPage ? '600' : '400',
                                    minWidth: isMobile ? '32px' : '40px'
                                  }}
                                >
                                  {i}
                                </button>
                              );
                            }
                            
                            if (end < totalPages) {
                              if (end < totalPages - 1) {
                                pages.push(<span key="dots2" style={{ padding: '0 4px', color: 'rgba(255, 255, 255, 0.5)' }}>...</span>);
                              }
                              pages.push(
                                <button
                                  key={totalPages}
                                  onClick={() => goToPage(totalPages)}
                                  disabled={isLoadingHistory}
                                  style={{
                                    padding: isMobile ? '6px 10px' : '8px 12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '14px',
                                    minWidth: isMobile ? '32px' : '40px'
                                  }}
                                >
                                  {totalPages}
                                </button>
                              );
                            }
                            
                            return pages;
                          })()}
                        </div>
                        
                        <button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages || isLoadingHistory}
                          style={{
                            padding: isMobile ? '6px 10px' : '8px 12px',
                            background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: currentPage === totalPages ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: isMobile ? '12px' : '14px',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {language === 'ko' ? '다음' : 'Next'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="footer-logo-container">
            <img src={textLogo} alt="Logo" />
          </div>
          <div>
            <p className="landing-footer-subtitle">
              {t('landing.footer.subtitle', language).split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>

          <div className="landing-footer-disclaimer">
            {t(isMobile ? 'landing.footer.disclaimerMobile' : 'landing.footer.disclaimer', language)}
          </div>

          <div className="landing-footer-sns">
            <a href="https://pf.kakao.com/_jggxan" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
              <img src={messageIcon} alt="KakaoTalk" />
            </a>
            <a href="https://t.me/BGSC_ADEN" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
              <img src={sendIcon} alt="Telegram" />
            </a>
            <a href="https://x.com/bugscoin_bgsc" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
              <img src={xIcon} alt="X (Twitter)" />
            </a>
          </div>
          <div className="landing-footer-copyright">
            {t('landing.footer.copyright', language).split('**').map((part, i) => 
              i === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        className={`scroll-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        <img src={iconArrowRightSmall} alt="" />
      </button>

      {/* Deposit Step Modal */}
      <DepositStepModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onConfirm={handleModalConfirm}
        step={modalStep}
        language={language}
        depositAmount={depositAmount}
      />

      <style dangerouslySetInnerHTML={{ __html: getStyles() }}></style>
    </div>
  );
}
