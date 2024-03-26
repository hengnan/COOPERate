import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [username, setUser] = useState("");

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
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
          <li><a href="#">Contact</a></li>
          <li><a href="/create-account" className="make-account-btn" role="button">Make an Account</a></li> {/* New Make an Account button */}
        </ul>
      </nav>
      <main className="container">
        <form className="login-form">
          <h2>Login</h2>
          <input type="text" id="username" name="username" placeholder="Username" value = {username} onChange={e=>setUser(e.target.value)} required />
          <input type="text" id="email" name="email" placeholder="email@cooper.edu" value = {email} onChange={e=>setEmail(e.target.value)} required />
          <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button type="submit" onClick={logIn}>Log In</button>
        </form>
      </main>
      <footer className="container">
        <small><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></small>
      </footer>
    </div>
  );
}

export default LoginPage;