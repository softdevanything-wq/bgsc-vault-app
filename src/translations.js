export const translations = {
  ko: {
    // Common
    common: {
      loading: '로딩 중...',
      error: '오류',
      retry: '다시 시도',
      refresh: '새로고침',
      connectWallet: '지갑 연결',
      disconnect: '연결 해제',
      copy: '복사',
      copied: '복사됨',
      confirm: '확인',
      cancel: '취소',
      close: '닫기',
      max: 'MAX',
      balance: '잔액',
      amount: '수량',
      value: '가치',
      total: '총합',
      available: '사용 가능',
      insufficient: '잔액 부족',
      success: '성공',
      failed: '실패',
      pending: '대기 중',
      completed: '완료',
      approved: '승인됨',
      rejected: '거부됨',
      transaction: '트랜잭션',
      transactions: '트랜잭션',
      history: '내역',
      details: '상세 정보',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      submit: '제출',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      date: '날짜',
      time: '시간',
      status: '상태',
      type: '유형',
      from: '보낸 사람',
      to: '받는 사람',
      fee: '수수료',
      gas: '가스',
      hash: '해시',
      block: '블록',
      network: '네트워크',
      mainnet: '메인넷',
      testnet: '테스트넷',
      wallet: '지갑',
      account: '계정',
      address: '주소',
      deposit: '예치',
      withdraw: '출금',
      claim: '수령',
      stake: 'Stake',
      unstake: 'Unstake',
      rewards: '보상',
      earnings: '수익',
      apy: 'APY',
      apr: 'APR',
      tvl: 'TVL',
      price: '가격',
      marketCap: '시가총액',
      volume: '거래량',
      liquidity: '유동성',
      slippage: '슬리피지',
      settings: '설정',
      language: '언어',
      theme: '테마',
      about: '소개',
      help: '도움말',
      faq: 'FAQ',
      contact: '문의',
      terms: '이용약관',
      privacy: '개인정보처리방침',
      demo: 'DEMO',
      live: 'LIVE',
      bnb: 'BNB',
      bgsc: 'BGSC',
      usdt: 'USDT',
      usd: 'USD',
      krw: 'KRW',
      processing: '처리 중...',
      addressCopied: '주소가 복사되었습니다',
      gasFee: '가스비',
    },
    
    // Error messages
    errors: {
      general: '문제가 발생했습니다',
      network: '네트워크 오류',
      timeout: '요청 시간 초과',
      notFound: '찾을 수 없음',
      unauthorized: '권한 없음',
      forbidden: '접근 금지',
      validation: '유효성 검사 실패',
      insufficientBalance: '잔액이 부족합니다',
      transactionFailed: '트랜잭션 실패',
      connectionFailed: '연결 실패',
      walletNotConnected: '지갑이 연결되지 않았습니다',
      unsupportedNetwork: '지원하지 않는 네트워크',
      userRejected: '사용자가 거부했습니다',
      unknown: '알 수 없는 오류',
      wrongAmount: '잘못된 금액입니다',
      tooManyAttempts: '너무 많은 시도',
      contractError: '컨트랙트 오류',
      notWhitelisted: '화이트리스트에 없습니다',
      copyFailed: '복사에 실패했습니다',
      invalidAddress: '유효하지 않은 주소 형식입니다',
    },
    
    // Access Denied
    accessDenied: {
      title: 'Access Denied',
      subtitle: '이 볼트는 화이트리스트 전용입니다',
    },
    
    // Landing Page
    landing: {
      title: 'BGSC Vault',
      subtitle: '안전하고 투명한 DeFi 수익 창출',
      heroTitle: 'Bugs Coin\nDeposit Vault',
      heroSubtitle: 'BGSC 볼트 라운드별 인센티브 지급',
      heroDescription: '스마트 컨트랙트 기반 자동화된 보상 분배 프로토콜',
      eventBadge: '차세대 블록체인 기술 기반 DeFi 프로토콜',
      countdownTitle: '프로토콜 오픈까지',
      countdownDays: '일',
      countdownHours: '시간',
      countdownMinutes: '분',
      countdownSeconds: '초',
      ctaDeposit: '예치하기',
      ctaLearnMore: '자세히 알아보기',
      
      nav: {
        howItWorks: '작동 방식',
        security: '보안',
      },
      
      stats: {
        tvl: '총 예치 금액',
        apy: '연 수익률',
        users: '참여자 수',
        secured: '보호된 자산',
      },
      
      heroMetrics: {
        bscBased: 'BSC 기반',
        bscSubtitle: '고성능 프로토콜',
        bgscReward: 'BGSC 지급',
        bgscSubtitle: '라운드별 프로토콜 보상',
        uptime: '99.9%',
        uptimeSubtitle: '시스템',
        uptimeLabel: '가동률',
        pointBased: 'Point 기반',
        pointSubtitle: '프로토콜 아키텍처',
      },
      
      features: {
        title: '주요 특징',
        secure: {
          title: '안전한 보관',
          desc: '멀티시그와 감사를 통한 자산 보호'
        },
        transparent: {
          title: '투명한 운영',
          desc: '모든 거래 내역 실시간 공개'
        },
        yield: {
          title: '최적화된 수익',
          desc: '검증된 전략으로 수익 극대화'
        },
        simple: {
          title: '간편한 사용',
          desc: '복잡한 과정 없이 쉽게 참여'
        }
      },
      
      howItWorks: {
        title: '이용 방법',
        sectionBadge: '3-Tier Algo System',
        sectionTitle: '정교한 3단계',
        sectionTitleHighlight: '알고리즘 시스템',
        sectionSubtitle: '기관급 수준의 자동화된\n가치 창출 메커니즘으로 운영됩니다',
        step1: {
          number: '01',
          title: '스마트 예치',
          desc: 'BGSC를 알고리즘 최적화된 볼트에\n예치하여 프리미엄 Point 토큰 획득'
        },
        step2: {
          number: '02',
          title: 'AI 최적화 엔진',
          desc: '생태계 보상이 효율적 스테이킹을\n통해 Point 토큰에 반영'
        },
        step3: {
          number: '03',
          title: '정교한 환전',
          desc: '라운드 완료시 Point 토큰을\nBGSC로 정확히 변환하여 프로토콜 완성'
        },
        systemStats: {
          stability: '99.97%',
          stabilityLabel: '시스템 안정성',
          processingSpeed: '< 3s',
          processingLabel: '트랜잭션 처리 속도',
          uptime: '24/7',
          uptimeLabel: '자율 운영 시간'
        }
      },
      
      yieldSection: {
        badge: '예상 수익률 안내',
        subtitle: '현재 TVL 기준 예상 수익률을 확인하세요',
        annualYield: '예상 연간 수익률',
        monthlyYield: '월간 예상 수익률',
        tvl: 'BGSC TVL (총 예치량)',
        tvlAdjusted: 'BGSC TVL (총 예치량) (조정됨)',
        chartTitle: '월별 Point 가치 성장 예상 (6개월)',
        currentValue: '현재 1 Point 가치: ',
        monthlyGrowth: '월 성장률: ',
        sixMonthProjection: '6개월 후 예상: ',
        month: '개월',
        monthPrefix: '월',
        monthSuffix: '개월',
        clickForDetails: '클릭하여 상세 정보 확인',
        tvlSimulation: 'TVL 시뮬레이션',
        tvlAdjustment: '총 예치량 조정',
        resetToCurrent: '현재값으로 리셋',
        totalRewardPool: '총 보상 풀 (6개월)',
        monthlyDistribution: '월간 분배량',
        description: '현재 총 예치량',
        descriptionReward: '에 대해 월간',
        descriptionDistribution: '가 보상으로 분배됩니다.',
        importantNotice: '중요 안내',
        noticeContent: '• 위 수익률은 현재 TVL 기준 예상치로, 확정 수익률이 아닙니다.\n• 실제 수익률은 TVL 변동에 따라 크게 달라질 수 있습니다.\n• TVL이 증가하면 수익률은 감소하고, TVL이 감소하면 수익률은 증가합니다.\n• 보상은 매 라운드 종료 후 예치자들에게 비례 분배됩니다.',
        calculatorTitle: '투자 수익 계산기',
        calculatorLabel: '예치 수량 (BGSC)',
        calculatorHint: '▼ 아래에 원하는 수량을 입력하세요',
        monthlyReturn: '예상 월 수익',
        sixMonthReturn: '예상 6개월 수익'
      },
      
      calculator: {
        title: '수익 계산기',
        inputAmount: '예치 금액',
        duration: '예치 기간',
        days: '일',
        months: '개월',
        years: '년',
        estimatedReturn: '예상 수익',
        totalValue: '총 가치',
        disclaimer: '* 실제 수익은 시장 상황에 따라 달라질 수 있습니다'
      },
      
      quantumReturn: {
        badge: 'Quantum Return',
        title: '차세대 스마트 컨트랙트 기반\n가치 창출 엔진',
        titleHighlight: '퀀텀 리턴',
        subtitle: 'Point 2.0 혁신적 가치 증폭 시스템',
        enterprisePerformance: '엔터프라이즈급 성능 분석',
        responseSpeed: '응답 속도',
        typical: '일반적',
        throughput: '처리량(TPS)',
        enterprise: '엔터프라이즈',
        bugsVault: '벅스코인 볼트',
        innovative: '혁신적',
        roundCycle: '라운드 주기',
        stableReturn: '(안정적 수익)',
        verifiedTech: '검증된 기술력',
        smartContractAutomation: '스마트 컨트랙트 자동화를 통한 보상 분배',
        techStability: '검증된 기술 안정성 확보',
        hyperIntelligent: '하이퍼 인텔리전트 시스템',
        valueAmplification: '가치 증폭 방식',
        smartContractBased: '스마트 컨트랙트 기반',
        incentiveEngine: '인센티브 엔진',
        ecosystem: '생태계 → Point 2.0',
        valueRealization: '가치 실현',
        precisionExchange: '정밀 BGSC 환전',
        transparency: '투명성 레벨',
        contractTransparency: '컨트랙트 100%',
        techInnovation: '기술 혁신성',
        securityGrade: '보안 등급',
        nextGenFuture: '차세대 기술의 미래',
        futureDescription: '최첨단 블록체인 기술과 AI 알고리즘의 완벽한 융합으로 탄생한 혁신적 프로토콜. 스마트 컨트랙트 자동화와 분산형 거버넌스를 통해',
        techInnovationHighlight: '차세대 기술 혁신',
        realize: '을 실현합니다.'
      },
      
      security: {
        badge: 'Security',
        title: '높은 보안\n아키텍처',
        titleHighlight: '아키텍처',
        subtitle: '전세계 최고 수준의 프로토콜과 스마트 컨트랙트를 융합한 시스템',
        verifiedCodebase: '검증된 코드베이스',
        verifiedAmount: '3억 달러+ 검증 완료',
        verifiedDesc: 'Theo Protocol과 Ribbon Finance의 배틀테스트된 스마트컨트랙트를 기반으로 구축',
        nextGenBsc: '차세대 BSC 보안',
        latestStandards: '최신 보안 표준 준수',
        bscDesc: 'Binance Smart Chain의 최신 표준과 고급 프로토콜을 적용',
        hyperTransparency: '하이퍼 투명성',
        fullTransparency: '100% 투명성 보장',
        transparencyDesc: '모든 거래와 Point 가치 변동이 실시간 온체인 검증 가능한 완전 투명 운영 시스템',
        enterpriseMetrics: 'BGSC 엔터프라이즈급 지표',
        transactions: '트랜잭션',
        dailyUsers: '일일 활성 사용자',
        relatedProjects: '관련 프로젝트',
        regulatory: '규제 적합성',
        established: '확립'
      },
      
      partners: {
        badge: 'Trusted Partnerships',
        title: '신뢰받는 파트너십'
      },
      
      faq: {
        title: '자주 묻는 질문',
        subtitle: '정교한 시스템에 대한 핵심 질문들',
        q1: {
          q: '최소 참여 임계값은 얼마인가요?',
          a: '최소 10,000 BGSC부터 프로토콜에 참여할 수 있으며, 상한선은 없습니다. 더 많은 토큰을 스테이킹할수록 더 높은 프로토콜 보상을 받을 수 있습니다.'
        },
        q2: {
          q: '프로토콜 메커니즘은 어떻게 작동하나요?',
          a: '스마트 컨트랙트 기반의 3단계 시스템을 통해 BGSC를 스테이킹하고, 생태계 보상을 Point 토큰에 반영하여 프로토콜 효율을 높입니다.'
        },
        q3: {
          q: 'Point 변환 프로세스는 어떻게 되나요?',
          a: '라운드 완료 시 Point 토큰을 정확한 비율로 BGSC로 자동 변환됩니다. 모든 과정은 온체인에서 투명하게 처리됩니다.'
        },
        q4: {
          q: '보안은 어떻게 보장되나요?',
          a: '보안 아키텍처와 3억 달러 이상 검증된 스마트 컨트랙트를 기반으로 A+ 등급의 보안을 제공합니다.'
        }
      },
      
      cta: {
        title: '지금 시작하세요',
        subtitle: 'BGSC Vault와 함께 안전하고 투명한 수익을 경험하세요',
        button: '예치 시작하기'
      },
      
      footer: {
        subtitle: '차세대 스마트 컨트랙트 기반 Web3 DeFi 프로토콜\n전통 시스템과 혁신 기술의 완벽한 융합',
        disclaimer: '본 프로토콜은 실험적 기술을 포함하고 있습니다. 스마트 컨트랙트 리스크가 존재할 수 있으며, 기술적 문제가 발생할 수 있습니다. 모든 블록체인 프로토콜은 예기치 않은 버그나 해킹의 위험이 있습니다. 모든 투자는 본인의 올바른 가치 판단이 필요합니다.',
        disclaimerMobile: '본 프로토콜은 실험적 기술을 포함하고 있습니다. 스마트 컨트랙트 리스크가 존재할 수 있으며, 기술적 문제가 발생할 수 있습니다. 모든 블록체인 프로토콜은 예기치 않은 버그나 해킹의 위험이 있습니다. 모든 투자는 본인의 올바른 가치 판단이 필요합니다.',
        copyright: '© 2025 Aden Bugs Vault Protocol. All rights reserved.',
        links: {
          docs: '문서',
          github: 'GitHub',
          discord: 'Discord',
          telegram: 'Telegram',
          twitter: 'Twitter'
        }
      }
    },
    
    // Main Page (Dashboard)
    main: {
      title: 'Dashboard',
      welcome: '환영합니다',
      
      tabs: {
        deposit: '1) BGSC 예치',
        redeem: '2) 포인트 수령',
        convert: '3) 포인트 변환',
        withdraw: '4) BGSC 출금',
        mypage: '5) 내 정보',
      },
      
      stats: {
        title: '내 자산 현황',
        deposited: '예치 금액',
        earnings: '수익',
        shares: '보유 Point',
        nextRound: '다음 라운드',
        currentRound: '현재 라운드',
        roundEnds: '라운드 종료',
        daysLeft: '일 남음',
        hoursLeft: '시간 남음',
        minutesLeft: '분 남음',
        bgscVaultBalance: 'BGSC 볼트 잔액',
        totalPoints: '총 포인트',
        bgscTvl: 'BGSC TVL',
        ownedPoints: '보유한 포인트',
        unredeemed: '미수령 포인트',
        currentDeposit: '변환 대기 BGSC',
        claimableBgsc: '출금 가능 BGSC',
        annualOperatingProfit: '현재 보유 포인트',
        vaultStored: '볼트 보관 중',
        pendingConversion: 'Point 변환 대기',
        withdrawableFromVault: '볼트에서 출금 가능',
        liveTrading: '실시간',
        ownedPoints: '보유 포인트',
        round: '라운드',
        next: '다음',
        bgscPerPoint: 'BGSC/Point',
      },
      
      vault: {
        title: 'Vault 정보',
        totalDeposited: '총 예치 금액',
        totalShares: '총 Point',
        sharePrice: 'Point 가격',
        performance: '성과',
        daily: '일간',
        weekly: '주간',
        monthly: '월간',
        allTime: '전체',
      },
      
      actions: {
        deposit: '예치',
        withdraw: '출금',
        claim: '수령',
        compound: '복리',
        depositTitle: '자산 예치하기',
        withdrawTitle: '자산 출금하기',
        selectToken: '토큰 선택',
        enterAmount: '금액 입력',
        willReceive: '받을 금액',
        exchangeRate: '환율',
        estimatedGas: '예상 가스비',
        approve: '승인',
        approving: '승인 중...',
        depositing: '예치 중...',
        withdrawing: '출금 중...',
        confirmDeposit: '예치 확인',
        confirmWithdraw: '출금 확인',
        depositSuccess: '예치가 완료되었습니다',
        withdrawSuccess: '출금이 완료되었습니다',
        approveFailed: '승인 실패',
        depositFailed: '예치 실패',
        withdrawFailed: '출금 실패',
        redeem: '수령',
      },
      
      deposit: {
        title: '1. 볼트 프로토콜 예치',
        formTitle: '1. 볼트 프로토콜 예치',
        description: 'BGSC를 예치하여 안정적인 수익을 얻으세요',
        pointIssuanceNotice: '포인트 발행 안내',
        shareIssuanceNotice: 'Point 발행 안내', // deprecated
        immediately: '입금 즉시: 현재 라운드 참여 대기열에 등록됩니다',
        roundEnd: '{round} 종료 시: BGSC가 포인트로 자동 변환됩니다',
        afterConversion: '변환 완료 후: 포인트를 BGSC로 교환하여 출금할 수 있습니다',
        expectedTime: '예상 대기 시간:',
        depositForOthers: '다른 계정을 위해 참여',
        recipientAddress: '수령인 주소',
        recipientAddressLabel: '수령인 주소',
        participationAmount: '참여할 금액',
        minimum: '최소',
        minimumAmount: '최소',
        availableBalance: '사용 가능',
        expectedPoints: '예상 포인트',
        expectedPointsLabel: '예상 포인트',
        expectedShares: 'Expected Points', // deprecated
        expectedSharesLabel: 'Expected Points', // deprecated
        currentPrice: '현재 가격',
        currentPriceLabel: '현재 가격',
        approvalRequired: '먼저 {token} 토큰 사용을 승인해야 합니다. 승인 완료 후 같은 버튼을 다시 눌러 입금을 진행해주세요.',
        approvalPending: '토큰 승인 처리 중입니다. 승인 완료 후 같은 버튼을 다시 눌러 입금을 진행해주세요.',
        approvalComplete: '토큰 승인이 완료되었습니다. 이제 입금을 진행할 수 있습니다.',
        approveToken: '{token} 사용 승인하기',
        approvingToken: '토큰 승인 중...',
        processingApproval: '승인 처리 중...',
        depositWithToken: '{token}로 입금하기',
        joinWith: '{token}로 참여',
      },
      
      instantWithdraw: {
        title: '현재 라운드 예치 취소',
        description: '{round}에 참여한 입금분을 라운드 종료 전에 회수할 수 있습니다',
        canWithdraw: '참여 취소 가능',
        cannotWithdraw: '참여 취소 불가능',
        availableTime: '참여 취소 가능 시간:',
        currentRoundDeposit: '현재 라운드 입금',
        currentRoundDepositLabel: '현재 라운드 입금',
        depositedInRound: 'Round {round}에서 입금한 금액',
        noDepositsInRound: '현재 라운드에 입금한 금액이 없습니다',
        withdrawAmount: '출금 금액',
        withdrawAmountLabel: '출금 금액',
        availableLabel: '사용 가능',
        notAvailable: '참여 취소 불가능',
        noDepositToCancel: '취소할 입금 없음',
        cancelAndWithdraw: '취소 및 출금',
      },
      
      redeem: {
        title: '2. 포인트 수령',
        description: '이전 라운드에서 참여한 BGSC가 포인트로 변환되어 볼트에 저장됩니다. 해당 포인트를 내 계정으로 출금받을 수 있습니다.',
        completedRounds: '완료된 라운드',
        shareConversionComplete: '포인트 변환 완료 → 바로 수령 가능',
        currentRound: '현재 라운드',
        roundEndConversion: '라운드 종료 시 포인트로 변환 → 다음 라운드에 수령 가능',
        unredeemedPoints: '미수령 포인트',
        unredeemedPointsLabel: '미수령 포인트',
        points: '포인트',
        noPointsAvailable: '수령 가능한 포인트가 없습니다. 먼저 볼트에 참여하거나 라운드가 완료될 때까지 기다려주세요.',
        unredeemedShares: 'Unredeemed Points', // deprecated
        unredeemedSharesLabel: 'Unredeemed Points', // deprecated
        shares: 'Shares', // deprecated
        noSharesAvailable: '수령 가능한 Point가 없습니다. 먼저 볼트에 참여하거나 라운드가 완료될 때까지 기다려주세요.', // deprecated
        conversionRate: '전환율',
        conversionRateLabel: '전환율',
        instant: '즉시',
        instantLabel: '즉시',
        processing: '처리',
        processingLabel: '처리',
        bgscConvertedMessage: 'BGSC가 포인트로 변환되었습니다. 포인트를 수령해주세요.',
        redeemAllPoints: '모든 포인트 수령',
        noPointsToRedeem: '수령할 포인트 없음',
        redeemAllShares: 'Redeem All Points', // deprecated
        noSharesToRedeem: 'No Points to Redeem', // deprecated
      },
      
      withdraw: {
        step1Title: '3. 포인트 변환 요청',
        step1Description: '포인트 변환 요청시 다음 {duration} 라운드에서 BGSC로 변환됩니다. 라운드 전환 이후 볼트에서 BGSC 출금이 가능합니다.\n\n⚠️ 주의: 포인트 변환 요청은 다음 라운드 볼트 참여를 취소하는 것과 같습니다.\n컨트랙트 요청 후에는 절대 취소가 불가능합니다! \n신중하게 결정해주세요.',
        yourPoints: '내 포인트',
        yourPointsLabel: '내 포인트',
        currentPoints: '현재 보유 포인트',
        noPointsToConvert: '변환할 포인트가 없습니다. 먼저 포인트를 수령(Redeem)받으세요.',
        yourShares: 'Your Points', // deprecated
        yourSharesLabel: 'Your Points', // deprecated
        currentShares: '현재 보유 Point', // deprecated
        noSharesToConvert: '변환할 Point가 없습니다. 먼저 Point를 수령(Redeem)받으세요.', // deprecated
        participationAmount: '참여할 금액',
        availableLabel: '사용 가능',
        estimatedValue: '예상 가치',
        estimatedValueLabel: '예상 가치',
        processingTime: '처리 시간',
        processingTimeLabel: '처리 시간',
        totalGas: '총 가스',
        totalGasLabel: '총 가스',
        noPointsAvailable: '사용 가능한 포인트 없음',
        requestPointConversion: '포인트 변환 요청',
        noSharesAvailable: 'No Points Available', // deprecated
        requestShareConversion: 'Request Point Conversion', // deprecated
        step2Title: '4. BGSC 출금 신청',
        step2Description: '포인트가 BGSC로 변환되어 볼트에 저장됩니다.',
        withdrawAvailable: '출금 가능',
        bgscWithdrawAvailable: '{amount} BGSC가 즉시 출금 가능합니다.',
        conversionPending: '변환 대기 중',
        pointsConversionPending: '{amount} 포인트가 Round {round}에서 BGSC로 변환 대기 중입니다.\n예상 대기 시간: {time}',
        sharesConversionPending: '{amount} Points가 Round {round}에서 BGSC로 변환 대기 중입니다.\n예상 대기 시간: {time}', // deprecated
        noConversionRequest: '변환 요청 없음',
        noWithdrawRequest: '변환된 수량이 없습니다.\n먼저 Point 변환을 요청해주세요.',
        conversionComplete: '변환 완료',
        conversionCompleteLabel: '변환 완료',
        vaultBalance: '볼트 잔액',
        vaultBalanceLabel: '볼트 잔액',
        processingWithdraw: '출금 처리 중...',
        noBgscToWithdraw: '출금할 BGSC 없음',
        withdrawBgscAmount: '{amount} BGSC 출금',
        withdrawProcess: '출금 과정',
        pointConversionRequest: '포인트 변환 요청',
        pointToQueue: '내 포인트 → 대기열 등록',
        shareConversionRequest: 'Point 변환 요청', // deprecated
        shareToQueue: '내 Point → 대기열 등록', // deprecated
        bgscConversion: 'BGSC 변환',
        bgscWithdraw: 'BGSC 출금',
        vaultToWallet: '볼트에서 내 지갑으로',
        notes: '참고사항',
        notesDescription: '포인트 변환 요청 후에는 취소할 수 없습니다. 최종 BGSC 금액은 라운드 종료 시 포인트 가격에 따라 결정됩니다.',
      },
      
      process: {
        howItWorks: '작동 방식',
        depositQueued: '예치 대기',
        depositQueuedDesc: 'BGSC가 현재 라운드 풀에 진입',
        roundExecution: '라운드 실행',
        roundExecutionDesc: '수익 생성을 위해 배치됨',
        pointsIssued: '포인트 발행',
        pointsIssuedDesc: '라운드 종료 후 수령',
        security: '보안',
        securityDesc: '다중서명 지갑, 보험 보상, 실시간 모니터링 시스템.',
      },
      
      history: {
        title: '거래 내역',
        description: '볼트 상호작용의 전체 기록',
        loading: '거래 내역을 불러오는 중...',
        empty: '거래 내역이 없습니다',
        deposit: '예치',
        instantWithdraw: '참여 취소',
        initiateWithdraw: '출금 시작',
        completeWithdraw: '출금 완료',
        redeemPoints: '포인트 수령',
        redeemShares: 'Redeem Points', // deprecated
        round: '라운드',
        confirmed: '완료',
        loadMore: 'Load More Transactions',
        withdraw: '출금',
        claim: '수령',
        pending: '처리 중',
        completed: '완료',
        failed: '실패',
        viewOn: '에서 보기',
        bscscan: 'BscScan',
      },
      
      rounds: {
        title: '라운드 정보',
        current: '현재 라운드',
        previous: '이전 라운드',
        next: '다음 라운드',
        round: '라운드',
        startTime: '시작 시간',
        endTime: '종료 시간',
        duration: '기간',
        totalDeposited: '총 예치',
        totalWithdrawn: '총 출금',
        netFlow: '순 유입',
        participants: '참여자',
        status: '상태',
        active: '진행 중',
        ended: '종료',
        pending: '대기 중',
      },
      
      queue: {
        title: '출금 대기열',
        position: '대기 순번',
        amount: '출금 금액',
        requestTime: '요청 시간',
        estimatedTime: '예상 처리 시간',
        status: '상태',
        queued: '대기 중',
        processing: '처리 중',
        completed: '완료',
        cancelled: '취소됨',
        cancel: '취소',
        cancelConfirm: '출금 요청을 취소하시겠습니까?',
      },
      
      notifications: {
        title: '알림',
        depositConfirmed: '예치가 확인되었습니다',
        withdrawConfirmed: '출금이 확인되었습니다',
        roundStarted: '새 라운드가 시작되었습니다',
        roundEnding: '라운드가 곧 종료됩니다',
        queueProcessed: '출금 대기가 처리되었습니다',
      },
      
      settings: {
        title: '설정',
        slippage: '슬리피지 허용치',
        gasPrice: '가스 가격',
        slow: '느림',
        standard: '표준',
        fast: '빠름',
        notifications: '알림 설정',
        emailNotifications: '이메일 알림',
        pushNotifications: '푸시 알림',
        soundEnabled: '소리 알림',
        darkMode: '다크 모드',
        language: '언어',
        save: '저장',
        saved: '저장되었습니다',
      }
    },
    
    // Demo Mode
    demo: {
      notification: '현재 DEMO 모드로 실행 중입니다',
      warning: '이것은 데모 버전입니다. 실제 거래는 발생하지 않습니다.',
      switchToLive: 'LIVE 모드로 전환',
    },
    
    // Tooltips
    tooltips: {
      apy: '연간 수익률 - 복리 효과를 포함한 연간 예상 수익률입니다',
      tvl: '총 예치 금액 - Vault에 예치된 모든 자산의 총 가치입니다',
      sharePrice: 'Point 토큰 1개당 기초 자산의 가치입니다',
      slippage: '거래 시 허용할 최대 가격 변동폭입니다',
      gasPrice: '트랜잭션 처리 속도를 결정하는 가스 가격입니다',
      round: '매월 1일 00시에 시작되는 월간 투자 라운드입니다',
      queue: '출금 요청이 처리되기를 기다리는 대기열입니다',
    },
    
    // Formats
    formats: {
      currency: '₩{amount}',
      percentage: '{value}%',
      date: 'YYYY년 MM월 DD일',
      time: 'HH:mm:ss',
      datetime: 'YYYY년 MM월 DD일 HH:mm',
      shortDate: 'MM/DD',
      duration: '{days}일 {hours}시간 {minutes}분',
    },
    
    // Validation messages
    validation: {
      invalidInputFormat: '잘못된 입력 형식',
      numbersOnly: '숫자만 입력 가능합니다',
      noDecimalsAllowed: '소수점은 허용되지 않습니다',
      maxDecimalsExceeded: '소수점 {maxDecimals}자리까지만 입력 가능합니다',
      minValueRequired: '최소값 {minValue} 이상 입력해주세요',
      maxValueExceeded: '최대값 {maxValue} 이하 입력해주세요',
      invalidNumberFormat: '올바른 숫자 형식을 입력하세요',
      mustBeGreaterThanZero: '0보다 큰 값을 입력하세요',
      minAmountRequired: '최소 {minAmount} 이상 입력하세요',
      maxAmountExceeded: '최대 {maxAmount} 까지 가능합니다',
      errorDuringValidation: '검증 중 오류가 발생했습니다'
    }
  },
  
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      refresh: 'Refresh',
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      copy: 'Copy',
      copied: 'Copied',
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      max: 'MAX',
      balance: 'Balance',
      amount: 'Amount',
      value: 'Value',
      total: 'Total',
      available: 'Available',
      insufficient: 'Insufficient balance',
      success: 'Success',
      failed: 'Failed',
      pending: 'Pending',
      completed: 'Completed',
      approved: 'Approved',
      rejected: 'Rejected',
      transaction: 'Transaction',
      transactions: 'Transactions',
      history: 'History',
      details: 'Details',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      type: 'Type',
      from: 'From',
      to: 'To',
      fee: 'Fee',
      gas: 'Gas',
      hash: 'Hash',
      block: 'Block',
      network: 'Network',
      mainnet: 'Mainnet',
      testnet: 'Testnet',
      wallet: 'Wallet',
      account: 'Account',
      address: 'Address',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      claim: 'Claim',
      stake: 'Stake',
      unstake: 'Unstake',
      rewards: 'Rewards',
      earnings: 'Earnings',
      apy: 'APY',
      apr: 'APR',
      tvl: 'TVL',
      price: 'Price',
      marketCap: 'Market Cap',
      volume: 'Volume',
      liquidity: 'Liquidity',
      slippage: 'Slippage',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      about: 'About',
      help: 'Help',
      faq: 'FAQ',
      contact: 'Contact',
      terms: 'Terms',
      privacy: 'Privacy',
      demo: 'DEMO',
      live: 'LIVE',
      bnb: 'BNB',
      bgsc: 'BGSC',
      usdt: 'USDT',
      usd: 'USD',
      krw: 'KRW',
      processing: 'Processing...',
      addressCopied: 'Address copied',
      gasFee: 'Gas Fee',
    },
    
    // Error messages
    errors: {
      general: 'Something went wrong',
      network: 'Network error',
      timeout: 'Request timeout',
      notFound: 'Not found',
      unauthorized: 'Unauthorized',
      forbidden: 'Access forbidden',
      validation: 'Validation failed',
      insufficientBalance: 'Insufficient balance',
      transactionFailed: 'Transaction failed',
      connectionFailed: 'Connection failed',
      walletNotConnected: 'Wallet not connected',
      unsupportedNetwork: 'Unsupported network',
      userRejected: 'User rejected',
      unknown: 'Unknown error',
      wrongAmount: 'Invalid amount',
      tooManyAttempts: 'Too many attempts',
      contractError: 'Contract error',
      notWhitelisted: 'Not whitelisted',
      copyFailed: 'Failed to copy',
      invalidAddress: 'Invalid address format',
    },
    
    // Access Denied
    accessDenied: {
      title: 'Access Denied',
      subtitle: 'This vault is whitelist only',
    },
    
    // Landing Page
    landing: {
      title: 'BGSC Vault',
      subtitle: 'Secure & Transparent DeFi Yield',
      heroTitle: 'Bugs Coin\nDeposit Vault',
      heroSubtitle: 'BGSC Vault Round-based Incentive Distribution',
      heroDescription: 'Smart Contract-based Automated Reward Distribution Protocol',
      eventBadge: 'Next-Gen Blockchain-based DeFi Protocol',
      countdownTitle: 'Until Protocol Launch',
      countdownDays: 'Days',
      countdownHours: 'Hours',
      countdownMinutes: 'Minutes',
      countdownSeconds: 'Seconds',
      ctaDeposit: 'Start Deposit',
      ctaLearnMore: 'Learn More',
      
      nav: {
        howItWorks: 'How it Works',
        security: 'Security',
      },
      
      stats: {
        tvl: 'Total Value Locked',
        apy: 'Annual Yield',
        users: 'Active Users',
        secured: 'Assets Secured',
      },
      
      heroMetrics: {
        bscBased: 'BSC Based',
        bscSubtitle: 'High Performance Protocol',
        bgscReward: 'BGSC Distribution',
        bgscSubtitle: 'Round-based Protocol Rewards',
        uptime: '99.9%',
        uptimeSubtitle: 'System',
        uptimeLabel: 'Uptime',
        pointBased: 'Point Based',
        pointSubtitle: 'Protocol Architecture',
      },
      
      features: {
        title: 'Key Features',
        secure: {
          title: 'Secure Storage',
          desc: 'Asset protection through multisig and audits'
        },
        transparent: {
          title: 'Transparent Operations',
          desc: 'Real-time disclosure of all transactions'
        },
        yield: {
          title: 'Optimized Yield',
          desc: 'Maximize returns with proven strategies'
        },
        simple: {
          title: 'Easy to Use',
          desc: 'Participate easily without complexity'
        }
      },
      
      howItWorks: {
        title: 'How It Works',
        sectionBadge: '3-Tier Algo System',
        sectionTitle: 'Sophisticated 3-Tier',
        sectionTitleHighlight: 'Algorithm System',
        sectionSubtitle: 'Operates with institutional-grade\nautomated value creation mechanism',
        step1: {
          number: '01',
          title: 'Smart Deposit',
          desc: 'Deposit BGSC into algorithm-optimized vault\nto acquire premium Point tokens'
        },
        step2: {
          number: '02',
          title: 'AI Optimization Engine',
          desc: 'Ecosystem rewards are reflected\nin Point tokens through efficient staking'
        },
        step3: {
          number: '03',
          title: 'Precision Exchange',
          desc: 'Point tokens are precisely converted\nto BGSC upon round completion'
        },
        systemStats: {
          stability: '99.97%',
          stabilityLabel: 'System Stability',
          processingSpeed: '< 3s',
          processingLabel: 'Transaction Processing Speed',
          uptime: '24/7',
          uptimeLabel: 'Autonomous Operation Time'
        }
      },
      
      yieldSection: {
        badge: 'Expected Return Guide',
        subtitle: 'Check expected returns based on current TVL',
        annualYield: 'Expected Annual Yield',
        monthlyYield: 'Monthly Expected Yield',
        tvl: 'BGSC TVL (Total Deposits)',
        tvlAdjusted: 'BGSC TVL (Total Deposits) (Adjusted)',
        chartTitle: 'Monthly Point Value Growth Projection (6 months)',
        currentValue: 'Current 1 Point Value: ',
        monthlyGrowth: 'Monthly Growth Rate: ',
        sixMonthProjection: '6-Month Projection: ',
        month: 'months',
        monthPrefix: '',
        monthSuffix: 'months',
        clickForDetails: 'Click for detailed information',
        tvlSimulation: 'TVL Simulation',
        tvlAdjustment: 'Total Deposit Adjustment',
        resetToCurrent: 'Reset to Current Value',
        totalRewardPool: 'Total Reward Pool (6 months)',
        monthlyDistribution: 'Monthly Distribution',
        description: 'For current total deposits of',
        descriptionReward: ', monthly',
        descriptionDistribution: 'will be distributed as rewards.',
        importantNotice: 'Important Notice',
        noticeContent: '• The above returns are estimates based on current TVL, not guaranteed returns.\n• Actual returns may vary significantly based on TVL changes.\n• Returns decrease as TVL increases, and increase as TVL decreases.\n• Rewards are proportionally distributed to depositors after each round ends.',
        calculatorTitle: 'Investment Return Calculator',
        calculatorLabel: 'Deposit Amount (BGSC)',
        calculatorHint: '▼ Enter your desired amount below',
        monthlyReturn: 'Expected Monthly Return',
        sixMonthReturn: 'Expected 6-Month Return'
      },
      
      calculator: {
        title: 'Yield Calculator',
        inputAmount: 'Deposit Amount',
        duration: 'Duration',
        days: 'Days',
        months: 'Months',
        years: 'Years',
        estimatedReturn: 'Estimated Return',
        totalValue: 'Total Value',
        disclaimer: '* Actual returns may vary based on market conditions'
      },
      
      quantumReturn: {
        badge: 'Quantum Return',
        title: 'Next-Gen Algorithm-based\nValue Creation Engine',
        titleHighlight: 'Quantum Return',
        subtitle: 'Point 2.0 Innovative Value Amplification System',
        enterprisePerformance: 'Enterprise-Grade Performance Analysis',
        responseSpeed: 'Response Speed',
        typical: 'Typical',
        throughput: 'Throughput (TPS)',
        enterprise: 'Enterprise',
        bugsVault: 'Bugs Coin Vault',
        innovative: 'Innovative',
        roundCycle: 'Round Cycle',
        stableReturn: '(Stable Returns)',
        verifiedTech: 'Verified Technology',
        smartContractAutomation: 'Reward distribution through smart contract automation',
        techStability: 'Secured verified technical stability',
        hyperIntelligent: 'Hyper Intelligent System',
        valueAmplification: 'Value Amplification Method',
        smartContractBased: 'Smart Contract Based',
        incentiveEngine: 'Incentive Engine',
        ecosystem: 'Ecosystem → Point 2.0',
        valueRealization: 'Value Realization',
        precisionExchange: 'Precision BGSC Exchange',
        transparency: 'Transparency Level',
        contractTransparency: 'Contract 100%',
        techInnovation: 'Technical Innovation',
        securityGrade: 'Security Grade',
        nextGenFuture: 'Future of Next-Gen Technology',
        futureDescription: 'Innovative protocol born from the perfect fusion of cutting-edge blockchain technology and AI algorithms. Through smart contract automation and decentralized governance',
        techInnovationHighlight: 'next-generation technological innovation',
        realize: 'is realized.'
      },
      
      security: {
        badge: 'Security',
        title: 'High Security\nArchitecture',
        titleHighlight: 'Architecture',
        subtitle: 'System integrating world-class protocols and smart contracts',
        verifiedCodebase: 'Verified Codebase',
        verifiedAmount: '$300M+ Verified',
        verifiedDesc: 'Built on battle-tested smart contracts from Theo Protocol and Ribbon Finance',
        nextGenBsc: 'Next-Gen BSC Security',
        latestStandards: 'Latest Security Standards Compliance',
        bscDesc: 'Applying latest standards and advanced protocols of Binance Smart Chain',
        hyperTransparency: 'Hyper Transparency',
        fullTransparency: '100% Transparency Guaranteed',
        transparencyDesc: 'Fully transparent operation system where all transactions and Point value changes are verifiable on-chain in real-time',
        enterpriseMetrics: 'BGSC Enterprise-Grade Metrics',
        transactions: 'Transactions',
        dailyUsers: 'Daily Active Users',
        relatedProjects: 'Related Projects',
        regulatory: 'Regulatory Compliance',
        established: 'Established'
      },
      
      partners: {
        badge: 'Trusted Partnerships',
        title: 'Trusted Partnerships'
      },
      
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Key questions about our sophisticated system',
        q1: {
          q: 'What is the minimum participation threshold?',
          a: 'You can participate in the protocol starting from 10,000 BGSC minimum, with no upper limit. The more tokens you stake, the higher protocol rewards you can receive.'
        },
        q2: {
          q: 'How does the protocol mechanism work?',
          a: 'Through a 3-tier smart contract-based system, BGSC is staked and ecosystem rewards are reflected in Point tokens to enhance protocol efficiency.'
        },
        q3: {
          q: 'What is the Point conversion process?',
          a: 'Upon round completion, Point tokens are automatically converted to BGSC at precise ratios. All processes are transparently handled on-chain.'
        },
        q4: {
          q: 'How is security guaranteed?',
          a: 'We provide A+ grade security based on security architecture and smart contracts verified with over $300 million.'
        }
      },
      
      cta: {
        title: 'Get Started Now',
        subtitle: 'Experience secure and transparent yields with BGSC Vault',
        button: 'Start Depositing'
      },
      
      footer: {
        subtitle: 'Next-Gen Algorithm-based Web3 DeFi Protocol\nPerfect fusion of traditional systems and innovative technology',
        disclaimer: 'This protocol contains experimental technology. Smart contract risks may exist and technical issues may occur. All blockchain protocols carry risks of unexpected bugs or hacks.',
        disclaimerMobile: 'This protocol contains experimental technology. Smart contract risks may exist and technical issues may occur. All blockchain protocols carry risks of unexpected bugs or hacks.',
        copyright: '© 2025 Aden Bugs Vault Protocol. All rights reserved.',
        links: {
          docs: 'Docs',
          github: 'GitHub',
          discord: 'Discord',
          telegram: 'Telegram',
          twitter: 'Twitter'
        }
      }
    },
    
    // Main Page (Dashboard)
    main: {
      title: 'Dashboard',
      welcome: 'Welcome',
      
      tabs: {
        deposit: 'Deposit',
        redeem: 'Redeem',
        convert: 'Convert Points',
        withdraw: 'Withdraw BGSC',
        mypage: 'My Info',
      },
      
      stats: {
        title: 'My Portfolio',
        deposited: 'Deposited',
        earnings: 'Earnings',
        shares: 'Points Held',
        nextRound: 'Next Round',
        currentRound: 'Current Round',
        roundEnds: 'Round Ends',
        daysLeft: 'days left',
        hoursLeft: 'hours left',
        minutesLeft: 'minutes left',
        bgscVaultBalance: 'BGSC Vault Balance',
        totalPoints: 'Total Points',
        bgscTvl: 'BGSC TVL',
        ownedPoints: 'Owned Points',
        unredeemed: 'Unredeemed',
        currentDeposit: 'Round Deposit',
        claimableBgsc: 'Claimable BGSC',
        annualOperatingProfit: 'Current Points',
        vaultStored: 'Stored in Vault',
        pendingConversion: 'Pending Conversion',
        withdrawableFromVault: 'Withdrawable from Vault',
        liveTrading: 'LIVE',
        ownedPoints: 'Owned Points',
        round: 'Round',
        next: 'Next',
        bgscPerPoint: 'BGSC/Point',
      },
      
      vault: {
        title: 'Vault Info',
        totalDeposited: 'Total Deposited',
        totalShares: 'Total Points',
        sharePrice: 'Point Price',
        performance: 'Performance',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
        allTime: 'All Time',
      },
      
      actions: {
        deposit: 'Deposit',
        withdraw: 'Withdraw',
        claim: 'Claim',
        compound: 'Compound',
        depositTitle: 'Deposit Assets',
        withdrawTitle: 'Withdraw Assets',
        selectToken: 'Select Token',
        enterAmount: 'Enter Amount',
        willReceive: 'You Will Receive',
        exchangeRate: 'Exchange Rate',
        estimatedGas: 'Estimated Gas',
        approve: 'Approve',
        approving: 'Approving...',
        depositing: 'Depositing...',
        withdrawing: 'Withdrawing...',
        confirmDeposit: 'Confirm Deposit',
        confirmWithdraw: 'Confirm Withdraw',
        depositSuccess: 'Deposit successful',
        withdrawSuccess: 'Withdrawal successful',
        approveFailed: 'Approval failed',
        depositFailed: 'Deposit failed',
        withdrawFailed: 'Withdrawal failed',
        redeem: 'Redeem',
      },
      
      deposit: {
        title: 'Join Vault Protocol',
        formTitle: 'Join Vault Protocol',
        description: 'Deposit BGSC to earn stable returns',
        pointIssuanceNotice: 'Point Issuance Notice',
        shareIssuanceNotice: 'Point Issuance Notice', // deprecated
        immediately: 'Upon deposit: Registered in current round participation queue',
        roundEnd: 'At {round} end: BGSC automatically converts to Points',
        afterConversion: 'After conversion: Exchange Points for BGSC to withdraw',
        expectedTime: 'Expected wait time:',
        depositForOthers: 'Participate for another account',
        recipientAddress: 'Recipient Address',
        recipientAddressLabel: 'Recipient Address',
        participationAmount: 'Participation Amount',
        minimum: 'Minimum',
        minimumAmount: 'Minimum',
        availableBalance: 'Available',
        expectedPoints: 'Expected Points',
        expectedPointsLabel: 'Expected Points',
        expectedShares: 'Expected Points', // deprecated
        expectedSharesLabel: 'Expected Points', // deprecated
        currentPrice: 'Current Price',
        currentPriceLabel: 'Current Price',
        approvalRequired: 'You must first approve {token} token usage. After approval, click the same button again to proceed with the deposit.',
        approvalPending: 'Token approval is being processed. After approval, click the same button again to proceed with the deposit.',
        approvalComplete: 'Token approval is complete. You can now proceed with the deposit.',
        approveToken: 'Approve {token}',
        approvingToken: 'Approving token...',
        processingApproval: 'Processing approval...',
        depositWithToken: 'Deposit with {token}',
        joinWith: 'Join with {token}',
      },
      
      instantWithdraw: {
        title: 'Cancel Current Round Participation',
        description: 'You can withdraw deposits from {round} before the round ends',
        canWithdraw: 'Instant withdrawal available',
        cannotWithdraw: 'Instant withdrawal not available',
        availableTime: 'Instant withdrawal available time:',
        currentRoundDeposit: 'Current Round Deposit',
        currentRoundDepositLabel: 'Current Round Deposit',
        depositedInRound: 'Amount deposited in Round {round}',
        noDepositsInRound: 'No deposits in current round',
        withdrawAmount: 'Withdraw Amount',
        withdrawAmountLabel: 'Withdraw Amount',
        availableLabel: 'Available',
        notAvailable: 'Instant withdrawal not available',
        noDepositToCancel: 'No Deposit to Cancel',
        cancelAndWithdraw: 'Cancel & Withdraw',
      },
      
      redeem: {
        title: 'Redeem Points',
        description: 'BGSC from previous rounds has been converted to Points and stored in the vault. You can redeem these Points to your account.',
        completedRounds: 'Completed Rounds',
        shareConversionComplete: 'Point conversion complete → Ready to redeem',
        currentRound: 'Current Round',
        roundEndConversion: 'Converts to Points at round end → Redeemable next round',
        unredeemedPoints: 'Unredeemed Points',
        unredeemedPointsLabel: 'Unredeemed Points',
        points: 'Points',
        noPointsAvailable: 'No points available to redeem. Please participate in the vault first or wait for the round to complete.',
        unredeemedShares: 'Unredeemed Points', // deprecated
        unredeemedSharesLabel: 'Unredeemed Points', // deprecated
        shares: 'Shares', // deprecated
        noSharesAvailable: 'No Points available to redeem. Please participate in the vault first or wait for the round to complete.', // deprecated
        conversionRate: 'Conversion Rate',
        conversionRateLabel: 'Conversion Rate',
        instant: 'Instant',
        instantLabel: 'Instant',
        processing: 'Processing',
        processingLabel: 'Processing',
        bgscConvertedMessage: 'BGSC has been converted to points. Please collect your points.',
        redeemAllPoints: 'Redeem All Points',
        noPointsToRedeem: 'No Points to Redeem',
        redeemAllShares: 'Redeem All Points', // deprecated
        noSharesToRedeem: 'No Points to Redeem', // deprecated
      },
      
      withdraw: {
        step1Title: 'Request Point Conversion',
        step1Description: 'Place your Points in the withdrawal queue for conversion to BGSC in the next {duration} round. After conversion, you can withdraw BGSC from the vault.\n\n⚠️ WARNING: Point conversion request is equivalent to canceling your next round vault participation.\nConversion requests are IRREVERSIBLE! Once submitted, you cannot cancel. Please decide carefully.',
        yourPoints: 'Your Points',
        yourPointsLabel: 'Your Points',
        currentPoints: 'Current Points held',
        noPointsToConvert: 'No Points to convert. Please redeem Points first.',
        yourShares: 'Your Points', // deprecated
        yourSharesLabel: 'Your Points', // deprecated
        currentShares: 'Current Points held', // deprecated
        noSharesToConvert: 'No Points to convert. Please redeem Points first.', // deprecated
        participationAmount: 'Participation Amount',
        availableLabel: 'Available',
        estimatedValue: 'Estimated Value',
        estimatedValueLabel: 'Estimated Value',
        processingTime: 'Processing Time',
        processingTimeLabel: 'Processing Time',
        totalGas: 'Total Gas',
        totalGasLabel: 'Total Gas',
        noPointsAvailable: 'No Points Available',
        requestPointConversion: 'Request Point Conversion',
        noSharesAvailable: 'No Points Available', // deprecated
        requestShareConversion: 'Request Point Conversion', // deprecated
        step2Title: 'Complete BGSC Withdrawal',
        step2Description: 'Points have been converted to BGSC and stored in the vault. You can now request BGSC withdrawal.',
        withdrawAvailable: 'Withdrawal Available',
        bgscWithdrawAvailable: '{amount} BGSC available for withdrawal.\nYou can withdraw immediately.',
        conversionPending: 'Conversion Pending',
        pointsConversionPending: '{amount} Points pending conversion to BGSC in Round {round}.\nEstimated wait time: {time}',
        sharesConversionPending: '{amount} Points pending conversion to BGSC in Round {round}.\nEstimated wait time: {time}', // deprecated
        noConversionRequest: 'No conversion request',
        noWithdrawRequest: 'No withdrawal request.\nPlease request Point conversion in first.',
        conversionComplete: 'Conversion Complete',
        conversionCompleteLabel: 'Conversion Complete',
        vaultBalance: 'Vault Balance',
        vaultBalanceLabel: 'Vault Balance',
        processingWithdraw: 'Processing withdrawal...',
        noBgscToWithdraw: 'No BGSC to Withdraw',
        withdrawBgscAmount: 'Withdraw {amount} BGSC',
        withdrawProcess: 'Withdrawal Process',
        pointConversionRequest: 'Point Conversion Request',
        pointToQueue: 'My Points → Queue Registration',
        shareConversionRequest: 'Point Conversion Request', // deprecated
        shareToQueue: 'My Points → Queue Registration', // deprecated
        bgscConversion: 'BGSC Conversion',
        bgscWithdraw: 'BGSC Withdrawal',
        vaultToWallet: 'From Vault to My Wallet',
        notes: 'Notes',
        notesDescription: 'Point conversion requests cannot be cancelled. Final BGSC amount is determined by Point price at round end.',
      },
      
      process: {
        howItWorks: 'How It Works',
        depositQueued: 'Deposit Queued',
        depositQueuedDesc: 'BGSC enters current round pool',
        roundExecution: 'Round Execution',
        roundExecutionDesc: 'Deployed for yield generation',
        pointsIssued: 'Points Issued',
        pointsIssuedDesc: 'Redeem after round ends',
        security: 'Security',
        securityDesc: 'Multi-signature wallets, insurance coverage, and real-time monitoring systems.',
      },
      
      history: {
        title: 'Transaction History',
        description: 'Complete record of your vault interactions',
        loading: 'Loading transaction history...',
        empty: 'No transactions yet',
        deposit: 'Deposit',
        instantWithdraw: 'Instant Withdraw',
        initiateWithdraw: 'Initiate Withdraw',
        completeWithdraw: 'Complete Withdraw',
        redeemPoints: 'Redeem Points',
        redeemShares: 'Redeem Points', // deprecated
        round: 'Round',
        confirmed: 'Confirmed',
        loadMore: 'Load More Transactions',
        withdraw: 'Withdraw',
        claim: 'Claim',
        pending: 'Pending',
        completed: 'Completed',
        failed: 'Failed',
        viewOn: 'View on',
        bscscan: 'BscScan',
      },
      
      rounds: {
        title: 'Round Info',
        current: 'Current Round',
        previous: 'Previous Round',
        next: 'Next Round',
        round: 'Round',
        startTime: 'Start Time',
        endTime: 'End Time',
        duration: 'Duration',
        totalDeposited: 'Total Deposited',
        totalWithdrawn: 'Total Withdrawn',
        netFlow: 'Net Flow',
        participants: 'Participants',
        status: 'Status',
        active: 'Active',
        ended: 'Ended',
        pending: 'Pending',
      },
      
      queue: {
        title: 'Withdrawal Queue',
        position: 'Queue Position',
        amount: 'Withdrawal Amount',
        requestTime: 'Request Time',
        estimatedTime: 'Estimated Processing',
        status: 'Status',
        queued: 'Queued',
        processing: 'Processing',
        completed: 'Completed',
        cancelled: 'Cancelled',
        cancel: 'Cancel',
        cancelConfirm: 'Cancel withdrawal request?',
      },
      
      notifications: {
        title: 'Notifications',
        depositConfirmed: 'Deposit confirmed',
        withdrawConfirmed: 'Withdrawal confirmed',
        roundStarted: 'New round started',
        roundEnding: 'Round ending soon',
        queueProcessed: 'Withdrawal queue processed',
      },
      
      settings: {
        title: 'Settings',
        slippage: 'Slippage Tolerance',
        gasPrice: 'Gas Price',
        slow: 'Slow',
        standard: 'Standard',
        fast: 'Fast',
        notifications: 'Notification Settings',
        emailNotifications: 'Email Notifications',
        pushNotifications: 'Push Notifications',
        soundEnabled: 'Sound Alerts',
        darkMode: 'Dark Mode',
        language: 'Language',
        save: 'Save',
        saved: 'Saved',
      }
    },
    
    // Demo Mode
    demo: {
      notification: 'Currently running in DEMO mode',
      warning: 'This is a demo version. No real transactions will occur.',
      switchToLive: 'Switch to LIVE mode',
    },
    
    // Tooltips
    tooltips: {
      apy: 'Annual Percentage Yield - Expected annual return including compound interest',
      tvl: 'Total Value Locked - Total value of all assets deposited in the vault',
      sharePrice: 'Value of underlying assets per Point token',
      slippage: 'Maximum price movement allowed during transaction',
      gasPrice: 'Gas price that determines transaction processing speed',
      round: 'Monthly investment round starting on the 1st at 00:00',
      queue: 'Queue for pending withdrawal requests',
    },
    
    // Formats
    formats: {
      currency: '$' + '{amount}',
      percentage: '{value}%',
      date: 'MMM DD, YYYY',
      time: 'HH:mm:ss',
      datetime: 'MMM DD, YYYY HH:mm',
      shortDate: 'MM/DD',
      duration: '{days}d {hours}h {minutes}m',
    },
    
    // Validation messages
    validation: {
      invalidInputFormat: 'Invalid input format',
      numbersOnly: 'Only numbers allowed',
      noDecimalsAllowed: 'Decimals not allowed',
      maxDecimalsExceeded: 'Maximum {maxDecimals} decimal places allowed',
      minValueRequired: 'Minimum value of {minValue} required',
      maxValueExceeded: 'Maximum value of {maxValue} exceeded',
      invalidNumberFormat: 'Please enter a valid number format',
      mustBeGreaterThanZero: 'Must be greater than 0',
      minAmountRequired: 'Minimum {minAmount} required',
      maxAmountExceeded: 'Maximum {maxAmount} allowed',
      errorDuringValidation: 'Error during validation'
    }
  }
};

export const getTranslation = (language, key) => {
  // key가 문자열이 아닌 경우 처리
  if (typeof key !== 'string') {
    console.error('Invalid translation key:', key);
    return '';
  }
  
  const keys = key.split('.');
  let value = translations[language] || translations.ko;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
};

export const t = (key, language = 'ko', params = {}) => {
  // key가 문자열이 아닌 경우 빈 문자열 반환
  if (typeof key !== 'string') {
    console.error('Invalid translation key type:', typeof key, key);
    return '';
  }
  
  let text = getTranslation(language, key);
  
  // 객체가 반환된 경우 key를 그대로 반환
  if (typeof text !== 'string') {
    console.warn(`Translation not found for key: ${key}, language: ${language}`);
    return key;
  }
  
  // 파라미터 치환
  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([paramKey, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        text = text.replace(`{${paramKey}}`, String(value));
      }
    });
  }
  
  return text;
};