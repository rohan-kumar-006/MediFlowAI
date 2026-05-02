import { useNavigate } from "react-router-dom"
import { useLocation, useEffect, useState } from "react"
import "./Payment.css"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const [doctor, setDoctor] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (location.state?.doctor) {
      setDoctor(location.state.doctor)
    } else {
      setError("No appointment details found")
    }
  }, [location])

  const handlePay = async () => {
    if (!doctor) {
      setError("Doctor information is missing")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const userId = localStorage.getItem("user_id")
      const patientId = localStorage.getItem("patient_id") || userId

      if (!userId || !patientId) {
        throw new Error("User not logged in")
      }

      const response = await fetch(`${BACKEND_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: parseInt(patientId, 10),
          doctor_id: doctor.doctor_id,
          slot_id: doctor.slot_id,
          reason: "Booked via AI Assistant",
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || "Appointment creation failed")
      }

      const patientDetails = await fetch(`${BACKEND_URL}/patient-details/${userId}`)
      const patientData = await patientDetails.json()
      if (!patientDetails.ok) {
        throw new Error(patientData?.detail || "Patient lookup failed")
      }

      const payload = {
        patientName: patientData.name,
        doctor: doctor.name,
        hospital: doctor.hospital,
        bookingId: `BOOK-${data.appointment_id}`,
        date: doctor.next_available_date,
        time: doctor.start_time,
      }
      navigate(`/success?data=${encodeURIComponent(JSON.stringify(payload))}`)
    } catch (err) {
      console.error("Payment failed:", err)
      setError(err.message || "Payment failed")
      setIsProcessing(false)
    }
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>💳 Payment</h1>

        {error && <div className="error-message">{error}</div>}

        {doctor ? (
          <div className="appointment-details">
            <h2>Appointment Details</h2>
            <div className="detail-row">
              <span className="detail-label">Doctor:</span>
              <span className="detail-value">{doctor.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Specialization:</span>
              <span className="detail-value">{doctor.specialization}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Hospital:</span>
              <span className="detail-value">{doctor.hospital}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">{doctor.next_available_date} at {doctor.start_time}</span>
            </div>
            <div className="detail-row fee-row">
              <span className="detail-label">Consultation Fee:</span>
              <span className="detail-value">₹{doctor.fees}</span>
            </div>

            <button onClick={handlePay} disabled={isProcessing} className="pay-button">
              {isProcessing ? "Processing..." : `Pay ₹${doctor.fees}`}
            </button>
          </div>
        ) : (
          <p className="loading-text">Loading appointment details...</p>
        )}

        <button onClick={() => navigate("/dashboard")} className="payment-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
