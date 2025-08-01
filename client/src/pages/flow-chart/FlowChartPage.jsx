import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './FlowChartPage.css';
import tagImg from '../../assets/Tag.png';
import axios from 'axios';
import PublishPopup from '../../components/publish-popup/PublishPopup';
import EditorSidebar from '../../components/editor-sidebar/EditorSidebar';
import FormLinkPopup from '../../components/link-popup/FormLinkPopup';


const FlowChartPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { formId } = useParams();
  const [pages, setPages] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showLinkPopup, setShowLinkPopup] = useState(false);

  const handleAddPage = () => {
    const newPage = {
      id: Date.now(),
      sections: [],
    };
    setPages(prev => [...prev, newPage]);
  };

  useEffect(() => {
    const fetchFlowData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        const formRes = await axios.get(`${backendUrl}/api/forms/${formId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPages(formRes.data.pages || []);

        const condRes = await axios.get(`${backendUrl}/api/forms/${formId}/conditions-summary`);
        setConditions(condRes.data || []);
      } catch (error) {
        console.error('Error fetching flow data:', error);
      }
    };

    fetchFlowData();
  }, [formId]);

  const getPageNumberById = (pageId) => {
    const index = pages.findIndex(p => p.id === pageId);
    return index !== -1 ? `Page ${String(index + 1).padStart(2, '0')}` : 'Unknown Page';
  };

  return (
    <div className="flowchart-layout">
      <EditorSidebar
        pages={pages}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={setCurrentPageIndex}
        handleAddPage={handleAddPage}
      />

      <div className="flowchart-container">

        <div className="flow-node">Page 01 ▼</div>
        {conditions.length === 0 ? (
          <div className="no-conditions-message">No any condition added.</div>
        ) : (
          conditions.map((cond, idx) => (
            <div key={idx} className="flow-branch">
              <div className="condition-choice">
                <div className="tag">
                  <img src={tagImg} alt="" />
                  <span>True</span>
                </div>
                <div className="flow-line"></div>
                <div className="flow-node">{getPageNumberById(cond.ifTruePageId)}</div>
              </div>

              <div className="condition-choice">
                <div className="tag">
                  <img src={tagImg} alt="" />
                  <span>False</span>
                </div>
                <div className="flow-line"></div>
                <div className="flow-node">{getPageNumberById(cond.ifFalsePageId)}</div>
              </div>
            </div>
          ))
        )}

        < button className="next-btn" onClick={() => setShowPublishPopup(true)}>Next</button>
        {showPublishPopup && (
          <PublishPopup
            formId={formId}
            onClose={() => setShowPublishPopup(false)}
            onShowLinkPopup={() => {
              setShowPublishPopup(false);
              setTimeout(() => setShowLinkPopup(true), 200); // delay for smooth transition
            }}
          />
        )}

        {showLinkPopup && (
          <FormLinkPopup
            formId={formId}
            onClose={() => setShowLinkPopup(false)}
          />
        )}

      </div>
    </div >
  );
};

export default FlowChartPage;
