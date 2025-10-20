import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../assets/styles/App.css';
import '../assets/styles/Profile.css';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user data from session storage
        const storedUserData = sessionStorage.getItem("userData");
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                setUserData(parsedData);
            } catch (error) {
                console.error("Error parsing user data:", error);
                navigate("/login");
            }
        } else {
            // No user data found, redirect to login
            navigate("/login");
        }
        setLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("userData");
        navigate("/login");
    };

    const handleEditProfile = () => {
        // TODO: Navigate to edit profile page
        console.log("Edit profile clicked");
    };

    const handleDeleteAccount = () => {
        // TODO: Implement delete account functionality
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            console.log("Delete account clicked");
        }
    };

    const handleGoToSubmitTicket = () => {
        navigate("/tickets");
    };
    const handleGoToMyTickets = () => {
        navigate("/tickets/view");
    };

    if (loading) {
        return (
            <div className="profileContainer">
                <div className="profileCard">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (!userData) {
        return null;
    }

    return (
        <div className="profileContainer">
            <div className="profileCard">
                <div className="profileHeader">
                    <div className="profileImage">
                        <img 
                            src={userData.profilePic || "https://via.placeholder.com/150/000000/FFFFFF?text=Profile"} 
                            alt="Profile" 
                            className="profilePic"
                        />
                    </div>
                    <h1 className="profileName">
                        {userData.firstName} {userData.lastName}
                    </h1>
                    <p className="profileRole">{userData.role}</p>
                </div>

                <div className="profileInfo">
                    <div className="infoSection">
                        <h3>Personal Information</h3>
                        <div className="infoItem">
                            <span className="infoLabel">Email:</span>
                            <span className="infoValue">{userData.emailAddress}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">Name:</span>
                            <span className="infoValue">{userData.firstName} {userData.lastName}</span>
                        </div>
                        <div className="infoItem">
                            <span className="infoLabel">Role:</span>
                            <span className="infoValue">{userData.role}</span>
                        </div>
                    </div>

                    {userData.role === "Driver" && (
                        <div className="infoSection">
                            <h3>Driver Information</h3>
                            <div className="infoItem">
                                <span className="infoLabel">License Number:</span>
                                <span className="infoValue">{userData.licenseNumber || "Not provided"}</span>
                            </div>
                            <div className="infoItem">
                                <span className="infoLabel">Vehicle:</span>
                                <span className="infoValue">{userData.vehicle || "Not provided"}</span>
                            </div>
                            <div className="infoItem">
                                <span className="infoLabel">Experience:</span>
                                <span className="infoValue">{userData.experience || "Not provided"}</span>
                            </div>
                        </div>
                    )}

                    {userData.role === "Parent" && (
                        <div className="infoSection">
                            <h3>Parent Information</h3>
                            <div className="infoItem">
                                <span className="infoLabel">Children:</span>
                                <span className="infoValue">{userData.children || "Not provided"}</span>
                            </div>
                            <div className="infoItem">
                                <span className="infoLabel">Address:</span>
                                <span className="infoValue">{userData.address || "Not provided"}</span>
                            </div>
                            <div className="infoItem">
                                <span className="infoLabel">Phone:</span>
                                <span className="infoValue">{userData.phone || "Not provided"}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="profileActions">
                    <button 
                        onClick={handleEditProfile} 
                        className="profileButton editButton"
                    >
                        Edit Profile
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="profileButton logoutButton"
                    >
                        Logout
                    </button>
                    <button 
                        onClick={handleDeleteAccount} 
                        className="profileButton deleteButton"
                    >
                        Delete Account
                    </button>
                    <button 
                        onClick={handleGoToSubmitTicket} 
                        className="profileButton logoutButton"
                    >
                        Submit a Ticket
                    </button>
                    <button 
                        onClick={handleGoToMyTickets} 
                        className="profileButton editButton"
                    >
                        My Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}
