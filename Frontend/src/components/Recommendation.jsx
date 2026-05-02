import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import "./Recommendation.css";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";


export default function Recommendation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(location.state || null);

  const hasUsefulResults = (value) => {
    if (!value) return false;
    return (value.recommended_specialists?.length || 0) > 0 || (value.doctors?.length || 0) > 0;
  };

  useEffect(() => {
    if (hasUsefulResults(payload)) return;

    const stored = localStorage.getItem("last_recommendation");
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (hasUsefulResults(parsed)) {
        setPayload(parsed);
      }
    } catch {
      localStorage.removeItem("last_recommendation");
    }
  }, [payload]);

  const { recommended_specialists = [], doctors = [] } = payload || {};

  // Deduplicate doctors by doctor_id
  const uniqueDoctors = useMemo(() => {
    const seen = new Map();
    const unique = [];
    
    doctors.forEach((doctor) => {
      // Only keep the first occurrence of each doctor
      if (!seen.has(doctor.doctor_id)) {
        seen.set(doctor.doctor_id, true);
        unique.push(doctor);
      }
    });
    
    return unique;
  }, [doctors]);

  const handlePayment = (doctor) => {
    // Navigate to fake payment page with doctor details
    navigate("/payment", {
      state: {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        slot_id: doctor.slot_id,
        fees: doctor.fees,
        next_available_date: doctor.next_available_date,
        start_time: doctor.start_time,
      },
    });
  };

  function formatDateTime(dateString, timeString) {
    if (!dateString || !timeString || dateString === "Not available" || timeString === "N/A") {
      return "Not available";
    }

    const date = new Date(`${dateString}T${timeString}`);
    if (Number.isNaN(date.getTime())) return "Not available";

    const dayOfWeek = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dateFormatted = date.toLocaleDateString("en-GB");
    const timeFormatted = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${dayOfWeek} ${dateFormatted} at ${timeFormatted}`;
  }

  return (
    <div className="recommendation-container">
      <h2 className="recommendation-heading">Consult Recommendation</h2>

      {recommended_specialists.length > 0 ? (
        <>
          <p className="recommendation-text">
            Based on your symptoms, we recommend consulting one of the following specialists:
          </p>
          <ul className="specialist-list">
            {recommended_specialists.map((specialist) => (
              <li key={specialist}>{specialist}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="warning-text">No specialist recommendations available.</p>
      )}

      {uniqueDoctors.length > 0 ? (
        <div className="doctor-card-container">
          {uniqueDoctors.map((doctor) => (
            <div className="doctor-card" key={`${doctor.doctor_id}-${doctor.slot_id}`}>
              <div className="doctor-info">
                <p className="doctor-name">{doctor.name}</p>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Hospital:</strong> {doctor.hospital}</p>
                <p><strong>Rating:</strong> {doctor.rating} / 5</p>
                <p><strong>Fee:</strong> Rs. {doctor.fees}</p>
                <p><strong>Next Slot:</strong> {formatDateTime(doctor.next_available_date, doctor.start_time)}</p>
              </div>
              <div className="doctor-actions">
                <button className="book-btn" onClick={() => handlePayment(doctor)}>
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="warning-text">No doctors available for the selected specialists.</p>
      )}
    </div>
  );
}
