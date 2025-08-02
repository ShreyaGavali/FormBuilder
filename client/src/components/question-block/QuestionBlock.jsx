import React, { useState, useRef, useEffect } from 'react';
import './QuestionBlock.css';
import DownArrowImg from '../../assets/Arrows.png';

const QUESTION_TYPES = [
  'Short Answer', 'Long Answer', 'Multiple Choice',
  'Checkbox', 'Dropdown', 'Date', 'Linear Scale', 'Rating'
]; // removed 'File Upload'

const QuestionBlock = ({ question, index, updateQuestion }) => {
  const label = question.label ?? '';
  const options = question.options ?? [];
  const [showDropdown, setShowDropdown] = useState(false);

  const optionRefs = useRef([]);
  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, options.length);
  }, [options]);

  const handleLabelChange = (e) => {
    updateQuestion({ ...question, label: e.target.value });
  };

  // const handleKeyDown = (e, optIndex) => {
  //   if (e.key === 'Backspace' && question.options[optIndex] === '') {
  //     const updatedOptions = [...(question.options || [])];
  //     if (updatedOptions.length > 1) {
  //       updatedOptions.splice(optIndex, 1);
  //       updateQuestion({ ...question, options: updatedOptions });
  //     }
  //   }
  // };

    const handleKeyDown = (e, optIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const updatedOptions = [...options];
      updatedOptions.splice(optIndex + 1, 0, ''); // insert new empty option
      updateQuestion({ ...question, options: updatedOptions });

      setTimeout(() => {
        if (optionRefs.current[optIndex + 1]) {
          optionRefs.current[optIndex + 1].focus();
        }
      }, 0);
    }

    if (e.key === 'Backspace' && options[optIndex] === '') {
      if (options.length === 1) return; // Don't remove the last option

      const updatedOptions = [...options];
      updatedOptions.splice(optIndex, 1);
      updateQuestion({ ...question, options: updatedOptions });

      setTimeout(() => {
        const prev = optIndex > 0 ? optIndex - 1 : 0;
        if (optionRefs.current[prev]) {
          optionRefs.current[prev].focus();
        }
      }, 0);
    }
  };


  const handleTypeChange = (type) => {
    setShowDropdown(false);

    const newQuestion = {
      ...question,
      type,
    };

    // Only add options for types that need them
    if (['Multiple Choice', 'Checkbox', 'Dropdown'].includes(type)) {
      newQuestion.options = [''];
    } else {
      newQuestion.options = []; // avoid undefined
    }

    updateQuestion(newQuestion);
  };

//   const handleOptionChange = (e, optIndex) => {
//   const value = e.target?.value;

//   if (typeof value !== 'string') {
//     console.warn('🚨 Unexpected non-string value in option input:', value);
//     return;
//   }

//   const updatedOptions = [...(question.options || [])];
//   updatedOptions[optIndex] = value;

//   if (optIndex === updatedOptions.length - 1 && value.trim() !== '') {
//     updatedOptions.push('');
//   }

//   const cleanOptions = updatedOptions.map(opt => (typeof opt === 'string' ? opt : ''));

//   updateQuestion({ ...question, options: cleanOptions });
// };

  const handleOptionChange = (e, optIndex) => {
    const value = e.target?.value;
    const updatedOptions = [...(question.options || [])];
    updatedOptions[optIndex] = value;

    updateQuestion({ ...question, options: updatedOptions });
  };

  return (
    <div className="question-block">
      <div className="question-title">
        <label className="q-number">Q{index + 1}</label>
        <input
          type="text"
          placeholder="What is ?"
          value={question.label || ''}
          onChange={handleLabelChange}
          className="question-input"
        />
        <div className="dropdown-wrapper">
          <button
            className="question-type-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img style={{ width: "20px", height: "20px" }} src={DownArrowImg} alt="" /> {question.type}
          </button>
          {showDropdown && (
            <div className="question-type-dropdown">
              {QUESTION_TYPES.map((type) => (
                <div
                  key={type}
                  className="dropdown-item"
                  onClick={() => handleTypeChange(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Render UI based on type */}
      {question.type === 'Short Answer' && (
        <textarea className="short-input" placeholder="Short answer text" />
      )}

      {question.type === 'Long Answer' && (
        <textarea className="long-input" placeholder="Long answer text" />
      )}
      {['Multiple Choice', 'Checkbox', 'Dropdown'].includes(question.type) && (
        <div className="option-list">
          {(question.options || []).map((opt, i) => (
            <div key={i} className="option-item">
              <input
                type={question.type === 'Checkbox' ? 'checkbox' : 'radio'}
                style={{ width: '10px' }}
              />
              <input
                type="text"
                value={opt ?? ''}
                placeholder={`Option 0${i + 1}`}
                onChange={(e) => handleOptionChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                ref={(el) => (optionRefs.current[i] = el)}
              />
            </div>
          ))}
        </div>
      )}

      {
        question.type === 'Date' && (
          <input type="date" className="date-placeholder" placeholder="DD/MM/YYYY" />
        )
      }

      {
        question.type === 'Linear Scale' && (
          <div className="scale-wrapper">
            <div className="scale-start-end">
              <p className="scale-start">Scale Starting</p>
              <p className="scale-end">Scale Ending</p>
            </div>
            <div className="scale-bar">
              <input type="range" min="0" max="10" />
              <div className="scale-rate">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        )
      }

      {
        question.type === 'Rating' && (
          <div className="rating-block">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="star">&#9733;</span>
              ))}
            </div>
            <div className="star-count-control">
              <label>Star Count:</label>
              <input
                type="number"
                min={1}
                max={10}
                value={question.starCount || 5}
                onChange={(e) =>
                  updateQuestion({ ...question, starCount: parseInt(e.target.value) || 5 })
                }
              />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default QuestionBlock;

