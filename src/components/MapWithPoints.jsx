import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/styles/MapWithPoints.css";

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

    useEffect(() => {
        if (map && selectedPoint) {
            map.flyTo([selectedPoint.lat, selectedPoint.lng], 13, {
                duration: 1.5,
            });
        }
    }, [selectedPoint, map]);

    const handleMessageDriver = (e)=>{
        e.preventDefault()
    }

    return (
        <div className="container">
            <div className="leftColumn">
                <MapContainer
                    center={[-33.92, 18.42]}
                    zoom={13}
                    className="mapContainer"
                    whenCreated={(mapInstance) => setMap(mapInstance)}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {points.map((point) => (
                        <Marker
                            key={point.id}
                            position={[point.lat, point.lng]}
                            eventHandlers={{ click: () => setSelectedPoint(point) }}
                        >
                            <Popup>{point.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* List below map */}
                <ul className="pointsList">
                    {points.map((point) => (
                        <li
                            key={point.id}
                            onClick={() => setSelectedPoint(point)}
                            className={`pointItem ${
                                selectedPoint?.id === point.id ? "selected" : ""
                            }`}
                        >
                            <img
                                src={point.profilePic}
                                alt={point.name}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    marginRight: 12,
                                    verticalAlign: "middle",
                                    objectFit: "cover",
                                    border: "2px solid #007acc",
                                }}
                            />
                            <span style={{ verticalAlign: "middle", fontWeight: "600" }}>
                {point.name}
              </span>
                            <br />
                            <span className="pointVehicle">{point.vehicle}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Detail view */}
            <div className="detailView">
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
                                border: "3px solid",
                                marginBottom: "1rem",
                            }}
                        />
                        <h3>{selectedPoint.name}</h3>
                        <p>
                            <strong>Driver ID:</strong> {selectedPoint.id}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedPoint.status}
                        </p>
                        <p>
                            <strong>Vehicle:</strong> {selectedPoint.vehicle}
                        </p>
                        <p>
                            <strong>Schools:</strong> {selectedPoint.schools.join(", ")}
                        </p>
                        <p>
                            <strong>Languages:</strong> {selectedPoint.languages.join(", ")}
                        </p>
                        <p>
                            <strong>Criminal Record:</strong>{" "}
                            {selectedPoint.criminal_record ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Max Passengers:</strong> {selectedPoint.max_passengers}
                        </p>
                        <p>
                            <strong>Available Seats:</strong> {selectedPoint.available_seats}
                        </p>
                        <p>
                            <strong>Gender:</strong> {selectedPoint.gender}
                        </p>
                        <p>
                            <strong>Race:</strong> {selectedPoint.race}
                        </p>
                        <p>
                            <strong>Latitude:</strong> {selectedPoint.lat}
                        </p>
                        <p>
                            <strong>Longitude:</strong> {selectedPoint.lng}
                        </p>
                        <input
                            type={"submit"}
                            value={"Message Driver"}
                            onClick={handleMessageDriver}
                        />
                    </>
                ) : (
                    <p>Select a driver to view details</p>
                )}
            </div>
        </div>
    );
}
