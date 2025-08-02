import React, { useEffect, useState } from 'react'
import '../home/HomePage.css';
import CreateProjectForm from '../../components/create/CreateProjectForm';
import CreateProjectImg from '../../assets/project1.png';
import CreateFormImg from '../../assets/form.png';
import Form from '../../components/form/Form';
import Folder from '../../components/folder/Folder';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AnalysisPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [sharedForms, setSharedForms] = useState([]);
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingShared, setLoadingShared] = useState(true);
  useEffect(() => {
    const fetchSharedForms = async () => {
      try {
        // const token = localStorage.getItem('token');
        setLoadingShared(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const res = await axios.get(`${backendUrl}/api/forms/shared`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSharedForms(res.data);
      } catch (err) {
        console.error('Error fetching shared forms:', err);
      } finally {
        setLoadingShared(false);
      }
    };

    fetchSharedForms();
  }, []);

  const handleSharedFormClick = (formId, access) => {
    if (access === 'edit') {
      navigate(`/analysis/${formId}`);
    } else if (access === 'share') {
      navigate(`/analysis/${formId}`);
    } else if (access === 'view') {
      navigate(`/analysis/${formId}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingRecent(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const [formRes, folderRes] = await Promise.all([
          axios.get(`${backendUrl}/api/forms`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/api/folders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const sortedForms = [...formRes.data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        const sortedFolders = [...folderRes.data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setForms(sortedForms);
        setFolders(sortedFolders);
      } catch (err) {
        console.error('Error fetching forms/folders:', err);
      } finally {
        setLoadingRecent(false); // stop loading
      }
    };

    fetchData();
  }, []);


  return (
    <div className='home-page'>
      <div className="home1">
        <p className='welcome'>Welcome to CANOVA</p>
        <hr />
        <div className="recent-works">
          <p className='recent'>Recent Works</p>
          <div className="work">
            {loadingRecent ? (
              <div className="spinner"></div>
            ) : (
              <>
                {forms.length === 0 && folders.length === 0 ? (
                  <p style={{ color: '#888' }}>You don't have any recent work.</p>
                ) : (
                  <>
                    {forms.map((form) => (
                      <Link to={`/analysis/${form._id}`} key={form._id}>
                        <Form  formName={form.title} img={CreateFormImg} formid={form._id} />
                      </Link>
                    ))}
                    {folders.map((folder) => (
                        <Folder key={folder._id} projectName={folder.name} img={CreateProjectImg} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="share-work">
          <p className='share'>Shared Works</p>
          <div className="shared-work">
            {loadingShared ? (
              <div className="spinner"></div>
            ) : (
              <>
                {sharedForms.length === 0 ? (
                  <p style={{ color: '#888' }}>No forms shared with you.</p>
                ) : (
                  sharedForms.map(({ form, access }) => (
                    <div
                      key={form._id}
                      onClick={() => handleSharedFormClick(form._id, access)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Form
                        formName={`${form.title} (${access})`}
                        img={CreateFormImg}
                        formid={form._id}
                      />
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage