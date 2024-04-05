import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";


const CreateAccountPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [verifSent, setVerifSent] = useState("");
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

            
            const userDetails = await fetch("http://localhost:8080/Users/username/" + username)

            const userExists = await userDetails.json()

            if (userExists.id > 0)
            {
                setError("Username is already taken!");
                return;
            }

            
            const auth = getAuth();
            const userCredential =  await createUserWithEmailAndPassword(auth, email, password);

            setVerifSent(" ");
            await sendEmailVerification(auth.currentUser);

            await new Promise( (resolve) => {
                
                
                const interval = setInterval( () => {
                    const currentUser = auth.currentUser;
                    console.log(currentUser);
                    if (currentUser && currentUser.emailVerified){
                        clearInterval(interval);
                        resolve();
                    }
                    else {
                        currentUser.reload();
                    }
                }, 1000);

            /*
                setTimeout( () => {
                    clearInterval(interval);
                    reject(new Error("Email verification timeout"));
                }, 5 * 60 * 1000); // Timeout after 5 minutes
                */
            });



            await fetch("http://localhost:8080/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    email_address: email,
                    hashed_password: password
                })
            });
            
            const userInfo = await fetch("http://localhost:8080/Users/email/" + email);
            const user = await userInfo.json();


            localStorage.setItem("username", user.userName);
            localStorage.setItem("user_id", Number(user.id));
            localStorage.setItem("karma", parseFloat(user.karma));
            
            navigate("/");
            window.location.reload();

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

    const verif_message = {
        color: 'green',
        margin: '10px',
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
            {error && !verifSent && <p style={errorStyle}>{error}</p>}
            {verifSent && <p style = {verif_message}>{<strong>Verification Email Sent!</strong>} </p>}

            <input
                style={inputStyle}
                placeholder="Your username"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />

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
