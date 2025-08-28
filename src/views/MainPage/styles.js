import { breakpoints, fonts, colors } from "../../styles";
import triangleBg from "assets/main_triangle.png";
// Main App Styles
export const getStyles = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
  }

  body {
    font-family: ${fonts.primary};
    background-color: ${colors.bgPrimary};
    color: ${colors.textPrimary};
    min-height: 100vh;
    position: relative;
  }
  
  /* Prevent horizontal scroll on all devices */
  #root {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
  }

  /* Background Effects */
  .background-gradient {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(ellipse at center, rgba(108, 82, 255, 0.05) 0%, rgba(108, 82, 255, 0.02) 40%, transparent 100%);
    filter: blur(150px);
    opacity: 0.5;
    z-index: -1;
    animation: pulse 10s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.3; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  /* App Container */
  .app {
    font-family: ${fonts.primary};
    background: ${colors.bgPrimary};
    color: ${colors.textPrimary};
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
    position: relative;
    z-index: 1;
  }
  
  /* Main Container */
  .main-container {
    width: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 2;
  }
  
  .main-section {
    width: 100%;
    overflow-x: hidden;
    position: relative;
    z-index: 2;
  }

  /* Header Styles - 완전히 수정됨 */
  .header-wrapper {
    font-family: ${fonts.display};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.68);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .header-container {
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 28px 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 92px;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 8px;
    
  }

  

  .logo {
    width: 40px;
    height: 40px;
    position: relative;
    flex-shrink: 0;
  }

  .logo-right {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }

  .logo-info {
    font-size: 14px;
    color: ${colors.textSecondary};
  }
    .logo-info span {
    position: relative;
    margin-right: 21px;
    }
  .logo-info span:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -10px;
    top: 30%;
    width: 1px;
    height: 9px;
    background: ${colors.textPrimary};
    opacity: 0.2; 
    }
    .live-trading-highlight {
    color: ${colors.success};
    }

  
  /* Wallet Section */
  .wallet-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }
  
  .mobile-header-right {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .event-badge {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border-radius: 12px;
    padding: 8px 20px;
    border: 1px solid ${colors.borderPrimary};
  }
  .event-badge::before {
    content: "";
    position: absolute;
    z-index: -1;
    opacity: 0.2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #8C52FF 0%, #6C52FF 100%);
    border-radius: 12px;
  }
  .event-dot {
    width: 4px;
    height: 4px;
    background: ${colors.success};
    border-radius: 50%;
    box-shadow: 0 0 4px #0EC167;
  }

  .event-text {
    font-size: 16px;
  }


  .price-change {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
  }

  .price-change.positive {
    color: ${colors.success};
  }

  .price-change.negative {
    color: ${colors.error};
  }



  .address-display {
    font-size: 16px;
    color: ${colors.textSecondary};
    white-space: nowrap;
  }

  /* Desktop/Mobile Visibility */
  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  /* Mobile Menu Button */
  .mobile-menu-button {
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }


  /* Main Container */
  .main-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 120px;
  }

  /* Hero Section */
  .main-section {
    position: relative;
    width: 100%;
    min-height: 682px;
    margin-top: 92px;
  }

  .main-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
}


  .main-background-triangle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: max(100vw, 2046px);
    height: max(100vh, 1385px);
    background: url('${triangleBg}') no-repeat center center;
    background-size: cover;
    pointer-events: none;
    filter: opacity(0.8);
  }
  
  @media (max-width: ${breakpoints.mobile}) {
    .main-background {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    
    .main-background-triangle {
      display: none; /* 모바일에서는 큰 배경 이미지 숨김 */
    }
  }

  .main-content-wrapper {
    position: relative;
    z-index: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .balance-display {
    text-align: center;
    margin-bottom: 0px;
    width: 100%;
  }

  .balance-amount {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 100px;
    line-height: 116px;
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .balance-label {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 0.12em;
    color: ${colors.textSecondary};
    opacity: 0.8;
  }

  /* Stats Container */
  .stats-container {
    padding: 12px 0px;
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    
  }

  .main-stat-item {
    width: 280px;
    text-align: center;
    position: relative;
  }
  .main-stat-item:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -1px;
    top: 30%;
    width: 1px;
    height: 48px;
    background: ${colors.borderPrimary};
  }
    

  .main-stat-value {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    letter-spacing: -0.02em;
    color: ${colors.textLabel};
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .main-stat-label {
    font-family: ${fonts.display};
    font-weight: 400;
    font-size: 16px;
    line-height: 28px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
    white-space: nowrap;
  }

  .main-stat-divider {
    width: 1px;
    height: 48px;
    background: ${colors.borderPrimary};
  }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    width: 100%;
  }

  .info-card {
    background: ${colors.bgCard};
    border: 2px solid ${colors.borderPrimary};
    border-radius: 20px;
    padding: 24px 20px;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  // .info-card:hover {
  //   transform: translateY(-4px);
  //   box-shadow: 0 8px 24px rgba(108, 82, 255, 0.1);
  //   border-color: rgba(108, 82, 255, 0.3);
  // }

  .card-value {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: -0.02em;
    color: ${colors.textPrimary};
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-title {
    font-family: ${fonts.display};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: ${colors.textLabel};
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .card-subtitle {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
    white-space: nowrap;
  }

  /* Tabs */
  .tabs-container {
    border-bottom: 1px solid ${colors.borderPrimary};
    margin-bottom: 40px;
    display: flex;
    justify-content: center;
  }

  .tabs-wrapper {
    display: flex;
    gap: 0;
  }
  
  .tabs-wrapper.two-row-tabs {
    flex-direction: column;
    gap: 0;
  }
  
  .tabs-row {
    display: flex;
    justify-content: center;
    gap: 0;
  }

  .tab-button {
    padding: 12px 24px;
    font-family: ${fonts.primary};
    font-weight: 500;
    font-size: 25px;
    line-height: 28px;
    color: ${colors.textMuted};
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    white-space: nowrap;
  }

  .tab-button:hover {
    color: ${colors.textSecondary};
  }

  .tab-button.active {
    color: ${colors.textPrimary};
    border-bottom-color: ${colors.textPrimary};
  }

  /* Tab Content */
  .tab-content {
    max-width: 1440px;
    margin: 0 auto 160px;
    padding: 0 120px;
    display: none;
    animation: fadeIn 0.3s ease;
  }

  .tab-content.tab-content-small {
    max-width: 792px;
    padding: 0;
  }
  .tab-content.active {
    display: block;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tab-content-wrapper {
    display: flex;
    gap: 24px;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .sidebar-content {
    width: 384px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Deposit and Withdraw Container */
  .deposit-withdraw-container {
    display: block;
  }
  
  /* Deposit Locked Standalone */
  .deposit-locked-standalone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    text-align: center;
    padding: 40px;
    background: ${colors.bgCard};
    border: 2px solid ${colors.borderPrimary};
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    margin: 60px auto 0;
    max-width: 600px;
    width: 100%;
  }
  
  .lock-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    animation: lockPulse 2s ease-in-out infinite;
  }
  
  @keyframes lockPulse {
    0%, 100% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  
  .lock-title {
    font-family: ${fonts.display};
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  
  .lock-description {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.5;
    margin-bottom: 20px;
  }
  
  .lock-timer {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: rgba(140, 90, 255, 0.1);
    border: 1px solid rgba(140, 90, 255, 0.3);
    border-radius: 12px;
    padding: 16px 32px;
    margin-bottom: 20px;
  }
  
  .timer-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
  }
  
  .timer-value {
    font-family: ${fonts.monospace};
    font-size: 28px;
    font-weight: 700;
    color: #8C5AFF;
    letter-spacing: 0.05em;
  }
  
  .lock-info {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.5;
  }

  @media (min-width: 769px) {
    .deposit-withdraw-container {
      display: flex !important;
      flex-direction: row !important;
      gap: 20px;
      align-items: flex-start;
    }
    
    .deposit-withdraw-container .deposit-card,
    .deposit-withdraw-container .instant-withdraw-card {
      flex: 1;
      max-width: calc(50% - 10px);
      width: calc(50% - 10px);
      margin-bottom: 0 !important;
    }
    
    /* Override main-content flex-direction for deposit tab */
    .tab-content[class*="active"] .deposit-withdraw-container.main-content {
      flex-direction: row !important;
    }
  }

  /* Form Card */
  .form-card {
    background: ${colors.bgCard};
    border: 2px solid ${colors.borderPrimary};
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .form-header {
    margin-bottom: 20px;
  }

  .form-title {
    white-space: pre-line;
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 25px;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: ${colors.textPrimary};
    margin-bottom: 4px;
  }

  .form-description {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
  }

  .form-description.redeem-description {
    color: ${colors.textPrimary};
  }

  .form-description.withdraw-description {
    color: ${colors.textPrimary};
  }


  .stat-item {
    width: 100%;
    text-align: center;
    position: relative;
  }
  .stat-item:not(:last-child)::after {
    content: "";
    position: absolute;
    right: -1px;
    top: 30%;
    width: 1px;
    height: 48px;
    background: ${colors.borderPrimary};
  }
    

  .stat-value {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 40px;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: ${colors.textLabel};
    white-space: nowrap;
  }

  .stat-label {
    font-family: ${fonts.display};
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
    white-space: nowrap;
  }

  .stat-divider {
    width: 1px;
    height: 48px;
    background: ${colors.borderPrimary};
  }


  /* Token Selector */
  .token-selector {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  .token-option {
    padding: 12px 24px;
    border-radius: 12px;
    border: 1px solid ${colors.borderPrimary};
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.02em;
  }

  .token-option.active {
    background: ${colors.primary};
    color: ${colors.textPrimary};
  }

  .token-option:not(.active) {
    background: ${colors.bgCard};
    color: ${colors.textSecondary};
  }

  .token-option:hover:not(.active) {
    background: ${colors.primaryLight};
    border-color: rgba(108, 82, 255, 0.3);
    color: ${colors.textPrimary};
  }

  /* Checkbox */
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .toggle-switch {
    width: 48px;
    height: 28px;
    background: ${colors.textMuted};
    border-radius: 14px;
    padding: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .toggle-switch.active {
    background: ${colors.primary};
  }

  .toggle-knob {
    width: 20px;
    height: 20px;
    background: ${colors.textPrimary};
    border-radius: 50%;
    transition: all 0.3s ease;
    position: absolute;
    top: 4px;
    left: 4px;
  }

  .toggle-switch.active .toggle-knob {
    left: 24px;
  }

  .checkbox-label {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.textMuted};
  }

  /* Input Fields */
  .input-group {
    margin-bottom: 20px;
  }

  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .input-label {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.textLabel};
  }

  .input-info {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${colors.primary};
  }

  .input-field {
    background: ${colors.bgInput};
    border: 1px solid ${colors.borderSecondary};
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    cursor: text;
  }

  .input-field:hover {
    border-color: ${colors.borderHover};
  }

  .input-field:focus-within {
    border-color: ${colors.primary};
    background: ${colors.primaryLight};
  }

  .input-value {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.textPrimary};
    background: none;
    border: none;
    outline: none;
    width: 100%;
  }

  .input-value::placeholder {
    color: ${colors.textSecondary};
  }

  .input-suffix {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.textSecondary};
    margin-left: 8px;
    white-space: nowrap;
  }

  /* Amount Buttons */
  .amount-buttons {
    display: flex;
    gap: 4px;
  }

  .amount-button {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid ${colors.borderHover};
    border-radius: 8px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: ${fonts.display};
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    color: ${colors.textLabel};
    white-space: nowrap;
  }

  .amount-button:hover {
    background: rgba(108, 82, 255, 0.2);
    border-color: ${colors.primary};
    color: ${colors.textPrimary};
  }

  .amount-button.active {
    background: ${colors.primary};
    border-color: ${colors.primary};
    color: ${colors.textPrimary};
  }

  /* Action Buttons */
  .action-button {
    width: 100%;
    padding: 16px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-family: ${fonts.primary};
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
  }

  .action-button.primary {
    background: ${colors.primary};
    color: ${colors.textPrimary};
  }

  .action-button.primary:hover:not(:disabled) {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(108, 82, 255, 0.4);
  }

  .action-button.primary:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px rgba(108, 82, 255, 0.3);
  }

  .action-button.secondary {
    background: ${colors.bgCard};
    color: ${colors.textSecondary};
    border: 1px solid ${colors.borderPrimary};
  }

  .action-button.secondary:hover:not(:disabled) {
    background: ${colors.borderPrimary};
    color: ${colors.textPrimary};
  }

  .action-button:disabled {
    background: ${colors.borderPrimary};
    color: ${colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Info Cards */
  .info-panel {
    background: ${colors.bgCard};
    border: 2px solid ${colors.borderPrimary};
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .info-panel-title {
    font-family: ${fonts.display};
    font-weight: 700;
    font-size: 20px;
    line-height: 32px;
    letter-spacing: -0.02em;
    color: ${colors.textPrimary};
    margin-bottom: 16px;
  }

  .step-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .step-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .step-item:last-child {
    border-bottom: none;
  }

  .step-number {
    width: 32px;
    height: 32px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ${fonts.primary};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    flex-shrink: 0;
  }

  .step-number.active {
    background: ${colors.textPrimary};
    color: ${colors.borderPrimary};
  }

  .step-number:not(.active) {
    background: ${colors.borderHover};
    color: ${colors.textPrimary};
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-family: ${fonts.primary};
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: ${colors.textPrimary};
    margin-bottom: 4px;
  }

  .step-description {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
  }

  .info-text {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
  }

  /* Status Cards */
  .status-card {
    background: ${colors.bgInput};
    border: 2px solid ${colors.borderSecondary};
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  
  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  .status-row:last-child {
    border-bottom: none;
  }

  .status-label {
    font-family: ${fonts.primary};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textPrimary};
    white-space: nowrap;
  }

  .status-value {
    font-family: ${fonts.primary};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: ${colors.textMuted};
    text-align: right;
    margin-left: 12px;
  }

  /* History Items */
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .history-item {
    background: ${colors.bgInput};
    border: 2px solid ${colors.borderSecondary};
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    gap: 12px;
  }

  .history-item:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: ${colors.borderHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .history-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .history-icon {
    width: 44px;
    height: 44px;
    background: ${colors.bgCard};
    border: 2px solid ${colors.borderPrimary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .history-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    flex: 1;
  }

  .history-action {
    font-family: ${fonts.primary};
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;
    color: ${colors.textPrimary};
    white-space: nowrap;
  }

  .history-amount {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: ${colors.textSecondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .history-time {
    font-family: ${fonts.primary};
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    color: ${colors.textSecondary};
    white-space: nowrap;
  }

  .history-status {
    font-family: ${fonts.display};
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: ${colors.success};
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  /* Icon Styles */
  .icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }

  .icon-button {
    background: none;
    border: none;
    color: ${colors.textSecondary};
    cursor: pointer;
    padding: 8px;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .icon-button:hover {
    color: ${colors.textPrimary};
  }

  /* Loading State */
  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: ${colors.textPrimary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }


  /* Utility Classes */
  .empty-state {
    text-align: center;
    padding: 64px 24px;
    color: ${colors.textMuted};
  }

  .empty-state .icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${colors.error};
    font-size: 14px;
    margin-top: 8px;
  }

  .error-message .icon {
    width: 16px;
    height: 16px;
  }

  .input-error {
    border-color: ${colors.error} !important;
  }

  /* Alert Boxes */
  .alert-box {
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    border-width: 2px;
    border-style: solid;
  }

  .alert-box.info {
    background: rgba(108, 82, 255, 0.1);
    border-color: ${colors.primary};
    color: ${colors.textPrimary};
  }

  .alert-box.warning {
    background: rgba(245, 158, 11, 0.1);
    border-color: ${colors.warning};
    color: ${colors.textPrimary};
  }

  .alert-box.success {
    background: rgba(18, 185, 131, 0.1);
    border-color: ${colors.success};
    color: ${colors.textPrimary};
  }



  /* Landing Footer */
  .landing-footer {
    background: #000000;
    padding: 60px 100px;
  }

  .landing-footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-logo-container {
    margin-bottom: 40px;
  }

  .landing-footer-subtitle {
    font-size: 16px;
    color: ${colors.textSecondary};
    font-weight: 400;
    line-height: 28px;
    margin-bottom: 29px;
  }

  .landing-footer-disclaimer {
    white-space: pre-line;
    font-size: 13px;
    color: ${colors.textPrimary};
    line-height: 20px;
    max-width: 800px;
    margin: 0 auto;
    opacity: 0.36;
  }
  .landing-footer-sns {
    display: flex;
    gap: 25px;
    margin: 25px 0 40px;
  }
  .landing-footer-sns-item {
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: transform 0.2s ease;
  }
  .landing-footer-sns-item:hover {
    transform: translateY(-2px);
  }

  .landing-footer-copyright {
  font-family: ${fonts.display};
    width: 1240px;
    // margin: 0 auto;
    font-size: 14px;
    color: #666666;
    font-weight: 300;
    letter-spacing: 0.02em;
    padding-top: 24px;
    border-top: 1px solid rgba(127, 122, 109, 0.2);
  }
  .landing-footer-copyright strong {
    color: #c8c8c8;
    font-weight: 700;
  }

  /* Private Data Style */
  [data-private="true"] {
    filter: blur(8px);
    user-select: none;
  }

  /* Error Container */
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
  }

  .error-container .icon {
    width: 60px;
    height: 60px;
    margin-bottom: 24px;
    color: ${colors.error};
  }

  .error-container h1 {
    font-size: 32px;
    margin-bottom: 16px;
    color: ${colors.error};
  }

  .error-container p {
    font-size: 16px;
    color: ${colors.textSecondary};
    margin-bottom: 32px;
    max-width: 500px;
  }

  /* Scroll to Top Button */
  .scroll-top {
    position: fixed;
    bottom: 40px;
    right: 40px;
    width: 48px;
    height: 48px;
    background: rgba(108, 82, 255, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 100;
    border: none;
    color: ${colors.textPrimary};
  }

  .scroll-top.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .scroll-top:hover {
    background: ${colors.primaryDark};
    transform: translateY(-4px);
  }

  /* Responsive Design - 완전히 재작성 */
  @media (max-width: ${breakpoints.desktop}) {
    .header-container,
    .main-container,
    .footer-container {
      padding: 0 40px;
    }
    
    .navbar {
      gap: 15px;
    }
    
    .nav-stats {
      gap: 12px;
    }
 
    
    .cards-grid {
      // grid-template-columns: repeat(2, 1fr);
    }
    
    .tab-content-wrapper {
      flex-direction: column;
    }
    .tab-content { 
      margin: 0 16px;
      padding: 0;
    }
    .tab-content.tab-content-small {
      margin: 0 auto 160px
    }
    .sidebar-content {
      width: 100%;
    }

  }

  @media (max-width: ${breakpoints.tablet}) {
    .header-container,
    .main-container,
    .footer-container {
      padding: 0 16px;
    }
    .header-container {
      padding: 16px;
      height: 68px;
    }
    
    .navbar {
      padding: 12px 0;
      height: 60px;
      gap: 10px;
    }
    

    /* Hide desktop elements */
    .desktop-only {
      display: none !important;
    }
    
    /* Show mobile elements */
    .mobile-only {
      display: flex !important;
    }

    .logo {
      width: 36px;
      height: 36px;
    }
    .logo-text {
      height: 14.8px;
    }
    .logo-info {
      font-size: 12px;
    }
  
  .logo-info span:not(:last-child)::after {
    height: 8px;
    }
    
    .main-container {
      // padding-top: 80px;
    }
    
    .main-content-wrapper {
    margin-top: 0px;
    }
    .main-background-triangle {
      filter: opacity(0.4);
    }




    /* Wallet Section */
  .wallet-section {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .event-badge {
    padding: 4px 12px;
    border-radius: 8px;
    font-family: ${fonts.display};
  }
  .event-badge::before {
    border-radius: 8px;
  }
  .event-dot {
    width: 4px;
    height: 4px;
    background: ${colors.success};
    border-radius: 50%;
    box-shadow: 0 0 4px #0EC167;
  }

  .event-text {
    font-size: 12px;
  }


  .price-change {
    font-size: 12px;
    
  }

  .address-display {
    font-family: ${fonts.display};
    font-size: 14px;
    color: ${colors.textPrimary};
    line-height: 20px;
  }
    
    .main-section {
      min-height: 660px;
      margin-top: 68px;
    }
    
    .balance-display {
      margin-bottom: 0px;
      width: 90%;
    }
    .balance-amount {
      font-size: 60px;
      line-height: 72px;
    }
    
    .balance-label {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.08em;
    }
    
    .stats-container {
    width: 100%;
      // flex-direction: column;
      // gap: 20px;
      // padding: 20px;
    }
    
    .stat-divider {
      width: 100%;
      height: 1px;
    }
    
    .main-stat-item {
      width: 100%;
    }
    .main-stat-value {
      font-size: 24px;
      line-height: 36px;
    }
    
    .main-stat-label {
      font-size: 13px;
      line-height: 20px;
    }

    .main-stat-item:not(:last-child)::after {
      top: 15%;
    }


    .stat-item {
      width: 100%;
    }
    .stat-value {
      font-size: 24px;
      line-height: 36px;
    }
    
    .stat-label {
      font-size: 13px;
      line-height: 20px;
    }

    .stat-item:not(:last-child)::after {
      top: 15%;
    }
    

    .cards-grid {
      grid-template-columns: unset;
      gap: 16px;
      width: 100%;
    }
    .info-card-wrap {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      width: 100%;
      padding: 20px 16px;
      gap: 16px;
      background: rgba(24, 27, 37, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;      
    }
    
    .info-card {
      background: unset;
      border-radius: unset;
      border: unset;
      box-shadow: unset;
      padding: 0;
    }
    
    .card-value {
      font-size: 24px;
      line-height: 32px;
    }
    
    .card-title {
      font-size: 13px;
      line-height: 20px;
    }
    
    .card-subtitle {
      font-size: 12px;
      line-height: 18px;
    }
    
    .tabs-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    
    .tabs-container::-webkit-scrollbar {
      display: none;
    }

    .tab-content {
      margin: 0 16px 40px;
    }
    .tab-content.tab-content-small {
    margin: 0 16px 40px;
    }
    .tabs-wrapper {
      min-width: max-content;
      padding: 0 20px;
    }
    
    .tab-button {
      padding: 12px 10px;
      font-size: 20px;
      line-height: 24px;
    }

    .main-content {
      gap: 16px;
    }
    
    .form-card {
      padding: 20px;
    }
    
    
    .token-selector {
      // flex-direction: column;
    }
    
    .token-option {
      // width: 100%;
      text-align: center;
    }
    
    .status-card {
      padding: 12px;
    }
    .status-row {
      padding: 8px 16px;
    }
    .amount-buttons {
      justify-content: space-between;
    }
    
    .amount-button {
      flex: 1;
    }

    .results-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .expected-results {
      padding: 16px;
    }
    
    .alert-box {
      padding: 12px;
      font-size: 13px;
    }
    
      
    .status-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .status-card-no-border .status-row { 
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }
    
    .status-value {
      margin-left: 0;
      text-align: left;
    }
    
    .history-item {
      padding: 16px;
      // flex-direction: column;
      // align-items: flex-start;
    }
    
    .history-left {
      width: 100%;
    }
    
    .history-right {
      // width: 100%;
      // flex-direction: row;
      // justify-content: space-between;
      // align-items: center;
      // margin-top: 8px;
    }
    
    .history-icon {
      width: 36px;
      height: 36px;
    }
    
    .step-item {
      padding: 8px 0;
    }
    
    .step-number {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
    
    .step-title {
      font-size: 14px;
    }
    
    .step-description {
      font-size: 12px;
    }
    
    .info-panel {
      padding: 16px;
    }
    
    .info-panel-title {
      font-size: 18px;
    }

    .landing-footer {
      padding: 40px 16px;
    }
    .footer-logo-container {
      margin-bottom: 20px;
    }
    .footer-logo-container img {
      height: 32px;
      width: 140px;
    }
    .landing-footer-title {
      font-size: 20px;
    }
    
    .landing-footer-subtitle {
      font-size: 13px;
      margin-bottom: 12px;
      line-height: 20px;
    }
    
    .landing-footer-disclaimer {
      font-size: 11px;
      lien-height: 16px;
    }
    .landing-footer-sns {
      margin: 12px 0;
      gap: 12px;
    }
    .landing-footer-sns-item img {
      width: 18px;
      height: 18px;
    }
    .landing-footer-copyright {
      width: 100%;
      font-size: 11px;
    }
    
    .scroll-top {
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    .balance-amount {
      font-size: 48px;
      line-height: 56px;
    }
    
    .balance-label {
      font-size: 12px;
      line-height: 18px;
    }
    
    .cards-grid {
      gap: 12px;
    }
    
    .card-value {
      font-size: 20px;
      line-height: 28px;
    }
    
    .card-title {
      font-size: 13px;
      line-height: 18px;
    }
    
    
    
    .stat-value {
      font-size: 28px;
      line-height: 36px;
    }
    
    .stat-label {
      font-size: 12px;
      line-height: 18px;
    }
    
    .tabs-wrapper {
      padding: 0 10px;
    }
    

    .tab-content-wrapper {
      gap: 16px;
    }


    .tab-button {
      // padding: 6px 12px;
    }
    
    .form-card {
      padding: 16px;
    }
    
    .input-header.with-buttons {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .input-header.with-buttons .amount-buttons {
      width: 100%;
    }
    
    .sidebar-content {
      gap: 16px;
    }
    .action-button {
      padding: 14px 16px;
      font-size: 14px;
    }
    
    
    .history-action {
      font-size: 20px;
    }
    
    .history-amount {
      font-size: 18px;
    }
    
    .history-time {
      font-size: 11px;
    }
    
    .history-status {
      font-size: 14px;
    }
    
    .footer-badge {
      padding: 6px 12px;
      font-size: 11px;
    }
    
    /* Mobile styles for deposited BGSC to handle 10-digit numbers */
    .deposited-value {
      font-size: 24px !important;
      white-space: nowrap;
      word-break: keep-all;
    }
    
    .deposited-label {
      font-size: 22px !important;
    }
    
    .deposited-container {
      max-width: 100%;
      padding: 0 8px;
    }

  }

  /* Professional Hero Section - Complete Redesign */
  .hero-section-pro {
    width: 100%;
    margin-top: 20px;
    padding: 40px 0;
    position: relative;
    overflow: visible;
  }

  /* Main Grid Layout */
  .hero-main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  /* Hero Card Base Styles */
  .hero-card {
    position: relative;
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
  }
  .hero-card:nth-child(1),
  .hero-card:nth-child(2) {
    height: 332px; 
  }
  
  .hero-card:nth-child(3),
  .hero-card:nth-child(4) {
    height: 316px; 
  }

  .hero-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%);
    pointer-events: none;
  }

  .hero-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.12);
  }

  .card-inner {
    position: relative;
    padding: 24px;
    z-index: 1;
  }
  
  /* Bonus Badge Corner */
  .bonus-badge-corner {
    position: absolute;
    top: 40px;
    right: 24px;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #333333ff;
    padding: 8px 16px;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    z-index: 10;
    animation: pulse-glow 2s ease-in-out infinite;
    transform: translateY(-50%);
    text-align: center;
  }
  
  .bonus-main-text {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .bonus-sub-text {
    font-size: 15px;
    font-weight: 600;
    opacity: 0.9;
    margin-top: 2px;
  }
  
  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.6);
      transform: scale(1.05);
    }
  }

  .reward-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: #141414;
    border-radius: 20px;
    margin-bottom: 24px;
  }

  .reward-label {
    font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 700;
    line-height: 32px;
    color: #9095FB;
    margin-bottom: 12px;
  }

  .reward-amount {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 24px;
  }

  .amount-number {
    font-family: ${fonts.display};
    font-size: 60px;
    font-weight: 700;
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -1px;
    line-height: 80px;
  }

  .amount-unit {
  font-family: ${fonts.display};
    font-size: 28px;
    font-weight: 700;
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .reward-details {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    padding: 12px 16px;
    background: rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
  }

  .timer-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .timer-icon {
    color: rgba(140, 90, 255, 0.8);
  }

  .round-label {
    font-size: 18px;
    font-weight: 700;
    color: ${colors.textSecondary};
  }

  .round-badge {
    margin-left: auto;
    padding: 6px 12px;
    background: rgba(108, 82, 255, 0.12);
    border: 1px solid #6C52FF;
    border-radius: 18px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .timer-countdown {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 45px 0;
  }

  .time-unit {
    text-align: center;
  }

  .time-value {
    font-size: 60px;
    font-weight: 700;
    min-width: 80px;
    font-family: ${fonts.display};
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-variant-numeric: tabular-nums;
    line-height: 80px;
    letter-spacing: -1px;
  }

  .time-label {
    font-size: 12px;
    font-weight: 600;
    color: ${colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: 1px;
    line-height: 16px;
    margin-top: 4px;
  }

  .time-separator {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    vertical-align: top;
    color: ${colors.textSecondary};
    animation: blink 1s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .timer-footer {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    padding: 12px 16px;
    background: rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
  }

  .tvl-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 50px;
  }

  .tvl-icon {
    color: rgba(6, 214, 160, 0.8);
  }

  .tvl-label {
    font-size: 18px;
    font-weight: 700;
    color: ${colors.textSecondary};
  }

  .live-indicator {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    font-size: 14px;
    font-weight: 600;
    color: ${colors.success};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-family: ${fonts.display};
  }

  .live-dot {
    width: 4px;
    height: 4px;
    background: ${colors.success};
    border-radius: 50%;
    box-shadow: 0px 0px 4px #0EC167;
    animation: livePulse 2s ease-in-out infinite;
  }

  @keyframes livePulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  .tvl-amount {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 49px;
  }

  .tvl-number {
    font-size: 60px;
    font-weight: 700;
    font-family: ${fonts.display};
    line-height: 80px;
    background: linear-gradient(135deg, #12B983 0%, #06B6D3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -1px;
    // font-variant-numeric: tabular-nums;
  }

  .tvl-unit {
    font-size: 28px;
    font-weight: 700;
    font-family: ${fonts.display};
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tvl-progress {
    position: relative;
  }

  .progress-bar {
    width: 100%;
    height: 5px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    // overflow: hidden;
    margin-bottom: 23px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(to right, #12B983 0%, #06B6D3 100%);
    border-radius: 3px;
    transition: width 0.6s ease;
    position: relative;
    // overflow: hidden;
  }

  .progress-dot {
    width: 7px;
    height: 7px;
    background: #06B6D3;
    position: absolute;
    top: -1px;
    right: -2.5px;
    border-radius: 50%;
  }

  // .progress-fill::after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  //   background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  //   animation: shimmer 2s infinite;
  // }

  // @keyframes shimmer {
  //   0% { transform: translateX(-100%); }
  //   100% { transform: translateX(100%); }
  // }

  .progress-label {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    padding: 12px 16px;
    background: rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
  }

  .apy-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .apy-label {
    font-size: 18px;
    font-weight: 700;
    color: ${colors.textSecondary};
    letter-spacing: -2%;
    line-height: 28px;
  }

  .apy-display {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    margin: 56px 0;
    position: relative;
  }

  .apy-number {
    font-family: ${fonts.display};
    font-size: 60px;
    font-weight: 700;
    background: linear-gradient(135deg, #16A9F2 0%, #6DACFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 80px;
    font-variant-numeric: tabular-nums;
    
  }

  .apy-symbol {
    font-family: ${fonts.display};
    font-size: 28px;
    font-weight: 700;
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 44px;
    
  }
  .round1-bonus-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    margin-left: 12px;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
    animation: glow 2s ease-in-out infinite;
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4); }
    50% { box-shadow: 0 2px 16px rgba(255, 215, 0, 0.6); }
  }

  .apy-subtitle {
    text-align: center;
    line-height: 24px;
    letter-spacing: 4%;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    padding: 12px 16px;
    background: rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 8px;
  }
  
  .apy-bonus-badge {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #333333ff;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  }

  /* Notice Banner */
  .hero-notice-banner {
    background: linear-gradient(0deg, rgba(108, 82, 255, 0.04), rgba(108, 82, 255, 0.04)), rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(108, 82, 255, 0.4);
    border-radius: 20px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    position: relative;
    overflow: hidden;
  }

  .hero-notice-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(140, 90, 255, 0.1) 50%, transparent 100%);
    animation: noticeShimmer 3s infinite;
  }

  @keyframes noticeShimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  .notice-icon {
    width: 24px;
    height: 24px;
  }

  .notice-text {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 28px;
    text-align: center;
  }

  /* Mobile Responsive for Professional Hero Section */
  @media (max-width: ${breakpoints.tablet}) {
    .hero-section-pro {
      padding: 0;
      margin-top: 32px;
    }

    .hero-main-grid {
      grid-template-columns: 1fr;
      margin-bottom: 24px;
    }

    .hero-card:nth-child(1),
    .hero-card:nth-child(2),
    .hero-card:nth-child(3),
    .hero-card:nth-child(4) {
      height: auto; 
    }
  


    /* Mobile adjustments for reward pool */
    .reward-icon-wrapper {      
      margin-bottom: 16px;
    }

    .reward-label {
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 4%;
      margin-bottom: 8px;
    }

    .reward-amount {
      margin-bottom: 16px;
    }

    .amount-number {
      font-size: 32px;
      line-height: 40px;
    }

    .amount-unit {
      font-size: 20px;
      line-height: 32px;
    }

    .reward-details {
      font-size: 13px;
    }

    /* Mobile adjustments for timer */
    .timer-header {
      gap: 9px;
    }

    .round-label {
      font-size: 14px;
    }

    .timer-countdown {
      margin: 16px 0;
    }

    .time-value {
      font-size: 32px;
      line-height: 40px;
    }

    .time-separator {
      font-size: 16px;
      line-height: 24px;
    }

    .time-label {
      margin-top: 0px;
    }
    
    .timer-footer {
      font-size: 13px;
    }

    /* Mobile adjustments for TVL */
    .tvl-header {
      margin-bottom: 16px;
      gap: 8px;
    }
    .tvl-amount {
      margin-bottom: 15px;
    }
    
    .tvl-label {
      font-size: 14px;
      line-height: 20px;
    }

    .tvl-number {
      font-size: 32px;
      line-height: 40px;
    }

    .tvl-unit {
      font-size: 20px;
      line-height: 32px;
    }
    
    .progress-label {
      font-size: 13px;
    }

    /* Mobile adjustments for APY */
    

    .apy-display {
      margin: 16px 0;
    }

    .apy-label {
      font-size: 14px;
      line-height: 20px;
    }

    .apy-number {
      font-size: 32px;
      line-height: 40px;
    }

    .apy-symbol {
      font-size: 20px;
      line-height: 32px;
    }

    .apy-subtitle {
      font-size: 13px;
      margin-top: 40px; /* 모바일에서 더 많은 간격 */
    }

    /* Mobile notice banner */
    .hero-notice-banner {
      padding: 14px 20px;
      border-radius: 14px;
      margin-top: 24px;
    }


    .notice-text {
      font-size: 14px;
    }
    .round1-bonus-badge {
      font-size: 12px;
      padding: 3px 8px;
      margin-left: 8px;
    }
    .bonus-badge-corner {
      top: 44px; /* 모바일에서 조정 */
      right: 16px;
      padding: 6px 12px;
    }
    .bonus-main-text {
      font-size: 15px;
    }
    .bonus-sub-text {
      font-size: 10px;
    }
    .apy-bonus-badge {
      font-size: 13px;
      padding: 3px 10px;
      bottom: -30px; /* 모바일에서 더 아래로 조정 */
    }
  }


  /* Mobile-specific Hero Styles */
  .hero-mobile-layout {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hero-card-mobile {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: all 0.3s ease;
  }

  .card-inner-mobile {
    padding: 16px;
  }

  .card-inner-mobile.compact {
    padding: 14px;
  }

  /* Mobile Reward Pool */
  .reward-pool-mobile {
    background: linear-gradient(135deg, rgba(25, 20, 45, 0.9) 0%, rgba(35, 25, 55, 0.9) 100%);
    border: 1px solid rgba(140, 90, 255, 0.15);
  }

  .mobile-reward-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  .mobile-reward-header svg {
    color: #8C5AFF;
    width: 24px;
    height: 24px;
  }

  .mobile-label {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mobile-reward-amount {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin-bottom: 8px;
  }

  .mobile-number {
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mobile-unit {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 215, 0, 0.8);
  }

  .mobile-reward-details {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
  }

  /* Mobile Timer */
  .timer-mobile {
    background: linear-gradient(135deg, rgba(20, 15, 35, 0.9) 0%, rgba(30, 20, 45, 0.9) 100%);
    border: 1px solid rgba(140, 90, 255, 0.1);
  }

  .mobile-timer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .mobile-round-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
  }

  .mobile-round-info svg {
    color: rgba(140, 90, 255, 0.8);
    width: 16px;
    height: 16px;
  }

  .mobile-badge {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 214, 160, 0.15) 100%);
    color: #10b981;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }

  .mobile-timer-content {
    text-align: center;
  }

  .mobile-timer-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 4px;
    display: block;
  }

  .mobile-timer-display {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    font-variant-numeric: tabular-nums;
    letter-spacing: -1px;
  }

  /* Mobile TVL & APY Row */
  .hero-mobile-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .tvl-mobile {
    background: linear-gradient(135deg, rgba(15, 25, 20, 0.9) 0%, rgba(20, 35, 25, 0.9) 100%);
    border: 1px solid rgba(6, 214, 160, 0.1);
  }

  .apy-mobile {
    background: linear-gradient(135deg, rgba(15, 20, 30, 0.9) 0%, rgba(20, 30, 40, 0.9) 100%);
    border: 1px solid rgba(0, 212, 255, 0.1);
  }

  .mobile-metric-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .mobile-metric-label {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mobile-live {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 600;
    color: #10b981;
    text-transform: uppercase;
  }

  .mobile-live::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    animation: livePulse 2s ease-in-out infinite;
  }

  .mobile-metric-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .mobile-tvl-number {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, #06D6A0 0%, #05AA82 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mobile-apy-number {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, #00D4FF 0%, #0099CC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .mobile-metric-unit {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.6);
  }

  /* Mobile Notice */
  .hero-mobile-notice {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 20px;
    padding: 16px;
    background: linear-gradient(0deg, rgba(108, 82, 255, 0.04), rgba(108, 82, 255, 0.04)), rgba(24, 27, 37, 0.32);
    border: 1px solid rgba(108, 82, 255, 0.4);
    border-radius: 20px;
    margin-bottom: 40px;
  }


  /* Toast Override for this design */
  .toaster-container {
    --toaster-font: ${fonts.primary};
  }
`;
