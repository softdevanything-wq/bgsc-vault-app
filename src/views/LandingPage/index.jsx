// Landing Page Component
/* global BigInt */
import { useState, useEffect, useRef } from "react";
import { formatAmount } from "utils";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../translations";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// SVG Icon Imports
import iconStackRound from "assets/icon-stack-round.svg";
import iconMindfulness from "assets/icon-mindfulness.svg";
import iconSync from "assets/icon-sync.svg";
import iconGraphGreen from "assets/icon-graph-green.svg";
import iconArrowBack from "assets/icon-arrow-back.svg";
import iconSensor from "assets/icon-sensor.svg";
import iconLightning from "assets/icon-lightning.svg";
import firstIllustration from "assets/first-illustration.png";
import secondIllustration from "assets/second-illustration.png";
import thirdIllustration from "assets/third-illustration.png";
import iconAnalytics from "assets/icon-anylitics.png";
import iconArrowBackCircle from "assets/icon-arrow-back-circle.png";
import iconStackUpSquareCircle from "assets/icon-stack-up-square-circle.png";
import iconCheckCircle from "assets/icon-check-circle.png";
import mexcGlobalLogo from "assets/mexc_global_logo.png";
import bitGetLogo from "assets/bitget_logo.png";
import hashkeyLogo from "assets/hashkey_logo.png";
import gateIoLogo from "assets/gate_io_logo.png";
import textLogo from "assets/text_logo.png";
import messageIcon from "assets/icon-chat-bubble.svg";
import sendIcon from "assets/icon-send.svg";
import xIcon from "assets/icon-x.svg";
import iconArrowRightSmall from "assets/icon-arrow-right-small.svg";

import heroImage from "assets/hero-image.png";
import ornamentDollarImage from "assets/ornament_dollar.png";
import ornamentWonImage from "assets/ornament_won.png";
import ornamentChartImage from "assets/ornament_chart.png";
import ornamentCrownImage from "assets/ornament_crown.png";
import Icons from "components/Icons";

import { getLandingPageStyles } from "./styles";

export default function LandingPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("algorithm");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const bannerListRef = useRef(null);

  useEffect(() => {
    const bannerList = bannerListRef.current;
    if (!bannerList) return;

    const bannerItems = bannerList.querySelectorAll(".banner");
    const numBanners = bannerItems.length;

    // 복제해서 붙이기
    for (let i = 0; i < numBanners * 2; i++) {
      bannerList.appendChild(bannerItems[i % numBanners].cloneNode(true));
    }
  }, []);

  // banner infinite loop
  useEffect(() => {
    const bannerList = bannerListRef.current;
    if (!bannerList) return;
    const bannerItems = bannerList.querySelectorAll(".banner");
    const numBanners = bannerItems.length;
    const bannerWidth = bannerItems[0].clientWidth;

    bannerList.style.width = `${
      bannerWidth * numBanners * 2 + 10 * (numBanners * 2 - 1)
    }px`;

    let currentPos = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const animate = (timestamp) => {
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      currentPos -= ((bannerWidth + 10) * delta) / 1000;

      if (currentPos <= -(bannerWidth + 10) * numBanners) {
        currentPos = 0;
      }

      bannerList.style.transform = `translateX(${currentPos}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    // 👉 cleanup (이전 애니메이션 중단)
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date('2025-08-01T00:00:00+09:00'); // August 1, 2025, 00:00 KST
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000); // Update every second
    
    return () => clearInterval(timer);
  }, []);

  const faqData = [
    {
      question: t(`landing.faq.q1.q`, language),
      answer: t(`landing.faq.q1.a`, language),
    },
    {
      question: t(`landing.faq.q2.q`, language),
      answer: t(`landing.faq.q2.a`, language),
    },
    {
      question: t(`landing.faq.q3.q`, language),
      answer: t(`landing.faq.q3.a`, language),
    },
    {
      question: t(`landing.faq.q4.q`, language),
      answer: t(`landing.faq.q4.a`, language),
    },
  ];

  return (
    <>
      <div className="landing-container">
        {/* Header/Navbar */}
        <header className={`landing-header`}>
          <nav className="landing-navbar">
            <div className="landing-logo-container">
              <img src={`${process.env.PUBLIC_URL}/logo.png`} className="landing-logo" alt="Logo" />
              <div className="landing-logo-text">Bugs Vault</div>
            </div>

            <div className="landing-nav-menu">
              <a href="#how-it-works" className="landing-nav-link">
                {t('landing.nav.howItWorks', language)}
              </a>
              <a href="#security" className="landing-nav-link">
                {t('landing.nav.security', language)}
              </a>
            </div>

            <div className="landing-nav-right">
              <ConnectButton 
                showBalance={false}
                accountStatus="address"
                chainStatus="none"
              />
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="landing-main-content">
          {/* Hero Section */}
          <section className="landing-hero-section">
            <div className="landing-hero-background">
              <div className="landing-hero-background-triangle" />
              <div className="landing-hero-background-up" />
            </div>

            <div className="landing-hero-content-wrapper">
              <div className="landing-hero-content">
                <div className="landing-hero-header">
                  <div className="landing-event-badge">
                    <div className="landing-event-dot" />
                    <span className="landing-event-text">
                      {t('landing.eventBadge', language)}
                    </span>
                  </div>

                  <div className="landing-hero-title-container">
                    <h1 className="landing-hero-title">
                      {t('landing.heroTitle', language).split('\n')[0]}
                      <br />
                      {t('landing.heroTitle', language).split('\n')[1]}
                    </h1>
                    <p className="landing-hero-subtitle">
                      <strong>{t('landing.heroSubtitle', language)}</strong>
                      <br />
                      {t('landing.heroDescription', language)}
                    </p>
                  </div>
                </div>

                <div className="landing-countdown-container">
                  <div className="landing-countdown-title">{t('landing.countdownTitle', language)}</div>
                  <div className="landing-countdown-boxes">
                    <div className="landing-countdown-box">
                      <div className="landing-countdown-value">{countdown.days}</div>
                      <div className="landing-countdown-label">{t('landing.countdownDays', language)}</div>
                    </div>
                    <div className="landing-countdown-box">
                      <div className="landing-countdown-value">{countdown.hours.toString().padStart(2, '0')}</div>
                      <div className="landing-countdown-label">{t('landing.countdownHours', language)}</div>
                    </div>
                    <div className="landing-countdown-box">
                      <div className="landing-countdown-value">{countdown.minutes.toString().padStart(2, '0')}</div>
                      <div className="landing-countdown-label">{t('landing.countdownMinutes', language)}</div>
                    </div>
                    <div className="landing-countdown-box">
                      <div className="landing-countdown-value">{countdown.seconds.toString().padStart(2, '0')}</div>
                      <div className="landing-countdown-label">{t('landing.countdownSeconds', language)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="landing-hero-graphic">
                <img
                  src={heroImage}
                  alt="Hero"
                  className="landing-hero-image"
                />
              </div>
            </div>
          </section>

          {/* Hero Metrics Section */}
          <section className="landing-hero-metrics">
            <div className="landing-metric-box">
              <img src={ornamentDollarImage} alt="" />
              <div className="landing-metric-value">{t('landing.heroMetrics.bscBased', language)}</div>
              <div className="landing-metric-label">{t('landing.heroMetrics.bscSubtitle', language)}</div>
            </div>
            <div className="landing-metric-box">
              <img src={ornamentWonImage} alt="" />
              <div className="landing-metric-value">{t('landing.heroMetrics.bgscReward', language)}</div>
              <div className="landing-metric-label">{t('landing.heroMetrics.bgscSubtitle', language)}</div>
            </div>
            <div className="landing-metric-box">
              <img src={ornamentChartImage} alt="" />
              <div className="landing-metric-value">{t('landing.heroMetrics.uptime', language)}</div>
              <div className="landing-metric-label">
                {t('landing.heroMetrics.uptimeSubtitle', language)} <span>{t('landing.heroMetrics.uptimeLabel', language)}</span>
              </div>
            </div>
            <div className="landing-metric-box">
              <img src={ornamentCrownImage} alt="" />
              <div className="landing-metric-value">{t('landing.heroMetrics.pointBased', language)}</div>
              <div className="landing-metric-label">{t('landing.heroMetrics.pointSubtitle', language)}</div>
            </div>
          </section>


          {/* 3-Tier Algo System Section */}
          <section id="how-it-works" className="landing-section">
            <div className="landing-ellipse-gradient landing-ellipse-1" />

            <div className="landing-section-contents">
              <div className="landing-section-header">
                <div className="landing-section-badge">{t('landing.howItWorks.sectionBadge', language)}</div>
                <h2 className="landing-section-title">
                  <p className="white-gradient">{t('landing.howItWorks.sectionTitle', language)}</p>
                  <p className="purple-gradient">{t('landing.howItWorks.sectionTitleHighlight', language)}</p>
                </h2>
                <p className="landing-section-subtitle">
                  {t('landing.howItWorks.sectionSubtitle', language).split('\n').map((line, index) => (
                    <span key={index}>{line}{index === 0 && <br />}</span>
                  ))}
                </p>
              </div>

              <div className="landing-grid-container">
                <div className="landing-card">
                  <div className="landing-icon-wrapper">
                    <img src={iconStackRound} alt="Stack" />
                  </div>
                  <div className="landing-card-number">{t('landing.howItWorks.step1.number', language)}</div>
                  <h3 className="landing-card-title">{t('landing.howItWorks.step1.title', language)}</h3>
                  <p className="landing-card-description">
                    {t('landing.howItWorks.step1.desc', language).split('\n').map((line, index) => (
                      <span key={index}>{line}{index === 0 && <br />}</span>
                    ))}
                  </p>
                </div>

                <div className="landing-card">
                  <div className="landing-icon-wrapper">
                    <img src={iconMindfulness} alt="AI" />
                  </div>
                  <div className="landing-card-number">{t('landing.howItWorks.step2.number', language)}</div>
                  <h3 className="landing-card-title">{t('landing.howItWorks.step2.title', language)}</h3>
                  <p className="landing-card-description">
                    {t('landing.howItWorks.step2.desc', language).split('\n').map((line, index) => (
                      <span key={index}>{line}{index === 0 && <br />}</span>
                    ))}
                  </p>
                </div>

                <div className="landing-card">
                  <div className="landing-icon-wrapper">
                    <img src={iconSync} alt="Sync" />
                  </div>
                  <div className="landing-card-number">{t('landing.howItWorks.step3.number', language)}</div>
                  <h3 className="landing-card-title">{t('landing.howItWorks.step3.title', language)}</h3>
                  <p className="landing-card-description">
                    {t('landing.howItWorks.step3.desc', language).split('\n').map((line, index) => (
                      <span key={index}>{line}{index === 0 && <br />}</span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="landing-stats-container">
                <div className="landing-stats-grid">
                  <div className="landing-stat-item">
                    <div className="landing-stat-content">
                      <div className="landing-stat-value">{t('landing.howItWorks.systemStats.stability', language)}</div>
                      <div className="landing-stat-label">{t('landing.howItWorks.systemStats.stabilityLabel', language)}</div>
                    </div>
                  </div>
                  <div className="landing-stat-item">
                    <div className="landing-stat-content">
                      <div className="landing-stat-value">{t('landing.howItWorks.systemStats.processingSpeed', language)}</div>
                      <div className="landing-stat-label">
                        {t('landing.howItWorks.systemStats.processingLabel', language)}
                      </div>
                    </div>
                  </div>
                  <div className="landing-stat-item">
                    <div className="landing-stat-content">
                      <div className="landing-stat-value">{t('landing.howItWorks.systemStats.uptime', language)}</div>
                      <div className="landing-stat-label">{t('landing.howItWorks.systemStats.uptimeLabel', language)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quantum Return Section */}
          <section id="returns" className="landing-quantum-section">
            <div className="landing-ellipse-gradient landing-ellipse-2" />

            <div className="landing-quantum-contents">
              <div className="landing-quantum-left">
                <div className="landing-section-badge">{t('landing.quantumReturn.badge', language)}</div>
                <h2 className="landing-quantum-title-small">
                  {t('landing.quantumReturn.title', language).split('\n').map((line, index) => (
                    index === 1 ? <><br /><span className="white-gradient" key={index}>{line}</span></> : <span key={index}>{line}</span>
                  ))}
                </h2>
                <h3 className="landing-quantum-title purple-gradient">
                  {t('landing.quantumReturn.titleHighlight', language)}
                </h3>
                <p className="landing-section-subtitle">
                  {t('landing.quantumReturn.subtitle', language)}
                </p>
              </div>

              <div className="landing-quantum-middle landing-quantum-cards">
                <div className="landing-valuation-card">
                  <div className="landing-valuation-header">
                    <img src={iconGraphGreen} alt="" />
                    <h4 className="landing-valuation-title">
                      {t('landing.quantumReturn.enterprisePerformance', language)}
                    </h4>
                  </div>

                  <div className="landing-valuation-rows">
                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.responseSpeed', language)}</span>
                        <span className="landing-valuation-badge">{t('landing.quantumReturn.typical', language)}</span>
                      </div>
                      <span className="landing-valuation-value">10-15ms</span>
                    </div>

                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.throughput', language)}</span>
                        <span className="landing-valuation-badge landing-valuation-badge-purple">
                          {t('landing.quantumReturn.enterprise', language)}
                        </span>
                      </div>
                      <span className="landing-valuation-value">100K+</span>
                    </div>
                  </div>
                  <div className="landing-highlight-row">
                    <div className="landing-valuation-label">
                      <span>{t('landing.quantumReturn.bugsVault', language)}</span>
                      <span className="landing-valuation-badge landing-valuation-badge-gradient">
                        {t('landing.quantumReturn.innovative', language)}
                      </span>
                    </div>
                    <span className="landing-valuation-value landing-valuation-value-highlight">
                      {language === 'ko' ? '28일' : '28 days'}
                    </span>
                  </div>
                  <div className="landing-valuation-notice">
                    <span>
                      <strong>← {t('landing.quantumReturn.roundCycle', language)}</strong> {t('landing.quantumReturn.stableReturn', language)}
                    </span>
                  </div>
                </div>

                <div className="landing-valuation-card">
                  <div className="landing-valuation-header">
                    <img src={iconArrowBack} alt="" />
                    <h4 className="landing-valuation-title">{t('landing.quantumReturn.verifiedTech', language)}</h4>
                  </div>

                  <div className="landing-performance-content">
                    <div className="landing-performance-value">+20%</div>
                    <p className="landing-performance-text">
                      {t('landing.quantumReturn.smartContractAutomation', language)}
                    </p>
                    <div className="landing-performance-badge">
                      <span>{t('landing.quantumReturn.techStability', language)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="landing-quantum-right landing-quantum-cards">
                <div className="landing-valuation-card">
                  <div className="landing-valuation-header">
                    <img src={iconSensor} alt="" />
                    <h4 className="landing-valuation-title">
                      {t('landing.quantumReturn.hyperIntelligent', language)}
                    </h4>
                  </div>

                  <div className="landing-valuation-rows">
                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.valueAmplification', language)}</span>
                      </div>
                      <span className="landing-valuation-value">
                        {t('landing.quantumReturn.smartContractBased', language)}
                      </span>
                    </div>
                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.incentiveEngine', language)}</span>
                      </div>
                      <span className="landing-valuation-value">
                        {t('landing.quantumReturn.ecosystem', language)}
                      </span>
                    </div>
                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.valueRealization', language)}</span>
                      </div>
                      <span className="landing-valuation-value">
                        {t('landing.quantumReturn.precisionExchange', language)}
                      </span>
                    </div>
                    <div className="landing-valuation-row">
                      <div className="landing-valuation-label">
                        <span>{t('landing.quantumReturn.transparency', language)}</span>
                      </div>
                      <span className="landing-valuation-value">
                        {t('landing.quantumReturn.contractTransparency', language)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="landing-valuation-card landing-valuation-card-rank">
                  <div className="landing-performance-rank-content-wrap">
                    <div className="landing-performance-content">
                      <div className="landing-performance-rank">A+</div>
                      <div className="landing-performance-text">
                        {t('landing.quantumReturn.techInnovation', language)}
                      </div>
                    </div>
                    <div className="landing-performance-content">
                      <div className="landing-performance-rank">A+</div>
                      <div className="landing-performance-text">{t('landing.quantumReturn.securityGrade', language)}</div>
                    </div>
                  </div>
                </div>

                <div className="landing-valuation-card landing-valuation-card-text">
                  <div className="landing-valuation-header">
                    <img src={iconLightning} alt="" />
                    <h4 className="landing-valuation-title">
                      {t('landing.quantumReturn.nextGenFuture', language)}
                    </h4>
                  </div>

                  <div className="landing-performance-content">
                    <p className="landing-performance-text-left">
                      {t('landing.quantumReturn.futureDescription', language)}{" "}
                      <span>{t('landing.quantumReturn.techInnovationHighlight', language)}</span>{t('landing.quantumReturn.realize', language)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section id="security" className="landing-section-with-bg">
            <div className="landing-line-gradient"></div>
            <div className="landing-section-header">
              <div className="landing-section-badge">{t('landing.security.badge', language)}</div>
              <h2 className="landing-section-title">
                {t('landing.security.title', language).split('\n').map((line, index) => (
                  index === 1 ? <><br /><p className="purple-gradient" key={index}>{line}</p></> : <span key={index}>{line}</span>
                ))}
              </h2>
              <p className="landing-section-subtitle">
                {t('landing.security.subtitle', language)}
              </p>
            </div>

            <div className="landing-security-grid">
              <div className="landing-security-card">
                <div className="landing-security-image">
                  <img src={firstIllustration} alt="Security" />
                </div>
                <div className="landing-security-badge">
                  <span>{t('landing.security.verifiedAmount', language)}</span>
                </div>
                <h3 className="landing-security-title">{t('landing.security.verifiedCodebase', language)}</h3>
                <p className="landing-security-description">
                  {t('landing.security.verifiedDesc', language)}
                </p>
              </div>

              <div className="landing-security-card">
                <div className="landing-security-image">
                  <img src={secondIllustration} alt="Transparency" />
                </div>
                <div className="landing-security-badge">
                  <span>{t('landing.security.latestStandards', language)}</span>
                </div>
                <h3 className="landing-security-title">{t('landing.security.nextGenBsc', language)}</h3>
                <p className="landing-security-description">
                  {t('landing.security.bscDesc', language)}
                </p>
              </div>

              <div className="landing-security-card">
                <div className="landing-security-image">
                  <img src={thirdIllustration} alt="Transparency" />
                </div>
                <div className="landing-security-badge">
                  <span>{t('landing.security.fullTransparency', language)}</span>
                </div>
                <h3 className="landing-security-title">{t('landing.security.hyperTransparency', language)}</h3>
                <p className="landing-security-description">
                  {t('landing.security.transparencyDesc', language)}
                </p>
              </div>
            </div>

            <div className="landing-metric-card">
              <h3 className="landing-metric-card-title">
                {t('landing.security.enterpriseMetrics', language)}
              </h3>
              <div className="landing-metric-grid">
                <div className="landing-metric-item">
                  <div className="landing-metric-item-icon">
                    <img src={iconAnalytics} alt="" />
                  </div>
                  <div className="landing-metric-item-content">
                    <div className="landing-metric-item-value">3M+</div>
                    <div className="landing-metric-item-label">{t('landing.security.transactions', language)}</div>
                  </div>
                </div>

                <div className="landing-metric-item">
                  <div className="landing-metric-item-icon">
                    <img src={iconArrowBackCircle} alt="" />
                  </div>
                  <div className="landing-metric-item-content">
                    <div className="landing-metric-item-value">10K +</div>
                    <div className="landing-metric-item-label">{t('landing.security.dailyUsers', language)}</div>
                  </div>
                </div>
                <div className="landing-metric-item">
                  <div className="landing-metric-item-icon">
                    <img src={iconStackUpSquareCircle} alt="" />
                  </div>
                  <div className="landing-metric-item-content">
                    <div className="landing-metric-item-value">{language === 'ko' ? '5개 +' : '5+'}</div>
                    <div className="landing-metric-item-label">
                      {t('landing.security.relatedProjects', language)}
                    </div>
                  </div>
                </div>
                <div className="landing-metric-item">
                  <div className="landing-metric-item-icon">
                    <img src={iconCheckCircle} alt="" />
                  </div>
                  <div className="landing-metric-item-content">
                    <div className="landing-metric-item-value">{t('landing.security.established', language)}</div>
                    <div className="landing-metric-item-label">{t('landing.security.regulatory', language)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Partners Section */}
          <section className="landing-partners-section">
            <div className="landing-section-header">
              <div className="landing-section-badge">{t('landing.partners.badge', language)}</div>
              <h2 className="landing-section-title landing-section-title-small">
                {t('landing.partners.title', language)}
              </h2>
            </div>
            <div className="loop_cont">
              <ul className="banner_list" ref={bannerListRef}>
                <li className="banner">
                  <img src={mexcGlobalLogo} alt="" />
                </li>
                <li className="banner">
                  <img src={bitGetLogo} alt="" />
                </li>
                <li className="banner">
                  <img src={hashkeyLogo} alt="" />
                </li>
                <li className="banner">
                  <img src={gateIoLogo} alt="" />
                </li>
              </ul>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="landing-faq-section">
            <div className="landing-section-header">
              <div className="landing-section-badge">FAQ</div>
              <h2 className="landing-section-title landing-section-title-small">
                {t('landing.faq.title', language)}
              </h2>
              <p className="landing-section-subtitle">
                {t('landing.faq.subtitle', language)}
              </p>
            </div>

            <div className="landing-faq-container">
              {faqData.map((faq, index) => (
                <div
                  key={index}
                  className={`landing-faq-item ${
                    expandedFaq === index ? "expanded" : ""
                  }`}
                >
                  <div
                    className="landing-faq-question"
                    onClick={() =>
                      setExpandedFaq(expandedFaq === index ? null : index)
                    }
                  >
                    <span className="landing-faq-question-text">
                      {faq.question}
                    </span>
                    <div
                      className={`landing-faq-icon ${
                        expandedFaq === index ? "rotated" : ""
                      }`}
                    >
                      <Icons.Plus />
                    </div>
                  </div>
                  {expandedFaq === index && (
                    <div className="landing-faq-answer">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="landing-footer">
            <div className="landing-footer-content">
              <div className="footer-logo-container">
                <img src={textLogo} alt="Logo" />
              </div>
              <div>
                <p className="landing-footer-subtitle">
                  {t('landing.footer.subtitle', language).split('\n').map((line, index) => (
                    <span key={index}>{line}{index === 0 && <br />}</span>
                  ))}
                </p>
              </div>

              <div className="landing-footer-disclaimer">
                {isMobile
                  ? t('landing.footer.disclaimerMobile', language)
                  : t('landing.footer.disclaimer', language)}
              </div>

              <div className="landing-footer-sns">
                <a href="https://pf.kakao.com/_jggxan" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
                  <img src={messageIcon} alt="KakaoTalk" />
                </a>
                <a href="https://t.me/BGSC_ADEN" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
                  <img src={sendIcon} alt="Telegram" />
                </a>
                <a href="https://x.com/bugscoin_bgsc" target="_blank" rel="noopener noreferrer" className="landing-footer-sns-item">
                  <img src={xIcon} alt="X (Twitter)" />
                </a>
              </div>
              <div className="landing-footer-copyright">
                {t('landing.footer.copyright', language).split('Aden Bugs Vault Protocol.').map((part, index) => (
                  index === 0 ? <span key={index}>{part}<strong>Aden Bugs Vault Protocol.</strong></span> : part
                ))}
              </div>
            </div>
          </footer>

          {/* Scroll to Top Button */}
          <div
            className={`landing-scroll-to-top ${
              showScrollTop ? "visible" : ""
            }`}
            onClick={scrollToTop}
          >
            <img src={iconArrowRightSmall} alt="" />
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{ __html: getLandingPageStyles() }}
      ></style>
    </>
  );
}