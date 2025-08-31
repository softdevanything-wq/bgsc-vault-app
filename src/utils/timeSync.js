// timeSync.js - KST 기준 라운드 시간 계산 (간소화 버전)
import moment from 'moment-timezone';

class TimeSync {
  constructor() {
    this.isInitialized = false;
  }

  // 초기화 (간소화)
  async initialize() {
    // 시간 서버 동기화 없이 로컬 시간 사용
    // 대부분의 기기는 NTP로 자동 동기화되므로 충분히 정확
    this.isInitialized = true;
    console.log('TimeSync initialized (using local time with KST conversion)');
    return true;
  }

  // 현재 UTC 시간 가져오기
  getNow() {
    return new Date();
  }

  // 현재 KST 시간 가져오기
  getKSTNow() {
    return moment().tz('Asia/Seoul').toDate();
  }

  // KST 기준 다음 라운드 종료 시간 계산 (매달 마지막일 자정 = 다음달 1일 00:00)
  getNextRoundEndKST() {
    const kstNow = moment.tz('Asia/Seoul');
    
    // 다음달 1일 00:00 KST
    let nextRoundEnd = kstNow.clone().add(1, 'month').startOf('month');
    
    // 만약 현재가 이미 이번달 마지막일 자정을 지났다면
    if (kstNow.date() === 1 && kstNow.hours() === 0 && kstNow.minutes() === 0) {
      // 다다음달 1일로
      nextRoundEnd = nextRoundEnd.add(1, 'month');
    }
    
    return nextRoundEnd.toDate();
  }

  // 라운드 종료까지 남은 시간 (초)
  getSecondsUntilRoundEnd() {
    const now = moment.tz('Asia/Seoul');
    const roundEnd = moment.tz(this.getNextRoundEndKST(), 'Asia/Seoul');
    const diffSeconds = roundEnd.diff(now, 'seconds');
    return Math.max(0, diffSeconds);
  }

  // 예치 차단 여부 (종료 1시간 전)
  isDepositLocked() {
    const secondsLeft = this.getSecondsUntilRoundEnd();
    return secondsLeft <= 3600; // 1시간 = 3600초
  }

  // 디버깅용 정보
  getDebugInfo() {
    const kstNow = moment.tz('Asia/Seoul');
    const nextRoundEnd = moment.tz(this.getNextRoundEndKST(), 'Asia/Seoul');
    const secondsLeft = this.getSecondsUntilRoundEnd();
    
    return {
      currentKST: kstNow.format('YYYY-MM-DD HH:mm:ss'),
      nextRoundEndKST: nextRoundEnd.format('YYYY-MM-DD HH:mm:ss'),
      secondsLeft,
      hoursLeft: Math.floor(secondsLeft / 3600),
      minutesLeft: Math.floor((secondsLeft % 3600) / 60),
      isDepositLocked: this.isDepositLocked()
    };
  }
}

// 싱글톤 인스턴스
const timeSync = new TimeSync();

export default timeSync;