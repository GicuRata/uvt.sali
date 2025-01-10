import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState("");

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
        <div style={{ padding: "2rem" }}>
            <h2>My Bookings</h2>
            {message && <p>{message}</p>}
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                bookings.map((b) => (
                    <div
                        key={b._id}
                        style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}
                    >
                        <p>
                            Room: {b.room?.name} | Location: {b.room?.location}
                        </p>
                        <p>
                            Date: {b.date?.slice(0, 10)} | Time: {b.startTime} - {b.endTime}
                        </p>
                        <p>Status: {b.status}</p>
                        {/* Cancel button (only if not already denied/approved, or allow cancel anyway) */}
                        {b.status === "pending" || b.status === "approved" ? (
                            <button onClick={() => cancelBooking(b._id)}>Cancel Booking</button>
                        ) : null}
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBookings;
