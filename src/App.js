import React, { useEffect, useRef } from "react";
import { useAccount, usePublicClient, useChainId } from "wagmi";
import LandingPage from "views/LandingPage";
import MainPage from "views/MainPage";
import AccessDenied from "components/AccessDenied";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { VaultDataProvider, useVaultData } from "./contexts/VaultDataContext";
import { t } from "./translations";

import toast from "react-hot-toast";
import { initializeSecurity, MobileWalletUtils } from "./utils";
import { BSC_CHAIN } from "./constants";
import { handleWalletConnectError } from "./utils/walletConnectCleanup";

function AppContent() {
  const { language } = useLanguage();
  const [showLanding, setShowLanding] = React.useState(false);
  
  // Check URL for landing page
  React.useEffect(() => {
    if (window.location.pathname === '/landing' || window.location.hash === '#landing') {
      setShowLanding(true);
    }
    
    // Listen for custom event from MainPage
    const handleShowLanding = () => setShowLanding(true);
    window.addEventListener('showLandingPage', handleShowLanding);
    return () => window.removeEventListener('showLandingPage', handleShowLanding);
  }, []);
  
  // Security initialization
  useEffect(() => {
    const securityStatus = initializeSecurity();
    if (
      !securityStatus?.isSecureContext &&
      process.env.NODE_ENV === "production"
    ) {
      toast.error(t('errors.connectionFailed', language));
    }
  }, [language]);

  // Wallet connection state
  const { address, isConnected, connector } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const previousAddressRef = useRef(address);
  const previousChainIdRef = useRef(chainId);
  
  // WalletConnect 디버깅 및 에러 처리
  useEffect(() => {
    if (connector?.name === 'WalletConnect' && MobileWalletUtils.isMobile()) {
      console.log('WalletConnect on mobile detected', {
        connectorName: connector.name,
        isConnected,
        address,
        walletApp: MobileWalletUtils.detectWalletApp()
      });
      
      // WalletConnect 세션 복구 시도
      MobileWalletUtils.restoreWalletConnectSession().then(restored => {
        if (restored) {
          console.log('WalletConnect session restored');
        }
      }).catch(error => {
        if (handleWalletConnectError(error)) {
          toast.error(
            language === 'ko' 
              ? '지갑 연결이 만료되었습니다. 다시 연결해주세요.' 
              : 'Wallet connection expired. Please reconnect.',
            { id: 'wc-session-error' }
          );
        }
      });
    }
  }, [connector, isConnected, address, language]);

  // Vault data and hooks
  const { vaultInfo, userBalance, hasError, isLoading, refreshAllData } = useVaultData();

  // Wallet event listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log('Wallet disconnected');
        // 승인 상태 초기화
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bgsc-approval-status');
          localStorage.removeItem('bgsc-approval-amount');
        }
      } else if (accounts[0] !== previousAddressRef.current) {
        console.log('Account changed:', accounts[0]);
        previousAddressRef.current = accounts[0];
        refreshAllData();
        toast.success(
          language === 'ko' 
            ? '지갑 계정이 변경되었습니다' 
            : 'Wallet account changed',
          { id: 'account-changed' }
        );
      }
    };

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16);
      if (newChainId !== BSC_CHAIN.id) {
        toast.error(
          language === 'ko'
            ? 'BSC 네트워크로 전환해주세요'
            : 'Please switch to BSC network',
          { id: 'wrong-network' }
        );
      } else if (newChainId !== previousChainIdRef.current) {
        previousChainIdRef.current = newChainId;
        refreshAllData();
      }
    };

    const handleDisconnect = () => {
      console.log('Wallet disconnect event');
      // 승인 상태 초기화
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bgsc-approval-status');
        localStorage.removeItem('bgsc-approval-amount');
      }
    };

    // 이벤트 리스너 등록
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    window.ethereum.on('disconnect', handleDisconnect);

    // 모바일에서 추가 리스너
    if (MobileWalletUtils.isMobile()) {
      // 페이지가 다시 활성화될 때 상태 확인
      const handleVisibilityChange = async () => {
        if (!document.hidden && isConnected) {
          // 연결 상태가 유지되어 있을 때만 데이터 새로고침
          try {
            // BSC 메인넷 연결 확인
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdNumber = parseInt(chainId, 16);
            
            if (chainIdNumber === BSC_CHAIN.id) {
              // BSC 메인넷에 연결되어 있으면 데이터 새로고침
              refreshAllData();
            } else if (chainId) {
              // 다른 체인에 연결되어 있으면 BSC로 전환 요청
              console.log('Wrong network detected on mobile:', chainIdNumber);
              toast.error(
                language === 'ko'
                  ? 'BSC 네트워크로 전환해주세요'
                  : 'Please switch to BSC network',
                { id: 'wrong-network-mobile' }
              );
            }
          } catch (error) {
            // 에러가 발생하면 연결이 끊긴 것으로 판단
            console.log('Mobile wallet connection lost:', error);
            // 이 경우에만 wagmi가 자동으로 처리하도록 둠
          }
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    };
  }, [address, isConnected, language, refreshAllData]);

  // Error handling - show toast instead of full screen error
  useEffect(() => {
    // 초기 로딩 중에는 에러 토스트를 표시하지 않음
    if (hasError && isConnected && !isLoading) {
      toast.error(t('errors.connectionFailed', language), {
        id: 'connection-error',
        duration: 5000,
      });
    }
  }, [hasError, isConnected, isLoading, language]);

  // Show landing page if requested
  if (showLanding) {
    return <LandingPage />;
  }

  // Always show MainPage regardless of connection status
  // Whitelist check only applies when connected
  if (isConnected && !vaultInfo.isPublic && !userBalance.isWhitelisted && !isLoading) {
    return <AccessDenied />;
  }

  // Main App UI - shown for both connected and disconnected users
  return <MainPage />;
}

export default function App() {
  return (
    <LanguageProvider>
      <VaultDataProvider>
        <AppContent />
      </VaultDataProvider>
    </LanguageProvider>
  );
}
