import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            
            const userDetails = await fetch("http://localhost:8080/Users/email/" + email);

            const user = await userDetails.json();

            localStorage.setItem("username", user.userName);
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("karma", user.karma);

            
            console.log(user.username);
            console.log(user.id);
            
            window.location.reload();
        } catch (err) {
          if (err.code === 'auth/invalid-email') {
            toast.error('Invalid email ID');
          }
          if (err.code === 'auth/user-not-found') {
              toast.error('Please check your email');
          }
          if (err.code === 'auth/wrong-password') {
              toast.error('Please check your password');
          }
          if (err.code === 'auth/too-many-requests') {
              toast.error('Too many attempts, please try again later');
          }
        }
    };



    return (
    <div className="Login">
      <nav className="container-fluid">
        <ul><li><strong>COOPERATE</strong></li></ul>
        <ul>
          <li><a href="/AboutUs">About Us</a></li>
          <li><a href="/create-account" className="make-account-btn" role="button">Make an Account</a></li>
        </ul>
      </nav>
      <div className = "container">
        <main className="login-form">

          <h2>Sign In</h2>
          <input  type = "text" placeholder="Email Address" value = {email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={logIn}>Log In</button>
          <a href="/ForgotPassword">Forgot Password?</a>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;