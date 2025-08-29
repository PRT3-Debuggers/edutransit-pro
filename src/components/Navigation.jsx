import React, { useState } from 'react';
import '../assets/styles/Navigation.css';
import { FaSchool, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="nav-container">
            <div className="nav-header">
                <div className="nav-logo">
                    <Link to="/" className="nav-logo-link">
                        <FaSchool className="nav-logo-icon" />
                        <span>EDUTRANSIT</span>
                    </Link>
                </div>
                <button
                    className="nav-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link">Signup</Link>
                <Link to="/finddriver" className="nav-link">Find a Driver</Link>
                <Link to="/" className="nav-link">For Parents</Link>
                <Link to="/" className="nav-link">For Drivers</Link>
                <Link to="/" className="nav-link">Schools</Link>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/privacy" className="nav-link">Privacy</Link>
            </div>
        </nav>
    );
};

export default Navigation;
