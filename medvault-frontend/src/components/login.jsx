// login page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
             localStorage.setItem('user', JSON.stringify(response.data.user));

            setSuccess('Login successful');
            setError('');
            navigate('/dashboard');
        } catch (error) {
            setError(error.response.data.message);
            setSuccess('');
        }
    }

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" >Login</button>
                </form>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                <p>Don't have an account? <Link to="/">Signup</Link></p>
            </div>
        </div>
    )
}   

export default Login;