import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './assets/styles/App.css';
import HomePage from "./views/HomePage.jsx";
import About from './pages/About';
import Drivers from './pages/Drivers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Navigation from "./components/Navigation.jsx";
import MapWithPoints from "./components/MapWithPoints.jsx";
import Profile from "./components/Profile.jsx";
import DriverReview from "./components/DriverReview.jsx";
import AllReview from "./components/AllReview.jsx";

function App() {
    return (
        <BrowserRouter>
            <Navigation></Navigation>
            <Routes>
                {/*<Route path="/" element={</>}/>*/}
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/drivers" element={<Drivers/>}/>
                <Route path="/privacy" element={<PrivacyPolicy/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/finddriver" element={<MapWithPoints/>}/>
                <Route path="/reviews/:id" element={<DriverReview />} />
                <Route path="/reviews" element={<AllReview />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
