// import React from 'react';
// import './FormLinkPopup.css';

// const FormLinkPopup = ({ formId, onClose }) => {
//   const formLink = `${window.location.origin}/view/${formId}`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(formLink);
//     alert('Link copied to clipboard!');
//   };

//   return (
//     <div className="form-link-popup">
//       <p>Anyone with this link can view the form:</p>
//       <input type="text" value={formLink} readOnly className="form-link-input" />
//       <button className="blue-link" onClick={handleCopy}>Copy Link</button>
//       <button className="close-btn" onClick={onClose}>Done</button>
//     </div>
//   );
// };

// export default FormLinkPopup;

import React from 'react';
import './FormLinkPopup.css';
import { FaTimes, FaLink, FaShareAlt } from 'react-icons/fa';

const FormLinkPopup = ({ formId, onClose }) => {
  const formLink = `${window.location.origin}/response/${formId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="form-link-popup-overlay">
      <div className="form-link-popup-box">
        <div className="popup-header">
            <div className='share'>
                <FaShareAlt className="share-icon" />
                <span>Share</span>
            </div>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <label className="share-label">Share</label>

        <div className="copy-link-box" onClick={handleCopy}>
          <FaLink className="link-icon" />
          <span>Copy the Link</span>
        </div>

        <button className="share-btn" onClick={handleCopy}>Share</button>
      </div>
    </div>
  );
};

export default FormLinkPopup;

