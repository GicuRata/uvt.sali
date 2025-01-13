import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/BookRoom.module.css";

export default function BookRoom() {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState("");
    const [selectedRoomDetails, setSelectedRoomDetails] = useState(null); // To store details of the clicked room
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Loader state
    const navigate = useNavigate();

    // Helper to get current date and time
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

            // Check if the selected date and time are valid
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
            setMessage("Booking request created successfully (status: pending).");
            setAvailableRooms([]);
            setSelectedRoom("");
            setSelectedRoomDetails(null);
        } catch (error) {
            console.error("Booking error:", error);
            setMessage(error.response?.data?.message || "Failed to create booking.");
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
            <h2>Book a Room</h2>
            {message && <p id="message" className={styles.messageBookroom}>{message}</p>}
            {loading && <div className={styles.spinner}>Loading...</div>}

            <form onSubmit={handleCheckAvailability} className={styles.sharedStyleBookroom}>
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

            {/* Back Button */}
            <button
                className={styles.backBtnBookroom}
                onClick={() => navigate(-1)} // Navigate to the previous page
            >
                Back
            </button>
        </div>
    );
}
