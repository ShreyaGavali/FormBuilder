// // components/share-link-popup/ShareLinkPopup.jsx
// import React from 'react';
// import './ShareLinkPopup.css';

// const ShareLinkPopup = ({ formId, onClose }) => {
//   const shareUrl = `${window.location.origin}/response/${formId}`;

//   const handleCopy = () => {
//     navigator.clipboard.writeText(shareUrl);
//     alert('Link copied to clipboard!');
//   };

//   return (
//     <div className="share-popup">
//       <div className="share-popup-content">
//         <h3>Share this form</h3>
//         <input type="text" readOnly value={shareUrl} />
//         <div className="popup-buttons">
//           <button onClick={handleCopy}>Copy Link</button>
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareLinkPopup;

import React from 'react';
// import './FormLinkPopup.css';
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


