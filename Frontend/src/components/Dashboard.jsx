import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";


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
        const patientResponse = await fetch(`${BACKEND_URL}/patient-details/${userId}`);
        const patientData = await patientResponse.json();
        if (!patientResponse.ok) {
          throw new Error(patientData?.detail || "Failed to fetch patient details");
        }

        const historyResponse = await fetch(`${BACKEND_URL}/medical-history/${userId}`);
        const historyData = await historyResponse.json();
        if (!historyResponse.ok) {
          throw new Error(historyData?.detail || "Failed to fetch medical history");
        }

        setPatient(patientData);
        setHistory(historyData);
        if (patientData?.id) {
          localStorage.setItem("patient_id", patientData.id);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      }
    }

    loadDashboard();
  }, [navigate, userId]);

  if (error) return <div className="error">Error: {error}</div>;
  if (!patient || !history) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {patient.name}</h2>
      <p><strong>Date of Birth:</strong> {patient.date_of_birth}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>Contact Number:</strong> {patient.contact_number}</p>
      <p><strong>Medical Record Number:</strong> {patient.medical_record_number}</p>
      <p><strong>Blood Group:</strong> {patient.blood_group}</p>
      <p><strong>Marital Status:</strong> {patient.marital_status}</p>

      <h3>Medical History</h3>
      <p><strong>Past Diagnoses:</strong> {history.past_diagnoses}</p>
      <p><strong>Surgeries:</strong> {history.surgeries}</p>
      <p><strong>Hospital Admissions:</strong> {history.hospital_admissions}</p>
      <p><strong>Immunization Records:</strong> {history.immunization_records}</p>
      <p><strong>Family Medical History:</strong> {history.family_medical_history}</p>
      <p><strong>Lifestyle Factors:</strong> {history.lifestyle_factors}</p>

      <button className="assistant-button" onClick={() => navigate("/assistant")}>
        Start AI Assistant
      </button>
    </div>
  );
};

export default PatientDashboard;
