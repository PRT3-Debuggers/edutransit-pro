import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import {getFirestore, setDoc, doc } from "firebase/firestore";
import { use, useEffect, useState } from "react";

export default function DriverProfile(){

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [parentEmail, setParentEmail] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [maxPassengers, setMaxPassengers] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [vehicleType, setVehicleType] = useState("");
    const [vehiclePlate, setVehiclePlate] = useState("");
    const [criminalRecord, setCriminalRecord] = useState("");
    const [experience, setExperience] = useState("");


    
    // save driver info
    // const handleSaveProfile = async (event) => {
        // event.preventDefault();
    // }

    useEffect(() => {
        console.log("Driver Profile: checking user data");
        const fetchUserData = sessionStorage.getItem("user-data");

        if (fetchUserData) {
            try {
            const parsedData = JSON.parse(fetchUserData);
            console.log("Driver Profile: user data found", parsedData);

        if (parsedData.role !== "Driver") {
            console.error("Driver Profile: not found");
            navigate("/login");
            return;
        }    

        console.log("Driver Profile: user is a Driver, loading profile");
        setUserData(parsedData);
        setLoading(false);
            } catch (error) {
                console.error("Error parsing data: ", error);
                navigate("/login");
            }
        } else {
            console.error("No user data found");
            navigate("/login");
        }

        setLoading(false);
    }, [navigate]);

    // alt. method
    // const handleSave = (e) => {
    //     const {name, value} = e.target;
    //     setDriverData((prevData) => ({...prevData, [name]: value}));
    // };

    // save driver profile to firestore
    const handleSaveDriver = async () => {

        const driver = auth.currentUser;
        if (!driver) {
            console.error("No driver user found");
            return;
        }

        try {
            await setDoc(doc(db, "driver-profiles", userData.uid),{
                maxPassengers,
                licenseNumber,
                vehicleType,
                vehiclePlate,
                criminalRecord,
                experience,
            });

            console.log("Driver profile saved successfully");
            navigate("/dashboard");
        }   catch (error) {
            console.error("Error saving driver profile: ", error);
            navigate("/login");
        }
    }
};

if (loading) {
    return <div>Loading...</div>;
}

const styles = {
    formArea: {
        width: "100%",
      maxWidth: 400,
      margin: "5vh auto",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    heading: {
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: "#000",
    },
    inputText: {
      width: "100%",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "50px",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      backgroundColor: "#000000ff",
      color: "#fff",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
  };
    

return (
    <div>
        <form style={styles.formArea}>
        <h1 style = {styles.heading}>Driver Profile</h1>

        {userData && (
            <p style = {styles.subHeading}>
                Welcome, {userData.firstName} {userData.lastName}!
            </p>
            )}

        <input
            type="number"
            placeholder="Max Passengers"
            value={maxPassengers}
            onChange={(e) => setMaxPassengers(e.target.value)}
            style = {styles.inputText}
        />
        <input
            type="text"
            placeholder="License Number"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            style = {styles.inputText}
        />
        <input
            type="text"
            placeholder="Vehicle Type"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            style = {styles.inputText}
        />
        <input
            type="text"
            placeholder="Vehicle Plate"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            style = {styles.inputText}
        />
        <input
            type="text"
            placeholder="Criminal Record"
            value={criminalRecord}
            onChange={(e) => setCriminalRecord(e.target.value)}
            style = {styles.inputText}
        />
        <input
            type="text"
            placeholder="Experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            style = {styles.inputText}
        />
        <button onClick={handleSaveDriver}>Save Driver Profile</button>
        </form>
    </div>
)