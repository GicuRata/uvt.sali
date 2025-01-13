import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/AdminGuestBookings.module.css";

const AdminGuestBookings = () => {
    const [guestBookings, setGuestBookings] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchGuestBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/guest-bookings/all`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setGuestBookings(res.data.guestBookings || []);
            } catch (error) {
                console.error("Failed to fetch guest bookings:", error);
            }
        };
        fetchGuestBookings();
    }, []);

    const handleApprove = async (id) => {
        setMessage("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/guest-bookings/approve/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = res.data.guestBooking;
            setGuestBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
            );
            setMessage("Guest booking approved successfully");
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
                `${import.meta.env.VITE_API_URL}/api/guest-bookings/deny/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = res.data.guestBooking;
            setGuestBookings((prev) =>
                prev.map((b) => (b._id === id ? { ...b, status: updated.status } : b))
            );
            setMessage("Guest booking denied");
        } catch (error) {
            console.error("Deny error:", error);
            setMessage("Failed to deny booking");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Guest Bookings (Admin)</h2>
            {message && <p className={styles.message}>{message}</p>}
            <ul className={styles.bookingList}>
                {guestBookings.length === 0 ? (
                    <p className={styles.message}>No guest bookings found.</p>
                ) : (
                    guestBookings.map((b) => (
                        <li key={b._id} className={styles.bookingCard}>
                            <p className={styles.bookingDetails}>
                                <strong>Full Name:</strong> {b.fullName} <br />
                                <strong>Email:</strong> {b.email}
                            </p>
                            <p className={styles.bookingDetails}>
                                <strong>Room:</strong> {b.room?.name} |{" "}
                                <strong>Location:</strong> {b.room?.location}
                            </p>
                            <p className={styles.bookingDetails}>
                                <strong>Date:</strong>{" "}
                                {b.date && new Date(b.date).toLocaleDateString()} |{" "}
                                <strong>Time:</strong> {b.startTime} - {b.endTime} <br />
                                <strong>Status:</strong> {b.status}
                            </p>
                            <p className={styles.bookingDetails}>
                                <strong>Created At:</strong>{" "}
                                {new Date(b.createdAt).toLocaleString()}
                            </p>
                            {b.status === "pending" && (
                                <div className={styles.buttonGroup}>
                                    <button
                                        className={styles.button}
                                        onClick={() => handleApprove(b._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className={styles.button}
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

export default AdminGuestBookings;
