import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/GuestBookRoom.module.css";

export default function GuestBookRoom() {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // "HH:mm"
    };

    const handleCheckAvailability = async (e) => {
        e.preventDefault();
        setMessage("");
        setAvailableRooms([]);
        setLoading(true);

        try {
            const currentDate = getCurrentDate();
            const currentTime = getCurrentTime();

            if (date < currentDate || (date === currentDate && startTime < currentTime)) {
                setMessage("Cannot select a time or date in the past.");
                setLoading(false);
                return;
            }

            if (startTime >= endTime) {
                setMessage("Start time must be less than end time.");
                setLoading(false);
                return;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`);
            setAvailableRooms(res.data.rooms || []);
            if (res.data.rooms.length === 0) {
                setMessage("No rooms available for this time slot.");
            }
        } catch (err) {
            console.error("Check availability error:", err);
            setMessage("Failed to check availability.");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedRoom) {
            setMessage("Please select a room first.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/guest-bookings/create`, {
                fullName,
                email,
                roomId: selectedRoom,
                date,
                startTime,
                endTime,
            });
            setMessage(res.data.message || "Guest booking request created successfully.");
            setAvailableRooms([]);
            setSelectedRoom("");
            setSelectedRoomDetails(null);
        } catch (error) {
            console.error("Booking error:", error);
            setMessage(error.response?.data?.message || "Failed to create guest booking.");
        } finally {
            setLoading(false);
        }
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room._id);
        setSelectedRoomDetails(room);
    };

    return (
        <div className={styles.containerBookroom}>
            <h2>Book a Room (Guest)</h2>
            {message && <p id="message" className={styles.messageBookroom}>{message}</p>}
            {loading && <div className={styles.spinner}>Loading...</div>}

            <form onSubmit={handleCheckAvailability} className={styles.sharedStyleBookroom}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={styles.inputBookroom}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.inputBookroom}
                        required
                    />
                </div>

                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        min={getCurrentDate()} // Prevent past dates
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.inputBookroom}
                        required
                    />
                </div>

                <div>
                    <label>Start Time (HH:mm):</label>
                    <input
                        type="time"
                        value={startTime}
                        min={date === getCurrentDate() ? getCurrentTime() : undefined} // Prevent past times for today
                        onChange={(e) => setStartTime(e.target.value)}
                        className={styles.inputBookroom}
                        required
                    />
                </div>

                <div>
                    <label>End Time (HH:mm):</label>
                    <input
                        type="time"
                        value={endTime}
                        min={startTime || undefined} // Prevent times earlier than startTime
                        onChange={(e) => setEndTime(e.target.value)}
                        className={styles.inputBookroom}
                        required
                    />
                </div>

                <button type="submit" className={styles.sharedBtnBookroom}>
                    Check Availability
                </button>
            </form>

            {availableRooms.length > 0 && (
                <div className={styles.availableRoomsBookroom}>
                    <h3>Select an available room</h3>
                    <ul>
                        {availableRooms.map((room) => (
                            <li
                                key={room._id}
                                className={styles.roomItemBookroom}
                                onClick={() => handleRoomClick(room)} // Set the clicked room's details
                            >
                                <label>
                                    <input
                                        type="radio"
                                        name="selectedRoom"
                                        value={room._id}
                                        checked={selectedRoom === room._id}
                                        readOnly
                                    />
                                    {room.name} ({room.location}, capacity: {room.capacity})

                                    {selectedRoomDetails?._id === room._id && (
                                        <div className={styles.roomDetailsBookroom}>
                                            <p>Details:</p>
                                            <p>Location: {room.location}</p>
                                            <p>Capacity: {room.capacity}</p>
                                            {room.equipment?.length > 0 && room.equipment[0] !== "" && (
                                                <p>
                                                    Equipment: {room.equipment.filter((e) => e).join(", ")}
                                                </p>
                                            )}
                                            {room.description && <p>Description: {room.description}</p>}
                                        </div>
                                    )}
                                </label>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleBooking}
                        className={styles.sharedBtnBookroom}
                        disabled={!selectedRoom} // Disable booking if no room is selected
                    >
                        Book Selected Room
                    </button>
                </div>
            )}
        </div>
    );
}
