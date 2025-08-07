import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/navbar.css';

function Navbar() {
    const [user, setUser] = useState(null);
    const profileRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            setUser(storedUser);
        } catch {
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav>
            <div className="logo">
                <Link to="/dashboard"><h1>MedVault</h1></Link>
            </div>
            <div className="nav-links">
                <Link to="/upload-report" className="upload-link">Upload Report</Link>
                <Link to="/reports">Reports</Link>
                
                <Link to="/report-trends">Report Trends</Link>
                {user && user.name ? (
                    <div
                        className="user-profile"
                        ref={profileRef}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        style={{ position: 'relative' }}
                    >
                        <p className="user-initial" style={{ cursor: 'pointer', userSelect: 'none' }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </p>

                        {dropdownOpen && (
                            <div className="user-profile-dropdown" >
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                                <Link to="/login" onClick={handleLogout}>Logout</Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
