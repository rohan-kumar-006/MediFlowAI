import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import run from "../gemini";
import { datacontext } from "./dataContext";


function UserContext({ children }) {
  const isListening = useRef(false);
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyKeywords, setEmergencyKeywords] = useState([]);
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;

    if (isListening.current && recognitionRef.current) {
      recognitionRef.current.stop();
      setStatus("Speaking");
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = "en-GB";

    utterance.onend = () => {
      if (isListening.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setStatus("Listening");
        } catch (err) {
          console.warn("Failed to restart recognition:", err);
          setStatus("Idle");
        }
      } else {
        setStatus("Idle");
      }
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const checkEmergency = useCallback(async (userText) => {
    try {
      const response = await fetch(`${BACKEND_URL}/check-emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      const data = await response.json();
      if (response.ok && data.is_emergency) {
        setIsEmergency(true);
        setEmergencyKeywords(data.keywords_detected);
        // Don't process further if it's an emergency
        return true;
      }
      return false;
    } catch (error) {
      console.error("Emergency check failed:", error);
      return false;
    }
  }, [BACKEND_URL]);

  const aiResponse = useCallback(async (prompt) => {
    setMessages((prev) => [...prev, { sender: "Patient", text: prompt }]);

    // Check for emergency first
    const isEmergencyCase = await checkEmergency(prompt);
    
    if (isEmergencyCase) {
      const emergencyResponse = "EMERGENCY DETECTED: Please call emergency services immediately! Hang up and call 911 or your local emergency number.";
      setMessages((prev) => [...prev, { sender: "Assistant", text: emergencyResponse }]);
      speak(emergencyResponse);
      return;
    }

    const text = await run(prompt);
    const cleanedText = text.replace(/^Agent:\s*/i, "").trim();

    setMessages((prev) => [...prev, { sender: "Assistant", text: cleanedText }]);
    speak(cleanedText);
  }, [checkEmergency, speak]);

  useEffect(() => {
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "function") {
      console.warn("SpeechRecognition API not supported in this browser.");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("Listening");
    };

    recognition.onresult = (event) => {
      const currentIndex = event.resultIndex;
      const transcript = event.results[currentIndex][0].transcript;
      aiResponse(transcript);
    };

    recognition.onend = () => {
      if (isListening.current) {
        try {
          recognition.start();
        } catch (err) {
          console.warn("Failed to restart recognition:", err);
        }
      } else {
        setStatus("Idle");
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setStatus("Idle");
    };

    recognitionRef.current = recognition;

    return () => {
      isListening.current = false;
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // Ignore browser-specific cleanup errors.
      }
      window.speechSynthesis?.cancel?.();
      recognitionRef.current = null;
    };
  }, [aiResponse]);

  function connect() {
    if (!recognitionRef.current) {
      console.warn("Cannot start microphone: SpeechRecognition unavailable.");
      return;
    }

    isListening.current = true;
    try {
      recognitionRef.current.start();
      setStatus("Listening");
    } catch (err) {
      console.warn("Failed to start recognition:", err);
    }
  }

  async function disconnect() {
    isListening.current = false;
    recognitionRef.current?.stop?.();
    window.speechSynthesis?.cancel?.();
    setStatus("Idle");

    const patientMessages = messages
      .filter((msg) => msg.sender === "Patient")
      .map((msg) => msg.text)
      .join(" ");

    const symptomPhrases = patientMessages
      .split(/[.?!]/)
      .map((phrase) => phrase.trim())
      .filter(Boolean);

    if (symptomPhrases.length === 0) {
      localStorage.setItem(
        "last_recommendation",
        JSON.stringify({
          phrases: [],
          normalized_symptoms: [],
          specialists: [],
          recommended_specialists: [],
          doctors: [],
        })
      );
      navigate("/recommendation", {
        state: {
          phrases: [],
          normalized_symptoms: [],
          specialists: [],
          recommended_specialists: [],
          doctors: [],
        },
      });
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/run_langgraph`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrases: symptomPhrases }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.detail || "Failed to get recommendations");
      }

      localStorage.setItem("last_recommendation", JSON.stringify(data));
      navigate("/recommendation", { state: data });
    } catch (error) {
      console.error("Error during LangGraph execution:", error);
      localStorage.setItem(
        "last_recommendation",
        JSON.stringify({
          phrases: symptomPhrases,
          normalized_symptoms: [],
          specialists: [],
          recommended_specialists: [],
          doctors: [],
        })
      );
      navigate("/recommendation", {
        state: {
          phrases: symptomPhrases,
          normalized_symptoms: [],
          specialists: [],
          recommended_specialists: [],
          doctors: [],
        },
      });
    }
  }

  return (
    <datacontext.Provider value={{ 
      connect, 
      disconnect, 
      messages, 
      status,
      isEmergency,
      emergencyKeywords,
      setIsEmergency,
    }}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
