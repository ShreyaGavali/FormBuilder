import React from 'react'
import './SideBar.css';
import logoImg from '../../assets/logo1.png';
import homeImg from '../../assets/home.png';
import analysisImg from '../../assets/analytics.png';
import projectImg from '../../assets/project.png';
import profileImg from '../../assets/profile.png';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SideBar = () => {
    const location = useLocation();
  return (
    <div className='side-bar'>
        <div className="logo">
            <img src={logoImg} alt="" />
            <p>CANOVA</p>
        </div>
        <div className="items">
            <div className="list-item">
                <Link to={'/'}>
                <div className={`home ${location.pathname === '/' ? 'active' : ''}`}>
                    <img src={homeImg} alt="" />
                    <p>Home</p>
                </div>
                </Link>
                <Link to={'/analysis'}>
                <div className={`analysis ${location.pathname === '/analysis' ? 'active' : ''}`}>
                    <img src={analysisImg} alt="" />
                    <p>Analysis</p>
                </div>
                </Link>
                <Link to={'/projects'}>
                <div className={`project ${location.pathname === '/projects' ? 'active' : ''}`}>
                    <img src={projectImg} alt="" />
                    <p>Projects</p>
                </div>
                </Link>
            </div>
            <Link to={'/profile'}>
            <div className={`profile ${location.pathname === '/profile' ? 'active' : ''}`}>
                <img src={profileImg} alt="" />
                <p>Profile</p>
            </div>
            </Link>
        </div>
    </div>
  )
}

export default SideBar