import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AuthContext from '../context/auth.context';
import '../styles/Register.css';

function Register() {
    const { register } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const response = await register(formData);
        if (response) {
            navigate('/login'); // Redirect to login page on successful registration
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-dynamic">Registration</h2>
                    <label className="text-dynamic">
                        Username:
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="text-dynamic">
                        Email:
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="text-dynamic">
                        Password:
                        <input
                            type={showPassword ? 'text' : 'password'} // Toggle password visibility
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="text-dynamic">
                        Confirm Password:
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="button-container">
                        <button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 'Hide Passwords' : 'Show Passwords'}
                        </button>
                        <button type="submit">Register</button>
                        <button type="button" onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
