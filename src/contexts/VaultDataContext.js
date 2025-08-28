import React, { createContext, useContext } from 'react';
import { useVaultData as useVaultDataHook, useTokenBalance as useTokenBalanceHook } from '../hooks';

const VaultDataContext = createContext();

export const VaultDataProvider = ({ children }) => {
  // Single instance of vault data
  const vaultData = useVaultDataHook();
  // Pass vaultInfo to tokenBalance hook to avoid duplicate useVaultData call
  const tokenBalance = useTokenBalanceHook(vaultData.vaultInfo);

  // 통합된 refresh 함수들
  const refreshAllDataWithBalances = async () => {
    await Promise.all([
      vaultData.refreshAllData(),
      tokenBalance.refreshBalances()
    ]);
  };

  const refreshUserDataWithBalances = async () => {
    await Promise.all([
      vaultData.refreshUserData(),
      tokenBalance.refreshBalances()
    ]);
  };

  const refreshCriticalDataWithBalances = async () => {
    await Promise.all([
      vaultData.refreshCriticalData(),
      tokenBalance.refreshBalances()
    ]);
  };

  return (
    <VaultDataContext.Provider value={{ 
      ...vaultData, 
      tokenBalance,
      refreshAllData: refreshAllDataWithBalances,
      refreshUserData: refreshUserDataWithBalances,
      refreshCriticalData: refreshCriticalDataWithBalances
    }}>
      {children}
    </VaultDataContext.Provider>
  );
};

// Export hooks that use the context instead of creating new instances
export const useVaultData = () => {
  const context = useContext(VaultDataContext);
  if (!context) {
    throw new Error('useVaultData must be used within VaultDataProvider');
  }
  
  // Return everything except tokenBalance to maintain compatibility
  const { tokenBalance, ...vaultData } = context;
  return vaultData;
};

export const useTokenBalance = () => {
  const context = useContext(VaultDataContext);
  if (!context) {
    throw new Error('useTokenBalance must be used within VaultDataProvider');
  }
  return context.tokenBalance;
};