import React, { useState, useContext } from 'react';
import AuthContext from '../context/auth.context';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1 className="text-dynamic">Welcome!</h1>
                <form onSubmit={handleSubmit}>
                    <label className="text-dynamic">
                        User ID or Email:
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    </label>
                    <label className="text-dynamic">
                        Password:
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="button-container">
                        <button className="login-button text-dynamic" type="submit">Login</button>
                        <button
                            className="register-button text-dynamic"
                            type="button"
                            onClick={() => navigate('/register')}
                        >
                            Go To Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
