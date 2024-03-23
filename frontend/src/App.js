import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReviewsPage from './Pages/Reviews.js';
import LoginPage from './Pages/Login.js';
import useUser from "./hooks/useUser";


// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
    //const [data, setData] = useState(null);

    const {user, isLoading} = useUser();
    if(user != null)
    {
        console.log(user);
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<ReviewsPage/>} />
                    <Route path="/login" element={<LoginPage/>} />
                
                </Routes>
            </Router>
        );
    }
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage/>} />
                </Routes>
            </Router>
        );

  };
  
  root.render(<App/>);

  
export default App;