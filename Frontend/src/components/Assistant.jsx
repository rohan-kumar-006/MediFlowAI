import { useContext } from "react";

import va from "../assets/assistant.jpg";
import { datacontext } from "../context/dataContext";
import "./Assistant.css";


export default function Assistant() {
  const { connect, disconnect, messages, status } = useContext(datacontext);

  return (
    <div className="assistant-wrapper">
      <div className="left-panel">
        <div className="assistant-header">AI Medical Assistant</div>

        <div className="assistant-chat">
          <img src={va} alt="Medical Assistant" className="assistant-image" />
          <p className="assistant-status">Status: {status}</p>
        </div>

        <div className="assistant-footer">
          <button onClick={connect} className="btn-connect">Connect</button>
          <button onClick={disconnect} className="btn-disconnect">Disconnect</button>
        </div>
      </div>

      <div className="right-panel">
        <div className="messages-container">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={`${message.sender}-${index}`} className={`message ${message.sender.toLowerCase()}`}>
                <strong>{message.sender}: </strong>
                <span>{message.text}</span>
              </div>
            ))
          ) : (
            <p>No messages yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
