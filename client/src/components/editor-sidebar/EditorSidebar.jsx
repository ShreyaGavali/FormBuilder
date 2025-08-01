// EditorSidebar.jsx
import React from 'react';
// import './EditorSidebar.css'; // you can move existing sidebar styles here
import profileImg from '../../assets/profile.png';
import { Link } from 'react-router-dom';

const EditorSidebar = ({ pages, currentPageIndex, setCurrentPageIndex, handleAddPage }) => {
  return (
    <div className="sidebar">
      <h3 className="logo">CANOVA</h3>
      <div className="page-list">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={`page-btn ${index === currentPageIndex ? 'selected' : ''}`}
            onClick={() => setCurrentPageIndex(index)}
          >
            Page {String(index + 1).padStart(2, '0')}
          </button>
        ))}
        <button className="add-page-btn" onClick={handleAddPage}>+ Add new Page</button>
      </div>
      <Link to={'/profile'}>
      <div className="profile">
        <span><img src={profileImg} alt="" /> Profile</span>
      </div>
      </Link>
    </div>
  );
};

export default EditorSidebar;
