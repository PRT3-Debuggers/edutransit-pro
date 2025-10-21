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
  const messagesEndRef = useRef(null);

  const driverId = "driver1";
  const parentId = "parent1";
  const chatId = [driverId, parentId].sort().join("_");

  // Auto-scroll when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Listen for new messages
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

  // Parent send
  const sendParentMessage = async (e) => {
    e.preventDefault();
    if (!parentMessage.trim()) return;

    const message = parentMessage;
    setParentMessage(""); // instantly clear input box for smoother UX

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: message,
      senderId: parentId,
      timestamp: serverTimestamp(),
    });
  };

  // Driver send
  const sendDriverMessage = async (e) => {
    e.preventDefault();
    if (!driverMessage.trim()) return;

    const message = driverMessage;
    setDriverMessage(""); // instantly clear input box

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
      {/* Parent Box (Left) */}
      <div className="chat-container">
        <div className="chat-header">Parent Chat</div>
        <div className="chat-box">
          {parentViewMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendParentMessage} className="chat-input">
          <input
            type="text"
            placeholder="Parent type a message..."
            value={parentMessage}
            onChange={(e) => setParentMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>

      {/* Driver Box (Right) */}
      <div className="chat-container">
        <div className="chat-header">Driver Chat</div>
        <div className="chat-box">
          {driverViewMessages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendDriverMessage} className="chat-input">
          <input
            type="text"
            placeholder="Driver type a message..."
            value={driverMessage}
            onChange={(e) => setDriverMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
