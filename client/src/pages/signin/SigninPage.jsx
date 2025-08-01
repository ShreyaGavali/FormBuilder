import React, { useState } from 'react';
import './SigninPage.css';
import logoImg from "../../assets/Logo.png";
import welcomeImg from "../../assets/welcome.png";
import { Link, useNavigate } from 'react-router-dom';

const SigninPage = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      return setError("Email and password are required.");
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
      } else {
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate('/'); // Redirect to home or dashboard
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signin-page'>
      <div className="logo-div">
        <img src={logoImg} alt="" />
      </div>
      <div className="signin-div">
        <div className="signin">
          <div className="welcome-img">
            <img src={welcomeImg} alt="" />
          </div>
          <p className="greet-text">Today is a new day. It's your day. You shape it.</p>
          <p className="greet-text">Sign in to start managing your projects.</p>

          <div className="signin-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="example@email.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="at least 8 characters"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <p className="forgot-pass"><Link to={'/forgot-password'}>Forgot Password?</Link></p>
          </div>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button className="signin-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="have-acc">Don't have an account? <Link to={'/signup'}>Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
