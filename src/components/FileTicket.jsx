import React, { useState, useEffect } from "react";
import {saveDoc} from "../firebase/firebase.js";
import { useNavigate } from "react-router-dom";

const FileTicket = () => {
  // Initialize from sessionStorage if available
  const storedUser = JSON.parse(sessionStorage.getItem("userData")) || {};
   const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState(storedUser.firstName || "");
  const [lastName, setLastName] = useState(storedUser.lastName || "");
  const [useremail, setUseremail] = useState(storedUser.emailAddress || "");
  const [userId, setUserId] = useState(storedUser.id || "");

  // Update state if sessionStorage changes after mount
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("userData"));
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setUseremail(userData.emailAddress || "");
      setUserId(userData.id || "");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = JSON.parse(sessionStorage.getItem("userData"));

    // Submit ticket payload
    const ticketData = {
      ...form,
      fname: userData[0].firstName,
      lname: userData[0].lastName,
      email: userData[0].emailAddress,
      uid: userData[0].id,
    };

    console.log("Ticket submitted:", ticketData);

    try {
      saveDoc(ticketData,"tickets");
      alert("Ticket submitted successfully!");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      alert("Failed to submit ticket. Please try again.");
    }

    setSubmitted(true);
    navigate('/finddriver');
  };

  // Black-and-white (mono) styles
  const monoStyles = {
    container: { maxWidth: 500, margin: "2rem auto", fontFamily: "monospace", color: "#000" },
    input: { width: "100%", padding: 8, border: "1px solid #000", backgroundColor: "#fff", color: "#000" },
    label: { display: "block", marginBottom: 8 },
    button: { padding: "8px 16px", border: "1px solid #000", backgroundColor: "#fff", color: "#000", cursor: "pointer" },
    heading: { textAlign: "center" },
  };

  if (submitted) {
    return (
      <div style={monoStyles.container}>
        <h2 style={monoStyles.heading}>Ticket Submitted</h2>
        <p>Thank you for filing your ticket. We will get back to you soon.</p>
      </div>
    );
  }

  return (
    <div style={monoStyles.container}>
      <h2 style={monoStyles.heading}>File a Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={monoStyles.label}>
            Subject<br />
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              style={monoStyles.input}
            />
          </label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={monoStyles.label}>
            Description<br />
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              style={monoStyles.input}
            />
          </label>
        </div>
        <button type="submit" style={monoStyles.button}>
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default FileTicket;
