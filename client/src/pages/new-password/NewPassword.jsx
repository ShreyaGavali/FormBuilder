import React, { useState } from 'react';
import './NewPassword.css';
import logoImg from "../../assets/Logo.png";
import welcomeImg from "../../assets/welcome.png";
import { useNavigate } from 'react-router-dom';

const NewPassword = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    const email = sessionStorage.getItem('resetEmail');

    if (!email) {
      return setError("Something went wrong. Please start from 'Forgot Password' again.");
    }

    if (!newPassword || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${backendUrl}/api/password/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Password reset failed.");
      } else {
        sessionStorage.removeItem('resetEmail');
        navigate('/signin');
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='new-pass-page'>
      <div className="logo-div">
        <img src={logoImg} alt="" />
      </div>
      <div className="new-pass-div">
        <div className="new-pass">
          <h3>Create New Password</h3>
          <p className="greet-text">Today is a new day. It's your day. You shape it.</p>
          <p className="greet-text">Sign in to start managing your projects.</p>

          <div className="new-pass-form">
            <div className="form-group">
              <label>Enter New Password</label>
              <input
                type="password"
                placeholder="at least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="at least 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          <button className="new-pass-btn" onClick={handleResetPassword} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
