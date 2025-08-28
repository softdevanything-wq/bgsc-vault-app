import Icons from "components/Icons";
import { useAccount, useDisconnect } from "wagmi";
import { shortenAddress } from "utils";
import { getStyles } from "views/MainPage/styles";
import { useLanguage } from "../../contexts/LanguageContext";
import { t } from "../../translations";

export default function AccessDenied() {
  const { language } = useLanguage();
  // Wallet connection state
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="app">
      <div className="background-gradient"></div>
      <header className="header-wrapper">
        <div className="header-container">
          <nav className="navbar">
            <div className="logo-wrapper">
              <Icons.Logo />
              <div className="logo-text">Bugs Vault</div>
            </div>
            <div className="wallet-section">
              <button
                onClick={() => disconnect()}
                className="action-button primary"
              >
                {t('common.disconnect', language)}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-container">
        <div className="hero-section">
          <div className="balance-display">
            <div className="balance-amount" style={{ fontSize: "60px" }}>
              {t('accessDenied.title', language)}
            </div>
            <div className="balance-label">
              {t('accessDenied.subtitle', language)}
            </div>
            <div style={{ marginTop: "20px", color: "#999" }}>
              {shortenAddress(address)}
            </div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{ __html: getStyles() }}></style>
    </div>
  );
}
