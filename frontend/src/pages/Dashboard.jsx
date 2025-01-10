import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/auth.context";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Load rooms, etc.
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setRooms(response.data.rooms);
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                setMessage("Failed to load rooms");
            }
        };

        fetchRooms();
    }, []);

    const handleGoToBookRoom = () => {
        navigate("/book-room");
    };

    const handleGoToMyBookings = () => {
        navigate("/my-bookings");
    };

    const handleGoToAdminBookings = () => {
        navigate("/admin/bookings");
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
                {/* Admin Only */}
                {user.role === "admin" && (
                    <div className="admin-section">
                        <h2>Admin Section</h2>
                        <button onClick={() => navigate("/admin/add-room")}>Add Room</button>
                        {/* Link to all bookings (admin) */}
                        <button onClick={handleGoToAdminBookings}>Manage Bookings</button>
                    </div>
                )}

                {/* Bookings for normal user */}
                {user.role === "user" && (
                    <div className="user-section">
                        <h2>User Bookings</h2>
                        {/* Navigate to Book Room */}
                        <button onClick={handleGoToBookRoom}>Book a Room</button>
                        {/* Navigate to My Bookings */}
                        <button onClick={handleGoToMyBookings}>My Bookings</button>
                    </div>
                )}

                <div className="info-section">
                    {/* Existing code for rooms listing */}
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
                                        {room.description && (
                                            <p>Description: {room.description}</p>
                                        )}
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
                                                            } catch (error) {
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
