import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

export default function DriverDashboard() {
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();
    
    const [driverData, setDriverData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDriverData = async () => {
            const user = auth.currentUser;
            if(!user) {
                navigate("/login");
                return;
            }
            
            try {
                const docRef = doc(db, "driver-profiles", user.uid);
                const docSnap = await getDoc(docRef);

                if(docSnap.exists()) {
                    setDriverData(docSnap.data());
                } else {
                    console.error("No Driver Profile found");
                    navigate("/driver-profile");
                }
            } catch (error) {
                console.error("Error loading dashboard: ", error);
            } finally {
                setLoading(false);
            }
    };

        fetchDriverData();
    }, [auth, db, navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    if(loading) return <div>Loading Dashboard</div>;
    if(!driverData) return <div>No Driver Data Available</div>;

    const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f6f8",
      padding: "2rem",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
      padding: "2rem",
      maxWidth: "600px",
      width: "100%",
    },
    heading: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#000",
      textAlign: "center",
      marginBottom: "1.5rem",
    },
    infoRow: {
      marginBottom: "0.8rem",
      fontSize: "1rem",
      color: "#333",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "2rem",
    },
    button: {
      padding: "0.8rem 1.5rem",
      backgroundColor: "#000",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      transition: "0.3s",
    },
  };

    return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>
          Welcome, {driverData.firstName} {driverData.lastName} 
        </h2>

        <div>
          <p style={styles.infoRow}><b>Email:</b> {driverData.email}</p>
          <p style={styles.infoRow}><b>Vehicle Type:</b> {driverData.vehicleType}</p>
          <p style={styles.infoRow}><b>Vehicle Plate:</b> {driverData.vehiclePlate}</p>
          <p style={styles.infoRow}><b>Max Passengers:</b> {driverData.maxPassengers}</p>
          <p style={styles.infoRow}><b>License Number:</b> {driverData.licenseNumber}</p>
          <p style={styles.infoRow}><b>Experience:</b> {driverData.experience} years</p>
          <p style={styles.infoRow}>
            <b>Criminal Record:</b> {driverData.criminalRecord ? "Yes" : "No"}
          </p>
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={() => navigate("/driver-profile")}>
            Update Profile
          </button>
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );

}

