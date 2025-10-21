import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "../assets/styles/Chat.css";

const ChatPage = () => {
  const [driverMessage, setDriverMessage] = useState("");
  const [parentMessage, setParentMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const parentEndRef = useRef(null);
  const driverEndRef = useRef(null);

  const driverId = "driver1";
  const parentId = "parent1";
  const chatId = [driverId, parentId].sort().join("_");

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (parentEndRef.current) {
      parentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (driverEndRef.current) {
      driverEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendParentMessage = async () => {
    if (!parentMessage.trim()) return;
    const message = parentMessage;
    setParentMessage("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: message,
      senderId: parentId,
      timestamp: serverTimestamp(),
    });
  };

  const sendDriverMessage = async () => {
    if (!driverMessage.trim()) return;
    const message = driverMessage;
    setDriverMessage("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: message,
      senderId: driverId,
      timestamp: serverTimestamp(),
    });
  };

  const parentViewMessages = messages.map((msg) => ({
    ...msg,
    type: msg.senderId === parentId ? "sent" : "received",
  }));

  const driverViewMessages = messages.map((msg) => ({
    ...msg,
    type: msg.senderId === driverId ? "sent" : "received",
  }));

  return (
    <div className="chat-wrapper split">
      {/* Parent Box */}
      <div className="chat-container">
        <div className="chat-header">Parent Chat</div>
        <div className="chat-box">
          {parentViewMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={parentEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Parent type a message..."
            value={parentMessage}
            onChange={(e) => setParentMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendParentMessage();
              }
            }}
          />
          <button type="button" onClick={sendParentMessage}>
            Send
          </button>
        </div>
      </div>

      {/* Driver Box */}
      <div className="chat-container">
        <div className="chat-header">Driver Chat</div>
        <div className="chat-box">
          {driverViewMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={driverEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Driver type a message..."
            value={driverMessage}
            onChange={(e) => setDriverMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendDriverMessage();
              }
            }}
          />
          <button type="button" onClick={sendDriverMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
