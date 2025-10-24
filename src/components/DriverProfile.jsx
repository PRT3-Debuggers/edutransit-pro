import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, getFirestore, setDoc, doc } from "firebase/firestore";


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
        const fetchUserData = async () => {
            const driver = auth.currentUser;

            if (!driver) {
                console.error("No driver user found");
                navigate("/login");
                return;
            }

    try {
        const db = getFirestore();
        const q = query(
            collection(db, "user-data"),
            where("emailAddress","==", driver.email)
        );

        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.error("No user data found for driver");
            navigate("/login");
            return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log("Driver Profile: user data found", userData);

        if (userData.role !== "Driver") {
            console.error("Driver Profile: not found");
            navigate("/login");
            return;
        }

        setUserData(userData);
        setLoading(false);
    }   catch (error) {
        console.error("Error fetching user data: ", error);
        navigate("/login");
        }
    };    

    fetchUserData();
}, [auth, navigate]);

    // useEffect(() => {
        // console.log("Driver Profile: checking user data");
        // const fetchUserData = sessionStorage.getItem("user-data");

        // if (fetchUserData) {
            // try {
            // const parsedData = JSON.parse(fetchUserData);
            // console.log("Driver Profile: user data found", parsedData);

        // if (parsedData.role !== "Driver") {
            // console.error("Driver Profile: not found");
            // navigate("/login");
            // return;
        // }    

    //     console.log("Driver Profile: user is a Driver, loading profile");
    //     setUserData(parsedData);
    //     setLoading(false);
    //         } catch (error) {
    //             console.error("Error parsing data: ", error);
    //             navigate("/login");
    //         }
    //     } else {
    //         console.error("No user data found");
    //         navigate("/login");
    //     }

    //     setLoading(false);
    // }, [navigate]);

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
            await setDoc(doc(db, "driver-profiles", driver.uid),{
                uid: driver.uid,
                email: driver.email,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                maxPassengers,
                licenseNumber,
                vehicleType,
                vehiclePlate,
                criminalRecord,
                experience,
            });

            console.log("Driver profile saved successfully");
            navigate("/driver-dashboard");
        }   catch (error) {
            console.error("Error saving driver profile: ", error);
            navigate("/login");
        }
    }


if (loading) {
    return <div>Loading...</div>;
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
    },
    card: {
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "20px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "500px",
    },
    label: {
        display: "block",
        marginBottom: "0.3rem",
        fontWeight: "500",
        color: "#333",    
    },
    heading: {
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "1.5rem",
        color: "#333",
    },
    checkboxLabel: {
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        color: "#333",
        gap: "0.5rem",
    },
    inputText:{
        width: "100%",
        padding: "0.8rem",
        marginBottom: "1rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
        fontSize: "1rem",
        outline: "none",
    },
    button:{
        width: "100%",
        padding: "0.8rem",
        backgroundColor: "#333",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "0.3s"
    },
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
    <div style = {styles.container}>
        <div style = {styles.card}>
            <h2 style = {styles.heading}>Driver Profile</h2>
            {/* <form style={styles.formArea}> */}
            {/* <h1 style = {styles.heading}>Driver Profile</h1> */}

            {/* {userData && ( */}
            {/* <p style = {styles.subHeading}> */}
            {/* Welcome, {userData.firstName} {userData.lastName}! */}
            {/* </p> */}
            {/* )} */}

            <label style = {styles.label}>Max Passengers</label>
            <input
                type="number"
                placeholder="6"
                value={maxPassengers}
                onChange={(e) => setMaxPassengers(e.target.value)}
                style = {styles.inputText}
            />

            <label style = {styles.label}>License Number</label>
            <input
                type="text"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                style = {styles.inputText}
            />

            <label style = {styles.label}>Vehicle Type</label>
            <input
                type="text"
                placeholder="Sedan, SUV, Van, etc."
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style = {styles.inputText}
            />

            <label style = {styles.label}>Vehicle Plate</label>
            <input
                type="text"
                placeholder="CAA123456  "
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                style = {styles.inputText}
            />

            <label style = {styles.checkboxLabel}>
            <input
                type="checkbox"
                placeholder="Check if a criminal record exists"
                checked={criminalRecord}
                onChange={(e) => setCriminalRecord(e.target.checked)}
            />
            Criminal Record
            </label>

            <label style = {styles.label}>Experience (years)</label>
            <input
                type="number"
                placeholder="Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                style = {styles.inputText}
            />
            {/* <button onClick={handleSaveDriver}>Save Driver Profile</button> */}
            <button
                style = {styles.button}
                onClick = {handleSaveDriver}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
                Save Driver Profile
            </button>
        </div>
    </div>
    );
};