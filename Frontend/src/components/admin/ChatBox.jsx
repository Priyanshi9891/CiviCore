import React, { useEffect, useState } from "react";
import API from "../../services/api";

const ChatBox = ({ complaintId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, [complaintId]);

  const fetchMessages = async () => {
    const res = await API.get(`/chat/${complaintId}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text) return;

    await API.post("/chat/send", {
      complaintId,
      message: text
    });

    setText("");
    fetchMessages();
  };

  return (
    <div className="card shadow p-3 mt-3">
      <h6>Chat</h6>

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {messages.map((m, index) => (
          <div key={index}>
            <b>{m.sender.name}:</b> {m.message}
          </div>
        ))}
      </div>

      <div className="d-flex mt-2">
        <input
          className="form-control me-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;