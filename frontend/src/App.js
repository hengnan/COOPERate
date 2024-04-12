import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewsPage from './Pages/Reviews.js';
import LoginPage from './Pages/Login.js';
import MakeUserPage from './Pages/CreateUser.js';
import MakeReviewPage from './Pages/makeReview.js';
import UserPage from './Pages/UserProfile.js';
import CoursePage from './Pages/CourseProfile.js';
import ProfessorPage from './Pages/ProfessorProfile.js';
import AboutUsPage from './Pages/AboutUs.js';
import ForgotPasswordPage from './Pages/ForgotPassword.js';
import useUser from "./hooks/useUser";



import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA18mDmNzVbx_1qqkTV0KSvP-a7LUo9A4c",
  authDomain: "cooperate-4d913.firebaseapp.com",
  projectId: "cooperate-4d913",
  storageBucket: "cooperate-4d913.appspot.com",
  messagingSenderId: "475017443270",
  appId: "1:475017443270:web:f71e12a896c9d47011a4c7",
  measurementId: "G-WWYE1YM0KE"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const root = ReactDOM.createRoot(document.getElementById('root'));

  
const App = () => {

    const {user, isLoading} = useUser();
    if(user != null && user.emailVerified)
    {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<ReviewsPage/>} />
                    <Route path="/makeReview" element={<MakeReviewPage/>}/>
                    <Route path="/Users" element={<UserPage/>}/>
                    <Route path="/Courses" element = {<CoursePage/>}/>
                    <Route path="/Professors" element = {<ProfessorPage/>}/>
                    <Route path="/AboutUs" element = {<AboutUsPage/>}/>
                
                </Routes>
            </Router>
        );
    }
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage/>} />
                    <Route path="/ForgotPassword" element = {<ForgotPasswordPage/>}/>
                    <Route path="/create-account" element={<MakeUserPage/>} />
                    <Route path="/AboutUs" element = {<AboutUsPage/>}/>
                </Routes>
            </Router>
        );

  };
  
 root.render(<App/>);

  
export default App;