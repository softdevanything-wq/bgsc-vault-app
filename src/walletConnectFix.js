// WalletConnect v2 모바일 연결 문제 해결을 위한 설정
import { createWeb3Modal } from '@web3modal/wagmi';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';

// WalletConnect v2 커넥터 설정 (모바일 최적화)
export const createWalletConnectConnector = (projectId, chains) => {
  return new WalletConnectConnector({
    chains,
    options: {
      projectId,
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '10000'
        }
      },
      metadata: {
        name: 'BGSC Vault',
        description: 'BGSC Vault DeFi Application',
        url: window.location.origin,
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      },
      // 모바일 연결 안정성을 위한 추가 설정
      relayUrl: 'wss://relay.walletconnect.org',
      storageOptions: {
        // 세션 저장소 설정
        database: ':memory:'
      }
    }
  });
};

// Web3Modal 설정 (모바일 최적화)
export const configureWeb3Modal = (projectId, chains, wagmiConfig) => {
  const modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    // 모바일 최적화 설정
    enableAnalytics: true,
    enableOnramp: false,
    themeMode: 'dark',
    themeVariables: {
      '--w3m-z-index': 10000,
      '--w3m-accent': '#8C5AFF'
    },
    // 추천 지갑 순서 (BSC 인기 지갑)
    featuredWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
      '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4', // Binance Wallet
      '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927'  // imToken
    ],
    // 연결 URI 옵션
    walletConnectVersion: 2
  });

  return modal;
};

// WalletConnect 세션 복구 헬퍼
export const restoreWalletConnectSession = async () => {
  try {
    // v2 세션 복구
    const wcStorage = localStorage.getItem('wc@2:core:0.3//client');
    if (wcStorage) {
      const sessions = JSON.parse(wcStorage);
      if (sessions && Object.keys(sessions).length > 0) {
        console.log('Found existing WalletConnect v2 sessions');
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to restore WalletConnect session:', error);
  }
  return false;
};

// 모바일 WalletConnect 연결 헬퍼
export const mobileWalletConnect = {
  // 연결 URI 생성
  generateConnectURI: async (connector) => {
    try {
      const provider = await connector.getProvider();
      const uri = provider?.connector?.uri;
      return uri;
    } catch (error) {
      console.error('Failed to generate connect URI:', error);
      return null;
    }
  },

  // 딥링크로 지갑 앱 열기
  openWalletApp: (walletType, uri) => {
    if (!uri) return;
    
    const encodedUri = encodeURIComponent(uri);
    const deepLinks = {
      metamask: `metamask://wc?uri=${encodedUri}`,
      imtoken: `imtokenv2://wc?uri=${encodedUri}`,
      tokenpocket: `tpoutside://wc?uri=${encodedUri}`,
      default: uri
    };
    
    const deepLink = deepLinks[walletType] || deepLinks.default;
    window.location.href = deepLink;
  },

  // 연결 상태 확인
  checkConnection: async (connector) => {
    try {
      const provider = await connector.getProvider();
      return provider?.connected || false;
    } catch (error) {
      console.error('Failed to check connection:', error);
      return false;
    }
  }
};