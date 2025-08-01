import React, { useState } from 'react';
import './ForgotPasswordPage.css';
import logoImg from "../../assets/Logo.png";
import welcomeImg from "../../assets/welcome.png";
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      return setError("Please enter your registered email");
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${backendUrl}/api/password/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        // Store email in sessionStorage to use in verify/reset steps
        sessionStorage.setItem('resetEmail', email);
        navigate('/verify-otp');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='forgotpassword-page'>
      <div className="logo-div">
        <img src={logoImg} alt="" />
      </div>
      <div className="forgotpassword-div">
        <div className="forgotpassword">
          <div className="welcome-img">
            <img src={welcomeImg} alt="" />
          </div>
          <p className="greet-text">Please enter your registered email ID to receive an OTP</p>
          <div className="signin-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button className="signin-btn" onClick={handleSendOTP} disabled={loading}>
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
