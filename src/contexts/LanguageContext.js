import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const language = 'en'; // Fixed to English only

  const value = {
    language,
    setLanguage: () => {}, // No-op function
    toggleLanguage: () => {}, // No-op function
    isKorean: false,
    isEnglish: true
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};