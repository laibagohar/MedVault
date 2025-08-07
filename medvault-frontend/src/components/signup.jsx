// signup page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/signup.css';

function Signup() {
    const [fullName, setFullName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {fullName, title, email, password, confirmPassword, dob, gender });
            setSuccess('User registered successfully');
            setError('');
        } catch (error) {
            setError(error.response.data.message);
            setSuccess('');
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h1>Signup</h1>
                <form onSubmit={handleSubmit} className="signup-form">
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <select value={title} onChange={(e) => setTitle(e.target.value)}>
                        <option value="Select Title">Select Title</option>
                        <option value="mr">Mr</option>
                        <option value="mrs">Mrs</option>
                        <option value="ms">Ms</option>
                    </select>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="Select Gender">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <button type="submit">Signup</button>
                </form>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    )
}
export default Signup;