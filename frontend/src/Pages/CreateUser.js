import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";


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
            if (! email.endsWith("@cooper.edu"))
            {
                setError("Email needs to be a cooper.edu email!");
                return;
            }
            
            const auth = getAuth();
            await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(auth.currentUser)
            
            
            //navigate("/");
        } catch(e) {
            setError(e.message);
        }
    };

    return (
        <>
            <h1>Create Account</h1>
            {error && <p className="error">{error}</p>}
            <input
                placeholder="Your email address"
                value={email}
                onChange={e=>setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e=>setConfirmPassword(e.target.value)}
            />
            <button onClick={createAccount}>Log In</button>
            <Link to="/">Already have an account? Log in here.</Link>
        </>
    );
}

export default CreateAccountPage;