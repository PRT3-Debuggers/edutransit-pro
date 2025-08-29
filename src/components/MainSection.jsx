
import React from 'react';
import SchoolBus from '../assets/Schoolbus.png';
import '../assets/styles/Main.css';

export default function MainSection() {
    return (
        <div className="main-container">
            <div className="main-text">
                <h1>EDUTRANSIT</h1>
                <p>
                    EduTransit helps parents quickly find safe and trusted school transport options for their children, or register their vehicle with ease.
                    We connect parents with reliable drivers to ensure peace of mind during daily school commutes.
                    Whether you're a parent looking for dependable transport or a driver ready to offer services, you're in the right place.
                    Join our growing network and experience a smarter way to manage school transportation.
                </p>
                <div className="main-buttons">
                    <button onClick={() => alert('Finding available transport...')}>Find Transport</button>
                    <button onClick={() => alert('Redirecting to registration...')}>Register Vehicle</button>
                    <button onClick={() => alert('Available for Bookings...')}>Book Now</button>
                </div>
            </div>

            <div className="main-image">
                <img src={SchoolBus} alt="SchoolBus Illustration" />
            </div>
        </div>
    );
}

