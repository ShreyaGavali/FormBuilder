// components/ConditionPopup/ConditionPopup.jsx
import React from 'react';
import './ConditionPopup.css';

const ConditionPopup = ({ questions, onClose, onContinue, selectedConditions, setSelectedConditions }) => {
  const handleCheckbox = (questionId, option, checked) => {
    const condition = { questionId, option };
    if (checked) {
      setSelectedConditions(prev => [...prev, condition]);
    } else {
      setSelectedConditions(prev => prev.filter(
        c => !(c.questionId === questionId && c.option === option)
      ));
    }
  };

  return (
    <div className="popup-overlay">
      <div className="condition-popup">
        <button className="condition-close-btn" onClick={onClose}>✖</button>
        <h3>Select Condition</h3>
        <p>Select answers to build your condition logic</p>

        {questions.map((q) => (
          <div key={q.id} className="condition-question">
            <strong>{q.label || 'Untitled Question'}</strong>
            {q.options.map((opt, idx) => (
              <label key={idx}>
                <input
                  className='condition-input'
                  type="checkbox"
                  checked={selectedConditions.some(
                    cond => cond.questionId === q.id && cond.option === opt
                  )}
                  onChange={(e) => handleCheckbox(q.id, opt, e.target.checked)}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}
        <div style={{display: "flex", alignItems: "center", justifyContent: "flex-end"}} onClick={onContinue}>
            <button className="condition-continue-btn" >Add Condition</button>
        </div>
       
      </div>
    </div>
  );
};

export default ConditionPopup;
