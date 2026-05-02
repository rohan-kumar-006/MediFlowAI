import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import "./Payment.css"

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()

  const [doctor, setDoctor] = useState(null)
  const [userName, setUserName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (location.state?.doctor) {
      setDoctor(location.state.doctor)
      setUserName(
        location.state.userName ||
        localStorage.getItem("user_name") ||
        "User"
      )
    } else {
      setError("No appointment details found")
    }
  }, [location])

  const handlePay = () => {
    if (!doctor) {
      setError("Doctor info missing")
      return
    }

    setIsProcessing(true)
    setError(null)

    // Dummy payment simulation
    setTimeout(() => {
      const payload = {
        patientName: userName,
        doctor: doctor.name,
        hospital: doctor.hospital,
        bookingId: "BOOK-" + Math.floor(Math.random() * 100000),
        date: doctor.next_available_date || "Tomorrow",
        time: doctor.start_time || "10:00 AM",
      }

      navigate(`/success?data=${encodeURIComponent(JSON.stringify(payload))}`)
    }, 2000)
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
              <span className="detail-label">Patient:</span>
              <span className="detail-value">{userName}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Doctor:</span>
              <span className="detail-value">{doctor?.name}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Specialization:</span>
              <span className="detail-value">{doctor?.specialization}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Hospital:</span>
              <span className="detail-value">{doctor?.hospital}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Date & Time:</span>
              <span className="detail-value">
                {doctor?.next_available_date || "N/A"} at{" "}
                {doctor?.start_time || "N/A"}
              </span>
            </div>

            <div className="detail-row fee-row">
              <span className="detail-label">Consultation Fee:</span>
              <span className="detail-value">₹{doctor?.fees}</span>
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="pay-button"
            >
              {isProcessing ? (
                <span className="loader"></span>
              ) : (
                `Pay ₹${doctor?.fees}`
              )}
            </button>
          </div>
        ) : (
          <p className="loading-text">Loading appointment details...</p>
        )}

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="payment-button"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}