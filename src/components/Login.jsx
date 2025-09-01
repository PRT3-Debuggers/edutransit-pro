import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../assets/styles/App.css';
import MessageModal from "../modals/MessageModal.jsx";
import {getDocumentsByField, loginUser} from "../firebase/firebase.js";

export default function Login() {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e) => setUserEmail(e.target.value);
    const handlePasswordChange = (e) => setUserPassword(e.target.value);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (userPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const userData = await loginUser(userEmail, userPassword);

        const realUserData = await getDocumentsByField("user-data","emailAddress",userData.email)
        console.log('Login successful:', userData.email);

        sessionStorage.setItem("userData", JSON.stringify(realUserData));

         setModalOpen(true);
        navigate('/profile');
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} className="formArea">
                <h1>Login</h1>
                <MessageModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        navigate("/login");
                    }}
                    message="Login successful"
                />
                <p>
                    <input
                        type="email"
                        onChange={handleEmailChange}
                        value={userEmail}
                        placeholder="Email"
                        required
                        className="inputText"
                    />
                </p>
                <p>
                    <input
                        type="password"
                        onChange={handlePasswordChange}
                        value={userPassword}
                        placeholder="Password"
                        required
                        className="inputText"
                    />
                </p>
                <input
                    type="submit"
                    value="Login"
                    className="task_addbutton"
                />
                <br />
                <Link to="/signup" className="LinkButton">
                    Dont have an account? Click here to sign up
                </Link>
            </form>
        </>
    );
}
