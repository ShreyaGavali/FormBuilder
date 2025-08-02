import React from 'react';
import './Form.css';
import viewImg from '../../assets/view.png'
import { Link } from 'react-router-dom';

const Form = ({formName, img, formid}) => {
  return (
    <div className='recent-works-form'>
        <p>{formName}</p>
        <img className='edit-img' src={img} alt="" />
        <div className="view-analysis">
            <Link to={`/analysis/${formid}`}><p className='analysis-p'>View Analysis</p></Link>
            {/* <img className="view" src={viewImg} alt="" /> */}
        </div>
    </div>
  )
}

export default Form