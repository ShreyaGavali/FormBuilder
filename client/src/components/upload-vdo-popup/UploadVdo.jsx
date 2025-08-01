import React, { useState } from 'react';
import '../upload-img-popup/UploadImg.css'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UploadVdo = ({ onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const uploadVideoToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/video/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error('Cloudinary Video Upload Error:', err);
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

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);

  //   const file = e.dataTransfer.files[0];
  //   if (file && file.type.startsWith('video/')) {
  //     const url = URL.createObjectURL(file);
  //     onUpload(url);
  //     onClose();
  //   }
  // };

  // const handleBrowse = (e) => {
  //   const file = e.target.files[0];
  //   if (file && file.type.startsWith('video/')) {
  //     const url = URL.createObjectURL(file);
  //     onUpload(url);
  //     onClose();
  //   }
  // };

  const handleBrowse = async (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    const url = await uploadVideoToCloudinary(file);
    if (url) {
      onUpload(url); // Pass Cloudinary URL to EditorPage
      onClose();
    }
  }
};

const handleDrop = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) {
    const url = await uploadVideoToCloudinary(file);
    if (url) {
      onUpload(url);
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
          <p className="note">Consider upto 100 MB per Video</p>
          <p className='or'>or</p>
          <label className="browse-btn">
            Browse files
            <input
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleBrowse}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default UploadVdo;
