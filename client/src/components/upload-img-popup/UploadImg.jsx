import React, { useState } from 'react';
import './UploadImg.css'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UploadImg = ({ onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  

  const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err);
    return null;
  }
};


  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
const handleDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const url = await uploadToCloudinary(file);
    if (url) {
      onUpload(url);
      onClose();
    }
  }
};

  const handleBrowse = async (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const url = await uploadToCloudinary(file);
    if (url) {
      onUpload(url); // This will add image to the canvas
      onClose();
    }
  }
};



  return (
    <div className="popup-overlay">
      <div
        className="popup-content"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Upload</h3>

        <div className={`upload-box ${dragActive ? 'drag-active' : ''}`}>
          <p><strong>Drag & drop files to upload</strong></p>
          <p className="note">Consider upto 25 MB per Image</p>
          <p className='or'>or</p>
          <label className="browse-btn">
            Browse files
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleBrowse}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadImg;
