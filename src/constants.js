// constants.js - dRPC 유료 서비스 우선 사용 설정 (완전 수정)
console.log('🔧 Loading environment variables...');

// ✅ 환경변수 검증 및 로딩
const requiredEnvVars = [
  'REACT_APP_VAULT_ADDRESS',
  'REACT_APP_BGSC_TOKEN_ADDRESS', 
  'REACT_APP_WBNB_ADDRESS'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing critical environment variables:', missingEnvVars);
}

// ✅ 환경변수에서 컨트랙트 주소 로드
export const VAULT_ADDRESS = process.env.REACT_APP_VAULT_ADDRESS;
export const BGSC_TOKEN_ADDRESS = process.env.REACT_APP_BGSC_TOKEN_ADDRESS;
export const WBNB_ADDRESS = process.env.REACT_APP_WBNB_ADDRESS;
export const VAULT_KEEPER_ADDRESS = process.env.REACT_APP_VAULT_KEEPER_ADDRESS;

// ✅ 컨트랙트 배포 블록 (히스토리 조회용)
export const VAULT_DEPLOY_BLOCK = 50571057n; // BSC 메인넷 볼트 배포 블록

// 환경변수 상태 로그
console.log('📋 Environment Variables Status:', {
  VAULT_ADDRESS: VAULT_ADDRESS ? `${VAULT_ADDRESS.slice(0, 6)}...${VAULT_ADDRESS.slice(-4)}` : 'NOT SET ❌',
  BGSC_TOKEN_ADDRESS: BGSC_TOKEN_ADDRESS ? `${BGSC_TOKEN_ADDRESS.slice(0, 6)}...${BGSC_TOKEN_ADDRESS.slice(-4)}` : 'NOT SET ❌',
  WBNB_ADDRESS: WBNB_ADDRESS ? `${WBNB_ADDRESS.slice(0, 6)}...${WBNB_ADDRESS.slice(-4)}` : 'NOT SET ❌',
  dRPC_URL: process.env.REACT_APP_dRPC_URLS ? 'SET ✅' : 'NOT SET ❌'
});

// ✅ 유료 dRPC 최우선 사용
const PREMIUM_DRPC_URL = process.env.REACT_APP_dRPC_URLS;

// dRPC URL 상세 검증
if (PREMIUM_DRPC_URL) {
  console.log('💎 dRPC Premium URL Details:', {
    isSet: true,
    length: PREMIUM_DRPC_URL.length,
    preview: PREMIUM_DRPC_URL.slice(0, 50) + '...',
    hasDkey: PREMIUM_DRPC_URL.includes('dkey=') ? 'YES ✅' : 'NO ❌',
    network: PREMIUM_DRPC_URL.includes('network=bsc') ? 'BSC ✅' : 'UNKNOWN ❓'
  });
} else {
  console.warn('⚠️ dRPC Premium URL not configured');
}

// ✅ 백업 RPC 목록 (CORS 허용)
const BACKUP_BSC_RPCS = [
  'https://bsc.drpc.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io'
];

// ✅ 최종 RPC 목록 결정 (dRPC 최우선)
const getFinalRpcList = () => {
  const rpcList = [];
  
  // 1순위: 유료 dRPC
  if (PREMIUM_DRPC_URL && PREMIUM_DRPC_URL.trim() !== '') {
    const trimmedUrl = PREMIUM_DRPC_URL.trim();
    
    // URL 유효성 기본 검사
    if (trimmedUrl.startsWith('https://') && trimmedUrl.includes('drpc.org')) {
      rpcList.push(trimmedUrl);
      console.log('💎 Using premium dRPC service as primary');
    } else {
      console.warn('⚠️ dRPC URL format seems invalid:', trimmedUrl.slice(0, 50) + '...');
    }
  }
  
  // 2순위: 환경변수 설정된 추가 RPC들
  if (process.env.REACT_APP_RPC_URLS) {
    const customRpcs = process.env.REACT_APP_RPC_URLS
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0 && url.startsWith('http'));
    
    if (customRpcs.length > 0) {
      rpcList.push(...customRpcs);
      console.log('📡 Adding custom RPC endpoints:', customRpcs.length);
    }
  }
  
  // 3순위: 안정적인 백업 RPC들 추가
  if (rpcList.length === 0) {
    console.warn('⚠️ No dRPC configured, using backup RPCs');
    rpcList.push(...BACKUP_BSC_RPCS);
  } else {
    // dRPC가 있어도 백업 RPC들 추가 (403 에러 대비)
    rpcList.push(...BACKUP_BSC_RPCS.slice(0, 4));
  }
  
  console.log(`🌐 Total RPC endpoints configured: ${rpcList.length}`);
  if (rpcList.length === 0) {
    console.error('❌ No RPC endpoints configured! Adding emergency fallback.');
    rpcList.push('https://bsc-dataseed1.binance.org');
  }
  
  return rpcList;
};

export const BSC_RPC_URLS = getFinalRpcList();
export const DEFAULT_RPC_URL = BSC_RPC_URLS[0];

console.log(`✅ Primary RPC: ${DEFAULT_RPC_URL.includes('drpc.org') ? 'dRPC Premium ✅' : 'Standard RPC'}`);
console.log(`📡 RPC Configuration: ${BSC_RPC_URLS.length} endpoints`);

// ✅ 라운드 설정
const parseEnvInt = (envVar, defaultValue) => {
  if (!envVar) return defaultValue;
  const parsed = parseInt(envVar, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const ROUND_CONFIG = {
  DURATION_DAYS: parseEnvInt(process.env.REACT_APP_ROUND_DURATION_DAYS, 28),
  START_DAY: parseEnvInt(process.env.REACT_APP_ROUND_START_DAY, 5),
  START_HOUR_UTC: parseEnvInt(process.env.REACT_APP_ROUND_START_HOUR_UTC, 0),
  
  getDurationText() {
    const days = this.DURATION_DAYS;
    if (days === 7) return 'weekly';
    if (days === 14) return 'bi-weekly';
    if (days === 28 || days === 30) return 'monthly';
    return `${days}-day`;
  },
  
  getDurationTextKr() {
    const days = this.DURATION_DAYS;
    if (days === 7) return '주간';
    if (days === 14) return '격주';
    if (days === 28 || days === 30) return '월간';
    return `${days}일`;
  },
  
  getCyclesPerYear() {
    return Math.floor(365 / this.DURATION_DAYS);
  }
};

// ✅ 네트워크 설정 (dRPC 최적화)
export const NETWORK_CONFIG = {
  CHAIN_ID: parseEnvInt(process.env.REACT_APP_CHAIN_ID, 56),
  NETWORK_NAME: process.env.REACT_APP_NETWORK_NAME || 'BSC',
  RPC_URLS: BSC_RPC_URLS,
  DEFAULT_RPC_URL: DEFAULT_RPC_URL,
  RPC_CONFIG: {
    RETRY_COUNT: 3,          // 빠른 실패를 위해 재시도 횟수 줄임
    RETRY_DELAY: 0,          // 첫 시도는 즉시
    TIMEOUT: 15000,          // 15초 타임아웃
    BATCH_SIZE: 20,          // 더 작은 배치로 빠른 응답
    BACKOFF_MULTIPLIER: 2,   // 재시도 시에만 지수 백오프
    MAX_RETRY_DELAY: 3000,   // 최대 3초 재시도 지연
    MIN_REQUEST_INTERVAL: 50 // 최소 요청 간격 50ms
  }
};

// ✅ API 및 UI 설정
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  MERKLE_PROOF_ENDPOINT: process.env.REACT_APP_MERKLE_PROOF_ENDPOINT || '/api/merkle-proof',
};

export const UI_CONFIG = {
  DEFAULT_DECIMALS: parseEnvInt(process.env.REACT_APP_DEFAULT_DECIMALS, 18),
  DISPLAY_DECIMALS: parseEnvInt(process.env.REACT_APP_DISPLAY_DECIMALS, 4),
  BALANCE_REFRESH_INTERVAL: parseEnvInt(process.env.REACT_APP_BALANCE_REFRESH_INTERVAL, 5000), // 5초로 단축
};

export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
  ENABLE_DARK_MODE: true,
  ENABLE_BETA_FEATURES: process.env.NODE_ENV === 'development',
  ENABLE_SERVICE_WORKER: false, // 서브디렉토리 배포 시 문제 방지를 위해 비활성화
};

export const EXTERNAL_LINKS = {
  WEBSITE: process.env.REACT_APP_WEBSITE_URL || 'https://bgsc.io',
  DOCS: process.env.REACT_APP_DOCS_URL || 'https://docs.bgsc.io',
  TWITTER: process.env.REACT_APP_TWITTER_URL || 'https://twitter.com/BGSCProtocol',
  DISCORD: process.env.REACT_APP_DISCORD_URL || 'https://discord.gg/BGSCProtocol',
};

// ✅ BugsDepositVault ABI (완전한 버전)
export const VAULT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wbnbAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "vaultKeeper",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "asset",
            "type": "address"
          },
          {
            "internalType": "uint56",
            "name": "minimumSupply",
            "type": "uint56"
          },
          {
            "internalType": "uint104",
            "name": "cap",
            "type": "uint104"
          }
        ],
        "internalType": "struct Vault.VaultParams",
        "name": "vaultConfiguration",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldCap",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newCap",
        "type": "uint256"
      }
    ],
    "name": "CapSet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userTotalDepositInRound",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userTotalWithdrawShares",
        "type": "uint256"
      }
    ],
    "name": "InitiateWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "remainingDepositAmount",
        "type": "uint256"
      }
    ],
    "name": "InstantWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oldKeeper",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newKeeper",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "updatedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "KeeperUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "userShareBalanceAfter",
        "type": "uint256"
      }
    ],
    "name": "Redeem",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerShare",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lockedAmount",
        "type": "uint256"
      }
    ],
    "name": "RollRound",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "completedRound",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPricePerShare",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalLockedAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newSharesMinted",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "RoundTransitionComplete",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "round",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldPricePerShare",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPricePerShare",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "SharePriceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "walletShares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "unredeemedShares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pendingDepositAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "queuedWithdrawShares",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "UserBalanceUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bool",
        "name": "isPublic",
        "type": "bool"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "changedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VaultAccessModeChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "oldCap",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newCap",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "updatedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VaultCapUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "availableBalance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lockedBalance",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "queuedWithdrawAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VaultLiquidityStatus",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalValueLocked",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSharesSupply",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pendingDeposits",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "queuedWithdrawAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "VaultMetricsUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "oldMerkleRoot",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "newMerkleRoot",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "updatedBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "WhitelistUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "shares",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "withdrawRound",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pricePerShareUsed",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "WBNB",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "acceptOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "accountVaultBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "canDeposit",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "completeWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentQueuedWithdrawShares",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositBNB",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "creditor",
        "type": "address"
      }
    ],
    "name": "depositBNBFor",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creditor",
        "type": "address"
      }
    ],
    "name": "depositFor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "depositReceipts",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "round",
        "type": "uint16"
      },
      {
        "internalType": "uint104",
        "name": "amount",
        "type": "uint104"
      },
      {
        "internalType": "uint128",
        "name": "unredeemedShares",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currentBalance",
        "type": "uint256"
      }
    ],
    "name": "getCurrQueuedWithdrawAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "numShares",
        "type": "uint256"
      }
    ],
    "name": "initiateWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isPublic",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "keeper",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastQueuedWithdrawAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxRedeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "merkleRoot",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pendingOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pricePerShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "privateDeposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "privateDepositBNB",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "numShares",
        "type": "uint256"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currentBalance",
        "type": "uint256"
      }
    ],
    "name": "rollToNextRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "round",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "roundPricePerShare",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newCap",
        "type": "uint256"
      }
    ],
    "name": "setCap",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_merkleRoot",
        "type": "bytes32"
      }
    ],
    "name": "setMerkleRoot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newKeeper",
        "type": "address"
      }
    ],
    "name": "setNewKeeper",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_isPublic",
        "type": "bool"
      }
    ],
    "name": "setPublic",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "asset",
            "type": "address"
          },
          {
            "internalType": "uint56",
            "name": "minimumSupply",
            "type": "uint56"
          },
          {
            "internalType": "uint104",
            "name": "cap",
            "type": "uint104"
          }
        ],
        "internalType": "struct Vault.VaultParams",
        "name": "newVaultParams",
        "type": "tuple"
      }
    ],
    "name": "setVaultParams",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "shareBalances",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "heldByAccount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "heldByVault",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "shares",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPending",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vaultParams",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "decimals",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "asset",
        "type": "address"
      },
      {
        "internalType": "uint56",
        "name": "minimumSupply",
        "type": "uint56"
      },
      {
        "internalType": "uint104",
        "name": "cap",
        "type": "uint104"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "vaultState",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "round",
        "type": "uint16"
      },
      {
        "internalType": "uint104",
        "name": "lockedAmount",
        "type": "uint104"
      },
      {
        "internalType": "uint104",
        "name": "lastLockedAmount",
        "type": "uint104"
      },
      {
        "internalType": "uint128",
        "name": "totalPending",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "queuedWithdrawShares",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdrawInstantly",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "withdrawals",
    "outputs": [
      {
        "internalType": "uint16",
        "name": "round",
        "type": "uint16"
      },
      {
        "internalType": "uint128",
        "name": "shares",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// ✅ ERC20 ABI (완전한 버전)
export const ERC20_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"name": "spender", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"},
      {"name": "spender", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"name": "account", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  }
];

// ✅ 가스비 설정 (dRPC 최적화)
export const GAS_CONFIG = {
  DEFAULT_GAS_PRICE: '3000000000', // 3 gwei
  MIN_GAS_PRICE: '1000000000',     // 1 gwei  
  MAX_GAS_PRICE: '20000000000',    // 20 gwei
  UPDATE_INTERVAL: 30000,          // 30초 (더 빈번한 업데이트)
  CACHE_DURATION: 15000,           // 15초
  
  SPEED_SETTINGS: {
    slow: {
      multiplier: 1.0,
      label: '절약형 (1-2분)',
      labelKr: '절약형'
    },
    standard: {
      multiplier: 1.25,
      label: '표준 (30초-1분)',
      labelKr: '표준'
    },
    fast: {
      multiplier: 1.5,
      label: '빠름 (15-30초)',
      labelKr: '빠름'
    }
  },
  
  FALLBACK_PRICES: {
    slow: '3000000000',      // 3 gwei
    standard: '5000000000',  // 5 gwei
    fast: '8000000000'       // 8 gwei
  }
};

export const GAS_LIMITS = {
  DEPOSIT: 250000n,
  DEPOSIT_BNB: 300000n,
  DEPOSIT_FOR: 270000n,
  WITHDRAW_INSTANTLY: 200000n,
  INITIATE_WITHDRAW: 250000n,
  COMPLETE_WITHDRAW: 350000n,
  REDEEM: 180000n,
  MAX_REDEEM: 200000n,
  APPROVE: 60000n,
  DEFAULT: 300000n,
  BUFFER_MULTIPLIER: 1.1,
};

// ✅ dRPC 최적화 이벤트 필터
export const EVENT_FILTERS = {
  BLOCKS_RANGE: 5000, // dRPC는 더 큰 범위 지원
  MAX_RETRIES: 2,
  RETRY_DELAY: 500,    // 더 빠른 재시도
  INITIAL_LOAD_BLOCKS: 20000,
  MAX_INITIAL_EVENTS: 100,
};

// ✅ Chain configuration (dRPC 최우선)
export const BSC_CHAIN = {
  id: NETWORK_CONFIG.CHAIN_ID,
  name: NETWORK_CONFIG.NETWORK_NAME,
  network: 'bsc',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: BSC_RPC_URLS,
    },
    public: {
      http: BSC_RPC_URLS,
    },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};

// ✅ 에러 메시지 매핑 (완전한 버전)
export const ERROR_MESSAGES = {
  'Vault access restricted': '볼트가 비공개 상태입니다',
  'user rejected transaction': '사용자가 트랜잭션을 취소했습니다',
  'user rejected': '사용자가 트랜잭션을 취소했습니다',
  'insufficient funds for gas': 'BNB 잔액이 부족합니다 (가스비)',
  'insufficient funds': '잔액이 부족합니다',
  'nonce too low': '트랜잭션 논스가 너무 낮습니다',
  'network error': '네트워크 오류가 발생했습니다',
  'execution reverted': '트랜잭션이 되돌려졌습니다',
  'ERC20InsufficientAllowance': '토큰 승인 한도가 부족합니다',
  'ERC20InsufficientBalance': '토큰 잔액이 부족합니다',
  'OwnableUnauthorizedAccount': '권한이 없는 계정입니다',
  'ReentrancyGuardReentrantCall': '재진입 공격이 감지되었습니다',
  'Transaction was not mined': '트랜잭션이 채굴되지 않았습니다',
  'timeout': '요청 시간이 초과되었습니다',
  'error.rateLimited': '네트워크가 혼잡합니다. 10초 후 다시 시도해주세요.',
  'error.rpcConnection': 'RPC 연결 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  'error.transactionCancelled': '트랜잭션이 취소되었습니다.',
  'error.mobileWalletConnection': '지갑 연결에 실패했습니다. 지갑 앱의 dApp 브라우저를 사용해보세요.',
  'error.mobileSignature': '서명 요청이 실패했습니다. 지갑 앱을 확인해주세요.',
  'error.mobileWalletRequest': '지갑 요청 처리 중 오류가 발생했습니다. 지갑 앱을 다시 열어주세요.',
  'error.mobileTransactionCancelled': '트랜잭션이 취소되었습니다. 지갑 앱에서 확인해주세요.',
  'error.mobileNetworkError': '네트워크 연결이 불안정합니다. WiFi 또는 모바일 데이터를 확인해주세요.',
  'error.mobileTransactionFailed': '트랜잭션이 실패했습니다. 지갑 앱에서 상태를 확인해주세요.',
};

// ✅ 앱 설정
export const APP_CONFIG = {
  DEFAULT_DECIMALS: UI_CONFIG.DEFAULT_DECIMALS,
  MIN_DEPOSIT_AMOUNT: '0.01',
  BALANCE_REFRESH_INTERVAL: 15000, // dRPC 사용으로 더 빈번한 업데이트
  PRICE_UPDATE_INTERVAL: 5000,
  DISPLAY_DECIMALS: {
    BALANCE: UI_CONFIG.DISPLAY_DECIMALS,
    PRICE: 3,
    PERCENTAGE: 2,
  },
  TRANSACTION_TIMEOUT: 180000, // 3분
  TOAST_DURATION: 5000,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  API_BASE_URL: API_CONFIG.BASE_URL,
  LINKS: EXTERNAL_LINKS,
};

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'bgsc_vault_preferences',
  TRANSACTION_CACHE: 'bgsc_vault_tx_cache',
  PRICE_CACHE: 'bgsc_vault_price_cache',
  GAS_CACHE: 'bgsc_vault_gas_cache',
};

// ✅ ABI 완전성 검증
const requiredFunctions = [
  'deposit', 'depositBNB', 'depositFor', 'depositBNBFor',
  'withdrawInstantly', 'initiateWithdraw', 'completeWithdraw',
  'redeem', 'maxRedeem', 'vaultParams', 'vaultState',
  'shareBalances', 'depositReceipts', 'withdrawals',
  'accountVaultBalance', 'canDeposit', 'isPublic',
  'pricePerShare', 'totalBalance', 'totalSupply'
];

const availableFunctions = VAULT_ABI
  .filter(item => item && item.type === 'function')
  .map(item => item.name);

const missingFunctions = requiredFunctions.filter(fn => !availableFunctions.includes(fn));

if (missingFunctions.length > 0) {
  console.error('❌ Missing ABI functions:', missingFunctions);
} else {
  console.log('✅ All required ABI functions present');
}

// ✅ 환경변수 최종 확인
if (missingEnvVars.length > 0) {
  console.error('❌ Critical environment variables missing!');
  console.error('Please check your .env file for:');
  missingEnvVars.forEach(envVar => {
    console.error(`- ${envVar}`);
  });
} else {
  console.log('✅ All critical environment variables configured');
}

// ✅ 최종 설정 로그
console.log('📋 Configuration Summary:', {
  VAULT_ADDRESS: VAULT_ADDRESS ? `${VAULT_ADDRESS.slice(0, 6)}...${VAULT_ADDRESS.slice(-4)}` : 'NOT SET',
  BGSC_TOKEN: BGSC_TOKEN_ADDRESS ? `${BGSC_TOKEN_ADDRESS.slice(0, 6)}...${BGSC_TOKEN_ADDRESS.slice(-4)}` : 'NOT SET',
  NETWORK: NETWORK_CONFIG.NETWORK_NAME,
  PRIMARY_RPC: PREMIUM_DRPC_URL ? 'dRPC Premium ✅' : 'Standard RPC',
  RPC_COUNT: BSC_RPC_URLS.length,
  ROUND_DURATION: `${ROUND_CONFIG.DURATION_DAYS} days (${ROUND_CONFIG.getDurationTextKr()})`,
  ABI_FUNCTIONS: VAULT_ABI.filter(item => item && item.type === 'function').length,
  ABI_EVENTS: VAULT_ABI.filter(item => item && item.type === 'event').length,
  DEBUG_MODE: FEATURE_FLAGS.DEBUG_MODE
});

console.log('✅ Constants module loaded successfully with dRPC Premium support');