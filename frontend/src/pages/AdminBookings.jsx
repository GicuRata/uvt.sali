import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");

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

    return (
        <div style={{ padding: "2rem" }}>
            <h2>All Bookings (Admin)</h2>
            {message && <p>{message}</p>}
            <ul>
                {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    bookings.map((b) => (
                        <li key={b._id} style={{ marginBottom: "1rem" }}>
                            <p>
                                <strong>Room:</strong> {b.room?.name} | <strong>Location:</strong>{" "}
                                {b.room?.location}
                            </p>
                            <p>
                                <strong>User:</strong> {b.user?.username} ({b.user?.email})
                            </p>
                            <p>
                                <strong>Date:</strong> {b.date?.slice(0, 10)} |{" "}
                                <strong>Time:</strong> {b.startTime} - {b.endTime} |{" "}
                                <strong>Status:</strong> {b.status}
                            </p>
                            <p>
                                <strong>Created At:</strong>{" "}
                                {new Date(b.createdAt).toLocaleString()}
                            </p>
                            {b.status === "pending" && (
                                <>
                                    <button onClick={() => handleApprove(b._id)}>Approve</button>
                                    <button onClick={() => handleDeny(b._id)}>Deny</button>
                                </>
                            )}
                            <hr />
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AdminBookings;
