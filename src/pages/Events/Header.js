import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import logo from "../../logo.jpg";

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
                <img src={logo} alt="Logo" style={{ width: "100px", height: "50px" }} />
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