// utils.js - dRPC 최적화 및 BGSC 잔액 정확성 개선
/* global BigInt */
import { formatUnits, parseUnits, isAddress } from 'ethers';
import { ERROR_MESSAGES, ROUND_CONFIG, GAS_CONFIG, GAS_LIMITS } from './constants';

// ✅ 보안 유틸리티 함수들 (dRPC 최적화)
export const SecurityUtils = {
  // XSS 방지 - HTML 이스케이프
  escapeHtml: (text) => {
    if (typeof text !== 'string') return String(text || '');
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    return text.replace(/[&<>"'`=/]/g, (s) => map[s]);
  },

  // 입력 sanitization (강화)
  sanitizeInput: (input, maxLength = 1000) => {
    if (typeof input !== 'string') return '';
    
    let sanitized = input.slice(0, maxLength);
    
    sanitized = sanitized
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/expression\s*\(/gi, '')
      .replace(/url\s*\(/gi, '')
      .replace(/import\s*\(/gi, '')
      .trim();
    
    return sanitized;
  },

  // ✅ 개선된 주소 검증 (ethers.js isAddress 사용)
  validateAddress: (address) => {
    if (!address || typeof address !== 'string') return false;
    
    try {
      return isAddress(address);
    } catch (error) {
      return false;
    }
  },

  // 숫자 입력 검증 (BGSC 정확성을 위해 강화)
  validateNumericInput: (input, options = {}) => {
    const {
      allowNegative = false,
      allowDecimal = true,
      maxDecimals = 18,
      maxValue = null,
      minValue = null
    } = options;

    if (typeof input !== 'string') return { valid: false, error: 'validation.invalidInputFormat' };
    
    if (input === '') return { valid: true };
    
    const numberRegex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
    
    if (!numberRegex.test(input)) {
      return { valid: false, error: 'validation.numbersOnly' };
    }
    
    if (!allowDecimal && input.includes('.')) {
      return { valid: false, error: 'validation.noDecimalsAllowed' };
    }
    
    if (allowDecimal && input.includes('.')) {
      const decimals = input.split('.')[1];
      if (decimals && decimals.length > maxDecimals) {
        return { valid: false, error: 'validation.maxDecimalsExceeded', params: { maxDecimals } };
      }
    }
    
    const numValue = parseFloat(input);
    if (!isNaN(numValue)) {
      if (minValue !== null && numValue < minValue) {
        return { valid: false, error: 'validation.minValueRequired', params: { minValue } };
      }
      if (maxValue !== null && numValue > maxValue) {
        return { valid: false, error: 'validation.maxValueExceeded', params: { maxValue } };
      }
    }
    
    return { valid: true };
  },

  // 민감한 정보 로깅 방지 (dRPC 관련 정보 포함)
  secureLog: (message, data = null) => {
    if (process.env.NODE_ENV === 'production') return;
    
    const sensitiveKeywords = ['private', 'key', 'seed', 'mnemonic', 'password', 'secret', 'dkey', 'api_key', 'token'];
    const messageStr = JSON.stringify({ message, data }).toLowerCase();
    
    if (sensitiveKeywords.some(keyword => messageStr.includes(keyword))) {
      console.log('[Security] [REDACTED] Sensitive information blocked from logging');
      return;
    }
    
    console.log(message, data);
  },

  // dRPC 최적화된 레이트 리미팅
  rateLimiter: (() => {
    const limits = new Map();
    
    return (key, maxRequests = 15, windowMs = 60000) => { // dRPC는 더 많은 요청 허용
      const now = Date.now();
      const windowStart = now - windowMs;
      
      if (!limits.has(key)) {
        limits.set(key, []);
      }
      
      const requests = limits.get(key);
      const validRequests = requests.filter(time => time > windowStart);
      
      if (validRequests.length >= maxRequests) {
        return false;
      }
      
      validRequests.push(now);
      limits.set(key, validRequests);
      
      return true;
    };
  })(),
  
  // 트랜잭션 재시도 디바운서
  debounceTransaction: (() => {
    const timeouts = new Map();
    
    return (key, callback, delay = 2000) => {
      if (timeouts.has(key)) {
        clearTimeout(timeouts.get(key));
      }
      
      const timeoutId = setTimeout(() => {
        timeouts.delete(key);
        callback();
      }, delay);
      
      timeouts.set(key, timeoutId);
    };
  })(),

  // 브라우저 환경 검증
  validateBrowserEnvironment: () => {
    const checks = {
      hasLocalStorage: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      })(),
      hasSessionStorage: (() => {
        try {
          sessionStorage.setItem('test', 'test');
          sessionStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      })(),
      hasWebCrypto: !!(window.crypto && window.crypto.subtle),
      hasConsole: !!(window.console && window.console.log),
      isSecureContext: window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      isDRPCOptimized: true // dRPC 사용 표시
    };
    
    return checks;
  }
};

// ✅ BGSC 정확성을 위한 숫자 포맷팅 함수들 (강화)
export const formatAmount = (amount, decimals = 18, displayDecimals = 4) => {
  try {
    if (!amount || amount === 0 || amount === 0n || amount === '0') return '0';
    
    // BigInt로 변환 시도
    let bigIntAmount;
    if (typeof amount === 'bigint') {
      bigIntAmount = amount;
    } else if (typeof amount === 'string' || typeof amount === 'number') {
      try {
        bigIntAmount = BigInt(Math.floor(Number(amount)));
      } catch (e) {
        console.warn('Cannot convert amount to BigInt:', amount, e);
        return '0';
      }
    } else {
      console.warn('Invalid amount type for formatting:', typeof amount);
      return '0';
    }
    
    const formatted = formatUnits(bigIntAmount, decimals);
    const num = parseFloat(formatted);
    
    if (!isFinite(num)) {
      console.warn('Non-finite number detected in formatAmount');
      return '0';
    }
    
    // BGSC 대용량 처리 개선
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    
    // 소액의 경우 더 정확한 표시
    if (num < 0.0001 && num > 0) {
      return num.toExponential(2);
    }
    
    return num.toFixed(displayDecimals);
  } catch (error) {
    SecurityUtils.secureLog('Format amount error:', error);
    return '0';
  }
};

export const formatFullAmount = (amount, decimals = 18) => {
  try {
    if (!amount || amount.toString() === '0') return '0';
    
    if (typeof amount !== 'string' && typeof amount !== 'bigint' && typeof amount !== 'number') {
      console.warn('Invalid amount type for full formatting:', typeof amount);
      return '0';
    }
    
    const result = formatUnits(amount, decimals);
    
    if (typeof result !== 'string' || !isFinite(parseFloat(result))) {
      console.warn('Invalid format result');
      return '0';
    }
    
    return result;
  } catch (error) {
    SecurityUtils.secureLog('Format full amount error:', error);
    return '0';
  }
};

// BGSC 잔액을 정수로 표시하는 함수 (K, M 표기 없이)
export const formatIntegerAmount = (amount, decimals = 18) => {
  try {
    if (!amount || amount === 0 || amount === 0n || amount === '0') return '0';
    
    // BigInt로 변환 시도
    let bigIntAmount;
    if (typeof amount === 'bigint') {
      bigIntAmount = amount;
    } else if (typeof amount === 'string' || typeof amount === 'number') {
      try {
        bigIntAmount = BigInt(Math.floor(Number(amount)));
      } catch (e) {
        console.warn('Cannot convert amount to BigInt:', amount, e);
        return '0';
      }
    } else {
      console.warn('Invalid amount type for formatting:', typeof amount);
      return '0';
    }
    
    const formatted = formatUnits(bigIntAmount, decimals);
    const num = parseFloat(formatted);
    
    if (!isFinite(num)) {
      console.warn('Non-finite number detected in formatIntegerAmount');
      return '0';
    }
    
    // 정수로 표시 (쉼표 포함) - 반올림 사용
    return Math.round(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
  } catch (error) {
    SecurityUtils.secureLog('Format integer amount error:', error);
    return '0';
  }
};

// ✅ BGSC 정확성을 위한 parseAmount 강화
export const parseAmount = (amount, decimals = 18) => {
  try {
    if (!amount || amount === '' || amount === '0') return 0n;
    
    const sanitizedAmount = SecurityUtils.sanitizeInput(amount.toString(), 50);
    
    const validation = SecurityUtils.validateNumericInput(sanitizedAmount, {
      allowNegative: false,
      allowDecimal: true,
      maxDecimals: decimals
    });
    
    if (!validation.valid) {
      console.warn('Invalid amount format:', validation.error);
      return 0n;
    }
    
    // BGSC 정확성을 위한 정밀도 검사
    const parsed = parseUnits(sanitizedAmount, decimals);
    
    if (parsed < 0n) {
      console.warn('Negative amount detected, returning 0');
      return 0n;
    }
    
    return parsed;
  } catch (error) {
    SecurityUtils.secureLog('Parse amount error:', error);
    return 0n;
  }
};

// ✅ dRPC 최적화된 BigInt 안전 연산 헬퍼
export const safeBigInt = (value) => {
  try {
    if (!value) return 0n;
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') {
      if (!isFinite(value)) {
        console.warn('Non-finite number in safeBigInt');
        return 0n;
      }
      if (value < 0) {
        console.warn('Negative number in safeBigInt, returning 0');
        return 0n;
      }
      return BigInt(Math.floor(value));
    }
    
    const strValue = value.toString();
    if (strValue === '' || strValue === '0') return 0n;
    
    if (strValue.length > 100) {
      console.warn('String too long for BigInt conversion');
      return 0n;
    }
    
    if (!/^\d+$/.test(strValue)) {
      console.warn('Invalid string format for BigInt:', strValue);
      return 0n;
    }
    
    const result = BigInt(strValue);
    return result < 0n ? 0n : result;
  } catch (error) {
    SecurityUtils.secureLog('Safe bigint conversion error:', error);
    return 0n;
  }
};

// ✅ dRPC 관련 에러 파싱 강화
export const parseError = (error) => {
  try {
    let message = '';
    let code = error?.code;
    const isMobile = MobileWalletUtils.isMobile();
    const walletType = MobileWalletUtils.detectWalletApp();
    
    if (error?.reason) {
      message = error.reason;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.data?.message) {
      message = error.data.message;
    } else if (error?.shortMessage) {
      message = error.shortMessage;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    // 민감한 정보 제거 (dRPC API 키 등)
    const sensitivePatterns = [
      /private.*key/gi,
      /mnemonic/gi,
      /seed.*phrase/gi,
      /0x[a-fA-F0-9]{64,}/g,
      /dkey=[a-zA-Z0-9]+/g, // dRPC API 키 패턴
      /api[_-]?key=[a-zA-Z0-9]+/gi,
    ];
    
    sensitivePatterns.forEach(pattern => {
      message = message.replace(pattern, '[REDACTED]');
    });
    
    // Rate limiting 에러 처리 (MetaMask/RPC)
    if (code === -32603 || message.toLowerCase().includes('rate limit') || 
        message.toLowerCase().includes('request is being rate limited')) {
      return 'error.rateLimited';
    }
    
    // dRPC 관련 에러 처리
    if (message.toLowerCase().includes('drpc') || message.toLowerCase().includes('rpc')) {
      return 'error.rpcConnection';
    }
    
    // 컨트랙트 require 메시지 찾기
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(key)) {
        return value;
      }
    }
    
    // 모바일 특화 에러 처리
    if (isMobile) {
      // WalletConnect 연결 에러
      if (message.toLowerCase().includes('walletconnect') || 
          message.toLowerCase().includes('session') ||
          message.toLowerCase().includes('pairing')) {
        return 'error.mobileWalletConnection';
      }
      
      // 트랜잭션 서명 에러
      if (message.toLowerCase().includes('sign') || 
          message.toLowerCase().includes('signature')) {
        return 'error.mobileSignature';
      }
      
      // 모바일 지갑 특화 에러
      if (walletType && message.toLowerCase().includes('request')) {
        return 'error.mobileWalletRequest';
      }
    }
    
    // 일반적인 에러들
    if (message.toLowerCase().includes('user rejected') || 
        message.toLowerCase().includes('user denied') ||
        message.toLowerCase().includes('cancelled') ||
        message.toLowerCase().includes('user cancelled')) {
      return isMobile ? 'error.mobileTransactionCancelled' : 'error.transactionCancelled';
    }
    if (message.toLowerCase().includes('insufficient funds')) {
      return 'error.insufficientBNB';
    }
    if (message.toLowerCase().includes('nonce') || 
        message.toLowerCase().includes('replacement')) {
      return 'error.transactionConflict';
    }
    if (message.toLowerCase().includes('network') || 
        message.toLowerCase().includes('timeout')) {
      return isMobile ? 'error.mobileNetworkError' : 'error.networkError';
    }
    if (message.toLowerCase().includes('gas')) {
      return 'error.gasEstimationFailed';
    }
    if (message.toLowerCase().includes('revert')) {
      return 'error.transactionReverted';
    }
    
    return isMobile ? 'error.mobileTransactionFailed' : 'error.transactionFailed';
  } catch (parseErrorException) {
    SecurityUtils.secureLog('Error parsing failed:', parseErrorException);
    return 'error.unknown';
  }
};

// ✅ 시간 포맷팅 (사용자 로컬 타임존)
export const formatTimestamp = (timestamp, language = 'ko') => {
  try {
    let eventTime;
    
    // 문자열 타임스탬프 처리 ("2025-06-27T06:47:02" 형식)
    if (typeof timestamp === 'string') {
      // 서버에서 받은 시간은 실제 이벤트 시간보다 9시간 늦음
      // 따라서 9시간을 더해서 실제 이벤트 시간을 구함
      const serverDate = new Date(timestamp + 'Z'); // UTC로 파싱
      eventTime = serverDate.getTime() + (9 * 60 * 60 * 1000); // 9시간 추가 (밀리초 단위)
    } else {
      // 숫자 타임스탬프는 초 단위로 가정
      // 서버가 잘못된 시간을 보내므로 9시간 추가
      const timestampNum = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
      eventTime = (timestampNum + 32400) * 1000; // 9시간(32400초) 추가 후 밀리초로 변환
    }
    
    if (!isFinite(eventTime) || eventTime < 0) {
      console.warn('Invalid timestamp:', timestamp);
      return language === 'ko' ? '알 수 없음' : 'Unknown';
    }
    
    // 현재 사용자 기기의 로컬 시간 (밀리초 단위)
    const now = Date.now();
    
    // 미래 시간 체크
    if (eventTime > now + (365 * 24 * 60 * 60 * 1000)) {
      console.warn('Timestamp too far in future');
      return language === 'ko' ? '알 수 없음' : 'Unknown';
    }
    
    // 현재 시간과 이벤트 시간의 차이 계산 (초 단위)
    const diff = Math.floor((now - eventTime) / 1000);
    
    // 직접 포맷팅된 문자열 반환
    if (language === 'ko') {
      if (diff < 60) return '방금 전';
      if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
      
      // 일주일 이상 된 거래는 로컬 시간으로 표시
      const date = new Date(eventTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}.${month}.${day} ${hours}:${minutes}`;
    } else {
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      
      // 일주일 이상 된 거래는 로컬 시간으로 표시
      const date = new Date(eventTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month} ${day}, ${year} ${hours}:${minutes}`;
    }
  } catch (error) {
    SecurityUtils.secureLog('Format timestamp error:', error);
    return '알 수 없음';
  }
};

// ✅ 라운드 종료까지 남은 시간 계산 (월간 라운드 최적화)
export const getTimeUntilNextRound = () => {
  try {
    const now = new Date();
    const config = ROUND_CONFIG;
    
    const currentDay = now.getUTCDay();
    const currentHour = now.getUTCHours();
    
    let daysUntilNextRound;
    
    if (currentDay < config.START_DAY) {
      daysUntilNextRound = config.START_DAY - currentDay;
    } else if (currentDay === config.START_DAY) {
      if (currentHour < config.START_HOUR_UTC) {
        daysUntilNextRound = 0;
      } else {
        daysUntilNextRound = config.DURATION_DAYS;
      }
    } else {
      const daysPassedInCycle = (currentDay - config.START_DAY + 7) % 7;
      if (daysPassedInCycle < config.DURATION_DAYS) {
        daysUntilNextRound = config.DURATION_DAYS - daysPassedInCycle;
      } else {
        daysUntilNextRound = 7 - daysPassedInCycle + config.DURATION_DAYS;
      }
    }
    
    const nextRoundStart = new Date(now);
    nextRoundStart.setUTCDate(now.getUTCDate() + daysUntilNextRound);
    nextRoundStart.setUTCHours(config.START_HOUR_UTC, 0, 0, 0);
    
    if (daysUntilNextRound === 0) {
      nextRoundStart.setUTCDate(now.getUTCDate());
    }
    
    const diff = nextRoundStart - now;
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  } catch (error) {
    SecurityUtils.secureLog('Get time until next round error:', error);
    return '0d 0h';
  }
};

// ✅ BGSC Point 변환 계산 (정확성 강화)
export const calculateBGSCFromPoints = (points, pricePerPoint, decimals = 18) => {
  try {
    const pointsBig = safeBigInt(points);
    const priceBig = safeBigInt(pricePerPoint);
    
    if (pointsBig === 0n || priceBig === 0n) {
      return 0n;
    }
    
    const decimalsBig = BigInt(10) ** BigInt(decimals);
    const result = (pointsBig * priceBig) / decimalsBig;
    
    if (result < 0n) {
      console.warn('Negative result in calculateBGSCFromPoints');
      return 0n;
    }
    
    return result;
  } catch (error) {
    SecurityUtils.secureLog('Calculate BGSC from points error:', error);
    return 0n;
  }
};

// ✅ BGSC to Point 변환 계산 (정확성 강화)
export const calculatePointsFromBGSC = (bgsc, pricePerPoint, decimals = 18) => {
  try {
    const bgscBig = safeBigInt(bgsc);
    const priceBig = safeBigInt(pricePerPoint);
    
    if (bgscBig === 0n || priceBig === 0n) {
      return 0n;
    }
    
    const decimalsBig = BigInt(10) ** BigInt(decimals);
    const result = (bgscBig * decimalsBig) / priceBig;
    
    if (result < 0n) {
      console.warn('Negative result in calculatePointsFromBGSC');
      return 0n;
    }
    
    return result;
  } catch (error) {
    SecurityUtils.secureLog('Calculate points from BGSC error:', error);
    return 0n;
  }
};

// ✅ APY 계산 (월간 라운드 최적화)
export const calculateAPY = (currentPrice, previousPrice, periodsAgo = 1) => {
  try {
    const currentBig = safeBigInt(currentPrice);
    const previousBig = safeBigInt(previousPrice);
    
    if (previousBig === 0n) return '0.00';
    
    const currentNum = Number(formatUnits(currentBig, 18));
    const previousNum = Number(formatUnits(previousBig, 18));
    
    if (previousNum <= 0 || !isFinite(currentNum) || !isFinite(previousNum)) return '0.00';
    
    const periodReturn = (currentNum - previousNum) / previousNum;
    const periodsPerYear = ROUND_CONFIG.getCyclesPerYear();
    
    if (Math.abs(periodReturn) > 10) {
      console.warn('Abnormal period return detected');
      return '0.00';
    }
    
    const apy = Math.pow(1 + periodReturn / Math.max(1, periodsAgo), periodsPerYear) - 1;
    
    if (!isFinite(apy) || Math.abs(apy) > 100) {
      console.warn('Invalid APY calculation result');
      return '0.00';
    }
    
    return (apy * 100).toFixed(2);
  } catch (error) {
    SecurityUtils.secureLog('Calculate APY error:', error);
    return '0.00';
  }
};

// ✅ BGSC 잔액 검증 함수 (강화)
export const validateAmount = (amount, max, min = '0', decimals = 18) => {
  try {
    if (!amount || amount === '') return { valid: true };
    
    const sanitizedAmount = SecurityUtils.sanitizeInput(amount, 50);
    
    const numericValidation = SecurityUtils.validateNumericInput(sanitizedAmount, {
      allowNegative: false,
      allowDecimal: true,
      maxDecimals: decimals
    });
    
    if (!numericValidation.valid) {
      return numericValidation;
    }
    
    let parsedAmount;
    try {
      parsedAmount = parseAmount(sanitizedAmount, decimals);
    } catch (error) {
      return { valid: false, error: 'validation.invalidNumberFormat' };
    }
    
    const maxAmount = safeBigInt(max);
    const minAmount = parseAmount(min, decimals);
    
    if (parsedAmount <= 0n) {
      return { valid: false, error: 'validation.mustBeGreaterThanZero' };
    }
    if (parsedAmount < minAmount) {
      return { valid: false, error: 'validation.minAmountRequired', params: { minAmount: formatIntegerAmount(minAmount, decimals) } };
    }
    if (parsedAmount > maxAmount) {
      return { valid: false, error: 'validation.maxAmountExceeded', params: { maxAmount: formatIntegerAmount(maxAmount, decimals) } };
    }
    
    return { valid: true };
  } catch (error) {
    SecurityUtils.secureLog('Validate amount error:', error);
    return { valid: false, error: 'validation.errorDuringValidation' };
  }
};

// ✅ Merkle proof 생성 (dRPC 최적화)
export const getMerkleProof = async (address) => {
  try {
    if (!SecurityUtils.validateAddress(address)) {
      console.warn('Invalid address for merkle proof');
      return [];
    }
    
    // dRPC 환경에서 더 관대한 레이트 리미팅
    if (!SecurityUtils.rateLimiter(`merkle_${address}`, 10, 60000)) {
      console.warn('Merkle proof request rate limited');
      return [];
    }
    
    // TODO: Implement backend API call or local whitelist check
    // TODO: Implement merkle proof generation with backend API or local whitelist
    return [];
  } catch (error) {
    SecurityUtils.secureLog('Failed to get merkle proof:', error);
    return [];
  }
};

// ✅ 주소 축약 (null 체크 강화)
export const shortenAddress = (address) => {
  if (!address || address === null || address === undefined) {
    return '';
  }
  
  if (typeof address !== 'string') {
    return '';
  }
  
  if (!SecurityUtils.validateAddress(address)) {
    return '0x...';
  }
  
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// ✅ BGSC 입력 필터링 (정확성 강화)
export const filterNumberInput = (value, decimals = 18) => {
  if (!value) return '';
  
  let sanitized = SecurityUtils.sanitizeInput(value.toString(), 50);
  
  // 숫자와 소수점만 허용
  let filtered = sanitized.replace(/[^0-9.]/g, '');
  
  // 소수점 처리
  const parts = filtered.split('.');
  if (parts.length > 2) {
    filtered = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // 소수점 자릿수 제한
  if (parts.length === 2 && parts[1].length > decimals) {
    filtered = parts[0] + '.' + parts[1].slice(0, decimals);
  }
  
  // 앞자리 0 제거 (소수점 앞자리가 아닌 경우)
  if (filtered.length > 1 && filtered[0] === '0' && filtered[1] !== '.') {
    filtered = filtered.slice(1);
  }
  
  // 빈 소수점 처리
  if (filtered === '.' || filtered === '') {
    return filtered === '.' ? '0.' : '';
  }
  
  return filtered;
};

// ✅ BSCScan 링크 생성 (보안 강화)
export const getBSCScanLink = (hash, type = 'tx') => {
  if (!hash || typeof hash !== 'string') return '#';
  
  const allowedTypes = ['tx', 'address', 'block', 'token'];
  const safeType = allowedTypes.includes(type) ? type : 'tx';
  
  // 주소나 해시 형식 기본 검증
  if (type === 'address' && !SecurityUtils.validateAddress(hash)) {
    return '#';
  }
  
  const baseUrl = 'https://bscscan.com';
  return `${baseUrl}/${safeType}/${SecurityUtils.escapeHtml(hash)}`;
};

// ✅ dRPC 최적화된 가스비 계산 함수
export const calculateGasFee = (gasPrice, gasLimit, speed = 'standard') => {
  try {
    if (!gasPrice || !gasLimit) {
      return GAS_CONFIG.FALLBACK_PRICES[speed] || '0.002';
    }

    const gasPriceBig = safeBigInt(gasPrice);
    const gasLimitBig = safeBigInt(gasLimit);
    
    if (gasPriceBig === 0n || gasLimitBig === 0n) {
      return '0.002';
    }
    
    const gasFee = gasPriceBig * gasLimitBig;
    const result = formatAmount(gasFee, 18, 4);
    
    const resultNum = parseFloat(result);
    if (!isFinite(resultNum) || resultNum > 1) {
      console.warn('Abnormally high gas fee calculated');
      return '0.002';
    }
    
    return result;
  } catch (error) {
    SecurityUtils.secureLog('Calculate gas fee error:', error);
    return '0.002';
  }
};

// ✅ 가스 한도 자동 계산 함수 (dRPC 최적화)
export const getGasLimit = (transactionType, hasApproval = false) => {
  try {
    let baseLimit = GAS_LIMITS[transactionType.toUpperCase()] || GAS_LIMITS.DEFAULT;
    
    if (hasApproval) {
      baseLimit = baseLimit + GAS_LIMITS.APPROVE;
    }
    
    // dRPC 환경에서는 약간 더 높은 가스 한도 사용
    const finalLimit = BigInt(Math.floor(Number(baseLimit) * (GAS_LIMITS.BUFFER_MULTIPLIER + 0.05)));
    
    return finalLimit;
  } catch (error) {
    SecurityUtils.secureLog('Get gas limit error:', error);
    return GAS_LIMITS.DEFAULT;
  }
};

// ✅ dRPC 최적화된 트랜잭션 비용 추정
export const estimateTransactionCost = (transactionType, gasPrice, hasApproval = false) => {
  try {
    const gasLimit = getGasLimit(transactionType, hasApproval);
    const gasFee = calculateGasFee(gasPrice, gasLimit);
    
    return {
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      gasFee,
      gasFeeWei: (safeBigInt(gasPrice) * gasLimit).toString(),
      optimizedForDRPC: true, // dRPC 최적화 표시
    };
  } catch (error) {
    SecurityUtils.secureLog('Estimate transaction cost error:', error);
    return {
      gasLimit: GAS_LIMITS.DEFAULT.toString(),
      gasPrice: GAS_CONFIG.DEFAULT_GAS_PRICE,
      gasFee: '0.002',
      gasFeeWei: '0',
      optimizedForDRPC: false,
    };
  }
};

// ✅ 월간 라운드 상태 확인 헬퍼
export const getCurrentRoundStatus = () => {
  const config = ROUND_CONFIG;
  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours();
  
  const isRoundActive = () => {
    if (currentDay < config.START_DAY) return false;
    if (currentDay === config.START_DAY && currentHour < config.START_HOUR_UTC) return false;
    
    const daysPassedInCycle = (currentDay - config.START_DAY + 7) % 7;
    return daysPassedInCycle < config.DURATION_DAYS;
  };
  
  return {
    isActive: isRoundActive(),
    timeUntilNext: getTimeUntilNextRound(),
    durationText: config.getDurationTextKr(),
    startDay: config.START_DAY,
    startHour: config.START_HOUR_UTC,
    duration: config.DURATION_DAYS,
    isPremiumRPC: true, // dRPC 사용 표시
  };
};

// ✅ 동적 텍스트 생성 헬퍼 (월간 라운드 최적화)
export const getDynamicText = (language = 'ko') => {
  const config = ROUND_CONFIG;
  
  if (language === 'ko') {
    return {
      roundDuration: config.getDurationTextKr(),
      roundFrequency: `${config.DURATION_DAYS}일마다`,
      apyPeriod: `${config.getCyclesPerYear()}회`,
      apyBasis: `연 ${config.getCyclesPerYear()}회 복리`,
      nextRoundLabel: `다음 ${config.getDurationTextKr()} 라운드`,
      currentRoundLabel: `현재 ${config.getDurationTextKr()} 라운드`,
      howItWorksText: `${config.getDurationTextKr()} 단위로 수익을 창출합니다`,
      processingTimeText: `${config.getDurationTextKr()} 라운드 종료 후 처리됩니다`,
      premiumRPC: 'dRPC Premium으로 최적화됨',
    };
  } else {
    return {
      roundDuration: config.getDurationText(),
      roundFrequency: `Every ${config.DURATION_DAYS} days`,
      apyPeriod: `${config.getCyclesPerYear()} times`,
      apyBasis: `${config.getCyclesPerYear()}x annual compounding`,
      nextRoundLabel: `Next ${config.getDurationText()} round`,
      currentRoundLabel: `Current ${config.getDurationText()} round`,
      howItWorksText: `Generates returns on a ${config.getDurationText()} basis`,
      processingTimeText: `Processed after ${config.getDurationText()} round ends`,
      premiumRPC: 'Optimized with dRPC Premium',
    };
  }
};

// ✅ 다음 라운드 시작 시간 계산 (매월 1일 00시)
export const getNextRoundStartTime = (language = 'ko') => {
  const now = new Date();
  const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // KST 시간으로 변환
  
  // 다음 달 1일 00시 (KST) 계산
  let nextRound = new Date(kstNow);
  nextRound.setMonth(nextRound.getMonth() + 1);
  nextRound.setDate(1);
  nextRound.setHours(0, 0, 0, 0);
  
  // 만약 현재가 1일 00시 이전이라면 이번 달 1일 00시가 다음 라운드
  const thisMonth = new Date(kstNow);
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  
  if (kstNow < thisMonth) {
    nextRound = thisMonth;
  }
  
  // 남은 시간 계산
  const diff = nextRound - kstNow;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  // 언어별 형식
  const monthNames = {
    ko: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  
  const formattedDate = language === 'ko' 
    ? `${monthNames.ko[nextRound.getMonth()]} 1일 00시`
    : `${monthNames.en[nextRound.getMonth()]} 1st, 00:00`;
    
  const timeLeft = language === 'ko'
    ? days > 0 ? `${days}일 ${hours}시간` : `${hours}시간 ${minutes}분`
    : days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`;
  
  return {
    nextRoundDate: nextRound,
    timeLeft,
    formattedDate
  };
};

// ✅ 즉시 출금 가능 시간 계산 (월간 라운드 최적화)
export const getInstantWithdrawDeadline = (language = 'ko') => {
  try {
    // 현재 라운드에서 입금한 경우에만 즉시 출금 가능
    // 라운드가 아직 진행 중이어야 함
    const timeLeftText = language === 'ko' ? '라운드 진행 중' : 'Round in Progress';
    return { 
      canWithdraw: true, 
      timeLeft: timeLeftText,
      message: 'round.inProgress',
      messageParams: { duration: language === 'ko' ? ROUND_CONFIG.getDurationTextKr() : ROUND_CONFIG.getDurationText() }
    };
  } catch (error) {
    SecurityUtils.secureLog('Get instant withdraw deadline error:', error);
    const timeLeftText = language === 'ko' ? '라운드 진행 중' : 'Round in Progress';
    return { 
      canWithdraw: true, 
      timeLeft: timeLeftText, 
      message: 'round.inProgress' 
    };
  }
};

// ✅ dRPC 최적화된 브라우저 환경 검증 및 초기화
export const initializeSecurity = () => {
  try {
    const browserChecks = SecurityUtils.validateBrowserEnvironment();
    
    if (!browserChecks.isSecureContext && process.env.NODE_ENV === 'production') {
      console.warn('[Security] Insecure context detected in production');
    }
    
    if (!browserChecks.hasWebCrypto) {
      console.warn('[Security] Web Crypto API not available');
    }
    
    // dRPC 환경 확인
    const isDRPCConfigured = process.env.REACT_APP_dRPC_URLS ? true : false;
    
    SecurityUtils.secureLog('Security initialization completed', {
      ...browserChecks,
      isDRPCConfigured,
      premiumRPC: isDRPCConfigured ? 'dRPC Premium' : 'Standard RPC'
    });
    
    return { ...browserChecks, isDRPCConfigured };
  } catch (error) {
    console.error('Security initialization failed:', error);
    return null;
  }
};

// ✅ 추가 유틸리티 함수들 (dRPC 최적화)
export const calculatePercentage = (amount, total) => {
  try {
    const amountBig = safeBigInt(amount);
    const totalBig = safeBigInt(total);
    
    if (totalBig === 0n) return 0;
    
    const result = Number((amountBig * 10000n) / totalBig) / 100;
    
    if (!isFinite(result) || result < 0 || result > 100) {
      console.warn('Invalid percentage calculation result');
      return 0;
    }
    
    return result;
  } catch (error) {
    SecurityUtils.secureLog('Calculate percentage error:', error);
    return 0;
  }
};

export const compareBigInt = (a, b) => {
  try {
    const aBig = safeBigInt(a);
    const bBig = safeBigInt(b);
    
    if (aBig > bBig) return 1;
    if (aBig < bBig) return -1;
    return 0;
  } catch (error) {
    SecurityUtils.secureLog('Compare BigInt error:', error);
    return 0;
  }
};

// ✅ dRPC 최적화된 디바운스 함수
export const debounce = (func, wait) => {
  if (typeof func !== 'function') {
    console.warn('Debounce: first argument must be a function');
    return () => {};
  }
  
  const waitTime = Math.min(Math.max(parseInt(wait) || 200, 50), 2000); // dRPC는 더 빠른 응답
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, waitTime);
  };
};

// ✅ dRPC 최적화된 폴링 기반 데이터 새로고침 헬퍼
export const createPollingRefresh = (callback, interval = 15000) => { // dRPC로 더 빈번한 폴링
  let isActive = true;
  let timeoutId = null;
  
  const refresh = async () => {
    if (!isActive) return;
    
    try {
      await callback();
    } catch (error) {
      console.warn('dRPC polling refresh failed:', error);
    }
    
    if (isActive) {
      timeoutId = setTimeout(refresh, interval);
    }
  };
  
  // 첫 번째 실행
  refresh();
  
  return {
    stop: () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    },
    restart: () => {
      if (!isActive) {
        isActive = true;
        refresh();
      }
    }
  };
};

// ✅ dRPC 최적화된 캐시 헬퍼
export const createSimpleCache = (ttl = 15000) => { // dRPC로 더 짧은 TTL
  const cache = new Map();
  
  return {
    get: (key) => {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
      }
      
      return item.value;
    },
    
    set: (key, value) => {
      cache.set(key, {
        value,
        expiry: Date.now() + ttl
      });
    },
    
    clear: () => {
      cache.clear();
    },
    
    size: () => cache.size
  };
};

// ✅ 모바일 지갑 감지 및 처리 유틸리티
export const MobileWalletUtils = {
  // 모바일 기기 감지
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    
    return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
           /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  },

  // DApp 브라우저 감지
  isDappBrowser: () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // 바이낸스 월렛 감지
    if (window.ethereum?.isBinance === true) {
      return true;
    }
    if (userAgent.includes('bnc/') || userAgent.includes('bmp/')) {
      return true;
    }
    
    // 일반적인 DApp 브라우저 감지
    // window.ethereum이 있으면 DApp 브라우저 (MetaMask, imToken 등)
    // window.web3만 있는 경우는 구분 불가능하므로 제외
    return !!window.ethereum;
  },

  // 특정 모바일 지갑 감지
  detectWalletApp: () => {
    if (typeof window === 'undefined') return null;
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    
    // Binance Wallet - 최우선 순위 (isMetaMask도 true일 수 있음)
    if (window.ethereum?.isBinance === true || 
        userAgent.includes('bnc/') || 
        userAgent.includes('bmp/')) {
      return 'binance';
    }
    
    // MetaMask Mobile
    if (window.ethereum?.isMetaMask && MobileWalletUtils.isMobile()) {
      return 'metamask';
    }
    
    // imToken
    if (window.ethereum?.isImToken || userAgent.includes('imtoken')) {
      return 'imtoken';
    }
    
    return null;
  },

  // 모바일 지갑 딥링크 생성
  generateDeepLink: (walletType, dappUrl) => {
    const encodedUrl = encodeURIComponent(dappUrl);
    
    const deepLinks = {
      metamask: `https://metamask.app.link/dapp/${dappUrl}`,
      imtoken: `imtokenv2://navigate/DappView?url=${encodedUrl}`,
      binance: `bnc://app.binance.com/cedefi/wc?dapp=${encodedUrl}`,
    };
    
    return deepLinks[walletType] || null;
  },

  // WalletConnect 세션 복구
  restoreWalletConnectSession: async () => {
    try {
      const wcSession = localStorage.getItem('walletconnect');
      if (wcSession) {
        const session = JSON.parse(wcSession);
        if (session?.connected) {
          console.log('Found existing WalletConnect session');
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to restore WalletConnect session:', error);
    }
    return false;
  },

  // 모바일 지갑 연결 힌트 메시지
  getMobileConnectionHint: (walletType) => {
    const hints = {
      metamask: '메타마스크 앱에서 브라우저 탭을 사용하거나 WalletConnect로 연결하세요.',
      imtoken: 'imToken 앱에서 브라우저 탭을 사용하거나 WalletConnect를 선택하세요.',
      default: '월렛 앱의 dApp 브라우저를 사용하거나 WalletConnect로 연결하세요.'
    };
    
    return hints[walletType] || hints.default;
  },

  // 트랜잭션 상태 저장 (페이지 새로고침 대비)
  saveTransactionState: (txHash, action, status = 'pending') => {
    try {
      const txStates = JSON.parse(localStorage.getItem('bgsc_tx_states') || '{}');
      txStates[txHash] = {
        hash: txHash,
        action,
        status,
        timestamp: Date.now()
      };
      localStorage.setItem('bgsc_tx_states', JSON.stringify(txStates));
    } catch (error) {
      console.error('Failed to save transaction state:', error);
    }
  },

  // 트랜잭션 상태 복구
  getTransactionState: (txHash) => {
    try {
      const txStates = JSON.parse(localStorage.getItem('bgsc_tx_states') || '{}');
      return txStates[txHash] || null;
    } catch (error) {
      console.error('Failed to get transaction state:', error);
      return null;
    }
  },

  // 모든 펜딩 트랜잭션 가져오기
  getPendingTransactions: () => {
    try {
      const txStates = JSON.parse(localStorage.getItem('bgsc_tx_states') || '{}');
      return Object.values(txStates).filter(tx => 
        tx.status === 'pending' && 
        Date.now() - tx.timestamp < 3600000 // 1시간 이내 것만
      );
    } catch (error) {
      console.error('Failed to get pending transactions:', error);
      return [];
    }
  },

  // 트랜잭션 상태 업데이트
  updateTransactionState: (txHash, status) => {
    try {
      const txStates = JSON.parse(localStorage.getItem('bgsc_tx_states') || '{}');
      if (txStates[txHash]) {
        txStates[txHash].status = status;
        txStates[txHash].updatedAt = Date.now();
        localStorage.setItem('bgsc_tx_states', JSON.stringify(txStates));
      }
    } catch (error) {
      console.error('Failed to update transaction state:', error);
    }
  },

  // 오래된 트랜잭션 정리
  cleanOldTransactions: () => {
    try {
      const txStates = JSON.parse(localStorage.getItem('bgsc_tx_states') || '{}');
      const oneHourAgo = Date.now() - 3600000;
      
      const cleaned = Object.entries(txStates).reduce((acc, [hash, tx]) => {
        if (tx.timestamp > oneHourAgo || tx.status === 'pending') {
          acc[hash] = tx;
        }
        return acc;
      }, {});
      
      localStorage.setItem('bgsc_tx_states', JSON.stringify(cleaned));
    } catch (error) {
      console.error('Failed to clean old transactions:', error);
    }
  }
};

// ✅ dRPC 환경 정보 로그 (개발 모드)
if (process.env.NODE_ENV === 'development') {
  SecurityUtils.secureLog('[Config] dRPC Optimized Utils Configuration:', {
    ROUND_CONFIG: {
      DURATION: ROUND_CONFIG.DURATION_DAYS,
      CYCLES_PER_YEAR: ROUND_CONFIG.getCyclesPerYear(),
      DURATION_TEXT: ROUND_CONFIG.getDurationTextKr()
    },
    currentStatus: getCurrentRoundStatus(),
    dynamicTexts: getDynamicText(),
    gasConfig: {
      DEFAULT_PRICE: GAS_CONFIG.DEFAULT_GAS_PRICE,
      UPDATE_INTERVAL: GAS_CONFIG.UPDATE_INTERVAL,
      FALLBACK_ENABLED: true
    },
    optimizations: {
      dRPCRateLimit: 'Increased (15 req/min)',
      pollingInterval: 'Reduced (15s)',
      cacheTimeout: 'Reduced (15s)',
      gasBufferMultiplier: 'Increased (+5%)'
    },
    premiumFeatures: {
      dRPCSupport: true,
      enhancedErrorHandling: true,
      improvedBGSCAccuracy: true,
      monthlyRoundOptimization: true
    },
    mobileSupport: {
      walletDetection: true,
      deepLinking: true,
      transactionRecovery: true,
      mobileOptimized: true
    }
  });
}