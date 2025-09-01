import { useState, useEffect } from "react";
import MessageModal from "../modals/MessageModal.jsx";
import { saveDriverReview, getDriverReviews } from "../firebase/firebase.js";
import "../assets/styles/App.css";

export default function DriverReviewPage({ driverId }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // Fetch reviews for this driver
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getDriverReviews(driverId);
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [driverId]);

    // Submit a new review
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            alert("Please select a rating between 1 and 5");
            return;
        }

        try {
            await saveDriverReview({ driverId, rating, comment });
            setModalMessage("Review submitted successfully!");
            setModalOpen(true);

            // Refresh reviews
            const updatedReviews = await getDriverReviews(driverId);
            setReviews(updatedReviews);

            // Clear form
            setRating(0);
            setComment("");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="formArea">
            <h1>Driver Review</h1>

            <MessageModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                message={modalMessage}
            />

            <form onSubmit={handleSubmit}>
                <p>
                    <label>Rating (1-5): </label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                        className="inputText"
                    >
                        <option value={0}>Select rating</option>
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </p>

                <p>
                    <label>Comment:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave your comment..."
                        rows={4}
                        className="inputText"
                    />
                </p>

                <button type="submit" className="task_addbutton">
                    Submit Review
                </button>
            </form>

            <hr />

            <h2>All Reviews</h2>
            {loading ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews yet for this driver.</p>
            ) : (
                <table className="reviewTable">
                    <thead>
                    <tr>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review) => (
                        <tr key={review.id}>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>
                                {review.timestamp?.toDate
                                    ? review.timestamp.toDate().toLocaleString()
                                    : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
