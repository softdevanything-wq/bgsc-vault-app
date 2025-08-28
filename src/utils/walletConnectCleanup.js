// WalletConnect 세션 정리 유틸리티
export const cleanupWalletConnectSessions = () => {
  try {
    // WalletConnect v2 관련 모든 localStorage 항목 정리
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('walletconnect') || 
        key.includes('wc@') ||
        key.includes('WALLETCONNECT') ||
        key.includes('recentWalletIds')
      )) {
        keysToRemove.push(key);
      }
    }
    
    // 찾은 모든 WalletConnect 관련 항목 제거
    keysToRemove.forEach(key => {
      console.log('Removing WalletConnect session:', key);
      localStorage.removeItem(key);
    });
    
    // 세션 스토리지도 정리
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('walletconnect') || key.includes('wc@'))) {
        sessionStorage.removeItem(key);
      }
    }
    
    console.log(`✅ Cleaned up ${keysToRemove.length} WalletConnect sessions`);
    return true;
  } catch (error) {
    console.error('Failed to cleanup WalletConnect sessions:', error);
    return false;
  }
};

// 특정 세션만 정리
export const cleanupInvalidSession = (topic) => {
  try {
    const wcKeys = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(topic)) {
        wcKeys.push(key);
      }
    }
    
    wcKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`✅ Removed invalid session with topic: ${topic}`);
  } catch (error) {
    console.error('Failed to cleanup invalid session:', error);
  }
};

// WalletConnect 에러 핸들러
export const handleWalletConnectError = (error) => {
  if (error.message && error.message.includes("session topic doesn't exist")) {
    // 세션 토픽 추출
    const topicMatch = error.message.match(/[a-f0-9]{64}/);
    if (topicMatch) {
      cleanupInvalidSession(topicMatch[0]);
    } else {
      // 모든 세션 정리
      cleanupWalletConnectSessions();
    }
    
    // 페이지 새로고침 권장
    console.log('🔄 Please refresh the page to reconnect');
    return true;
  }
  return false;
};