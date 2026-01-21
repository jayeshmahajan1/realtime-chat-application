import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, { message: data.message }]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("connect");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("send_message", { message });
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💬 Live Chat</h2>

      <div style={{ border: "1px solid #ccc", padding: "10px", height: "200px", overflowY: "auto" }}>
        {chat.map((msg, i) => (
          <div key={i}>{msg.message}</div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
