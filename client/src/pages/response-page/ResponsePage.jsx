import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ResponsePage.css';
import AnswerBlock from '../../components/answer-block/AnswerBlock';

const ResponsePage = () => {
  const { formId } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/forms/view/${formId}`);
        const data = await res.json();
        setFormTitle(data.title);
        setPages(data.pages || []);
      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };

    const logView = async () => {
      try {
        await fetch(`http://localhost:5000/api/forms/${formId}/view`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Error logging view:', err);
      }
    };

    fetchForm();
    logView();
  }, [formId]);

  if (!pages.length) return <div className="view-loading">Loading form...</div>;

   const handleSubmit = () => {
    alert('Form submitted ✅');
  };

  return (
    <div className="response-form-container">
      <h2 className="response-form-title">{formTitle}</h2>
      {pages.map((page, pageIndex) => (
        <div key={page.id} className="response-page">
          {page.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="response-section"
              style={{
                backgroundColor: sectionIndex % 2 === 0 ? '#f9f9f9' : '#eaf6ff',
              }}
            >
              {section.content.map((block, index) => {
                switch (block.type) {
                  case 'question':
                    return (
                      <AnswerBlock
                        key={block.id}
                        index={index}
                        question={block.data}
                      />
                    );
                  case 'text':
                    return (
                      <div key={block.id} className="response-text-block">
                        <p>{block.data.content}</p>
                      </div>
                    );
                  case 'image':
                    return (
                      <div key={block.id} className="response-image-block">
                        <img src={block.data} alt={`uploaded-${index}`} />
                      </div>
                    );
                  case 'video':
                    return (
                      <div key={block.id} className="response-video-block">
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
      <div className="submit-button-container">
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ResponsePage;
