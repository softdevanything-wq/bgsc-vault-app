import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2px;
  margin-right: 12px;

  @media (max-width: 768px) {
    margin-right: 8px;
    padding: 1px;
  }
`;

const LanguageButton = styled.button`
  padding: 4px 10px;
  background: ${props => props.$active ? 'rgba(140, 90, 255, 0.2)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 32px;

  &:hover {
    color: #fff;
    background: ${props => props.$active ? 'rgba(140, 90, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)'};
  }

  @media (max-width: 768px) {
    padding: 2px 8px;
    font-size: 11px;
    min-width: 28px;
    height: 24px;
    display: ${props => !props.$active ? 'none' : 'block'};
  }
`;

const HeaderLanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };
  
  // PC에서는 둘 다 표시, 모바일에서는 반대 언어만 표시
  if (isMobile) {
    return (
      <ToggleContainer onClick={toggleLanguage} style={{ padding: '1px', height: '30px', display: 'flex', alignItems: 'center' }}>
        <LanguageButton $active={true} style={{ height: '28px', padding: '0 10px', display: 'flex', alignItems: 'center', background: 'transparent', fontSize: '12px' }}>
          {language === 'ko' ? 'EN' : 'KR'}
        </LanguageButton>
      </ToggleContainer>
    );
  }
  
  return (
    <ToggleContainer onClick={toggleLanguage}>
      <LanguageButton 
        $active={language === 'ko'} 
        onClick={(e) => {
          e.stopPropagation();
          setLanguage('ko');
        }}
      >
        KR
      </LanguageButton>
      <LanguageButton 
        $active={language === 'en'} 
        onClick={(e) => {
          e.stopPropagation();
          setLanguage('en');
        }}
      >
        EN
      </LanguageButton>
    </ToggleContainer>
  );
};

export default HeaderLanguageToggle;