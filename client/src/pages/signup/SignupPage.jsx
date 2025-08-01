// import React from 'react';
// import './SignupPage.css';
// import logoImg from "../../assets/Logo.png";
// import welcomeImg from "../../assets/welcome.png";
// import { Link, useNavigate } from 'react-router-dom';

// const SignupPage = () => {
//     return (
//         <div className='signup-page'>
//             <div className="logo-div">
//                 <img src={logoImg} alt="" />
//             </div>
//             <div className="signup-div">
//                 <div className="signup">
//                     <div className="welcome-img">
//                         <img src={welcomeImg} alt="" />
//                     </div>
//                     <p className="greet-text">Today is a new day. It's your day. You shape it.</p>
//                     <p className="greet-text">Sign in to start managing your projects.</p>
//                     <div className="signup-form">
//                         <div className="form-group">
//                             <label>Name</label>
//                             <input type="text" placeholder="Name" />
//                         </div>
//                         <div className="form-group">
//                             <label>Email</label>
//                             <input type="email" placeholder="example@email.com" />
//                         </div>
//                         <div className="form-group">
//                             <label>Create Password</label>
//                             <input type="password" placeholder="at least 8 characters" />
//                         </div>
//                         <div className="form-group">
//                             <label>Confirm Password</label>
//                             <input type="password" placeholder="at least 8 characters" />
//                         </div>
//                     </div>
//                     <button className="signup-btn">Sign up</button>
//                     <p className="have-acc">Do you have an account? <Link to={'/signin'}>Sign in</Link></p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SignupPage

import React, { useState } from 'react';
import './SignupPage.css';
import logoImg from "../../assets/Logo.png";
import welcomeImg from "../../assets/welcome.png";
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      return setError("All fields are required.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate('/'); // Redirect to home or dashboard
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-page'>
      <div className="logo-div">
        <img src={logoImg} alt="" />
      </div>
      <div className="signup-div">
        <div className="signup">
          <div className="welcome-img">
            <img src={welcomeImg} alt="" />
          </div>
          <p className="greet-text">Today is a new day. It's your day. You shape it.</p>
          <p className="greet-text">Sign in to start managing your projects.</p>

          <div className="signup-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@email.com" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Create Password</label>
              <input type="password" placeholder="at least 8 characters" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="at least 8 characters" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <button className="signup-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
          <p className="have-acc">Do you have an account? <Link to={'/signin'}>Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
