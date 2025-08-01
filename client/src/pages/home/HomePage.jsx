import React, { useEffect, useState } from 'react'
import './HomePage.css'
import CreateProjectForm from '../../components/create/CreateProjectForm';
import CreateProjectImg from '../../assets/project1.png';
import CreateFormImg from '../../assets/form.png';
import Form from '../../components/form/Form';
import Folder from '../../components/folder/Folder';
import CreateProjectPopup from '../../components/project-popup/CreateProjectPopup';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ShareLinkPopup from '../../components/share-link-popup/ShareLinkPopup';
import FormPopup from '../../components/form-popup/FormPopup';
import { toast } from 'react-toastify';


const HomePage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [sharedForms, setSharedForms] = useState([]);
  const navigate = useNavigate();
  const handleEditForm = (formId) => {
    navigate(`/editor/${formId}`);
  };
  const [shareLinkFormId, setShareLinkFormId] = useState(null);
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);

  const handleSharedFormClick = (formId, access) => {
    if (access === 'edit') {
      navigate(`/create/${formId}`);
    } else if (access === 'share') {
      setShareLinkFormId(formId);
    } else if (access === 'view') {
      navigate(`/response/${formId}`);
    }
  };

  useEffect(() => {
    const fetchSharedForms = async () => {
      try {
        // const token = localStorage.getItem('token');
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
      }
    };

    fetchSharedForms();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      }
    };

    fetchData();
  }, []);


  return (
    <div className='home-page'>
      <div className="home1">
        <p className='welcome'>Welcome to CANOVA</p>
        <hr />
        <div className="create">
          <div onClick={() => setShowProjectPopup(true)}>
            <CreateProjectForm img={CreateProjectImg} title="Start From Scratch" desc="Create your first project now" />
          </div>
          <div onClick={() => setShowFormPopup(true)}>
            <CreateProjectForm img={CreateFormImg} title="Create Form" desc="Create your first form now" />
          </div>
        </div>
        <div className="recent-works">
          <p className='recent'>Recent Works</p>
          <div className="work">
            <div className="work">
              {forms.length === 0 && folders.length === 0 ? (
                <p style={{ color: '#888' }}>You don't have any recent work.</p>
              ) : (
                <>
                  {forms.map((form) => (
                    <Link to={`/create/${form._id}`} key={form._id}>
                      <Form formName={form.title} img={CreateFormImg} formid={form._id} />
                    </Link>
                  ))}
                  {folders.map((folder) => (
                    <Link to={`/project/files/${folder._id}`} key={folder._id}>
                      <Folder projectName={folder.name} img={CreateProjectImg} />
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="share-work">
          <p className='share'>Shared Works</p>
          <div className="shared-work">
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
          </div>
        </div>
      </div>
      {showProjectPopup && <CreateProjectPopup onClose={() => setShowProjectPopup(false)} onSuccess={() => {
        toast.success('Project Created 🎉');
      }} />}
      {showFormPopup && <FormPopup onClose={() => setShowFormPopup(false)} onSuccess={() => {
        toast.success('Form Created ✅');
      }} />}
      {shareLinkFormId && (
        <ShareLinkPopup
          formId={shareLinkFormId}
          onClose={() => setShareLinkFormId(null)}
        />
      )}
    </div>
  )
}

export default HomePage