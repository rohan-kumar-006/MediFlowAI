import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import run from "../gemini";
import { datacontext } from "./dataContext";


function UserContext({ children }) {
  const isListening = useRef(false);
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");
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

  const aiResponse = useCallback(async (prompt) => {
    setMessages((prev) => [...prev, { sender: "Patient", text: prompt }]);

    const text = await run(prompt);
    const cleanedText = text.replace(/^Agent:\s*/i, "").trim();

    setMessages((prev) => [...prev, { sender: "Assistant", text: cleanedText }]);
    speak(cleanedText);
  }, [speak]);

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
    <datacontext.Provider value={{ connect, disconnect, messages, status }}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
