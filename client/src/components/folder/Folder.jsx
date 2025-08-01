import React from 'react';
import './Folder.css';
import viewImg from '../../assets/view.png';

const Folder = ({projectName, img}) => {
  return (
    <div className='project-folder'>
        <img className="folder-img" src={img} alt="" />
        <div className="view-analysis">
            <p>{projectName}</p>
            {/* <img className='view' src={viewImg} alt="" /> */}
        </div>
    </div>
  )
}

export default Folder