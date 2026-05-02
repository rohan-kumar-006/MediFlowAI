import { useState, useEffect } from "react";
import "./EmergencySignal.css";

export default function EmergencySignal({ isEmergency, keywords = [] }) {
  const [visible, setVisible] = useState(isEmergency);

  useEffect(() => {
    setVisible(isEmergency);
  }, [isEmergency]);

  if (!visible) return null;

  return (
    <div className="emergency-signal-container">
      <div className="emergency-signal">
        <div className="emergency-pulse">
          <svg
            className="emergency-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
        </div>

        <div className="emergency-content">
          <h3 className="emergency-title">🚨 EMERGENCY DETECTED</h3>
          <p className="emergency-message">
            Your symptoms indicate a potentially serious medical condition. Please:
          </p>
          <ul className="emergency-steps">
            <li>📞 Call Emergency Services (911/112)</li>
            <li>🏥 Go to the nearest hospital immediately</li>
            <li>⚠️ Do not delay - seek immediate medical attention</li>
          </ul>

          {keywords.length > 0 && (
            <div className="emergency-keywords">
              <p className="keywords-label">Keywords Detected:</p>
              <div className="keywords-list">
                {keywords.map((keyword, idx) => (
                  <span key={idx} className="keyword-badge">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            className="emergency-acknowledge"
            onClick={() => setVisible(false)}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
