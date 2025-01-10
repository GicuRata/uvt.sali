import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookRoom() {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            // Basic time check on frontend
            if (startTime >= endTime) {
                setMessage("Start time must be less than end time.");
                return;
            }

            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/bookings/available-rooms`,
                {
                    params: { date, startTime, endTime },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setAvailableRooms(res.data.rooms);
            if (res.data.rooms.length === 0) {
                setMessage("No rooms available for this time slot (based on approved bookings).");
            }
        } catch (err) {
            console.error("Check availability error:", err);
            setMessage("Failed to check availability.");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedRoom) {
            setMessage("Please select a room first.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/bookings/create-booking`,
                {
                    roomId: selectedRoom,
                    date,
                    startTime,
                    endTime,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("Booking request created (status: pending).");
            // Optionally redirect or reset
            // navigate("/my-bookings");
        } catch (error) {
            console.error("Booking error:", error);
            setMessage(error.response?.data?.message || "Failed to create booking.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Book a Room</h2>
            {message && <p>{message}</p>}

            <form onSubmit={handleCheckAvailability}>
                <div>
                    <label>Date: </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Start Time (HH:mm): </label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>End Time (HH:mm): </label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Check Availability</button>
            </form>

            {availableRooms.length > 0 && (
                <>
                    <h3>Select an available room</h3>
                    <ul>
                        {availableRooms.map((room) => (
                            <li key={room._id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="selectedRoom"
                                        value={room._id}
                                        onChange={(e) => setSelectedRoom(e.target.value)}
                                    />
                                    {room.name} ({room.location}, capacity: {room.capacity})
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleBooking}>Book Selected Room</button>
                </>
            )}
        </div>
    );
}
