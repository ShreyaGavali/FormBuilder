import React, { useState } from 'react';
import './VerifyOTP.css';
import logoImg from "../../assets/Logo.png";
import welcomeImg from "../../assets/welcome.png";
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const email = sessionStorage.getItem('resetEmail');
    if (!email || !otp) return setError('Email or OTP missing');

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${backendUrl}/api/password/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Invalid OTP');
      } else {
        // Success: Go to reset password page
        navigate('/reset-password');
      }
    } catch (err) {
      setError('Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='verify-page'>
      <div className="logo-div">
        <img src={logoImg} alt="" />
      </div>
      <div className="verify-div">
        <div className="verify">
          <h3>Enter Your OTP</h3>
          <p className="greet-text">We've sent a 6-digit OTP to your registered mail.</p>
          <p className="greet-text">Please enter it below to sign in</p>
          <div className="verify-form">
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          </div>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button className="verify-btn" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
