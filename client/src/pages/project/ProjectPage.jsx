// import React from 'react'
// import '../home/HomePage.css';
// import CreateProjectForm from '../../components/create/CreateProjectForm';
// import CreateProjectImg from '../../assets/project1.png';
// import CreateFormImg from '../../assets/form.png';
// import Form from '../../components/form/Form';
// import Folder from '../../components/folder/Folder';
// import { Link } from 'react-router-dom';

// const ProjectPage = () => {
//   return (
//     <div className='home-page'>
//       <div className="home1">
//         <p className='welcome'>Welcome to CANOVA</p>
//         <hr />
//         <div className="shared-work">
//             <Link to={'/project/files'}><Folder projectName="Project Name" img={CreateProjectImg} /></Link>
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//             <Folder projectName="Project Name" img={CreateProjectImg} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProjectPage

import React, { useEffect, useState } from 'react';
import '../home/HomePage.css';
import CreateProjectImg from '../../assets/project1.png';
import Folder from '../../components/folder/Folder';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProjectPage = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!userInfo?.token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/folders/', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setFolders(res.data);
      } catch (err) {
        console.error('Failed to fetch folders:', err);
      }
    };

    fetchFolders();
  }, []);

  return (
    <div className='home-page'>
      <div className="home1">
        <p className='welcome'>Welcome to CANOVA</p>
        <hr />
        <div className="shared-work">
          {folders.map((folder) => (
            <Link
              to={`/project/files/${folder._id}`}
              key={folder._id}
              style={{ textDecoration: 'none' }}
            >
              <Folder projectName={folder.name} img={CreateProjectImg} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
