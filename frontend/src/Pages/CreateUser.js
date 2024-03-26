import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const CreateAccountPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const createAccount = async () => {
        try {
            if (password !== confirmPassword) {
                setError("Password and confirm password do not match");
                return;
            }
            if (!email.endsWith("@cooper.edu")) {
                setError("Email needs to be a cooper.edu email!");
                return;
            }

            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(auth.currentUser);

            // navigate("/");
        } catch (e) {
            setError(e.message);
        }
    };

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#1a2a33',
    };

    const inputStyle = {
        margin: '10px 0',
        padding: '10px',
        width: '300px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    const buttonStyle = {
        width: '316px',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none',
        background: '#007bff',
        color: 'white',
        cursor: 'pointer',
    };

    const errorStyle = {
        color: '#ff0000',
        margin: '10px 0',
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
    };

    return (
        <div style={pageStyle}>
            <h1>Create Account</h1>
            {error && <p style={errorStyle}>{error}</p>}
            <input
                style={inputStyle}
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                style={inputStyle}
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <input
                style={inputStyle}
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
            />
            <button style={buttonStyle} onClick={createAccount}>Create Account</button>
            <Link to="/" style={linkStyle}>Already have an account? Log in here.</Link>
        </div>
    );
}

export default CreateAccountPage;
