import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelLoanLimit() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // Redirect to the Payment page
    navigate('/airtel-payment');
  };

  return (
    <div className="airtel-container">
      {/* Header Section */}
      <div className="airtel-header">
        <div className="airtel-hamburger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <h1 className="airtel-logo">Airtel Loans</h1>
        <p className="airtel-tagline">Quick loans. Anytime. Anywhere.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        {/* Back Link */}
        <button className="airtel-back-link" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <h2 className="airtel-limit-heading">Your Loan Limit</h2>
        <p className="airtel-limit-subtext">Here is the amount you can borrow</p>

        {/* Available Amount Box */}
        <div className="airtel-limit-box">
          <span className="airtel-limit-label">Available Loan Amount</span>
          <span className="airtel-limit-amount">1,200</span>
          <span className="airtel-limit-currency">USD</span>
        </div>

        {/* Loan Details List */}
        <div className="airtel-details-list">
          <div className="airtel-detail-row">
            <span>Loan Term</span>
            <span>12 months</span>
          </div>
          <div className="airtel-detail-row">
            <span>Interest Rate</span>
            <span>13%</span>
          </div>
          <div className="airtel-detail-row">
            <span>Processing Fee</span>
            <span>$5</span>
          </div>
        </div>

        {/* Continue Button */}
        <button className="airtel-continue-btn" onClick={handleContinue}>
          Continue to Get Loan
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AirtelLoanLimit;