import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ role }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <h1>Event Mgt</h1>
                </div>

                <div className="user-section">
                    {
                        role == "admin" ? 
                        <button className="logout-btn" onClick={() => {
                            navigate("/add-event");
                        }}>
                            Add Event
                        </button> :""
                    }
                   
                    <button className="logout-btn" onClick={() => {
                        localStorage.clear();
                        console.log("Local storage cleared");
                        navigate("/login");
                    }}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;