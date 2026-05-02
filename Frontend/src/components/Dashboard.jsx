import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");
  
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    async function loadDashboard() {
      try {
        const patientRes = await fetch(`${BACKEND_URL}/patient-details/${userId}`);
        const patientData = await patientRes.json();
        if (!patientRes.ok) throw new Error(patientData?.detail);

        const historyRes = await fetch(`${BACKEND_URL}/medical-history/${userId}`);
        const historyData = await historyRes.json();
        if (!historyRes.ok) throw new Error(historyData?.detail);

        setPatient(patientData);
        setHistory(historyData);

        if (patientData?.id) {
          console.log(patientData)
          localStorage.setItem("patient_id", patientData.id);
        }
      } catch (err) {
        setError(err.message);
      }
    }

    loadDashboard();
  }, [navigate, userId]);

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-400 text-xl">
        {error}
      </div>
    );

  if (!patient || !history)
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">

      {/* Card */}
      <div
        className="w-full max-w-5xl p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl text-white"
        style={{
          animation: "fadeIn 0.8s ease-out"
        }}
      >

        {/* Header */}
        <h2 className="text-3xl font-bold mb-6">
          👋 Welcome, <span className="text-cyan-400">{patient.name}</span>
        </h2>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            ["DOB", patient.date_of_birth],
            ["Gender", patient.gender],
            ["Contact", patient.contact_number],
            ["MRN", patient.medical_record_number],
            ["Blood", patient.blood_group],
            ["Status", patient.marital_status],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 transition hover:scale-[1.02]"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">
          🧾 Medical History
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            ["Diagnoses", history.past_diagnoses],
            ["Surgeries", history.surgeries],
            ["Admissions", history.hospital_admissions],
            ["Immunization", history.immunization_records],
            ["Family History", history.family_medical_history],
            ["Lifestyle", history.lifestyle_factors],
          ].map(([label, value], i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 transition hover:scale-[1.02]"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/assistant")}
          className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition font-semibold shadow-lg"
        >
          🚀 Start AI Assistant
        </button>
      </div>

      {/* Inline animation (no config needed) */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default PatientDashboard;