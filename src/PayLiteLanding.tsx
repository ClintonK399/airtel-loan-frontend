import React from "react";
import { useNavigate } from "react-router-dom";

// Define the type for TypeScript since you are using .tsx
interface Plan {
  id: number;
  data: string;
  network: string;
  duration: string;
  price: string;
  isHighlighted?: boolean;
  isFullWidth?: boolean;
  badge?: string;
  badgeColor?: string;
}

export default function AirtelInternetPlans() {
  // 1. Initialize the navigate hook
  const navigate = useNavigate();

  const plans: Plan[] = [
    {
      id: 1,
      data: "5",
      network: "5G",
      duration: "Valide 1 Jour",
      price: "436",
      isHighlighted: true,
    },
    {
      id: 2,
      data: "10",
      network: "5G",
      duration: "Valide 3 Jours",
      price: "895",
    },
    {
      id: 3,
      data: "20",
      network: "5G",
      duration: "Valide 7 Jours",
      price: "1813",
    },
    {
      id: 4,
      data: "40",
      network: "5G",
      duration: "Valide 7 Jours",
      price: "3420",
      badge: "⚡ Populaire",
      badgeColor: "#F5A623",
    },
    {
      id: 5,
      data: "80",
      network: "5G+",
      duration: "Valide 21 Jours",
      price: "6863",
      badge: "💎 Pro",
      badgeColor: "#F5A623",
    },
    {
      id: 6,
      data: "120",
      network: "5G+",
      duration: "Valide 30 Jours",
      price: "12601",
      badge: "🚀 Max",
      badgeColor: "#F5A623",
    },
    {
      id: 7,
      data: "∞",
      network: "5G+",
      duration: "Valide 30 Jours",
      price: "17190",
      isHighlighted: true,
      isFullWidth: true,
      badge: "👑 Illimité",
      badgeColor: "#F5A623",
    },
  ];

  // 2. Update the handler to use navigate
  const handlePlanSelect = (plan: Plan) => {
    // Save the selected plan in localStorage (optional, but useful for the next page)
    localStorage.setItem("selectedAirtelPlan", JSON.stringify(plan));
    
    // Redirect to the AirtelLogin page
    // IMPORTANT: Change "/login" to whatever route you set up in App.tsx for AirtelLogin.tsx
    navigate("/login"); 
  };

  return (
    <div className="airtel-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        body {
          background-color: #f0f0f0;
        }

        .airtel-container {
          background: linear-gradient(180deg, #8B0000 0%, #A52A2A 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        /* HEADER */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 20px;
          background-color: #8B0000;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .logo-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .airtel-logo-icon {
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #DA1C1C;
          font-weight: bold;
          font-size: 16px;
        }

        .logo-text {
          color: white;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .tagline {
          color: #ccc;
          font-size: 8px;
          letter-spacing: 2px;
          margin-left: 32px;
          text-transform: uppercase;
        }

        .header-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 4px;
        }

        .collab-text {
          color: white;
          font-size: 9px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .starlink-logo {
          display: flex;
          align-items: center;
          gap: 4px;
          color: white;
          font-weight: 700;
          font-size: 14px;
        }

        .menu-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
        }

        /* HERO SECTION */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 20px 20px;
          text-align: center;
        }

        .badge-internet {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(0, 0, 0, 0.3);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-title {
          color: white;
          font-size: 38px;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
        }

        .hero-title span {
          color: #FFD700;
        }

        .hero-desc {
          color: #e0e0e0;
          font-size: 14px;
          line-height: 1.5;
          max-width: 320px;
        }

        /* PLANS GRID */
        .plans-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding: 20px;
          margin-top: 10px;
        }

        .plan-card {
          background-color: #ffffff;
          border-radius: 20px;
          padding: 24px 16px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .plan-card.highlighted {
          background-color: #FFFDF0;
          border: 2px solid #F5A623;
        }

        .plan-card.full-width {
          grid-column: span 2;
          padding-top: 30px;
        }

        .card-badge {
          position: absolute;
          top: -12px;
          background-color: #F5A623;
          color: white;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 10;
        }

        .network-type {
          color: #999;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .data-amount {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          color: #C8102E;
          font-size: 42px;
          font-weight: 800;
          line-height: 1;
        }

        .data-amount .unit {
          font-size: 16px;
          font-weight: 700;
          margin-top: 6px;
          margin-left: 2px;
        }

        .duration {
          color: #666;
          font-size: 13px;
          font-weight: 500;
          margin-top: 8px;
          margin-bottom: 16px;
        }

        .divider {
          width: 100%;
          height: 1px;
          background-color: #eee;
          margin-bottom: 16px;
        }

        .price-container {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 16px;
        }

        .price-value {
          color: #111;
          font-size: 26px;
          font-weight: 800;
        }

        .price-currency {
          color: #444;
          font-size: 13px;
          font-weight: 700;
        }

        .btn-choose {
          width: 100%;
          background-color: #C8102E;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(200, 16, 46, 0.3);
          transition: transform 0.1s;
        }

        .btn-choose:active {
          transform: scale(0.98);
        }

        /* FOOTER */
        .footer {
          margin-top: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .footer-features {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          background-color: rgba(0, 0, 0, 0.3);
          padding: 12px 20px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          color: white;
          font-size: 11px;
          font-weight: 500;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .feature-divider {
          color: rgba(255, 255, 255, 0.3);
        }

        .copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 10px;
          margin-bottom: 20px;
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-left">
          <div className="logo-row">
            <div className="airtel-logo-icon">A</div>
            <span className="logo-text">airtel</span>
          </div>
          <span className="tagline">A REASON TO IMAGINE</span>
        </div>

        <div className="header-center">
          <span className="collab-text">EN COLLABORATION AVEC</span>
          <div className="starlink-logo">
            <span style={{ fontWeight: "900", letterSpacing: "1px" }}>STARLINK</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z" />
            </svg>
          </div>
        </div>

        <button className="menu-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* HERO */}
      <main className="hero">
        <div className="badge-internet">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22h20V2L2 22z" />
          </svg>
          Forfaits Internet
        </div>
        <h1 className="hero-title">
          Restez<br />Connecté<br /><span>Sans Limites</span>
        </h1>
        <p className="hero-desc">
          Choisissez un forfait. Vous serez redirigé vers la page de connexion Airtel Lite pour procéder au paiement.
        </p>
      </main>

      {/* PLANS GRID */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${plan.isHighlighted ? "highlighted" : ""} ${plan.isFullWidth ? "full-width" : ""}`}
          >
            {plan.badge && (
              <div className="card-badge" style={{ backgroundColor: plan.badgeColor }}>
                {plan.badge}
              </div>
            )}
            
            <span className="network-type">{plan.network}</span>
            
            <div className="data-amount">
              {plan.data}
              {plan.data !== "∞" && <span className="unit">GB</span>}
            </div>
            
            <span className="duration">{plan.duration}</span>
            
            <div className="divider"></div>
            
            <div className="price-container">
              <span className="price-value">{plan.price}</span>
              <span className="price-currency">CDF</span>
            </div>
            
            {/* 3. Trigger the navigate function */}
            <button className="btn-choose" onClick={() => handlePlanSelect(plan)}>
              CHOISIR CE FORFAIT
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-features">
          <div className="feature-item">
            ⚡ Activation instantanée
          </div>
          <span className="feature-divider">|</span>
          <div className="feature-item">
            🔒 Paiement sécurisé
          </div>
          <span className="feature-divider">|</span>
          <div className="feature-item">
            📞 Support 24/7
          </div>
        </div>
        <p className="copyright">© 2026 Airtel Congo. Tous droits réservés.</p>
      </footer>
    </div>
  );
}