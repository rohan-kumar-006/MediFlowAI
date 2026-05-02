import { useContext } from "react";
import { datacontext } from "../context/dataContext";
import EmergencySignal from "./EmergencySignal";
import va from "../assets/assistant.jpg";

const Assistant = () => {
  const { connect, disconnect, messages, status, isEmergency, emergencyKeywords, setIsEmergency } = useContext(datacontext);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      {/* Emergency Signal */}
      {isEmergency && (
        <EmergencySignal 
          isEmergency={isEmergency} 
          keywords={emergencyKeywords}
        />
      )}

      {/* LEFT PANEL */}
      <div className="w-1/3 p-6 flex flex-col justify-between border-r border-white/10">

        <div>
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">
            🤖 AI Medical Assistant
          </h2>

          <div className="flex flex-col items-center gap-4">

            {/* Assistant Image */}
            <div className="relative">
              <img
                src={va}
                alt="assistant"
                className="w-40 h-40 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
              />

              {/* Pulse animation when connected */}
              {status === "connected" && (
                <span className="absolute inset-0 rounded-full border-4 border-cyan-400 animate-ping opacity-40"></span>
              )}
            </div>

            {/* Status */}
            <p className="text-sm text-gray-300">
              Status: <span className="text-cyan-400 font-semibold">{status}</span>
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={connect}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition"
          >
            Connect
          </button>

          <button
            onClick={disconnect}
            className="flex-1 py-2 rounded-xl bg-red-500 hover:scale-105 transition"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-2/3 p-6 flex flex-col">

        <div className="flex-1 overflow-y-auto space-y-3">

          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs p-3 rounded-xl animate-fadeIn ${
                  msg.sender === "User"
                    ? "ml-auto bg-cyan-500 text-black"
                    : "bg-white/10 border border-white/20"
                }`}
              >
                <p className="text-xs opacity-70">{msg.sender}</p>
                <p>{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No messages yet
            </div>
          )}

        </div>
      </div>

      {/* Inline animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default Assistant;