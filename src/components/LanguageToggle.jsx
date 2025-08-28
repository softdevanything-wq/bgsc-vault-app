import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 88px;
  right: 24px;
  z-index: 9999;
  
  width: 56px;
  height: 56px;
  border-radius: 28px;
  
  background: #1a1a1a;
  color: white;
  border: 2px solid #333;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #2a2a2a;
    border-color: #444;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    bottom: 72px;
    right: 20px;
    width: 48px;
    height: 48px;
    font-size: 14px;
  }
`;

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <FloatingButton onClick={toggleLanguage} aria-label="Toggle language">
      {language === 'ko' ? 'EN' : 'KR'}
    </FloatingButton>
  );
};

export default LanguageToggle;