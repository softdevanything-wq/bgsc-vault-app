import React, { useEffect, useState, useRef } from 'react';
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
  z-index: 1000;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  
  /* Flexbox 대신 padding으로 중앙 정렬 */
  padding: 20px;
  padding-top: max(20px, env(safe-area-inset-top, 20px));
  padding-bottom: max(100px, env(safe-area-inset-bottom, 100px)); /* 하단 여백 충분히 확보 */
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    padding: 15px;
    padding-top: max(30px, env(safe-area-inset-top, 30px));
    padding-bottom: max(120px, env(safe-area-inset-bottom, 120px)); /* 모바일 하단 여백 더 크게 */
  }
  
  /* 매우 작은 화면 */
  @media (max-height: 600px) {
    padding-top: 10px;
    padding-bottom: 150px; /* 작은 화면에서는 하단 여백 더 크게 */
  }
`;

const ModalContent = styled.div`
  background: #1a1f2e;
  border-radius: 16px;
  max-width: 480px;
  width: calc(100% - 20px);
  padding: 24px;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto;
  margin-bottom: 20px; /* 하단 여백 확보 */
  
  /* 높이 제한 제거 - 자연스럽게 콘텐츠만큼 늘어나도록 */
  min-height: auto;
  max-height: none;
  
  /* 모바일 최적화 */
  @media (max-width: 768px) {
    width: calc(100% - 10px);
    padding: 18px;
    margin-bottom: 30px;
  }
  
  /* 작은 화면 대응 */
  @media (max-height: 700px) {
    padding: 14px;
    margin-bottom: 40px;
  }
  
  /* 매우 작은 화면 */
  @media (max-height: 600px) {
    padding: 12px;
    margin-bottom: 50px;
    
    /* 폰트 크기 조정 */
    font-size: 14px;
  }
  
  /* 가로 모드 대응 */
  @media (orientation: landscape) and (max-height: 500px) {
    padding: 10px;
    margin-bottom: 60px;
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
  
  @media (max-height: 600px) {
    gap: 10px;
    margin-bottom: 16px;
  }
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
  
  @media (max-height: 600px) {
    padding: 12px;
    border-radius: 10px;
  }
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
  
  @media (max-height: 600px) {
    padding: 10px;
    margin-bottom: 16px;
    font-size: 12px;
  }
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

const ScrollIndicator = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(140, 90, 255, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1001;
  display: ${props => props.$show ? 'block' : 'none'};
  animation: bounce 2s infinite;
  
  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-10px); }
  }
`;

const DepositStepModal = ({ isOpen, onClose, onConfirm, step = 'approval', language = 'ko', depositAmount = '0' }) => {
  const overlayRef = useRef(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
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
      
      // 스크롤 가능 여부 체크
      setTimeout(() => {
        if (overlayRef.current) {
          const hasScroll = overlayRef.current.scrollHeight > overlayRef.current.clientHeight;
          const isAtBottom = overlayRef.current.scrollTop + overlayRef.current.clientHeight >= overlayRef.current.scrollHeight - 50;
          setShowScrollIndicator(hasScroll && !isAtBottom);
        }
      }, 100);
      
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
  
  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      if (overlayRef.current) {
        const isAtBottom = overlayRef.current.scrollTop + overlayRef.current.clientHeight >= overlayRef.current.scrollHeight - 50;
        const hasScroll = overlayRef.current.scrollHeight > overlayRef.current.clientHeight;
        setShowScrollIndicator(hasScroll && !isAtBottom);
      }
    };
    
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.addEventListener('scroll', handleScroll);
      return () => overlay.removeEventListener('scroll', handleScroll);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isApprovalStep = step === 'approval';
  
  return (
    <>
      <ModalOverlay ref={overlayRef} onClick={onClose}>
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
    <ScrollIndicator $show={showScrollIndicator}>
      {language === 'ko' ? '↓ 아래로 스크롤하세요' : '↓ Scroll down'}
    </ScrollIndicator>
    </>
  );
};

export default DepositStepModal;