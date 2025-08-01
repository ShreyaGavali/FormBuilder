import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewFormPage.css';
import QuestionBlock from '../../components/question-block/QuestionBlock';

const ViewFormPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { formId } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/forms/view/${formId}`);
        const data = await res.json();
        setFormTitle(data.title);
        setPages(data.pages || []);
      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };

    fetchForm();
  }, [formId]);

  if (!pages.length) return <div className="view-loading">Loading form...</div>;

  return (
    <div className="view-form-container">
      <h2 className="view-form-title">{formTitle}</h2>
      {pages.map((page, pageIndex) => (
        <div key={page.id} className="view-page">
          {page.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="view-section"
              style={{
                backgroundColor: sectionIndex % 2 === 0 ? '#f0f0f0' : '#e0eaff',
              }}
            >
              {section.content.map((block, index) => {
                switch (block.type) {
                  case 'question':
                    return (
                      <QuestionBlock
                        key={block.id}
                        index={index}
                        question={block.data}
                        updateQuestion={() => {}} // read-only
                        disabled={true}
                      />
                    );
                  case 'text':
                    return (
                      <div key={block.id} className="view-text-block">
                        <p>{block.data.content}</p>
                      </div>
                    );
                  case 'image':
                    return (
                      <div key={block.id} className="view-image-block">
                        <img src={block.data} alt={`uploaded-${index}`} />
                      </div>
                    );
                  case 'video':
                    return (
                      <div key={block.id} className="view-video-block">
                        <video src={block.data} controls width="400" />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ViewFormPage;
