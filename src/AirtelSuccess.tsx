import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelSuccess() {
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
        {/* Success Icon */}
        <div className="airtel-success-icon">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h2 className="airtel-denied-heading">Loan Approved!</h2>
        <p className="airtel-denied-subtext">Your loan has been successfully approved</p>

        <button className="airtel-dashboard-btn" onClick={() => alert("Navigating to Dashboard")}>
          Go to Dashboard
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <button className="airtel-back-to-login" onClick={() => navigate('/')}>
          Back to login
        </button>
      </div>
    </div>
  );
}

export default AirtelSuccess;