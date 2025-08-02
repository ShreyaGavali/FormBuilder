import React, { useEffect, useState, useRef } from 'react';
import './EditorPage.css';
import addQuestionImg from '../../assets/add-question.png';
import addTextImg from '../../assets/add-text.png';
import addConditionImg from '../../assets/add-condition.png';
import addImageImg from '../../assets/add-img.png';
import addVdoImg from '../../assets/add-video.png';
import addsectionImg from '../../assets/add-section.png';
import profileImg from '../../assets/profile.png';
import QuestionBlock from '../question-block/QuestionBlock';
import UploadImg from '../upload-img-popup/UploadImg';
import UploadVdo from '../upload-vdo-popup/UploadVdo';
import ConditionPopup from '../add-condition/ConditionPopup';
import PageRedirectPopup from '../page-redirect-popup/PageRedirectPopup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PublishPopup from '../publish-popup/PublishPopup';
import EditorSidebar from '../editor-sidebar/EditorSidebar';
import ColorPickerBox from '../color-picker/ColorPicker';
import { toast } from 'react-toastify';

const EditorPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [showConditionSelector, setShowConditionSelector] = useState(false);
  const [showPageRedirectPopup, setShowPageRedirectPopup] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [redirectPages, setRedirectPages] = useState({ ifTrue: null, ifFalse: null });
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [textBlocks, setTextBlocks] = useState([[]]);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [pages, setPages] = useState([
    { id: 1, sections: [{ id: Date.now(), content: [] }] }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const { formId } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [pendingPageSwitch, setPendingPageSwitch] = useState(false);
  const [savedConditions, setSavedConditions] = useState([]);
  const navigate = useNavigate();
  const [canEdit, setCanEdit] = useState(false);
  const [goNext, setGoNext] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [sectionColor, setSectionColor] = useState('#f0f0f0');
  const bgColorRef = useRef(null);
  const sectionColorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormSavedAfterChange, setIsFormSavedAfterChange] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?.token) return;

      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/forms/${formId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const form = res.data;
        setFormTitle(form.title);

        // check if user is creator
        if (form.createdBy === userInfo._id) {
          setCanEdit(true);
        } else {
          // fetch user to check shared access
          const userRes = await axios.get(`${backendUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });

          const sharedAccess = userRes.data.sharedForms.find(
            (sf) => sf.form === formId
          );

          if (sharedAccess && sharedAccess.access === 'edit') {
            setCanEdit(true);
            setGoNext(false);
          } else {
            setCanEdit(false);
          }
        }

        if (form.pages && form.pages.length > 0) {
          setPages(form.pages);
        } else {
          setPages([{ id: Date.now(), sections: [{ id: Date.now(), content: [] }] }]);
        }

      } catch (err) {
        console.error('Error fetching form data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);


  useEffect(() => {
    if (pages.length > 0 && currentPageIndex === -1) {
      setCurrentPageIndex(0);
      setCurrentSectionIndex(0);
    }
  }, []);

  const handleAddPage = () => {
    const newPage = {
      id: Date.now(),
      sections: [
        {
          id: Date.now(),
          content: [],
        },
      ],
    };

    setPages((prevPages) => [...prevPages, newPage]);
    setPendingPageSwitch(true);
  };

  useEffect(() => {
    if (pendingPageSwitch) {
      setCurrentPageIndex(pages.length - 1); // switch to last page
      setCurrentSectionIndex(0);
      setPendingPageSwitch(false);
    }
  }, [pages, pendingPageSwitch]);


  const handleAddQuestion = () => {
    const pageIndex = currentPageIndex; // Lock the value at the moment of click
    const sectionIndex = currentSectionIndex;

    setPages((prevPages) => {
      const updatedPages = [...prevPages];

      const updatedSections = [...updatedPages[pageIndex].sections];
      const updatedContent = [...updatedSections[sectionIndex].content];

      updatedContent.push({
        id: Date.now(),
        type: 'question',
        data: {
          id: Date.now(),
          label: '',
          type: 'Multiple Choice',
          options: ['Your option'],
          starCount: 5,
        },
      });

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        content: updatedContent,
      };

      updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        sections: updatedSections,
      };

      return updatedPages;
    });
    console.log("Adding question to page:", currentPageIndex);
    setIsFormSavedAfterChange(false);
  };


  const handleAddSection = () => {
    setPages((prevPages) => {
      const updatedPages = [...prevPages];
      updatedPages[currentPageIndex].sections.push({
        id: Date.now(),
        content: [],
      });
      setCurrentSectionIndex(updatedPages[currentPageIndex].sections.length - 1);
      return updatedPages;
    });
  };


  const handleUploadImage = (url) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].sections[currentSectionIndex].content.push({
      id: Date.now(),
      type: 'image',
      data: url
    });
    setPages(updatedPages);
    setShowImagePopup(false);
    setIsFormSavedAfterChange(false);
  };

  const handleUploadVideo = (url) => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].sections[currentSectionIndex].content.push({
      id: Date.now(),
      type: 'video',
      data: url
    });
    setPages(updatedPages);
    setShowVideoPopup(false);
    setIsFormSavedAfterChange(false);
  };

  const handleAddText = () => {
    const updatedPages = [...pages];
    updatedPages[currentPageIndex].sections[currentSectionIndex].content.push({
      id: Date.now(),
      type: 'text',
      data: { content: 'Enter your text...' }
    });
    setPages(updatedPages);
    setIsFormSavedAfterChange(false);
  };

  const updateTextBlock = (blockIndex, newText) => {
    const updated = [...textBlocks];
    updated[currentPageIndex][blockIndex].content = newText;
    setTextBlocks(updated);
  };

  const handleSaveForm = async (updatedConditions = savedConditions) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (!token) {
        alert("User not logged in.");
        return;
      }
      setIsSaving(true);
      const res = await axios.put(
        `${backendUrl}/api/forms/${formId}`,
        {
          pages,
          conditions: updatedConditions,
        }, // update only pages
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success('Form data added successfully');
        setIsFormSavedAfterChange(true);
        console.log('Updated form:', res.data);
      }
    } catch (err) {
      console.error('Error saving form:', err);
      toast.error('Failed to save form ❌');
    } finally {
      setIsSaving(false); // Stop loading
    }
  };

  const isCurrentPageEmpty = () => {
    const currentPage = pages[currentPageIndex];
    if (!currentPage || !currentPage.sections) return true;

    return currentPage.sections.every(
      (section) => section.content.length === 0
    );
  };

  return (
    <div className="editor-container">
      <EditorSidebar
        pages={pages}
        currentPageIndex={currentPageIndex}
        setCurrentPageIndex={(index) => {
          setCurrentPageIndex(index);
          setCurrentSectionIndex(0);
        }}
        handleAddPage={handleAddPage}
      />

      <div className="main-editor">
        <div className="editor-header">
          <h2>{formTitle}</h2>
          <div className="header-buttons">
            <button className="preview-btn">Preview</button>
            {/* <button className="save-btn" onClick={handleSaveForm}>Save</button> */}
            {canEdit && (
              // <button className="save-btn" onClick={() => handleSaveForm()}>Save</button>
              <button
                className="save-btn"
                onClick={() => handleSaveForm()}
                disabled={isSaving}
                style={{ opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
          </div>
        </div>

        <div className="editor-body">
          {/* <div className="canvas-section">
            {pages[currentPageIndex].sections.map((section, sectionIndex) => (
              <div
                key={section.id}
                className="section"
                style={{ backgroundColor: sectionIndex % 2 === 0 ? '#f0f0f0' : '#e0eaff', padding: '10px', marginBottom: '15px', borderRadius: '8px' }}
                // style={{ backgroundColor: sectionColor, padding: '10px', marginBottom: '15px', borderRadius: '8px' }}
              >
                {section.content.map((block, index) => {
                  switch (block.type) {
                    case 'question':
                      return (
                        <QuestionBlock
                          key={block.id}
                          index={index}
                          question={block.data}
                          updateQuestion={(updatedQ) => {
                            const updated = [...pages];
                            updated[currentPageIndex].sections[sectionIndex].content[index].data = updatedQ;
                            setPages(updated);
                          }}
                        />
                      );
                    case 'text':
                      return (
                        <div key={block.id} className="custom-text-block">
                          <textarea
                            value={block.data.content || ''}
                            onChange={(e) => {
                              if (!canEdit) return;
                              const updated = [...pages];
                              updated[currentPageIndex].sections[sectionIndex].content[index].data.content = e.target.value;
                              setPages(updated);
                            }}
                            disabled={!canEdit}
                            className="text-area-block"
                          />
                        </div>
                      );
                    case 'image':
                      return (
                        <div key={block.id} className="uploaded-image">
                          <img src={block.data} alt={`uploaded-${index}`} />
                        </div>
                      );
                    case 'video':
                      return (
                        <div key={block.id} style={{ marginBottom: '10px' }}>
                          <video src={block.data} controls width="400" />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
          </div> */}
          <div className="canvas-section">
            {loading ? (
              <div className="spinner"></div>
            ) : pages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                Start creating your form
              </p>
            ) : (
              pages[currentPageIndex]?.sections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="section"
                  style={{
                    backgroundColor: sectionIndex % 2 === 0 ? '#f0f0f0' : '#e0eaff',
                    padding: '10px',
                    marginBottom: '15px',
                    borderRadius: '8px',
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
                            updateQuestion={(updatedQ) => {
                              const updated = [...pages];
                              updated[currentPageIndex].sections[sectionIndex].content[index].data = updatedQ;
                              setPages(updated);
                            }}
                          />
                        );
                      case 'text':
                        return (
                          <div key={block.id} className="custom-text-block">
                            <textarea
                              value={block.data.content || ''}
                              onChange={(e) => {
                                if (!canEdit) return;
                                const updated = [...pages];
                                updated[currentPageIndex].sections[sectionIndex].content[index].data.content = e.target.value;
                                setPages(updated);
                              }}
                              disabled={!canEdit}
                              className="text-area-block"
                            />
                          </div>
                        );
                      case 'image':
                        return (
                          <div key={block.id} className="uploaded-image">
                            <img src={block.data} alt={`uploaded-${index}`} />
                          </div>
                        );
                      case 'video':
                        return (
                          <div key={block.id} style={{ marginBottom: '10px' }}>
                            <video src={block.data} controls width="400" />
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ))
            )}
          </div>
          <div className="toolbox">
            {canEdit && (
              <div className="add-question" onClick={handleAddQuestion}>
                <img src={addQuestionImg} alt="" />
                <button>Add Question</button>
              </div>
            )}
            {canEdit && (
              <div className="add-text" onClick={handleAddText}>
                <img src={addTextImg} alt="" />
                <button>Add Text</button>
              </div>
            )}
            {canEdit && (
              <div className="add-condition" onClick={() => setShowConditionSelector(true)}>
                <img src={addConditionImg} alt="" />
                <button>Add Condition</button>
              </div>
            )}
            {canEdit && (
              <div className="add-img" onClick={() => setShowImagePopup(true)}>
                <img src={addImageImg} alt="" />
                <button>Add Image</button>
              </div>
            )}
            {canEdit && (
              <div className="add-video" onClick={() => setShowVideoPopup(true)}>
                <img src={addVdoImg} alt="" />
                <button>Add Video</button>
              </div>
            )}
            {canEdit && (
              <div className="add-section" onClick={handleAddSection}>
                <img src={addsectionImg} alt="" />
                <button>Add Sections</button>
              </div>
            )}
            <div className="color-picker">
              <label>Background Color</label>
              <div className="color-control">
                <div className="color-box" style={{ backgroundColor: '#B6B6B6' }}></div>
                <span>B6B6B6</span>
                <span>100%</span>
              </div>
            </div>
            <div className="color-picker">
              <label>Section Color</label>
              <div className="color-control">
                <div className="color-box" style={{ backgroundColor: '#B6B6B6' }}></div>
                <span>B6B6B6</span>
                <span>100%</span>
              </div>
            </div>
            {/* {goNext && (
              <Link to={`/flow-chart/${formId}`}>
                {/* <button className="next-btn">Next</button> */}
            {/* <button
                  className="next-btn"
                  disabled={isCurrentPageEmpty()}
                  style={{
                    opacity: isCurrentPageEmpty() ? 0.6 : 1,
                    cursor: isCurrentPageEmpty() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button> 
                const disableNext =
                isCurrentPageEmpty() || !isFormSavedAfterChange;

                <button
                  className="next-btn"
                  disabled={disableNext}
                  style={{
                    opacity: disableNext ? 0.6 : 1,
                    cursor: disableNext ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next
                </button>
              </Link>
            )} */}
            {goNext && (
              <>
                {
                  // ✅ Define this just before the button
                  (() => {
                    const disableNext = isCurrentPageEmpty() || !isFormSavedAfterChange;
                    return (
                      <Link to={`/flow-chart/${formId}`}>
                        <button
                          className="next-btn"
                          disabled={disableNext}
                          style={{
                            opacity: disableNext ? 0.6 : 1,
                            cursor: disableNext ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Next
                        </button>
                      </Link>
                    );
                  })()
                }
              </>
            )}

          </div>
        </div>
      </div>

      {showImagePopup && (
        <UploadImg
          onClose={() => setShowImagePopup(false)}
          onUpload={handleUploadImage}
        />
      )}
      {showVideoPopup && (
        <UploadVdo
          onClose={() => setShowVideoPopup(false)}
          onUpload={handleUploadVideo}
        />
      )}
      {showConditionSelector && (
        <ConditionPopup
          questions={
            pages[currentPageIndex].sections
              .flatMap(section => section.content)
              .filter(block =>
                block.type === 'question' &&
                ['Multiple Choice', 'Dropdown', 'Checkbox'].includes(block.data.type)
              )
              .map(block => ({
                id: block.id,
                label: block.data.label,
                options: block.data.options,
              }))
          }
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          onClose={() => setShowConditionSelector(false)}
          onContinue={() => {
            setShowConditionSelector(false);
            setShowPageRedirectPopup(true);
          }}
        />
      )}
      {showPageRedirectPopup && (
        <PageRedirectPopup
          pages={pages}
          redirectPages={redirectPages}
          setRedirectPages={setRedirectPages}
          onClose={() => setShowPageRedirectPopup(false)}
          onSave={() => {
            const newCondition = {
              pageId: pages[currentPageIndex].id,
              rules: selectedConditions,
              ifTrue: pages[redirectPages.ifTrue].id,
              ifFalse: pages[redirectPages.ifFalse].id,
            };

            const updatedConditions = [...savedConditions, newCondition];
            setSavedConditions(updatedConditions);
            setShowPageRedirectPopup(false);
            setSelectedConditions([]);
            setRedirectPages({ ifTrue: null, ifFalse: null });

            handleSaveForm(updatedConditions);
          }}

        />
      )}
    </div>
  );
};

export default EditorPage;
