import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";
import {Tooltip} from 'react-leaflet/Tooltip';
const points = [
    {
        id: 1,
        name: 'John Doe',
        lat: -33.9249,
        lng: 18.4241,
        status: 'Available',
        schools: ['Groote Schuur High'],
        vehicle: 'Renault Clio',
        languages: ['English', 'Afrikaans'],
        criminal_record: true,
        max_passengers: 2,
        gender: 'male',
        race: 'coloured',
        available_seats: 1,
        profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
        id: 2,
        name: 'Lebo Mokoena',
        lat: -33.9180,
        lng: 18.4210,
        status: 'Unavailable',
        schools: ['Claremont High'],
        vehicle: 'Toyota Quantum',
        languages: ['Zulu', 'English'],
        criminal_record: false,
        max_passengers: 12,
        gender: 'male',
        race: 'black',
        available_seats: 0,
        profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    {
        id: 3,
        name: 'Fatima Jacobs',
        lat: -33.9122,
        lng: 18.4321,
        status: 'Available',
        schools: ['South Peninsula High'],
        vehicle: 'Nissan Almera',
        languages: ['English'],
        criminal_record: false,
        max_passengers: 4,
        gender: 'female',
        race: 'coloured',
        available_seats: 2,
        profilePic: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
        id: 4,
        name: 'Ahmed Khan',
        lat: -33.9300,
        lng: 18.4500,
        status: 'Available',
        schools: ['Windsor High'],
        vehicle: 'Hyundai H1',
        languages: ['English', 'Arabic'],
        criminal_record: false,
        max_passengers: 8,
        gender: 'male',
        race: 'indian',
        available_seats: 5,
        profilePic: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    {
        id: 5,
        name: 'Sipho Dlamini',
        lat: -33.9400,
        lng: 18.4600,
        status: 'Unavailable',
        schools: ['Livingstone High'],
        vehicle: 'Ford Transit',
        languages: ['Xhosa', 'English'],
        criminal_record: false,
        max_passengers: 10,
        gender: 'male',
        race: 'black',
        available_seats: 0,
        profilePic: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
        id: 6,
        name: 'Nicole Smith',
        lat: -33.9350,
        lng: 18.4250,
        status: 'Available',
        schools: ['Plumstead High'],
        vehicle: 'VW Polo',
        languages: ['English'],
        criminal_record: false,
        max_passengers: 3,
        gender: 'female',
        race: 'white',
        available_seats: 1,
        profilePic: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
        id: 7,
        name: 'Tshepo Moloi',
        lat: -33.9275,
        lng: 18.4350,
        status: 'Available',
        schools: ['Heideveld High'],
        vehicle: 'Mazda 2',
        languages: ['Sotho', 'English'],
        criminal_record: true,
        max_passengers: 4,
        gender: 'male',
        race: 'black',
        available_seats: 2,
        profilePic: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
        id: 8,
        name: 'Zainab Parker',
        lat: -33.9170,
        lng: 18.4190,
        status: 'Unavailable',
        schools: ['Belgravia High'],
        vehicle: 'Chevrolet Aveo',
        languages: ['English', 'Afrikaans'],
        criminal_record: false,
        max_passengers: 4,
        gender: 'female',
        race: 'coloured',
        available_seats: 0,
        profilePic: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
    {
        id: 9,
        name: 'Mohammed Patel',
        lat: -33.9210,
        lng: 18.4270,
        status: 'Available',
        schools: ['Islamia College'],
        vehicle: 'Toyota Corolla',
        languages: ['English', 'Urdu'],
        criminal_record: false,
        max_passengers: 4,
        gender: 'male',
        race: 'indian',
        available_seats: 3,
        profilePic: 'https://randomuser.me/api/portraits/men/9.jpg',
    },
    {
        id: 10,
        name: 'Thandiwe Ndlovu',
        lat: -33.9260,
        lng: 18.4220,
        status: 'Available',
        schools: ['Spine Road High'],
        vehicle: 'Kia Picanto',
        languages: ['Zulu', 'English'],
        criminal_record: false,
        max_passengers: 4,
        gender: 'female',
        race: 'black',
        available_seats: 1,
        profilePic: 'https://randomuser.me/api/portraits/women/10.jpg',
    },
];
export default function MapWithPoints() {
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [map, setMap] = useState(null);
    const [filters, setFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});
    const navigate = useNavigate();
  const [hoveredDriver, setHoveredDriver] = useState(null);

    useEffect(() => {
        if (map && selectedPoint) {
            map.flyTo([selectedPoint.lat, selectedPoint.lng], 13, { duration: 1.5 });
        }
    }, [selectedPoint, map]);

    const handleMessageDriver = () => {
        if (selectedPoint) {
            navigate(`/reviews/${selectedPoint.id}`, { state: { driver: selectedPoint } });
        }
    };

    const filteredPoints = points.filter(point => {
        return Object.entries(appliedFilters).every(([key, value]) => {
            if (!value) return true;
            const pointValue = point[key];
            if (Array.isArray(pointValue)) {
                return pointValue.some(v => v.toString().toLowerCase().includes(value.toLowerCase()));
            }
            return String(pointValue).toLowerCase().includes(value.toLowerCase());
        });
    });

    return (
        <div style={{ padding: "1rem", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <FilterBar 
                filters={filters} 
                setFilters={setFilters} 
                onApply={() => setAppliedFilters(filters)} 
            />

            <div className="container" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <div className="leftColumn" style={{ flex: 1 }}>
                    <MapContainer
                        center={[-33.92, 18.42]}
                        zoom={13}
                        className="mapContainer"
                        style={{ height: 400, borderRadius: 8 }}
                        whenCreated={(mapInstance) => setMap(mapInstance)}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filteredPoints.map((point) => (
                    <Marker
                    key={point.id}
                    position={[point.lat, point.lng]}
                    eventHandlers={{
                        click: () => setSelectedPoint(point),
                        mouseover: () => setHoveredDriver(point),
                        mouseout: () => setHoveredDriver(null),
                    }}
                    >
                    <Tooltip
                        direction="top"
                        offset={[0, -10]}
                        opacity={1}
                        permanent={hoveredDriver?.id === point.id} // only visible while hovered
                    >
                        <DriverCard
                        name={point.name}
                        profilePic={point.profilePic}
                        />
                    </Tooltip>
                    </Marker>


                        ))}
                    </MapContainer>

                    <ul style={{
                        listStyle: "none",
                        padding: 0,
                        marginTop: "1rem",
                        maxHeight: 200,
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        backgroundColor: "#f9f9f9",
                    }}>
                        {filteredPoints.map((point) => (
                            <li
                                key={point.id}
                                onClick={() => setSelectedPoint(point)}
                                style={{
                                    cursor: "pointer",
                                    padding: "0.5rem 1rem",
                                    marginBottom: "0.5rem",
                                    backgroundColor: selectedPoint?.id === point.id ? "#e0f7fa" : "#f5f5f5",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: selectedPoint?.id === point.id ? 700 : 600,
                                    color: selectedPoint?.id === point.id ? "#007acc" : "#444",
                                }}
                            >
                                <img
                                    src={point.profilePic}
                                    alt={point.name}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        marginRight: 12,
                                        objectFit: "cover",
                                        border: "2px solid #007acc",
                                    }}
                                />
                                <div>
                                    <div>{point.name}</div>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 400, color: "#555" }}>
                                        {point.vehicle}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="detailView" style={{
                    flex: 1,
                    border: "1px solid #ccc",
                    padding: "1rem 1.5rem",
                    borderRadius: 8,
                    backgroundColor: "#fdfdfd",
                    minWidth: 280,
                }}>
                    {selectedPoint ? (
                        <>
                            <img
                                src={selectedPoint.profilePic}
                                alt={selectedPoint.name}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "3px solid #000",
                                    marginBottom: "1rem",
                                }}
                            />
                            <h3>{selectedPoint.name}</h3>
                            <p><strong>Driver ID:</strong> {selectedPoint.id}</p>
                            <p><strong>Status:</strong> {selectedPoint.status}</p>
                            <p><strong>Vehicle:</strong> {selectedPoint.vehicle}</p>
                            <p><strong>Schools:</strong> {selectedPoint.schools.join(", ")}</p>
                            <p><strong>Languages:</strong> {selectedPoint.languages.join(", ")}</p>
                            <p><strong>Criminal Record:</strong> {selectedPoint.criminal_record ? "Yes" : "No"}</p>
                            <p><strong>Max Passengers:</strong> {selectedPoint.max_passengers}</p>
                            <p><strong>Available Seats:</strong> {selectedPoint.available_seats}</p>
                            <p><strong>Gender:</strong> {selectedPoint.gender}</p>
                            <p><strong>Race:</strong> {selectedPoint.race}</p>
                            <p><strong>Latitude:</strong> {selectedPoint.lat}</p>
                            <p><strong>Longitude:</strong> {selectedPoint.lng}</p>
                            <button onClick={handleMessageDriver} style={{
                                marginTop: "0.5rem",
                                padding: "8px 16px",
                                borderRadius: 6,
                                border: "none",
                                backgroundColor: "#007acc",
                                color: "#fff",
                                cursor: "pointer"
                            }}>Message Driver</button>
                        </>
                    ) : <p>Select a driver to view details</p>}
                </div>
            </div>
        </div>
    );
}

function FilterBar({ filters, setFilters, onApply }) {
    const handleChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));

    const inputStyle = {
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #ccc",
        fontSize: 14,
        width: 120,
        outline: "none"
    };

    const buttonStyle = {
        padding: "6px 16px",
        borderRadius: 6,
        border: "none",
        backgroundColor: "#000000ff",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14
    };

    const selectStyle = { ...inputStyle };

    // Options for select fields
    const statusOptions = ["", "Available", "Unavailable"];
    const raceOptions = ["", "black", "white", "coloured", "indian"];
    const languageOptions = ["", "English", "Afrikaans", "Zulu", "Xhosa", "Sotho", "Arabic", "Urdu"];

    return (
        <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "flex-start",
            marginBottom: "1rem"
        }}>
            <select
                value={filters.status || ""}
                onChange={e => handleChange("status", e.target.value)}
                style={selectStyle}
            >
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt || "Status"}</option>)}
            </select>

            <select
                value={filters.race || ""}
                onChange={e => handleChange("race", e.target.value)}
                style={selectStyle}
            >
                {raceOptions.map(opt => <option key={opt} value={opt}>{opt || "Race"}</option>)}
            </select>

            <select
                value={filters.languages || ""}
                onChange={e => handleChange("languages", e.target.value)}
                style={selectStyle}
            >
                {languageOptions.map(opt => <option key={opt} value={opt}>{opt || "Languages"}</option>)}
            </select>

            {[
                "vehicle", "schools", "criminal_record",
                "max_passengers", "available_seats", "gender", "lat", "lng"
            ].map(field => (
                <input
                    key={field}
                    type="text"
                    placeholder={field.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    value={filters[field] || ""}
                    onChange={e => handleChange(field, e.target.value)}
                    style={inputStyle}
                />
            ))}

            <button onClick={onApply} style={buttonStyle}>Filter</button>
        </div>
    );
}

function DriverCard({ name, profilePic, onClick, selected }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
        backgroundColor: selected ? "#e0f7fa" : "#f5f5f5",
        border: selected ? "2px solid #007acc" : "2px solid transparent",
        transition: "all 0.2s ease",
      }}
    >
      <img
        src={profilePic}
        alt={name}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #007acc",
        }}
      />
      <span style={{ fontWeight: 600, color: "#333" }}>{name}</span>
    </div>
  );
}

