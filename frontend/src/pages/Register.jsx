import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import AuthContext from '../context/auth.context';
import styles from '../styles/Register.module.css';

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
        <div className={styles.registerPage}>
            <div className={styles.registerContainer}>
                <form onSubmit={handleSubmit}>
                    <h2 className={styles.textDynamic}>Registration</h2>
                    <label className={styles.textDynamic}>
                        Username:
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.textDynamic}>
                        Email:
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.textDynamic}>
                        Password:
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <label className={styles.textDynamic}>
                        Confirm Password:
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </label>
                    <div className={styles.buttonContainer}>
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
