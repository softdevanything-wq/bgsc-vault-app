import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WalletDisconnectedAlert = () => {
  const { language } = useLanguage();

  return (
    <div className="main-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: '16px',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {language === 'ko' 
            ? '기능 사용을 위해 지갑 연결을 해주세요. 기기의 통신 에러로 지갑 연결이 끊어지는 경우 재연결하세요.' 
            : 'Please connect your wallet to use the feature. If your wallet is disconnected due to a communication error on your device, reconnect it.'}
        </p>
      </div>
    </div>
  );
};

export default WalletDisconnectedAlert;