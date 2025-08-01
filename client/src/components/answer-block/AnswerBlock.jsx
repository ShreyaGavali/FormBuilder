// import React from 'react';
// import './AnswerBlock.css';

// const AnswerBlock = ({ question, index }) => {
//   const { questionText, type, options } = question;

//   return (
//     <div className="answer-block">
//       <label className="question-label">{index + 1}. {question.label}</label>
//       {type === 'multiple_choice' && (
//         <div className="options-group">
//           {options.map((option, i) => (
//             <label key={i}>
//               <input type="radio" name={`q-${index}`} value={option} />
//               {option}
//             </label>
//           ))}
//         </div>
//       )}

//       {type === 'checkbox' && (
//         <div className="options-group">
//           {options.map((option, i) => (
//             <label key={i}>
//               <input type="checkbox" name={`q-${index}`} value={option} />
//               {option}
//             </label>
//           ))}
//         </div>
//       )}

//       {type === 'short_answer' && (
//         <input className="short-answer" type="text" placeholder="Your answer" />
//       )}

//       {type === 'long_answer' && (
//         <textarea className="long-answer" placeholder="Your detailed answer..." />
//       )}

//       {type === 'rating' && (
//         <div className="rating-group">
//           {[1, 2, 3, 4, 5].map((rate) => (
//             <label key={rate}>
//               <input type="radio" name={`rating-${index}`} value={rate} />
//               {rate}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnswerBlock;

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

