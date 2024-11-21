import React, { useState, useContext } from 'react';
import AuthContext from '../context/auth.context';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';

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
        <div className={styles.loginPage}>
            <div className={styles.loginContainer}>
                <h1 className={styles.textDynamic}>Welcome!</h1>
                <form onSubmit={handleSubmit}>
                    <label className={styles.textDynamic}>
                        User ID or Email:
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    </label>
                    <label className={styles.textDynamic}>
                        Password:
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className={styles.buttonContainer}>
                        <button className={`${styles.loginButton} ${styles.textDynamic}`} type="submit">Login</button>
                        <button
                            className={`${styles.registerButton} ${styles.textDynamic}`}
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
