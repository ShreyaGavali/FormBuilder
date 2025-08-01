import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import logoImg from '../../assets/logo1.png';
import userImg from '../../assets/user.png';
import seetingImg from '../../assets/seeting.png';
import logoutImg from '../../assets/log-out.png';
import arrowRightImg from '../../assets/right.png';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();

 useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Redirect if no name (optional: extra safety)
      if (!userData.name) {
        navigate('/signin');
      }
    } else {
      // Redirect if no user in localStorage
      navigate('/signin');
    }
  }, [navigate]);

  // Create initials from name
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "U";

    
const handleLogout = () => {
  localStorage.removeItem("userInfo");   // Remove user data
  navigate("/signin");                   // Redirect to login
};

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <div className="logo">
          <img src={logoImg} alt="" />
          <p>CANOVA</p>
        </div>
        <div className="user-info">
          <div className="user-initials">{initials}</div>
          <div className='user-name-email'>
            <p className="username">{user.name || "User Name"}</p>
            <p className="email">{user.email || "user@email.com"}</p>
          </div>
        </div>
        <hr />
        <div className="profile-menu">
          <div className="my-profile">
            <div className='pr'>
              <img src={userImg} alt="" />
              <p className="profile-menu-item">My Profile</p>
            </div>
            <div>
              <img src={arrowRightImg} alt="" />
            </div>
          </div>
          <div className="seeting">
            <div className='se'>
              <img src={seetingImg} alt="" />
              <p className="menu-item">Settings</p>
            </div>
            <div>
              <img src={arrowRightImg} alt="" />
            </div>
          </div>
          <div className="logout"  onClick={handleLogout} style={{ cursor: "pointer" }}>
            <img src={logoutImg} alt="" />
            <p className="menu-item logout">Log Out</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="pc">
          <div className="p">
            <h1>My Profile</h1>
            <div className="top-section">
              <div className="user-circle">{initials}</div>
              <div className="details">
                <p className="username">{user.name}</p>
                <p className="email">{user.email}</p>
              </div>
            </div>
            <div className="info-table">
              <div className="row">
                <span>Name</span>
                <span>{user.name}</span>
              </div>
              <div className="row">
                <span>Email account</span>
                <span>{user.email}</span>
              </div>
            </div>
            <div className="button-group">
              <button className="save-btn">Save Change</button>
              <button className="discard-btn">Discard Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

