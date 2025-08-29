import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../assets/styles/App.css';
import MessageModal from "../modals/MessageModal.jsx";
import {signUpUser,saveDoc} from "../firebase/firebase.js";

export default function SignUp() {
    const [emailAddress, setEmailAddress] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("Parent"); // Parent or Driver
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!role) {
            alert("Please select whether you are a Parent or Driver.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const userData = {
            emailAddress: emailAddress,
            firstName: firstName,
            lastName: lastName,
            role: role
        };

        try {
            const result = await signUpUser(emailAddress,password);
            const newResult = await saveDoc(userData,"user-data");

            console.log('Signup successful:', result);
            console.log('User data saved to FB:', newResult);

            // Clear form fields
            setEmailAddress("");
            setFirstName("");
            setLastName("");
            setPassword("");
            setConfirmPassword("");
            setRole("");

            setModalOpen(true);
        } catch (error) {
            console.error("Signup failed:", error);
            alert("Error signing up. Please try again.");
        }
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} className="formArea">
                <h1>Sign Up</h1>
                <MessageModal
                    isOpen={modalOpen}
                    onClose={() => {
                        setModalOpen(false);
                        navigate('/login');
                    }}
                    message="Signup successful"
                />

                <p>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                        className="inputText"
                    />
                </p>

                <p>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                        className="inputText"
                    />
                </p>

                <p>
                    <input
                        type="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Email Address"
                        required
                        className="inputText"
                    />
                </p>

                <p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="inputText"
                    />
                </p>

                <p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="inputText"
                    />
                </p>

                {/* Radio buttons for role selection */}
                <p>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="Parent"
                            checked={role === "Parent"}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        />
                        Parent
                    </label>
                    <label style={{ marginLeft: "20px" }}>
                        <input
                            type="radio"
                            name="role"
                            value="Driver"
                            checked={role === "Driver"}
                            onChange={(e) => setRole(e.target.value)}
                        />
                        Driver
                    </label>
                </p>

                <input type="submit" value="Sign Up" className="task_addbutton" />
                <br />
                <Link to="/login" className="LinkButton">
                    Already have an account? Click here to login
                </Link>
            </form>
        </>
    );
}
