import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "../styles/AdminBookings.module.css";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/bookings/all-bookings`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBookings(res.data.bookings || []);
            } catch (error) {
                console.error("Failed to fetch bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    const handleApprove = async (id) => {
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/bookings/approve/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedBooking = res.data.booking;
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: updatedBooking.status } : b))
            );
            setMessage("Booking approved successfully");
        } catch (error) {
            console.error("Approve error:", error);
            setMessage(error.response?.data?.message || "Failed to approve booking");
        }
    };

    const handleDeny = async (id) => {
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/bookings/deny/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedBooking = res.data.booking;
            setBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: updatedBooking.status } : b))
            );
            setMessage("Booking denied successfully");
        } catch (error) {
            console.error("Deny error:", error);
            setMessage("Failed to deny booking");
        }
    };

    // Sort bookings to show pending bookings first
    const sortedBookings = bookings.sort((a, b) => {
        const statusOrder = { pending: 1, approved: 2, denied: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    Back
                </button>
                <h2 className={styles.title}>All Bookings (Admin)</h2>
            </div>
            {message && <p className={styles.message}>{message}</p>}
            <ul className={styles.bookingList}>
                {sortedBookings.length === 0 ? (
                    <p className={styles.noBookings}>No bookings found.</p>
                ) : (
                    sortedBookings.map((b) => (
                        <li key={b._id} className={styles.bookingCard}>
                            <p className={styles.bookingDetails}>
                                <strong>Room:</strong> {b.room?.name} | <strong>Location:</strong>{" "}
                                {b.room?.location}
                            </p>
                            <p className={styles.bookingDetails}>
                                <strong>User:</strong> {b.user?.username} ({b.user?.email})
                            </p>
                            <p className={styles.bookingDetails}>
                                <strong>Date:</strong> {b.date?.slice(0, 10)} |{" "}
                                <strong>Time:</strong> {b.startTime} - {b.endTime}
                            </p>
                            <p
                                className={`${styles.bookingDetails} ${styles.status} ${styles[b.status.toLowerCase()]}`}
                            >
                                Status: {b.status}
                            </p>
                            {b.status === "pending" && (
                                <div className={styles.buttonGroup}>
                                    <button
                                        className={styles.approveButton}
                                        onClick={() => handleApprove(b._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.denyButton}`}
                                        onClick={() => handleDeny(b._id)}
                                    >
                                        Deny
                                    </button>
                                </div>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AdminBookings;
