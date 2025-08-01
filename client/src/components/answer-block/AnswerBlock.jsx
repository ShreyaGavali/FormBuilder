import React from 'react';
import './AnswerBlock.css';

const AnswerBlock = ({ question, index }) => {
  const { label, type, options = [], starCount = 5 } = question;

  return (
    <div className="answer-block">
      <label className="question-label">{index + 1}. {label}</label>

      {type === 'Multiple Choice' && (
        <div className="options-group">
          {options.filter(opt => opt.trim() !== '').map((option, i) => (
            <label key={i}>
              <input type="radio" name={`q-${index}`} value={option} />
              {option}
            </label>
          ))}
        </div>
      )}

      {type === 'Checkbox' && (
        <div className="options-group">
          {options.filter(opt => opt.trim() !== '').map((option, i) => (
            <label key={i}>
              <input type="checkbox" name={`q-${index}`} value={option} />
              {option}
            </label>
          ))}
        </div>
      )}

      {type === 'Short Answer' && (
        <input className="short-answer" type="text" placeholder="Your answer" />
      )}

      {type === 'Long Answer' && (
        <textarea className="long-answer" placeholder="Your detailed answer..." />
      )}

      {type === 'Rating' && (
        <div className="rating-group">
          {[...Array(starCount || 5)].map((_, i) => (
            <label key={i}>
              <input type="radio" name={`rating-${index}`} value={i + 1} />
              {i + 1}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswerBlock;

