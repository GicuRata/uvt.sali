import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import styles from "../styles/MyBooking.module.css";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBookings(res.data.bookings || []);
            } catch (error) {
                console.error("Failed to fetch user bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Do you want to cancel this booking?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/bookings/cancel/${bookingId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            setMessage("Booking canceled successfully.");
        } catch (error) {
            console.error("Cancel booking error:", error);
            setMessage("Failed to cancel booking.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>My Bookings</h2>
            {message && <p className={styles.message}>{message}</p>}
            {bookings.length === 0 ? (
                <p className={styles.noBookings}>No bookings found.</p>
            ) : (
                bookings.map((b) => (
                    <div key={b._id} className={styles.bookingCard}>
                        <p className={styles.bookingDetails}>
                            Room: {b.room?.name} | Location: {b.room?.location}
                        </p>
                        <p className={styles.bookingDetails}>
                            Date: {b.date?.slice(0, 10)} | Time: {b.startTime} - {b.endTime}
                        </p>
                        <p className={styles.bookingDetails}>Status: {b.status}</p>
                        {(b.status === "pending" || b.status === "approved") && (
                            <button
                                className={styles.cancelButton}
                                onClick={() => cancelBooking(b._id)}
                            >
                                Cancel Booking
                            </button>
                        )}
                    </div>
                ))
            )}

            {/* Back Button */}
            <button
                className={styles.backButton}
                onClick={() => navigate(-1)} // Navigate to the previous page
            >
                Back
            </button>
        </div>
    );
};

export default MyBookings;
