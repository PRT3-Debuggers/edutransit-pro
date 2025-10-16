import React, { useEffect, useState } from "react";
import "../assets/styles/DriverReview.css";

export default function AllReviews() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
        setReviews(storedReviews);
    }, []);

    return (
        <div className="review-container">
            <div className="review-card">
                <h2>All Driver Reviews</h2>
                <hr />
                {reviews.length > 0 ? (
                    <ul>
                        {reviews.map((r) => (
                            <li key={r.id} style={{ marginBottom: "1rem" }}>
                                <strong>{r.driverName}</strong> — ⭐ {r.rating}/5
                                <br />
                                <em>{r.comment}</em>
                                <br />
                                <small>🕒 {r.date}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews submitted yet.</p>
                )}
            </div>
        </div>
    );
}
