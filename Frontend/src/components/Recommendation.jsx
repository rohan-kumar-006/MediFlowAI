import { useLocation, useNavigate } from "react-router-dom";

import "./Recommendation.css";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";


export default function Recommendation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommended_specialists = [], doctors = [] } = location.state || {};

  const handlePayment = (doctor) => {
    if (!window.Razorpay) {
      alert("Payment service is not loaded. Please add the Razorpay checkout script.");
      return;
    }

    const options = {
      key: "Your Key here",
      amount: doctor.fees * 100,
      currency: "INR",
      name: "Healthcare Assistant",
      description: `Consultation with Dr. ${doctor.name}`,
      handler: async function () {
        try {
          const userId = localStorage.getItem("user_id");
          const patientId = localStorage.getItem("patient_id") || userId;

          const response = await fetch(`${BACKEND_URL}/appointments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patient_id: parseInt(patientId, 10),
              doctor_id: doctor.doctor_id,
              slot_id: doctor.slot_id,
              reason: "Booked via AI Assistant",
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data?.detail || "Appointment creation failed");
          }

          const patientDetails = await fetch(`${BACKEND_URL}/patient-details/${userId}`);
          const patientData = await patientDetails.json();
          if (!patientDetails.ok) {
            throw new Error(patientData?.detail || "Patient lookup failed");
          }

          const payload = {
            patientName: patientData.name,
            doctor: doctor.name,
            hospital: doctor.hospital,
            bookingId: `BOOK-${data.appointment_id}`,
            date: doctor.next_available_date,
            time: doctor.start_time,
          };
          navigate(`/success?data=${encodeURIComponent(JSON.stringify(payload))}`);
        } catch (err) {
          console.error("Appointment creation failed:", err);
          alert(err.message || "Appointment creation failed");
        }
      },
      prefill: {
        name: "Patient",
        email: "",
        contact: "",
      },
      theme: {
        color: "#0d6efd",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

      {doctors.length > 0 ? (
        <div className="doctor-card-container">
          {doctors.map((doctor) => (
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
