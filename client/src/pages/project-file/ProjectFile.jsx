import React, { useEffect, useState } from 'react';
import './ProjectFile.css';
import fileImg from '../../assets/form.png';
import Form from '../../components/form/Form';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectFile = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { folderId } = useParams();
  const [forms, setForms] = useState([]);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?.token) return;

      try {
        const res = await axios.get(`${backendUrl}/api/folders/${folderId}/files`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setForms(res.data);
        console.log(forms);
      } catch (err) {
        console.error('Error fetching forms:', err);
      }
    };

    fetchForms();
  }, [folderId]);

  useEffect(() => {
  const fetchFolderName = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo?.token) return;

    try {
      const res = await axios.get(`${backendUrl}/api/folders/${folderId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setFolderName(res.data.name);
    } catch (err) {
      console.error('Error fetching folder name:', err);
    }
  };

  fetchFolderName();
}, [folderId]);


  return (
    <div className="project-files">
      <div className="project-file">
        <div className="search-bar">
          <div className="search">
            <input type="text" placeholder='Hinted search text' />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>
        <hr />
        <div className="files">
          <div className="head">
            <Link to={'/projects'}><i className="fa-solid fa-arrow-left fa-2x"></i></Link>
            <p className='project-name'>{folderName}</p>
          </div>
          <div className="file">
            {forms.map((form) => (
              <Link to={`/create/${form._id}`}  key={form._id}>
              <Form key={form._id} formName={form.title} img={fileImg} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectFile