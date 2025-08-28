// Toast message translations
export const toastMessages = {
  ko: {
    approval: {
      alreadyPending: '이미 승인 처리 중입니다. 잠시만 기다려주세요.',
      requesting: 'BGSC 토큰 사용 권한을 요청 중...\n\n볼트가 사용자의 BGSC를 사용할 수 있도록\n지갑에서 허가를 받고 있습니다.',
      success: '토큰 승인 완료!\n\n이제 볼트가 BGSC를 사용할 수 있습니다.\n다시 버튼을 눌러 입금을 진행해주세요!'
    },
    deposit: {
      processing: 'BGSC를 볼트에 예치하는 중...\n\n현재 라운드 참여 대기열에 등록됩니다.',
      loading: 'BGSC를 볼트에 예치하는 중...\n\n현재 라운드 참여 대기열에 등록됩니다.',
      success: (amount, round) => `예치 성공!\n\n${amount} BGSC가 볼트에 예치되었습니다.\n\n라운드 ${round - 2} 종료 시 포인트로 자동 변환됩니다.`,
      emptyAmount: '예치할 금액을 입력해주세요\n\n최소 10,000 BGSC 이상 입력해주세요.',
      alreadyProcessing: '이미 처리 중입니다\n\n현재 진행 중인 작업이 완료될 때까지\n잠시만 기다려주세요.',
      invalidAmount: '올바른 금액을 입력해주세요',
      minimumAmount: (amount) => `최소 예치 금액 미달\n\n최소 10,000 BGSC 이상 예치해야 합니다.\n현재 입력: ${amount} BGSC`,
      insufficientBalance: (tokenName, currentBalance, amount) => `${tokenName} 잔액 부족\n\n현재 잔액: ${currentBalance} ${tokenName}\n요청 금액: ${amount} ${tokenName}`,
      preparationError: '입금 준비 중 오류가 발생했습니다',
      approvalRequired: 'BGSC 토큰 사용 승인이 필요합니다\n\n승인 버튼을 먼저 클릭해주세요.'
    },
    instantWithdraw: {
      emptyAmount: '출금 금액을 입력해주세요',
      loading: '현재 라운드 참여 취소 중...\n\n현재 라운드에 예치한 BGSC를\n지갑으로 반환합니다.',
      success: (amount) => `참여 취소 완료!\n\n${amount} BGSC가 지갑으로 반환되었습니다.`
    },
    withdraw: {
      emptyAmount: '출금할 포인트 수량을 입력해주세요',
      requestingConversion: '포인트 변환 요청 중...\n\n보유 포인트를 BGSC로 변환하는\n요청을 등록합니다.',
      conversionSuccess: (amount, round, timeLeft) => `포인트 변환 요청 완료!\n\n${amount} 포인트가 변환 대기열에 등록되었습니다.\n\n라운드 ${round - 2} 종료 시 BGSC로 자동 변환됩니다.\n예상 대기 시간: ${timeLeft}`,
      processing: 'BGSC 출금 처리 중...',
      success: (amount) => `출금 완료!\n\n${amount} BGSC가 지갑으로 전송되었습니다.`
    },
    redeem: {
      emptyAmount: '상환할 포인트 수량을 입력해주세요',
      processing: '포인트 상환 처리 중...\n\n볼트에 보관된 포인트를\n내 계정으로 이동합니다.',
      success: (amount) => `포인트 상환 완료!\n\n${amount} 포인트가 내 계정으로 이동되었습니다.\n\n출금을 원하시면 Withdraw 탭에서\nBGSC로 변환 요청하세요.`,
      processingAll: '모든 포인트 상환 처리 중...\n\n볼트에 보관된 모든 포인트를\n내 계정으로 이동합니다.',
      successAll: (amount) => `모든 포인트 상환 완료!\n\n${amount} 포인트가 내 계정으로 이동되었습니다.\n\n출금을 원하시면 Withdraw 탭에서\nBGSC로 변환 요청하세요.`
    },
    validation: {
      minimumAmount: (min) => `최소 ${min} 이상 입력하세요`
    },
    mobile: {
      checkWallet: '지갑 앱에서 트랜잭션을 확인해주세요',
      connectionHint: '지갑 연결에 문제가 있나요? 지갑 앱의 dApp 브라우저를 사용해보세요.',
      transactionDelayed: '트랜잭션 확인이 지연되고 있습니다. 지갑 앱을 확인해주세요.',
      approvalHint: '승인 요청이 표시되지 않나요? 지갑 앱을 열어 확인해주세요.'
    }
  },
  en: {
    approval: {
      alreadyPending: 'Approval already pending. Please wait.',
      requesting: 'Requesting BGSC token approval...\n\nAuthorizing the vault to use your BGSC tokens.',
      success: 'Token approval complete!\n\nThe vault can now use BGSC.\nClick the button again to proceed with deposit!'
    },
    deposit: {
      processing: 'Depositing BGSC to vault...\n\nRegistering in current round participation queue.',
      loading: 'Depositing BGSC to vault...\n\nRegistering in current round participation queue.',
      success: (amount, round) => `Deposit successful!\n\n${amount} BGSC has been deposited to the vault.\n\nWill automatically convert to Points when Round ${round - 2} ends.`,
      emptyAmount: 'Please enter deposit amount\n\nMinimum 10,000 BGSC required.',
      alreadyProcessing: 'Already processing\n\nPlease wait for current operation to complete.',
      invalidAmount: 'Please enter valid amount',
      minimumAmount: (amount) => `Below minimum deposit\n\nMinimum 10,000 BGSC required.\nCurrent input: ${amount} BGSC`,
      insufficientBalance: (tokenName, currentBalance, amount) => `Insufficient ${tokenName} balance\n\nCurrent balance: ${currentBalance} ${tokenName}\nRequested amount: ${amount} ${tokenName}`,
      preparationError: 'Error preparing deposit'
    },
    instantWithdraw: {
      emptyAmount: 'Please enter withdrawal amount',
      loading: 'Canceling current round participation...\n\nReturning deposited BGSC to your wallet.',
      success: (amount) => `Participation canceled!\n\n${amount} BGSC has been returned to your wallet.`
    },
    withdraw: {
      emptyAmount: 'Please enter Points to withdraw',
      requestingConversion: 'Requesting Point conversion...\n\nRegistering request to convert Points to BGSC.',
      conversionSuccess: (amount, round, timeLeft) => `Point conversion request complete!\n\n${amount} Points queued for conversion.\n\nWill automatically convert to BGSC when Round ${round - 2} ends.\nEstimated wait time: ${timeLeft}`,
      processing: 'Processing BGSC withdrawal...',
      success: (amount) => `Withdrawal complete!\n\n${amount} BGSC has been transferred to your wallet.`
    },
    redeem: {
      emptyAmount: 'Please enter Points to redeem',
      processing: 'Processing Point redemption...\n\nMoving Points from vault to your account.',
      success: (amount) => `Point redemption complete!\n\n${amount} Points have been moved to your account.\n\nTo withdraw, request BGSC conversion in the Withdraw tab.`,
      processingAll: 'Processing all Points redemption...\n\nMoving all Points from vault to your account.',
      successAll: (amount) => `All Points redeemed!\n\n${amount} Points have been moved to your account.\n\nTo withdraw, request BGSC conversion in the Withdraw tab.`
    },
    validation: {
      minimumAmount: (min) => `Minimum ${min} required`
    },
    mobile: {
      checkWallet: 'Please check the transaction in your wallet app',
      connectionHint: 'Having connection issues? Try using your wallet\'s dApp browser.',
      transactionDelayed: 'Transaction confirmation is delayed. Please check your wallet app.',
      approvalHint: 'Not seeing the approval request? Open your wallet app to check.'
    }
  }
};

// Helper function to get current language from localStorage
const getCurrentLanguage = () => {
  try {
    return localStorage.getItem('bgsc-vault-language') || 'ko';
  } catch {
    return 'ko';
  }
};

// Helper function to get toast message
export const getToastMessage = (key, language, ...params) => {
  // If language is not provided, get it from localStorage
  const lang = typeof language === 'string' && (language === 'ko' || language === 'en') 
    ? language 
    : getCurrentLanguage();
  
  // If the second parameter is not a language, treat it as a parameter
  const actualParams = typeof language === 'string' && (language === 'ko' || language === 'en')
    ? params
    : [language, ...params].filter(p => p !== undefined);
  
  const keys = key.split('.');
  let message = toastMessages[lang] || toastMessages.ko;
  
  for (const k of keys) {
    message = message?.[k];
    if (!message) break;
  }
  
  // If message is a function, call it with parameters
  if (typeof message === 'function') {
    return message(...actualParams);
  }
  
  return message || key;
};