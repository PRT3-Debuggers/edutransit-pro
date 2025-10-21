import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/DriverReview.css";
import { saveDriverReview, getDriverReviews } from "../firebase/firebase.js";


const drivers = [
    { id: 1, name: "John Doe", vehicle: "Renault Clio", languages: ["English", "Afrikaans"], status: "Available", profilePic: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 2, name: "Lebo Mokoena", vehicle: "Toyota Quantum", languages: ["Zulu", "English"], status: "Unavailable", profilePic: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Fatima Jacobs", vehicle: "Nissan Almera", languages: ["English"], status: "Available", profilePic: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "Ahmed Khan", vehicle: "Hyundai H1", languages: ["English", "Arabic"], status: "Available", profilePic: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: 5, name: "Sipho Dlamini", vehicle: "Ford Transit", languages: ["Xhosa", "English"], status: "Unavailable", profilePic: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 6, name: "Nicole Smith", vehicle: "VW Polo", languages: ["English"], status: "Available", profilePic: "https://randomuser.me/api/portraits/women/6.jpg" },
    { id: 7, name: "Tshepo Moloi", vehicle: "Mazda 2", languages: ["Sotho", "English"], status: "Available", profilePic: "https://randomuser.me/api/portraits/men/7.jpg" },
    { id: 8, name: "Zainab Parker", vehicle: "Chevrolet Aveo", languages: ["English", "Afrikaans"], status: "Unavailable", profilePic: "https://randomuser.me/api/portraits/women/8.jpg" },
    { id: 9, name: "Mohammed Patel", vehicle: "Toyota Corolla", languages: ["English", "Urdu"], status: "Available", profilePic: "https://randomuser.me/api/portraits/men/9.jpg" },
    { id: 10, name: "Thandiwe Ndlovu", vehicle: "Kia Picanto", languages: ["Zulu", "English"], status: "Available", profilePic: "https://randomuser.me/api/portraits/women/10.jpg" },
];

export default function DriverReview() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [driver, setDriver] = useState(location.state?.driver || null);
    const [reviews, setReviews] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");

    // Load driver info
    useEffect(() => {
        if (!driver && id) {
            const foundDriver = drivers.find((d) => d.id === Number(id));
            if (foundDriver) setDriver(foundDriver);
        }
    }, [id, driver]);

    // Load reviews from Firestore
    useEffect(() => {
        const fetchReviews = async () => {
            const driverReviews = await getDriverReviews(Number(id));
            setReviews(driverReviews);
        };
        fetchReviews();
    }, [id]);

    // Submit new review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const rating = e.target.rating.value;
        const comment = e.target.comment.value;

        const newReview = {
            driverId: Number(id),
            driverName: driver.name,
            rating: Number(rating),
            comment,
        };

        try {
            await saveDriverReview(newReview);
            setSuccessMsg("✅ Your review has been submitted!");
            setReviews((prev) => [newReview, ...prev]);
            setTimeout(() => setSuccessMsg(""), 3000);
            e.target.reset();
        } catch (error) {
            console.error("Error submitting review:", error);
            setSuccessMsg("❌ Failed to submit review. Try again.");
            setTimeout(() => setSuccessMsg(""), 3000);
        }
    };

    if (!driver) {
        return (
            <div className="review-container">
                <p>No driver data found. Please go back to the map.</p>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="review-container">
            <div className="review-card">
                <img src={driver.profilePic} alt={driver.name} className="driver-pic" />
                <h2>{driver.name}</h2>
                <p><strong>Vehicle:</strong> {driver.vehicle}</p>
                <p><strong>Languages:</strong> {driver.languages.join(", ")}</p>
                <p><strong>Status:</strong> {driver.status}</p>

                <hr />

                <div className="review-list">
                    <h3>Reviews</h3>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((rev) => (
                                <li key={rev.id}>
                                    <strong>⭐ {rev.rating}/5</strong> — {rev.comment}
                                    <br />
                                    <small>
                                        🕒{" "}
                                        {rev.timestamp?.toDate
                                            ? rev.timestamp.toDate().toLocaleString()
                                            : ""}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>

                <hr />

                <div className="review-form">
                    <h3>Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit}>
                        <label>Rating (1–5):</label>
                        <input name="rating" type="number" min="1" max="5" required />

                        <label>Comment:</label>
                        <textarea
                            name="comment"
                            placeholder={`Share your experience with ${driver.name}...`}
                            required
                        ></textarea>

                        <button type="submit" className="submit-btn">Submit Review</button>
                    </form>

                    {successMsg && <p className="success-msg">{successMsg}</p>}
                </div>

                <div className="button-group">
                    <button className="back-btn" onClick={() => navigate(-1)}>Back to Map</button>
                    <button className="view-all-btn" onClick={() => navigate("/reviews")}>View All Reviews</button>
                </div>
            </div>
        </div>
    );
}
