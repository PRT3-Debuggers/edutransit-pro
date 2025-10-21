import React, { useEffect, useState } from "react";
import "../assets/styles/DriverReview.css";
import { db } from "../firebase/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";



export default function AllReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(collection(db, "driver-reviews"), orderBy("timestamp", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedReviews = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="review-container">
                <div className="review-card">
                    <p>Loading reviews...</p>
                </div>
            </div>
        );
    }

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
                                <small>
                                    🕒{" "}
                                    {r.timestamp?.toDate
                                        ? r.timestamp.toDate().toLocaleString()
                                        : ""}
                                </small>
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
