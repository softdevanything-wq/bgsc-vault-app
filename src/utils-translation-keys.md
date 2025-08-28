# Utils.js Translation Keys

This document lists all the hardcoded strings that were found in utils.js and replaced with translation keys.

## Validation Messages

1. **validation.invalidInputFormat** - "잘못된 입력 형식"
2. **validation.numbersOnly** - "숫자만 입력 가능합니다"
3. **validation.noDecimalsAllowed** - "소수점은 허용되지 않습니다"
4. **validation.maxDecimalsExceeded** - "소수점 {maxDecimals}자리까지만 입력 가능합니다"
   - Parameters: `maxDecimals`
5. **validation.minValueRequired** - "최소값 {minValue} 이상 입력해주세요"
   - Parameters: `minValue`
6. **validation.maxValueExceeded** - "최대값 {maxValue} 이하 입력해주세요"
   - Parameters: `maxValue`
7. **validation.invalidNumberFormat** - "올바른 숫자 형식을 입력하세요"
8. **validation.mustBeGreaterThanZero** - "0보다 큰 값을 입력하세요"
9. **validation.minAmountRequired** - "최소 {minAmount} 이상 입력하세요"
   - Parameters: `minAmount`
10. **validation.maxAmountExceeded** - "최대 {maxAmount} 까지 가능합니다"
    - Parameters: `maxAmount`
11. **validation.errorDuringValidation** - "검증 중 오류가 발생했습니다"

## Error Messages

1. **error.rpcConnection** - "RPC 연결 오류 - 잠시 후 다시 시도해주세요"
2. **error.transactionCancelled** - "트랜잭션을 취소했습니다"
3. **error.insufficientBNB** - "BNB 잔액이 부족합니다 (가스비)"
4. **error.transactionConflict** - "트랜잭션 충돌 - 잠시 후 다시 시도해주세요"
5. **error.networkError** - "네트워크 오류 - dRPC 연결을 확인해주세요"
6. **error.gasEstimationFailed** - "가스 추정 실패 - 설정을 확인해주세요"
7. **error.transactionReverted** - "트랜잭션이 되돌려졌습니다 - 조건을 확인해주세요"
8. **error.transactionFailed** - "트랜잭션 실패 - 잠시 후 다시 시도해주세요"
9. **error.unknown** - "알 수 없는 오류가 발생했습니다"
10. **error.timeCalculation** - "시간 계산 오류"

## Time-related Messages

1. **time.justNow** - "방금 전"
2. **time.minutesAgo** - "{minutes}분 전"
   - Parameters: `minutes`
3. **time.hoursAgo** - "{hours}시간 전"
   - Parameters: `hours`
4. **time.daysAgo** - "{days}일 전"
   - Parameters: `days`
5. **time.localDate** - Date object to be formatted locally
   - Parameters: `date` (Date object)

## Round-related Messages

1. **round.notStartedYet** - "라운드가 아직 시작되지 않았습니다"
2. **round.endedNoInstantWithdraw** - "라운드가 종료되어 즉시 출금이 불가능합니다"
3. **round.timeUntilEnd** - "{duration} 라운드 종료까지"
   - Parameters: `duration`
4. **round.frequency** - "{days}일마다"
   - Parameters: `days`
5. **round.apyPeriod** - "{cycles}회"
   - Parameters: `cycles`
6. **round.apyBasis** - "연 {cycles}회 복리"
   - Parameters: `cycles`
7. **round.nextRoundLabel** - "다음 {duration} 라운드"
   - Parameters: `duration`
8. **round.currentRoundLabel** - "현재 {duration} 라운드"
   - Parameters: `duration`
9. **round.howItWorks** - "{duration} 단위로 수익을 창출합니다"
   - Parameters: `duration`
10. **round.processingTime** - "{duration} 라운드 종료 후 처리됩니다"
    - Parameters: `duration`

## Common Messages

1. **common.unknown** - "알 수 없음"
2. **common.dRPCOptimized** - "dRPC Premium으로 최적화됨"

## Implementation Notes

### For functions returning error objects:
```javascript
// Before
return { valid: false, error: '숫자만 입력 가능합니다' };

// After
return { valid: false, error: 'validation.numbersOnly' };
```

### For functions with parameters:
```javascript
// Before
return { valid: false, error: `최소값 ${minValue} 이상 입력해주세요` };

// After
return { valid: false, error: 'validation.minValueRequired', params: { minValue } };
```

### For time formatting:
```javascript
// Before
if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;

// After
if (diff < 3600) return { key: 'time.minutesAgo', params: { minutes: Math.floor(diff / 60) } };
```

### For getDynamicText function:
```javascript
// Before
roundFrequency: `${config.DURATION_DAYS}일마다`,

// After
roundFrequency: { key: 'round.frequency', params: { days: config.DURATION_DAYS } },
```

## Usage in Components

Components using these utility functions will need to:
1. Check if the returned value is a string (translation key) or an object with `key` and `params`
2. Use the appropriate translation function to convert keys to translated text
3. Pass parameters when needed for interpolation

Example:
```javascript
const validation = validateAmount(amount, max);
if (!validation.valid) {
  const errorMessage = typeof validation.error === 'string' 
    ? t(validation.error)
    : t(validation.error, validation.params);
  // Show error message
}
```