import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import {getAuth} from 'firebase/auth';
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './ForgotPassword.css';


const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();
  
    const handlePasswordReset = async () => {
      try {
        await sendPasswordResetEmail(getAuth(), email).then(() => {
          toast.success("Password reset link has been sent. Please check your mailbox");
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 5300)
        })
      } catch (err) {
        toast.error("An error occurred while sending mail.")
      }
    }
  


    return (
    <div>
        <h1>Forgot Password</h1>
        <div class="login-form">
            <h2>Enter valid email address to reset your password.</h2>
            <input  type = "text" placeholder="Email Address" value = {email} onChange={e=>setEmail(e.target.value)} />
            <button onClick={handlePasswordReset}>Send Email</button>
            <a href="/">Already know your password?</a>
        </div>
        <ToastContainer />
    </div>
  );
}

export default ForgotPasswordPage;