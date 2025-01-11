import React, { useState, useEffect } from "react";
import axios from "axios";

export default function GuestBookRoom() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [rooms, setRooms] = useState([]);
    const [roomId, setRoomId] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // fetch all rooms
        const fetchRooms = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`
                );
                setRooms(res.data.rooms || []);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        // Basic check
        if (startTime >= endTime) {
            setMessage("Start time must be less than end time.");
            return;
        }

        try {
            // Public endpoint to create a guest booking
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/guest-bookings/create`,
                {
                    fullName,
                    email,
                    roomId,
                    date,
                    startTime,
                    endTime,
                }
            );
            setMessage(res.data.message || "Booking request created");
        } catch (err) {
            console.error("Guest booking error:", err);
            setMessage(err.response?.data?.message || "Failed to create guest booking.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Book a Room (Guest)</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Select Room:</label>
                    <select
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        required
                    >
                        <option value="">-- Choose a room --</option>
                        {rooms.map((room) => (
                            <option key={room._id} value={room._id}>
                                {room.name} ({room.location})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Start Time (HH:mm):</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>End Time (HH:mm):</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Submit Booking</button>
            </form>
        </div>
    );
}
