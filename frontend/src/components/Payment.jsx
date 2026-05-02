import { useNavigate } from "react-router-dom"
import "./Payment.css"

export default function Payment() {
  const navigate = useNavigate()

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>Payment</h1>
        <p>Payment processing would go here</p>
        <button onClick={() => navigate("/dashboard")} className="payment-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
