import React, { useEffect } from 'react';
import styled from 'styled-components';
import Icons from './Icons';
import { t } from '../translations';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* iOS 안전 영역 대응 */
  padding-top: max(20px, env(safe-area-inset-top, 20px));
  padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
  
  /* 모바일에서 상단 여백 추가 */
  @media (max-width: 768px) {
    padding-top: max(40px, env(safe-area-inset-top, 40px));
    align-items: flex-start;
  }
`;

const ModalContent = styled.div`
  background: #1a1f2e;
  border-radius: 16px;
  max-width: 480px;
  width: 100%;
  padding: 24px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: auto;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px); /* 동적 뷰포트 높이 지원 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    max-height: calc(100vh - 80px);
    max-height: calc(100dvh - 80px);
    padding: 20px;
    margin-top: 20px;
    
    /* 메타마스크/트러스트월렛 인앱 브라우저 대응 */
    @supports (-webkit-touch-callout: none) {
      max-height: calc(100vh - 120px);
      max-height: calc(100dvh - 120px);
    }
  }
  
  /* 작은 화면 대응 */
  @media (max-height: 700px) {
    max-height: calc(100vh - 60px);
    max-height: calc(100dvh - 60px);
    padding: 16px;
  }
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-align: center;
  
  @media (max-width: 400px) {
    font-size: 18px;
    margin-bottom: 12px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

const ProgressDivider = styled.div`
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
`;

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #999;
  
  span {
    color: #fff;
    font-weight: 600;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid ${props => props.$active ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.06)'};
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: all 0.3s ease;

  ${props => props.$active && `
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  `}

  ${props => props.$completed && `
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  `}
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$completed ? '#10b981' : props.$active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$completed ? '#fff' : props.$active ? '#1a1f2e' : '#666'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$completed ? '#10b981' : '#fff'};
  margin: 0;
`;

const StepDescription = styled.p`
  font-size: 14px;
  color: #999;
  margin: 0;
  line-height: 1.5;
  padding-left: 44px;
`;

const Notice = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #f59e0b;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #8C5AFF;
  color: white;

  &:hover:not(:disabled) {
    background: #7c4ff3;
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.05);
  color: #999;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

const AmountDisplay = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
  }

  .amount {
    font-size: 25px;
    font-weight: 600;
    color: #FFFFFF;
    display: flex;
    align-items: baseline;
    gap: 6px;
    
    @media (max-width: 400px) {
      font-size: 20px;
    }
    
    .unit {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  @media (max-width: 400px) {
    padding: 10px 12px;
    margin-bottom: 16px;
  }
`;

const DepositStepModal = ({ isOpen, onClose, onConfirm, step = 'approval', language = 'ko', depositAmount = '0' }) => {
  // body 스크롤 제어
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      
      // body 스크롤 비활성화
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // iOS bounce 효과 방지
      document.documentElement.style.overflow = 'hidden';
      
      return () => {
        // 스크롤 위치 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isApprovalStep = step === 'approval';
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <Icons.X />
        </CloseButton>

        <Title>
          {language === 'ko' ? 'BGSC 예치 프로세스' : 'BGSC Deposit Process'}
        </Title>

        <AmountDisplay>
          <span className="label">
            {language === 'ko' ? '예치 수량' : 'Deposit Amount'}
          </span>
          <span className="amount">
            {Number(depositAmount).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}
            <span className="unit">BGSC</span>
          </span>
        </AmountDisplay>

        <StepIndicator>
          {isApprovalStep ? (
            <>{language === 'ko' ? '단계 ' : 'Step '}<span>1/2</span></>
          ) : (
            <>{language === 'ko' ? '단계 ' : 'Step '}<span>2/2</span></>
          )}
        </StepIndicator>

        <ProgressBar>
          <ProgressFill $progress={isApprovalStep ? 50 : 100} />
          <ProgressDivider />
        </ProgressBar>

        <StepsContainer>
          <StepCard $active={isApprovalStep} $completed={!isApprovalStep}>
            <StepHeader>
              <StepNumber $active={isApprovalStep} $completed={!isApprovalStep}>
                {!isApprovalStep ? <Icons.CheckCircle style={{ width: '18px', height: '18px' }} /> : '1'}
              </StepNumber>
              <StepTitle $active={isApprovalStep} $completed={!isApprovalStep}>
                {language === 'ko' ? 'BGSC 토큰 승인' : 'BGSC Token Approval'}
              </StepTitle>
            </StepHeader>
            <StepDescription>
              {language === 'ko' 
                ? '볼트가 사용자의 BGSC 토큰을 예치할 수 있도록 승인합니다.'
                : 'Approve the vault to deposit your BGSC tokens.'
              }
            </StepDescription>
          </StepCard>

          <StepCard $active={!isApprovalStep}>
            <StepHeader>
              <StepNumber $active={!isApprovalStep}>2</StepNumber>
              <StepTitle $active={!isApprovalStep}>
                {language === 'ko' ? 'BGSC 예치' : 'BGSC Deposit'}
              </StepTitle>
            </StepHeader>
            <StepDescription>
              {language === 'ko'
                ? '승인이 완료되면 원하는 수량의 BGSC를 볼트에 예치할 수 있습니다.'
                : 'After approval, you can deposit your desired amount of BGSC into the vault.'
              }
            </StepDescription>
          </StepCard>
        </StepsContainer>

        <Notice>
          {isApprovalStep ? (
            <>
              {language === 'ko' 
                ? '예치는 두 번의 승인으로 진행됩니다. 승인 후 예치 버튼을 다시 눌러주세요.'
                : 'This process requires two transactions. After approval, click the deposit button again.'
              }
            </>
          ) : (
            <>
              {language === 'ko'
                ? '✅ 승인이 완료되었습니다. 마지막 단계인 예치를 진행해주세요.'
                : '✅ Approval completed. Please proceed with the final step to deposit.'
              }
            </>
          )}
        </Notice>

        <ButtonContainer>
          <SecondaryButton onClick={onClose}>
            {language === 'ko' ? '취소' : 'Cancel'}
          </SecondaryButton>
          <PrimaryButton onClick={onConfirm}>
            {language === 'ko' ? '확인' : 'Confirm'}
          </PrimaryButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DepositStepModal;