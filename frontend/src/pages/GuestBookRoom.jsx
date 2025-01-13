import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/GuestBookRoom.module.css";

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

        if (startTime >= endTime) {
            setMessage("Start time must be less than end time.");
            return;
        }

        try {
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
            setMessage(res.data.message || "Booking request created successfully.");
        } catch (err) {
            console.error("Guest booking error:", err);
            setMessage(err.response?.data?.message || "Failed to create guest booking.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Book a Room (Guest)</h1>
            {message && <p className={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Select Room:</label>
                    <select
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className={styles.select}
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

                <div className={styles.formGroup}>
                    <label className={styles.label}>Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Start Time (HH:mm):</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>End Time (HH:mm):</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    Submit Booking
                </button>
            </form>
        </div>
    );
}
