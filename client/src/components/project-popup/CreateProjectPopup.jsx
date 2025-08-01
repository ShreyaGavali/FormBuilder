import React, { useState } from 'react';
import './CreateProjectPopup.css';
import img from '../../assets/Vector.png';
import closeBtnImg from '../../assets/Vector 1.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProjectPopup = ({ onClose, onSuccess }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [folderName, setFolderName] = useState('');
  const [formName, setFormName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const handleCreate = async () => {
  if (!folderName.trim() || !formName.trim()) {
    alert("Please enter both folder and form names.");
    return;
  }

  setLoading(true);

  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userId = userInfo?._id;
    const token = userInfo.token;

    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }

    // 1. Create Form
    const formRes = await axios.post(`${backendUrl}/api/forms`, {
      title: formName,
      createdBy: userId, // optional if backend uses req.user._id
      pages: [] // initially empty
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const formId = formRes.data._id;

    // 2. Create Folder with formId inside files
    const folderRes = await axios.post(`${backendUrl}/api/folders`, {
      name: folderName,
      files: [formId]
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (folderRes.status === 201) {
      onSuccess();
      onClose();
      navigate('/projects');
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong. Try again.");
  }finally{
      setLoading(false);
    }
};



  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <div className="popup-header-img">
            <img src={img} alt="" />
          </div>
          <div className="close-btn">
            <img onClick={onClose} src={closeBtnImg} alt="close" />
          </div>
        </div>
        <p className="popup-title">Create Project</p>
        <p className="popup-subtitle">Provide your project a name and start with your journey</p>

        <label>Folder Name</label>
        <input
          type="text"
          placeholder="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        <label>Form Name</label>
        <input
          type="text"
          placeholder="Form Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
        />

        <button onClick={handleCreate} disabled={loading}> {loading ? 'Creating...' : 'Create'}</button>
      </div>
    </div>
  );
};

export default CreateProjectPopup;

