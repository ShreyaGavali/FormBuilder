// import React from 'react';
// import './App.css';
// import SignupPage from './pages/signup/SignupPage';
// import { Routes, Route, useLocation } from "react-router-dom"
// import SigninPage from './pages/signin/SigninPage';
// import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage';
// import VerifyOTP from './pages/verify-OTP/VerifyOTP';
// import NewPassword from './pages/new-password/NewPassword';
// import SideBar from './components/side-bar/SideBar';
// import HomePage from './pages/home/HomePage';
// import AnalysisPage from './pages/analysis/AnalysisPage';
// import ProjectPage from './pages/project/ProjectPage';
// import ProjectFile from './pages/project-file/ProjectFile';
// import EditorPage from './components/editor/EditorPage';
// import ProfilePage from './pages/profile/ProfilePage';
// import FlowChartPage from './pages/flow-chart/FlowChartPage';
// import ViewFormPage from './pages/view/ViewFormPage';
// import ResponsePage from './pages/response-page/ResponsePage';
// import FormAnalysis from './pages/form-analysis/FormAnalysis';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {
//   const location = useLocation();
//   const shouldHideSidebar = [
//   '/signin',
//   '/signup',
//   '/forgot-password',
//   '/verify-otp',
//   '/reset-password',
//   '/profile',
// ].includes(location.pathname) || location.pathname.startsWith('/create/') || location.pathname.startsWith('/flow-chart/') || location.pathname.startsWith('/view/') || location.pathname.startsWith('/response/');
//   return (
//     <div className='app'>
//     {!shouldHideSidebar  && <SideBar />}
//     <Routes>
//       <Route path='/' element={<HomePage />} />
//       <Route path='/analysis' element={<AnalysisPage />} />
//       <Route path='/projects' element={<ProjectPage />} />
//       <Route path='/project/files/:folderId' element={<ProjectFile />} />
//       <Route path='/profile' element={<ProfilePage />} />
//       <Route path='/create/:formId' element={<EditorPage />} />
//       <Route path="/flow-chart/:formId" element={<FlowChartPage />} />
//       <Route path="/view/:formId" element={<ViewFormPage />} />
//       <Route path="/response/:formId" element={<ResponsePage />} />
//       <Route path='/analysis/:formId' element={<FormAnalysis />} />
//       <Route path='/signin' element={<SigninPage />} />
//       <Route path='/signup' element={<SignupPage />} />
//       <Route path='/forgot-password' element={<ForgotPasswordPage />} />
//       <Route path='/verify-otp' element={<VerifyOTP />} />
//       <Route path='/reset-password' element={<NewPassword />} />
//     </Routes>
//     <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   )
// }

// export default App


import React from 'react';
import './App.css';
import SignupPage from './pages/signup/SignupPage';
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import SigninPage from './pages/signin/SigninPage';
import ForgotPasswordPage from './pages/forgot-password/ForgotPasswordPage';
import VerifyOTP from './pages/verify-OTP/VerifyOTP';
import NewPassword from './pages/new-password/NewPassword';
import SideBar from './components/side-bar/SideBar';
import HomePage from './pages/home/HomePage';
import AnalysisPage from './pages/analysis/AnalysisPage';
import ProjectPage from './pages/project/ProjectPage';
import ProjectFile from './pages/project-file/ProjectFile';
import EditorPage from './components/editor/EditorPage';
import ProfilePage from './pages/profile/ProfilePage';
import FlowChartPage from './pages/flow-chart/FlowChartPage';
import ViewFormPage from './pages/view/ViewFormPage';
import ResponsePage from './pages/response-page/ResponsePage';
import FormAnalysis from './pages/form-analysis/FormAnalysis';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const shouldHideSidebar = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/verify-otp',
    '/reset-password',
    '/profile',
  ].includes(location.pathname) || location.pathname.startsWith('/create/') || location.pathname.startsWith('/flow-chart/') || location.pathname.startsWith('/view/') || location.pathname.startsWith('/response/');

  return (
    <div className='app'>
      {!shouldHideSidebar && <SideBar />}

      <Routes>
        {/* Protected Routes */}
        <Route path='/' element={userInfo ? <HomePage /> : <Navigate to="/signin" replace />} />
        <Route path='/analysis' element={userInfo ? <AnalysisPage /> : <Navigate to="/signin" replace />} />
        <Route path='/projects' element={userInfo ? <ProjectPage /> : <Navigate to="/signin" replace />} />
        <Route path='/project/files/:folderId' element={userInfo ? <ProjectFile /> : <Navigate to="/signin" replace />} />
        <Route path='/profile' element={userInfo ? <ProfilePage /> : <Navigate to="/signin" replace />} />
        <Route path='/create/:formId' element={userInfo ? <EditorPage /> : <Navigate to="/signin" replace />} />
        <Route path='/flow-chart/:formId' element={userInfo ? <FlowChartPage /> : <Navigate to="/signin" replace />} />
        <Route path='/response/:formId' element={userInfo ? <ResponsePage /> : <Navigate to="/signin" replace />} />
        <Route path='/analysis/:formId' element={userInfo ? <FormAnalysis /> : <Navigate to="/signin" replace />} />

        {/* Public Routes */}
        <Route path='/signin' element={<SigninPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/reset-password' element={<NewPassword />} />
        <Route path='/view/:formId' element={<ViewFormPage />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
