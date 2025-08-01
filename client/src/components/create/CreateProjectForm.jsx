import React from 'react';
import './CreateProjectForm.css';

const CreateProjectForm = ({img, title, desc}) => {
  return (
    <div className='create-project-form'>
        <img src={img} alt="" />
        <p className="title">{title}</p>
        <p className="desc">{desc}</p>
    </div>
  )
}

export default CreateProjectForm