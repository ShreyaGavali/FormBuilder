// components/PageRedirectPopup/PageRedirectPopup.jsx
import React from 'react';
import './PageRedirectPopup.css';

const PageRedirectPopup = ({ pages, onClose, onSave, redirectPages, setRedirectPages }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h3>Select Page</h3>
        <p>If the conditions are all met, lead the user to the selected page</p>

        <label>Select, if it’s true</label>
        <select
          value={redirectPages.ifTrue ?? ''}
          onChange={(e) => setRedirectPages(prev => ({ ...prev, ifTrue: Number(e.target.value) }))}
        >
          <option value="">Select Page</option>
          {pages.map((_, i) => (
            <option key={i} value={i}>Page {i + 1}</option>
          ))}
        </select>

        <label>Select, if it’s false</label>
        <select
          value={redirectPages.ifFalse ?? ''}
          onChange={(e) => setRedirectPages(prev => ({ ...prev, ifFalse: Number(e.target.value) }))}
        >
          <option value="">Select Page</option>
          {pages.map((_, i) => (
            <option key={i} value={i}>Page {i + 1}</option>
          ))}
        </select>
        <div onClick={onSave} style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
           <button className="continue-btn" >Continue</button>
        </div>
      </div>
    </div>
  );
};

export default PageRedirectPopup;
