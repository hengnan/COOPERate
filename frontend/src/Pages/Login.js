import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
        } catch (e) {
            setError(e.message);
        }
    };



    return (
    <div className="App">
    {error && <p className="error">{error}</p>}
      <nav className="container-fluid">
        <ul><li><strong>COOPERATE</strong></li></ul>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="/create-account" className="make-account-btn" role="button">Make an Account</a></li>
        </ul>
      </nav>
      <div className = "container">
        <main className="login-form">

          <h2>Login</h2>
          <input  type = "text" placeholder="email@cooper.edu" value = {email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={logIn}>Log In</button>
        </main>
      </div>
      <footer className="container">
        <small><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></small>
      </footer>
    </div>
  );
}

export default LoginPage;