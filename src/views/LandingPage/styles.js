import { breakpoints, colors, fonts } from "../../styles";
import triangleBg from "assets/main_triangle.png";
import landingBg from "assets/landing_bg.png";
// Landing Page Styles
export const getLandingPageStyles = () => `
  /* Landing Page Container */
  .landing-container {
    background-color: #000000;
    min-height: 100vh;
    color: #FFFFFF;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
    position: relative;
  }

  /* Landing Header */
  .landing-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 92px;
    transition: all 0.3s ease;
    z-index: 1000;
    padding: 12px 120px;
    background: rgba(0, 0, 0, 0.68);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);


  }

  // .landing-header.scrolled {
  //   background: rgba(0, 0, 0, 0.68);
  //   backdrop-filter: blur(16px);
  // }

  .landing-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    padding: 16px 0;
  }

  .landing-logo-container {
    display: flex;
    align-items: center;
  }

  .landing-logo {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .landing-logo-text {
  font-family: ${fonts.display};
    font-size: 20px;
    font-weight: 700;
    color: #FFFFFF;
  }

  .landing-nav-menu {
    display: flex;
    gap: 36px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .landing-nav-link {
    font-size: 16px;
    font-weight: 500;
    color: ${colors.textSecondary};
    cursor: pointer;
    transition: color 0.3s ease;
    text-decoration: none;
  }

  .landing-nav-link:hover {
    color: #FFFFFF;
  }
  
  /* RainbowKit Connect Button Customization for Landing Page */
  .landing-navbar [data-testid="rk-connect-button"] {
    background: ${colors.buttonGradient};
    color: white;
    font-weight: 600;
    font-size: 16px;
    padding: 12px 24px;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .landing-navbar [data-testid="rk-connect-button"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(117, 65, 200, 0.3);
  }
  
  .landing-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .landing-navbar [data-testid="rk-account-button"] {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 500;
    font-size: 16px;
    padding: 12px 24px;
    border-radius: 8px;
  }
  
  .landing-navbar [data-testid="rk-account-button"]:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  /* Landing Main Content */
  .landing-main-content {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    position: relative;
  }

  /* Landing Hero Section */
  .landing-hero-section {
    position: relative;
    width: 100%;
    min-height: 960px;
    overflow: hidden;
  }
.landing-hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}


  .landing-hero-background-triangle {
    position: absolute;
    top: -400px;
    left: -400px;
    width: 2046px;
    height: 1385px;
    background: url('${triangleBg}') no-repeat center center;
    pointer-events: none;
    filter: opacity(0.9);
  }

  .landing-hero-background-up {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('${landingBg}') no-repeat center center;
  }

  .landing-hero-content-wrapper {
    position: absolute;
    z-index: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 120px
  }

  .landing-hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    width: 762px;
  }

  .landing-hero-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    width: 100%;
  }

  .landing-event-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(153, 153, 153, 0.12);
    border-radius: 12px;
    padding: 8px 16px;
  }

  .landing-event-dot {
    width: 8px;
    height: 8px;
    background: ${colors.success};
    border-radius: 50%;
    box-shadow: 0 0 8px #0EC167;
  }

  .landing-event-text {
    font-size: 14px;
    color: ${colors.textSecondary};
    font-weight: 500;
  }

  .landing-hero-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
  }

  .landing-hero-title {
    font-family: ${fonts.display};
    font-size: 88px;
    font-weight: 700;
    line-height: 108px;
    margin-bottom: 24px;
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
  }

  .landing-hero-subtitle {
    font-size: 16px;
    color: #cacfd8;
    line-height: 24px;
    text-align: center;
  }
  .landing-hero-subtitle strong {
    font-weight: 700;
  }

  .landing-hero-buttons {
    position: relative;
    z-index: 10;
    display: flex;
    gap: 12px;
  }

  .landing-cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: ${colors.buttonGradient};
    color: #FFFFFF;
    padding: 16px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0px 0px 0px 1px #4C1EE3, 
    0px 16px 24px -8px rgba(24, 27, 37, 0.1), 
    inset 0px -2px 4px rgba(14, 18, 27, 0.3), 
    inset 0px 2px 6px rgba(255, 255, 255, 0.25);
  }

  .landing-cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(142, 89, 255, 0.4);
  }

  /* Landing Countdown Timer */
  .landing-countdown-container {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 10;
  }

  @keyframes countdownGlow {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(108, 82, 255, 0.3),
        0 0 40px rgba(108, 82, 255, 0.2),
        inset 0 0 20px rgba(144, 149, 251, 0.1);
    }
    50% {
      box-shadow: 
        0 0 30px rgba(108, 82, 255, 0.5),
        0 0 60px rgba(108, 82, 255, 0.3),
        inset 0 0 25px rgba(144, 149, 251, 0.2);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .landing-countdown-title {
    font-size: 14px;
    font-weight: 600;
    color: ${colors.textPrimary};
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: relative;
    padding: 8px 24px;
    background: rgba(108, 82, 255, 0.1);
    border: 1px solid rgba(108, 82, 255, 0.3);
    border-radius: 100px;
    backdrop-filter: blur(10px);
  }

  .landing-countdown-title::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -60px;
    right: -60px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(108, 82, 255, 0.3) 30%, 
      rgba(108, 82, 255, 0.3) 70%, 
      transparent 100%);
    transform: translateY(-50%);
    z-index: -1;
  }

  .landing-countdown-boxes {
    display: flex;
    gap: 12px;
    position: relative;
  }

  .landing-countdown-boxes::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(ellipse at center, 
      rgba(108, 82, 255, 0.15) 0%, 
      rgba(144, 149, 251, 0.1) 40%, 
      transparent 70%);
    filter: blur(40px);
    z-index: -1;
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 1;
    }
  }

  .landing-countdown-box {
    background: linear-gradient(135deg, rgba(24, 27, 37, 0.8) 0%, rgba(108, 82, 255, 0.1) 100%);
    border: 1px solid rgba(144, 149, 251, 0.3);
    border-radius: 12px;
    padding: 16px 20px;
    min-width: 80px;
    text-align: center;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    animation: countdownGlow 3s ease-in-out infinite;
  }

  .landing-countdown-box::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(144, 149, 251, 0.5) 50%, 
      transparent 70%);
    background-size: 200% 200%;
    border-radius: 16px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
    animation: shimmer 3s linear infinite;
  }

  .landing-countdown-box:hover::before {
    opacity: 1;
  }

  .landing-countdown-box:hover {
    border-color: rgba(144, 149, 251, 0.6);
    transform: translateY(-4px) scale(1.05);
    background: linear-gradient(135deg, rgba(24, 27, 37, 0.9) 0%, rgba(108, 82, 255, 0.2) 100%);
  }

  .landing-countdown-value {
    font-size: 32px;
    font-weight: 700;
    color: ${colors.textPrimary};
    font-family: ${fonts.display};
    background: linear-gradient(135deg, #FFFFFF 0%, #9095FB 50%, #BD85FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(144, 149, 251, 0.5);
    position: relative;
    z-index: 1;
  }

  .landing-countdown-label {
    font-size: 11px;
    font-weight: 600;
    color: rgba(144, 149, 251, 0.9);
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    position: relative;
    z-index: 1;
  }

  /* Landing Yield Section */
  .landing-yield-section {
    padding: 80px 120px 40px;
    position: relative;
    z-index: 10;
  }

  .landing-yield-container {
    background: rgba(24, 27, 37, 0.6);
    border: 1px solid rgba(144, 149, 251, 0.1);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    overflow: hidden;
  }

  .landing-yield-header {
    padding: 32px 40px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(144, 149, 251, 0.1);
    transition: all 0.3s ease;
  }

  .landing-yield-header:hover {
    background: rgba(108, 82, 255, 0.05);
  }

  .landing-yield-title {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .landing-yield-badge {
    display: inline-flex;
    padding: 6px 14px;
    background: linear-gradient(135deg, rgba(108, 82, 255, 0.2) 0%, rgba(144, 149, 251, 0.2) 100%);
    border: 1px solid rgba(144, 149, 251, 0.3);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    color: #9095FB;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  .landing-yield-subtitle {
    font-size: 16px;
    color: ${colors.textSecondary};
    font-weight: 400;
  }

  .landing-yield-toggle {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(108, 82, 255, 0.1);
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .landing-yield-toggle.open {
    transform: rotate(180deg);
  }

  .landing-yield-content {
    padding: 40px;
  }

  /* Landing Yield Preview (Collapsed State) */
  .landing-yield-preview {
    padding: 32px 40px;
    background: linear-gradient(135deg, rgba(144, 149, 251, 0.05) 0%, rgba(189, 133, 252, 0.05) 100%);
    border-top: 1px solid rgba(144, 149, 251, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .landing-yield-preview:hover {
    background: linear-gradient(135deg, rgba(144, 149, 251, 0.08) 0%, rgba(189, 133, 252, 0.08) 100%);
  }

  .landing-yield-preview .landing-yield-metrics {
    margin-bottom: 24px;
  }

  .landing-yield-preview .landing-yield-chart-container {
    margin-bottom: 0;
  }

  .landing-yield-preview-cta {
    font-size: 14px;
    font-weight: 600;
    color: #9095FB;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
      transform: translateX(0);
    }
    50% {
      opacity: 1;
      transform: translateX(5px);
    }
  }

  .landing-yield-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin-bottom: 40px;
  }

  .landing-yield-metric-item {
    text-align: center;
  }

  .landing-yield-metric-value {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #9095FB 0%, #BD85FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
  }

  .landing-yield-metric-label {
    font-size: 14px;
    color: ${colors.textSecondary};
  }

  .landing-yield-chart-container {
    background: rgba(144, 149, 251, 0.05);
    border: 1px solid rgba(144, 149, 251, 0.1);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
  }

  .landing-yield-chart-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    color: ${colors.textPrimary};
  }

  .landing-yield-chart {
    position: relative;
    height: 140px;
    margin-bottom: 16px;
  }

  .landing-yield-chart-stats {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    font-size: 13px;
  }

  .landing-yield-chart-stat {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .landing-yield-chart-stat-label {
    color: ${colors.textSecondary};
  }

  .landing-yield-chart-stat-highlight {
    color: #9095FB;
  }

  .landing-yield-section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${colors.textPrimary};
  }

  .landing-yield-tvl-simulator {
    background: rgba(108, 82, 255, 0.05);
    border: 1px solid rgba(108, 82, 255, 0.15);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }

  .landing-yield-tvl-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .landing-yield-tvl-label {
    font-size: 13px;
    color: ${colors.textSecondary};
  }

  .landing-yield-tvl-value {
    font-size: 18px;
    color: #9095FB;
  }

  .landing-tvl-slider {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    margin-bottom: 8px;
  }

  .landing-tvl-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #9095FB;
    border: 3px solid rgba(24, 27, 37, 0.8);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(144, 149, 251, 0.5);
  }

  .landing-tvl-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #9095FB;
    border: 3px solid rgba(24, 27, 37, 0.8);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(144, 149, 251, 0.5);
  }

  .landing-tvl-slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #666;
    margin-bottom: 12px;
  }

  .landing-tvl-reset-btn {
    padding: 8px 16px;
    font-size: 13px;
    background: rgba(108, 82, 255, 0.2);
    border: 1px solid rgba(108, 82, 255, 0.4);
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .landing-tvl-reset-btn:hover {
    background: rgba(108, 82, 255, 0.3);
    transform: translateY(-1px);
  }

  .landing-yield-reward-pool {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    background: rgba(144, 149, 251, 0.05);
    border: 1px solid rgba(144, 149, 251, 0.1);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }

  .landing-yield-reward-item {
    text-align: center;
  }

  .landing-yield-reward-label {
    font-size: 13px;
    color: ${colors.textSecondary};
    margin-bottom: 6px;
  }

  .landing-yield-reward-value {
    font-size: 24px;
    font-weight: 700;
    color: #9095FB;
  }

  .landing-yield-description {
    font-size: 15px;
    line-height: 24px;
    color: ${colors.textSecondary};
    margin-bottom: 24px;
  }

  .landing-yield-description strong {
    color: ${colors.textPrimary};
  }

  .landing-yield-warning {
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 32px;
  }

  .landing-yield-warning-title {
    font-size: 14px;
    font-weight: 600;
    color: #f59e0b;
    margin: 0 0 8px;
  }

  .landing-yield-warning-content {
    font-size: 13px;
    line-height: 20px;
    color: #e3e3e3;
    margin: 0;
  }

  .landing-yield-warning-content strong {
    color: #f59e0b;
  }

  .landing-yield-calculator {
    background: rgba(108, 82, 255, 0.05);
    border: 1px solid rgba(108, 82, 255, 0.15);
    border-radius: 16px;
    padding: 24px;
  }

  .landing-yield-calculator-input-wrapper {
    margin-bottom: 20px;
  }

  .landing-yield-calculator-label {
    display: block;
    font-size: 13px;
    color: ${colors.textSecondary};
    margin-bottom: 8px;
  }

  .landing-yield-calculator-hint {
    font-size: 11px;
    color: #9095FB;
    margin-left: 8px;
  }

  .landing-yield-calculator-input {
    width: 100%;
    padding: 14px 18px;
    font-size: 18px;
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(144, 149, 251, 0.3);
    border-radius: 10px;
    color: #fff;
    outline: none;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .landing-yield-calculator-input:focus {
    border-color: rgba(144, 149, 251, 0.6);
    background: rgba(255, 255, 255, 0.1);
  }

  .landing-yield-calculator-results {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .landing-yield-calculator-result-item {
    background: rgba(144, 149, 251, 0.05);
    border: 1px solid rgba(144, 149, 251, 0.1);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
  }

  .landing-yield-calculator-result-label {
    display: block;
    font-size: 12px;
    color: ${colors.textSecondary};
    margin-bottom: 6px;
  }

  .landing-yield-calculator-result-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: ${colors.textPrimary};
  }

  .landing-yield-calculator-result-highlight {
    background: linear-gradient(135deg, #9095FB 0%, #BD85FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .landing-hero-graphic {
    position: relative;
    width: 974.4px;
    height: 420px;
    margin-top: -80px;
    border-radius: 20px;
    overflow: hidden;
  }

  .landing-hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Landing Hero Metrics */
  .landing-hero-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 60px 120px;
    margin-top: -100px;
    position: relative;
    z-index: 10;
  }

  .landing-metric-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 20px;
    padding: 24px 20px;
    text-align: center;
    backdrop-filter: blur(20px);
    
  }

  .landing-metric-value {
    font-size: 28px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 24px 0 8px;
  }

  .landing-metric-label {
    font-size: 16px;
    color: ${colors.textSecondary};
  }
  .landing-metric-label span {
    color: #9095FB;
  }

  /* Landing Sections */
  .landing-section {
    margin: 320px 120px 0;
    position: relative;
  }

  .landing-section-with-bg {
    padding: 100px;
    position: relative;
  }
  .landing-section-contents {
    position: relative;
  }


  .landing-line-gradient {
    margin: 0 auto 60px;
    width: 1px;
    height: 120px;
    background: linear-gradient(180deg, #C1C1C1 0%, rgba(193, 193, 193, 0) 100%);
    opacity: 0.4;
  }
    
  .landing-section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    
  }

  .landing-section-badge {
    display: inline-flex;
    align-items: center;
    background: #181B25;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    color: ${colors.textSecondary};
    font-weight: 500;
  }

  .landing-section-title {
    font-size: 48px;
    font-weight: 700;
    line-height: 64px;
    text-align: center;
  }
  
   .white-gradient {
    background: ${colors.balanceGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

   .purple-gradient {
    background: linear-gradient(to right, #63A4FA -100%, #9095FB 50%,#BD85FC 200%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }


  .landing-section-title-small {
    font-size: 40px;
    line-height: 60px;
  }

  .landing-section-subtitle {
    font-size: 16px;
    color: ${colors.textSecondary};
    line-height: 24px;
    text-align: center;
  }

  /* Landing Cards */
  .landing-grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    margin: 83px 0 32px;
  }

  .landing-card {
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 20px;
    padding: 23px;
    transition: all 0.3s ease;
  }

  .landing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(108, 82, 255, 0.1);
    border-color: rgba(108, 82, 255, 0.3);
  }

  .landing-icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(142, 89, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
  }

  .landing-icon-wrapper img {
    width: 24px;
    height: 24px;
  }

  .landing-card-number {
    font-family: ${fonts.display};
    font-size: 32px;
    color: rgba(255, 255, 255, 0.2);
    font-weight: 600;
    margin-bottom: 5px;
  }

  .landing-card-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #FFFFFF;
  }

  .landing-card-description {
    font-size: 16px;
    color: ${colors.textSecondary};
    line-height: 24px;
  }

  /* Landing Stats */
  .landing-stats-container {
    padding-bottom: 100px;
  }

  .landing-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 20px;
    padding: 24px 40px;
  }

  .landing-stat-item {
    text-align: center;
  }

  .landing-stat-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .landing-stat-value {
    font-family: ${fonts.display};
    font-size: 36px;
    font-weight: 700;
    color: ${colors.textPrimary};
  }

  .landing-stat-label {
    font-size: 16px;
    color: ${colors.textSecondary};
  }

  /* Landing Quantum Section */
  .landing-quantum-section {
    position: relative;
    padding: 120px 120px 64px;
  }

  .landing-quantum-contents {
    position: relative;
    display: grid;
    grid-template-columns: 0.8fr 1fr 1fr;
    gap: 32px;
  }

  .landing-quantum-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }


  .landing-quantum-title-small {
    font-size: 32px;
    font-weight: 700;
    margin-top: 20px;
  }
  .landing-quantum-title-small span {
    font-size: 40px;
  }

  .landing-quantum-title {
    font-size: 60px;
    font-weight: 700;
    line-height: 80px;
    background: linear-gradient(90deg, #63A4FA 0%, #9095FB 50%, #BD85FC 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
  }
  
  .landing-quantum-middle {
  margin-top: 80px;
  }

  .landing-quantum-right {
    margin-top: 144px;
  }

  .landing-quantum-cards {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }

  /* Landing Valuation Cards */
  .landing-valuation-card {
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 20px;
    padding: 28px 24px;
  }
  .landing-valuation-card.landing-valuation-card-rank {
  padding: 24px 24px 14px;
  }

  .landing-valuation-card.landing-valuation-card-text {
    padding: 28px 39px;
  }

  .landing-valuation-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }

  .landing-valuation-title {
    font-size: 18px;
    font-weight: 700;
    color: ${colors.textPrimary};
  }

  
  .landing-valuation-rows .landing-valuation-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    
  }

  .landing-valuation-rows .landing-valuation-row:not(:last-child) {
    border-bottom: 1px solid rgba(24, 27, 37, 1);
  }

  .landing-valuation-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${colors.textPrimary};
  }

  .landing-valuation-badge {
    background: #666;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    color: ${colors.textPrimary};
  }

  .landing-valuation-badge-purple {
    background: ${colors.primary};
    color: ${colors.textPrimary};
  }

  .landing-valuation-badge-gradient {
    background: ${colors.greenGradient};
    color: ${colors.textPrimary};
  }

  .landing-valuation-value {
    color: #666;
    font-size: 14px;
  }

  .landing-valuation-value-highlight {
    font-weight: 700;
    background: ${colors.greenGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .landing-highlight-row {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(144, 149, 251, 0.2);
    border-radius: 8px;
    margin: 8px 0;
    padding: 11px 16px;
    z-index: 0;
  }

  .landing-highlight-row::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${colors.greenGradient};
    border-radius: 8px;
    z-index: -1;  
    opacity: 0.04;
  }

  .landing-valuation-notice {
    text-align: center;
    margin-top: 16px;
    padding: 16px;
    background: rgba(24, 27, 37, 0.32);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.04);
    font-size: 14px;
    color: #9095FB;
  }

.landing-performance-rank-content-wrap {
  display: flex;
  justify-content: space-around;
}

  .landing-performance-content {
    text-align: center;
  }

  .landing-performance-rank {
    font-family: ${fonts.display};
    font-size: 36px;
    font-weight: 700;
    color: #9095FB;
  }

  .landing-performance-value {
  font-family: ${fonts.display};
    font-size: 36px;
    font-weight: 700;
    background: ${colors.greenGradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 16px;
  }

  .landing-performance-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }

  .landing-performance-text-left {
    text-align: left;
    font-size: 13px;
    color: #666;
  }
    .landing-performance-text-left span {
    color: #9095FB;
}

  .landing-performance-badge {
    background: rgba(144, 149, 251, 0.08);
    border: 1px solid rgba(144, 149, 251, 0.12);
    border-radius: 14px;
    padding: 8px 16px;
    display: inline-block;
    font-size: 11px;
    color: #9095FB;
  }

  /* Landing Security Section */
  .landing-security-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin: 64px 0 20px;
  }

  .landing-security-card {
    position: relative;
    overflow: hidden;
    padding: 32px;
    background: rgba(24, 27, 37, 0.4);
    box-shadow: 0 8px 24px rgba(108, 82, 255, 0.1);
    border: 1px solid #181B25;
    border-radius: 32px;
    transition: all 0.3s ease;



  }

  .landing-security-card:hover {
    transform: translateY(-4px);
    border: 2px solid #181B25;
    box-shadow: 0px 0px 32px rgba(82, 0, 233, 0.08), inset 4px 4px 14px rgba(255, 255, 255, 0.04);

  }

  .landing-security-image {
    width: 100%;
    height: 200px;
    border-radius: 16px;
    margin-bottom: 24px;
    overflow: hidden;
  }

  .landing-security-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .landing-security-image-gradient {
    background: linear-gradient(135deg, #8E59FF 0%, #6B3FDB 100%);
  }

  .landing-security-badge {
    background: rgba(142, 133, 190, 0.08);
    border: 1px solid rgba(142, 133, 190, 0.12);
    border-radius: 14px;
    padding: 6px 16px;
    display: inline-block;
    font-size: 12px;
    color: #8E85BE;
    margin-bottom: 12px;

  }

  .landing-security-title {
    font-size: 24px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin-bottom: 12px;
  }

  .landing-security-description {
    font-size: 16px;
    color: ${colors.textSecondary};
    line-height: 24px;
  }

  /* Landing Metric Card */
  .landing-metric-card {
    background: rgba(24, 27, 37, 0.4);
    border: 1px solid #181B25;
    border-radius: 32px;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .landing-metric-card-title {
    font-size: 24px;
    font-weight: 700;
    color: #FFFFFF;
    opacity: 0.88;
  }

  .landing-metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    width: 100%;
  }

  .landing-metric-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 32px;
    text-align: center;
  }
    .landing-metric-item:not(:last-child)::after {
      content: "";
      position: absolute;
      right: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: 1px;
      height: 36px;
      background-color: ${colors.textPrimary};
      opacity: 0.08;
    }

  .landing-metric-item-value {
    font-size: 24px;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin-bottom: 4px;
    opacity: 0.88;
    text-align: left;
  }

  .landing-metric-item-label {
    font-size: 16px;
    text-align: left;
    color: ${colors.textSecondary};
  }

  /* Landing Partners Section */
  .landing-partners-section {
    overflow: hidden;
    padding: 40px 0;
    text-align: center;
  }



.loop_cont {
  opacity: 0.4;
  padding: 40px 0 0;
}
.banner {
  height: 36px;
  margin-right: 80px;
  flex-shrink: 0;
}

.banner_list {
  display: flex;
  width: calc(100% + 10px);
  animation: banner-animation 30s linear infinite;
}

@keyframes banner-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-200px * 10 - 10px * 10));
  }
}




  /* Landing FAQ Section */
  .landing-faq-section {
    padding: 100px 280px;
  }

  .landing-faq-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 84px;
  }

  .landing-faq-item {
    border: 1px solid #181B25;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .landing-faq-item.expanded {
    background: rgba(24, 27, 37, 0.4);
    border-color: rgba(99, 164, 250, 0.4);
  }

  .landing-faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 24px;
    cursor: pointer;
    user-select: none;
  }

  .landing-faq-question-text {
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    letter-spacing: -0.01em;
    padding-right: 20px;
  }
    .landing-faq-item.expanded .landing-faq-question-text {
      background: linear-gradient(to right, #63A4FA 0%, #BD85FC 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

  .landing-faq-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  .landing-faq-icon.rotated {
    transform: rotate(45deg);
    
  }
  .landing-faq-icon.rotated .icon line {
    stroke: #9095FB;
  }

  .landing-faq-answer {
    padding: 0 24px 32px;
    font-size: 16px;
    color: #999999;
    line-height: 24px;
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

  /* Landing Scroll to Top */
  .landing-scroll-to-top {
    position: fixed;
    bottom: 52px;
    right: 100px;
    width: 48px;
    height: 48px;
    background: #6C52FF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    box-shadow: 0 0 100px rgba(54, 49, 189, 0.3);
    z-index: 100;
  }

  .landing-scroll-to-top.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .landing-scroll-to-top:hover {
    background: #8C52FF;
    transform: translateY(-4px);
  }

  // .landing-scroll-to-top span {
  //   font-size: 24px;
  //   line-height: 1;
  //   transform: rotate(-90deg);
  //   display: block;
  //   color: #FFFFFF;
  // }

  /* Landing Gradients */
  .landing-ellipse-gradient {
    position: absolute;
    width: 680px;
    height: 680px;
    background: conic-gradient(from 181.95deg at 52.09% 38.61%, #F5EBFF 0deg, #6C52FF 106.45deg, #6C52FF 254.47deg, rgba(0, 0, 0, 0) 360deg);
    filter: blur(200px);
    opacity: 0.16;
  }

  .landing-ellipse-1 {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .landing-ellipse-2 {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .landing-vector-gradient {
    position: absolute;
    top: -570px;
    left: -674px;
    width: 1882.9px;
    height: 1592.27px;
    background: radial-gradient(50% 50% at 50% 50%, #F5EBFF 0%, #60A0FF 29.57%, #60A0FF 70.69%, rgba(0, 0, 0, 0) 100%);
    filter: blur(200px);
    opacity: 0.16;
  }

  /* Responsive Design for Landing Page */
  @media (max-width: ${breakpoints.desktop}) {
    .landing-header {
      padding: 12px 40px;
    }
    
    .landing-section {
      margin: unset;
      padding: 80px 16px 0;
    }
    .landing-hero-metrics {
      padding-left: 40px;
      padding-right: 40px;
    }
    
    /* Landing Quantum Section */
    .landing-quantum-section {
      padding: 0 40px;
    }
    
    .landing-faq-section {
      padding: 100px 40px;
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    .landing-header {
      padding: 12px 24px;
    }
    
    .landing-nav-menu {
      display: none;
    }
    
    .landing-hero-content-wrapper {
      margin-top: 178px;
    }
    
    .landing-hero-content {
      width: 100%;
    }
    
    .landing-hero-title {
      font-size: 36px;
      line-height: 44px;
    }
    
    .landing-hero-subtitle {
      font-size: 14px;
      line-height: 20px;
    }
    

    
    .landing-hero-metrics {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 40px 24px;
      // margin-top: -40px;
    }
    
    .landing-metric-box {
      padding: 20px;
    }
    
    .landing-metric-value {
      font-size: 24px;
    }
    
    .landing-metric-label {
      font-size: 13px;
    }
    
    /* Landing Sections */
    // .landing-section {
    //   margin: unset;
    //   padding: 80px 16px 0;
    // }
    
    .landing-section-with-bg {
      padding: 80px 16px;
    }
    
    .landing-section-title {
      font-size: 32px;
      line-height: 40px;
    }

    .landing-section-title-small {
      font-size: 28px;
      line-height: 40px;
    }
    
    .landing-section-subtitle {
      font-size: 14px;
      line-height: 20px;
    }
    
    .landing-grid-container {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .landing-card {
      padding: 20px;
    }
    
    .landing-icon-wrapper {
      width: 48px;
      height: 48px;
    }
    
    // .landing-card-title {
    //   font-size: 20px;
    // }
    
    .landing-card-description {
      font-size: 14px;
      line-height: 20px;
    }
    
    .landing-stats-container {
      padding-bottom: 80px;
    }
    
    .landing-stats-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      padding: 20px;
    }
    
    
    .landing-stat-label {
      font-size: 14px;
    }
    /* Landing Quantum Section */


    .landing-quantum-section {
      padding: 0 24px;
    }
    
    .landing-quantum-contents {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }

    .landing-quantum-left {
      padding-top: 60px;
      align-items: center;
    }
    
    .landing-quantum-middle {
    margin-top: 20px;
    }

    .landing-quantum-right {
    margin-top: 16px;
    }
    .landing-quantum-title {
      font-size: 40px;
      line-height: 50px;
    }

    
    .landing-quantum-cards {
      // margin-top: 20px;
      gap: 16px;
    }
      
    .landing-quantum-title-small {
      font-size: 18px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .landing-quantum-title-small span {
      font-size: 28px;
    }



    .landing-valuation-card {
      padding: 20px;
    }
    
    .landing-valuation-title {
      font-size: 18px;
    }
    
    .landing-valuation-label {
      font-size: 14px;
    }
    
    .landing-valuation-value {
      font-size: 14px;
    }
    
    .landing-valuation-value-highlight {
      font-size: 20px;
    }
    
    .landing-performance-value {
      font-size: 36px;
    }
    
    .landing-performance-text {
      font-size: 14px;
    }

    .landing-line-gradient {
      margin: 0 auto 20px;
    }
    
    .landing-security-grid {
      grid-template-columns: 1fr;
      gap: 16px;
      margin: 32px 0 20px; 
    }
    
    .landing-security-card {
      padding: 16px;
    }
    
    .landing-security-image {
      height: 280px;
      display: flex;
      justify-content: center;
    }
    .landing-security-image img {
      max-width: 311px;
    }
    
    .landing-security-badge {
      padding: 8px 16px;
    }
    
    .landing-metric-card {
      padding: 20px 0;
    }
    
    .landing-metric-card-title {
      font-size: 20px;
    }
    
    .landing-metric-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .landing-metric-item {
      padding: 16px 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      justify-content: flex-start;
    }

    .landing-metric-item:not(:last-child)::after {
    display: none;
    }
    
    .landing-metric-item-value {
      font-size: 16px;
    }
    
    .landing-metric-item-label {
      font-size: 12px;
    }
    
    .landing-partners-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      padding: 0 24px;
    }

    .banner {
      height: 20px;
      margin-right: 40px;
    }
    .banner img {
      height: 20px;
    }
    
    .landing-faq-section {
      padding: 80px 24px;
    }
    
    .landing-faq-container {
      margin-top: 20px;
    }

    .landing-faq-question {
      padding: 16px;
    }
    
    .landing-faq-question-text {
      font-size: 16px;
    }
    
    .landing-faq-answer {
      padding: 0 16px 16px;
      font-size: 13px;
      line-height: 20px;
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
      font-size: 11px;
    }
    
    .landing-scroll-to-top {
      bottom: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    /* Header Mobile Styles */
    .landing-header {
      padding: 12px 16px;
      height: 80px;
    }
    
    .landing-navbar {
      height: 56px;
      padding: 8px 0;
    }
    
    .landing-logo-container {
      gap: 8px;
      white-space: nowrap;
    }
    
    .landing-logo {
      width: 32px;
      height: 32px;
    }
    
    .landing-logo-text {
      font-size: 16px;
    }
    
    .landing-nav-menu {
      display: none;
    }
    
    .landing-nav-right {
      gap: 8px;
      margin-left: auto;
    }
    
    /* RainbowKit Connect Button Mobile */
    .landing-navbar [data-testid="rk-connect-button"] {
      font-size: 14px;
      padding: 8px 12px;
      white-space: nowrap;
    }
    
    .landing-navbar [data-testid="rk-account-button"] {
      font-size: 14px;
      padding: 8px 12px;
      white-space: nowrap;
    }
    
    .landing-connect-button {
      font-size: 12px;
      padding: 8px 12px;
    }

    .landing-hero-background-triangle {
      left: -800px;
    }

    .landing-hero-header {
      gap: 40px;
    }
    .landing-hero-metrics {
      padding: 40px 16px;
    }

    .landing-event-dot {
      width: 4px;  
      height: 4px;
      box-shadow: 0 0 4px #0EC167;
      border-radius: 50%;
    }

    .landing-event-text {
      font-size: 12px;
    }
      
    .landing-hero-title {
      font-size: 48px;
      line-height: 60px;
      }

    .landing-hero-subtitle {
      font-size: 13px;
      }
      
    .landing-cta-button {
      padding: 10px 20px;
      font-size: 13px;
      }

    /* Landing Countdown Timer Mobile */
    .landing-countdown-container {
      margin-top: 32px;
    }

    .landing-countdown-title {
      font-size: 12px;
      padding: 6px 20px;
    }

    .landing-countdown-title::before {
      display: none;
    }

    .landing-countdown-boxes {
      gap: 12px;
    }

    .landing-countdown-box {
      padding: 16px 20px;
      min-width: 85px;
      border-radius: 12px;
    }

    .landing-countdown-value {
      font-size: 32px;
    }

    .landing-countdown-label {
      font-size: 11px;
    }

    .landing-hero-graphic {
      width: 495px;
      height: 213px;
      margin-top: 20px;
    }
      


    /* Landing Sections */
    .landing-section-subtitle {
      font-size: 13px;
    }
    .landing-section-badge {
      font-size: 12px;
    }

    .landing-grid-container {
    margin: 40px 0 16px;
    }
    .landing-stat-value {
      font-size: 32px;
      background: ${colors.balanceGradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

  }
`;