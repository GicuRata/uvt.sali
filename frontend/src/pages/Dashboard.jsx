import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/auth.context";
import QRCode from "react-qr-code";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");

    const [guestFullName, setGuestFullName] = useState("");
    const [guestEmail, setGuestEmail] = useState("");
    const [guestDate, setGuestDate] = useState("");
    const [guestStartTime, setGuestStartTime] = useState("");
    const [guestEndTime, setGuestEndTime] = useState("");
    const [guestRoomId, setGuestRoomId] = useState("");

    const [qrValue, setQrValue] = useState("");
    const [showQr, setShowQr] = useState(false); // State to manage QR visibility

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`,
                    { headers }
                );
                setRooms(response.data.rooms || []);
            } catch {
                setMessage("Failed to load rooms");
            }
        };
        fetchRooms();
    }, []);

    const handleGuestBooking = async (e) => {
        e.preventDefault();
        setMessage("");
        if (guestStartTime >= guestEndTime) {
            setMessage("Start time must be less than end time.");
            return;
        }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/guest-bookings/create`,
                {
                    fullName: guestFullName,
                    email: guestEmail,
                    roomId: guestRoomId,
                    date: guestDate,
                    startTime: guestStartTime,
                    endTime: guestEndTime,
                }
            );
            setMessage(res.data.message || "Guest booking request created.");
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to create guest booking.");
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return (
            <div className="container">
                <nav>
                    <img src="/images/uvt-logo.jpeg" alt="Logo" />
                    <button onClick={() => navigate("/login")}>Login</button>
                </nav>
                <div className="profile">
                    <div className="user-info">
                        <h1>Guest Booking Page</h1>
                        <p>Book a room as a guest below:</p>
                    </div>
                    <img src="/images/logo.no.name.jpg" alt="Profile Logo" />
                </div>
                <div className="main">
                    {message && <p style={{ color: "red" }}>{message}</p>}
                    <form onSubmit={handleGuestBooking} style={{ margin: "1rem 0" }}>
                        <div>
                            <label>Full Name:</label>
                            <input
                                type="text"
                                value={guestFullName}
                                onChange={(e) => setGuestFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Email:</label>
                            <input
                                type="email"
                                value={guestEmail}
                                onChange={(e) => setGuestEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Room:</label>
                            <select
                                value={guestRoomId}
                                onChange={(e) => setGuestRoomId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a room --</option>
                                {rooms.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.name} ({r.location})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Date:</label>
                            <input
                                type="date"
                                value={guestDate}
                                onChange={(e) => setGuestDate(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={guestStartTime}
                                onChange={(e) => setGuestStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={guestEndTime}
                                onChange={(e) => setGuestEndTime(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Create Guest Booking</button>
                    </form>
                </div>
            </div>
        );
    }

    const handleGoToBookRoom = () => {
        navigate("/book-room");
    };

    const handleGoToMyBookings = () => {
        navigate("/my-bookings");
    };

    const handleGoToAdminBookings = () => {
        navigate("/admin/bookings");
    };

    const handleGenerateQr = () => {
        setQrValue(`${window.location.origin}/guest-book-room`);
        setShowQr(true); // Show the QR code when generated
    };

    return (
        <div className="container">
            <nav>
                <img src="/images/uvt-logo.jpeg" alt="Logo" />
                <button onClick={logout}>Logout</button>
            </nav>
            <div className="profile">
                <div className="user-info">
                    <h1>Personal Dashboard</h1>
                    <p>Name: {user.username}</p>
                    <p>Status: {user.role}</p>
                    <p>User ID: {user.id}</p>
                    <p>Today: {new Date().toLocaleString("en-US")}</p>
                </div>
                <img src="/images/logo.no.name.jpg" alt="Profile Logo" />
            </div>
            <div className="main">
                {user.role === "admin" && (
                    <div className="admin-section">
                        <h2>Admin Section</h2>
                        <button onClick={() => navigate("/admin/add-room")} className="admin-btn">Add Room</button>
                        <button onClick={handleGoToAdminBookings} className="admin-btn">Manage Bookings</button>
                        <button onClick={() => navigate("/admin/guest-bookings")} className="admin-btn">Manage Guest Bookings</button>
                        <div style={{marginTop: "1rem"}}>
                            <button onClick={handleGenerateQr} className="generate-button">Generate QR for Guest
                                Booking
                            </button>
                            {showQr && qrValue && (
                                <div style={{marginTop: "1rem"}}>
                                    <div>
                                        <QRCode value={qrValue}/>
                                    </div>
                                    <button onClick={() => setShowQr(false)} className="generate-button">
                                        Hide QR
                                    </button>

                                </div>

                            )}

                        </div>
                    </div>
                )}
                {user.role === "user" && (
                    <div className="user-section">
                    <h2>User Bookings</h2>
                        <button onClick={handleGoToBookRoom} className="user-btn">Book a Room</button>
                        <button onClick={handleGoToMyBookings} className="user-btn">My Bookings</button>
                    </div>
                )}
                <div className="info-section">
                    <div className="available-rooms shared-style">
                        <h2>Available Rooms</h2>
                        {message && <p className="error-message">{message}</p>}
                        <ul className="room-list">
                            {rooms && rooms.length > 0 ? (
                                rooms.map((room) => (
                                    <li key={room._id} className="room-item">
                                        <h3>{room.name}</h3>
                                        <p>Location: {room.location}</p>
                                        <p>Capacity: {room.capacity}</p>
                                        {room.equipment.length > 0 && room.equipment[0] !== "" && (
                                            <p>
                                                Equipment: {room.equipment.filter((e) => e).join(", ")}
                                            </p>
                                        )}
                                        {room.description && <p>Description: {room.description}</p>}
                                        {user.role === "admin" && (
                                            <div className="room-actions">
                                                <button
                                                    className="shared-btn edit-btn"
                                                    onClick={() => navigate(`/admin/edit-room/${room._id}`)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="shared-btn delete-btn"
                                                    onClick={async () => {
                                                        if (window.confirm("Confirm delete?")) {
                                                            try {
                                                                const token = localStorage.getItem("token");
                                                                await axios.delete(
                                                                    `${import.meta.env.VITE_API_URL}/api/rooms/delete-room/${room._id}`,
                                                                    {
                                                                        headers: { Authorization: `Bearer ${token}` },
                                                                    }
                                                                );
                                                                setRooms((prev) =>
                                                                    prev.filter((r) => r._id !== room._id)
                                                                );
                                                            } catch {
                                                                setMessage("Failed to delete room");
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p>No rooms available</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;