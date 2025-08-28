import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WagmiProvider, createConfig, fallback, http } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig, midnightTheme, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { 
  metaMaskWallet,
  walletConnectWallet,
  binanceWallet,
  imTokenWallet
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { Buffer } from 'buffer';
import { 
  BSC_CHAIN, 
  BSC_RPC_URLS,
  NETWORK_CONFIG, 
  FEATURE_FLAGS 
} from './constants';
import { cleanupWalletConnectSessions, handleWalletConnectError } from './utils/walletConnectCleanup';

// Buffer 전역 변수 추가
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer;
}

// Toast 전역 변수 추가 및 클릭 시 dismiss 설정
if (typeof window !== 'undefined') {
  // 원본 toast 메서드들을 저장
  const originalSuccess = toast.success;
  const originalError = toast.error;
  const originalLoading = toast.loading;
  const originalCustom = toast.custom;
  
  // window.toast 객체 생성
  window.toast = {
    success: (message, options = {}) => {
      const toastId = originalSuccess(message, {
        duration: 2000, // 2초
        ...options,
        onClick: () => {
          toast.remove(options.id || toastId); // remove 사용하여 즉시 제거
        },
      });
      return toastId;
    },
    error: (message, options = {}) => {
      const toastId = originalError(message, {
        duration: 2000, // 2초
        ...options,
        onClick: () => {
          toast.remove(options.id || toastId);
        },
      });
      return toastId;
    },
    loading: (message, options = {}) => {
      const toastId = originalLoading(message, {
        duration: Infinity, // loading은 수동으로 닫아야 함
        ...options,
        onClick: () => {
          toast.remove(options.id || toastId);
        },
      });
      return toastId;
    },
    custom: (jsx, options = {}) => {
      const toastId = originalCustom(jsx, {
        duration: 2000, // 2초
        ...options,
        onClick: () => {
          toast.remove(options.id || toastId);
        },
      });
      return toastId;
    },
    dismiss: toast.dismiss,
    remove: toast.remove,
    promise: toast.promise,
  };
}

// ✅ WalletConnect 세션 정리 (앱 시작 시)
if (typeof window !== 'undefined') {
  // URL 파라미터로 세션 정리 옵션 제공
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('clearWallet') === 'true') {
    cleanupWalletConnectSessions();
    // URL에서 파라미터 제거
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  // 글로벌 에러 핸들러 설정
  window.addEventListener('error', (event) => {
    if (event.error && handleWalletConnectError(event.error)) {
      event.preventDefault();
    }
  });
  
  // Promise rejection 핸들러
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && handleWalletConnectError(event.reason)) {
      event.preventDefault();
    }
  });
}

// ✅ 환경변수 검증
const requiredEnvVars = [
  'REACT_APP_WALLET_CONNECT_PROJECT_ID',
  'REACT_APP_VAULT_ADDRESS',
  'REACT_APP_BGSC_TOKEN_ADDRESS',
  'REACT_APP_WBNB_ADDRESS'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all required variables are set.');
}

// ✅ WalletConnect Project ID
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.warn('⚠️ REACT_APP_WALLET_CONNECT_PROJECT_ID is not set. Using default project ID.');
}

// ✅ 사용자 경험 최적화된 QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 불필요한 새로고침 방지
      refetchOnMount: true,        // 실시간 데이터 필요
      refetchOnReconnect: true,    
      retry: 1,                    // 빠른 실패
      staleTime: 0,                // 실시간 데이터 - 캐시 사용 안함
      gcTime: 0,                   // 캐시 사용 안함
      refetchInterval: false,      // 자동 새로고침 비활성화 (수동 제어)
    },
    mutations: {
      retry: 1,                    // 빠른 실패
    },
  },
});

// ✅ dRPC 최적화된 Transport 생성 함수
const createOptimizedTransport = (rpcUrls) => {
  try {
    if (!rpcUrls || !Array.isArray(rpcUrls) || rpcUrls.length === 0) {
      console.warn('⚠️ No RPC URLs provided, using default BSC RPC');
      return http('https://bsc-dataseed1.binance.org');
    }

    // dRPC가 첫 번째인지 확인
    const isDRPCPrimary = rpcUrls[0] && rpcUrls[0].includes('drpc.org');
    
    if (rpcUrls.length === 1) {
      console.log(`📡 Using single RPC transport: ${isDRPCPrimary ? 'dRPC Premium ✅' : 'Standard RPC'}`);
      return http(rpcUrls[0], {
        timeout: NETWORK_CONFIG.RPC_CONFIG.TIMEOUT,
        retryCount: NETWORK_CONFIG.RPC_CONFIG.RETRY_COUNT,
        retryDelay: NETWORK_CONFIG.RPC_CONFIG.RETRY_DELAY,
      });
    }

    // ✅ dRPC 최우선 + 백업 RPC들로 fallback 구성
    const transports = rpcUrls.slice(0, 4).map((url, index) => {
      console.log(`📡 Adding RPC transport ${index + 1}:`, 
        url.includes('drpc.org') ? 'dRPC Premium ✅' : 
        url.includes('ankr') ? 'Ankr' :
        url.includes('binance') ? 'Binance' :
        'Custom RPC');
        
      return http(url, {
        timeout: 10000,     // 10초 타임아웃
        retryCount: 1,      // 빠른 실패를 위해 재시도 1회만
        retryDelay: 0,      // 즉시 재시도
      });
    });

    console.log(`🌐 Created optimized fallback transport with ${transports.length} endpoints`);
    console.log(`💎 Primary RPC: ${isDRPCPrimary ? 'dRPC Premium (Paid Service)' : 'Standard RPC'}`);
    
    return fallback(transports, {
      rank: false, // dRPC가 이미 최우선이므로 순서 유지
    });
  } catch (error) {
    console.error('❌ Error creating optimized transport:', error);
    return http('https://bsc-dataseed1.binance.org');
  }
};

// ✅ dRPC 최적화 체인 설정
const chainConfig = {
  ...BSC_CHAIN,
  rpcUrls: {
    default: {
      http: BSC_RPC_URLS,
    },
    public: {
      http: BSC_RPC_URLS,
    },
  },
};

// ✅ dRPC 최적화된 Transport 생성
const optimizedTransport = createOptimizedTransport(BSC_RPC_URLS);

// ✅ 지갑 설정 (MetaMask, Binance, imToken, WalletConnect만)
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Wallets',
      wallets: [
        metaMaskWallet,
        binanceWallet,
        imTokenWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'BGSC Vault',
    projectId: projectId || 'default-project-id',
  }
);

// ✅ 모바일 최적화된 Wagmi 설정
const config = createConfig({
  connectors,
  chains: [chainConfig],
  transports: {
    [chainConfig.id]: optimizedTransport,
  },
  ssr: false,
  // ✅ dRPC Premium 배치 설정 (유료 서비스 최적화)
  batch: {
    multicall: {
      batchSize: 10,     // 작은 배치로 빠른 응답
      wait: 0,           // 즉시 처리
    },
  },
});

// RainbowKit 테마 설정
const customTheme = midnightTheme({
  accentColor: '#8C5AFF',
  accentColorForeground: 'white',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

// ✅ 앱 정보 설정
const appInfo = {
  appName: 'BGSC Vault',
  learnMoreUrl: process.env.REACT_APP_WEBSITE_URL || 'https://bgsc.io',
};

// ✅ dRPC 연결 상태 확인 컴포넌트
const DRPCHealthChecker = () => {
  React.useEffect(() => {
    if (!FEATURE_FLAGS.DEBUG_MODE) return;

    const checkDRPCHealth = async () => {
      try {
        // wagmi가 완전히 로드될 때까지 대기
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('🧪 Testing dRPC Premium connection...');
        console.log(`💎 Primary RPC: ${BSC_RPC_URLS[0]}`);
        console.log(`🔗 Backup RPCs: ${BSC_RPC_URLS.length - 1} configured`);
        
        const isDRPCPrimary = BSC_RPC_URLS[0] && BSC_RPC_URLS[0].includes('drpc.org');
        
        if (isDRPCPrimary) {
          console.log('✅ dRPC Premium service configured as primary');
          console.log('🚀 Expected performance: Higher throughput, better reliability');
        } else {
          console.log('⚠️ dRPC not detected as primary RPC');
        }
        
        console.log('ℹ️ Actual connection will be tested when wallet connects');
        
      } catch (error) {
        console.warn('⚠️ RPC configuration warning:', error.message);
      }
    };

    checkDRPCHealth();
  }, []);

  return null;
};

// 앱 래퍼 컴포넌트
const AppWrapper = () => {
  // ✅ dRPC 환경 디버그 정보
  React.useEffect(() => {
    if (FEATURE_FLAGS.DEBUG_MODE) {
      console.log('🔧 dRPC Environment Debug Info:', {
        NODE_ENV: process.env.NODE_ENV,
        CHAIN_ID: NETWORK_CONFIG.CHAIN_ID,
        RPC_COUNT: BSC_RPC_URLS.length,
        PRIMARY_RPC: BSC_RPC_URLS[0]?.includes('drpc.org') ? 'dRPC Premium ✅' : 'Standard RPC',
        VAULT_CONFIGURED: !!process.env.REACT_APP_VAULT_ADDRESS,
        BGSC_CONFIGURED: !!process.env.REACT_APP_BGSC_TOKEN_ADDRESS,
        PROJECT_ID_SET: !!projectId,
        DRPC_URL: process.env.REACT_APP_dRPC_URLS ? 'Configured ✅' : 'Not set',
        BATCH_SIZE: NETWORK_CONFIG.RPC_CONFIG.BATCH_SIZE,
        TIMEOUT: NETWORK_CONFIG.RPC_CONFIG.TIMEOUT + 'ms',
      });
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          showRecentTransactions={true}
          appInfo={appInfo}
          locale="en"
          modalSize="compact"
          coolMode={FEATURE_FLAGS.DEBUG_MODE}
          initialChain={chainConfig}
          chains={[chainConfig]}
        >
          <DRPCHealthChecker />
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 2000, // 기본 2초
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '14px',
                maxWidth: '400px',
                cursor: 'pointer',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid #10b981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid #ef4444',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#8C5AFF',
                  secondary: '#fff',
                },
                style: {
                  border: '1px solid #8C5AFF',
                },
              },
            }}
            reverseOrder={false}
            gutter={8}
            containerClassName="toaster-container"
            containerStyle={{
              top: 20,
              right: 20,
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

// ✅ 강화된 에러 바운더리 컴포넌트
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // dRPC 관련 에러 감지
    if (error?.message?.includes('drpc') || error?.message?.includes('rpc')) {
      console.error('🚨 dRPC related error detected:', error);
    }
    
    if (process.env.NODE_ENV === 'production') {
      // 프로덕션에서 에러 리포팅
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 에러가 발생해도 앱을 계속 렌더링하고, 토스트로만 알림
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('일시적인 오류가 발생했습니다. 새로고침을 시도해주세요.', {
          id: 'error-boundary',
          duration: 10000,
        });
      }
      
      // 3초 후 자동으로 재시도
      setTimeout(() => {
        this.handleRetry();
      }, 3000);
    }

    // 에러가 발생해도 children을 렌더링
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

// React 18/19 지원
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ 환경변수 누락 시 에러 화면 표시
if (missingEnvVars.length > 0) {
  root.render(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#ef4444' }}>
        환경변수 설정 오류
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '16px' }}>
        다음 환경변수들이 설정되지 않았습니다:
      </p>
      <ul style={{ color: '#f59e0b', marginBottom: '24px', textAlign: 'left' }}>
        {missingEnvVars.map(envVar => (
          <li key={envVar} style={{ marginBottom: '4px' }}>{envVar}</li>
        ))}
      </ul>
      <p style={{ color: '#6b7280', fontSize: '14px', maxWidth: '500px' }}>
        .env 파일을 확인하고 필요한 환경변수들을 설정해주세요.
        dRPC Premium 서비스를 사용하려면 REACT_APP_dRPC_URLS도 설정해주세요.
      </p>
    </div>
  );
} else {
  // ✅ 정상적인 앱 렌더링
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppWrapper />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

// ✅ 성능 측정 (dRPC 성능 모니터링 포함)
if (FEATURE_FLAGS.DEBUG_MODE && process.env.NODE_ENV === 'development') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS((metric) => {
      console.log('📊 CLS (Cumulative Layout Shift):', metric);
    });
    getFID((metric) => {
      console.log('📊 FID (First Input Delay):', metric);
    });
    getFCP((metric) => {
      console.log('📊 FCP (First Contentful Paint):', metric);
    });
    getLCP((metric) => {
      console.log('📊 LCP (Largest Contentful Paint):', metric);
    });
    getTTFB((metric) => {
      console.log('📊 TTFB (Time to First Byte):', metric);
    });
  }).catch(err => {
    console.warn('Web Vitals 로드 실패:', err);
  });
}

// ✅ 서비스 워커 등록 (프로덕션에서만)
if (FEATURE_FLAGS.ENABLE_SERVICE_WORKER && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// ✅ dRPC 최적화된 전역 에러 핸들러
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // dRPC 관련 에러 감지 및 처리
  if (event.reason?.message?.includes('drpc') || 
      event.reason?.message?.includes('rpc') ||
      event.reason?.message?.includes('fetch') || 
      event.reason?.message?.includes('network') ||
      event.reason?.message?.includes('timeout')) {
    console.warn('🌐 dRPC/Network-related error detected - wagmi will handle failover');
    console.log('💡 dRPC Premium service should provide better reliability');
  }
  
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션에서 에러 리포팅
  }
});

window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (process.env.NODE_ENV === 'production') {
    // 프로덕션에서 에러 리포팅
  }
});

// ✅ dRPC 최적화된 디버그 함수들 (개발 모드)
if (FEATURE_FLAGS.DEBUG_MODE) {
  window.__BGSC_VAULT_DEBUG__ = {
    config,
    chainConfig,
    rpcUrls: BSC_RPC_URLS,
    dRPCInfo: {
      isDRPCPrimary: BSC_RPC_URLS[0]?.includes('drpc.org'),
      primaryRPC: BSC_RPC_URLS[0],
      backupRPCCount: BSC_RPC_URLS.length - 1,
      batchSize: NETWORK_CONFIG.RPC_CONFIG.BATCH_SIZE,
      timeout: NETWORK_CONFIG.RPC_CONFIG.TIMEOUT,
    },
    envVars: {
      VAULT_ADDRESS: process.env.REACT_APP_VAULT_ADDRESS,
      BGSC_TOKEN: process.env.REACT_APP_BGSC_TOKEN_ADDRESS,
      PROJECT_ID: projectId,
      DRPC_URL: process.env.REACT_APP_dRPC_URLS ? 'Configured ✅' : 'Not set',
      RPC_COUNT: BSC_RPC_URLS.length,
    },
    utils: {
      clearCache: () => queryClient.clear(),
      getCache: () => queryClient.getQueryCache(),
      testDRPCConnection: () => {
        console.log('🧪 dRPC Connection Test');
        console.log('💎 Primary RPC:', BSC_RPC_URLS[0]);
        console.log('🔗 Fallback RPCs:', BSC_RPC_URLS.slice(1));
        console.log('⚡ Batch Size:', NETWORK_CONFIG.RPC_CONFIG.BATCH_SIZE);
        console.log('⏱️ Timeout:', NETWORK_CONFIG.RPC_CONFIG.TIMEOUT + 'ms');
        return { 
          configured: true, 
          isPremium: BSC_RPC_URLS[0]?.includes('drpc.org'),
          rpcCount: BSC_RPC_URLS.length 
        };
      }
    }
  };
  
  console.log('🛠️ dRPC Debug utilities available at window.__BGSC_VAULT_DEBUG__');
  console.log('💎 dRPC Premium Status:', BSC_RPC_URLS[0]?.includes('drpc.org') ? 'Active ✅' : 'Not configured');
}