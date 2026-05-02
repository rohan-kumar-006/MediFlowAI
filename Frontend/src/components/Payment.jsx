import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [hasValidData, setHasValidData] = useState(false);

  // Safely extract appointment data from location state
  const getAppointmentData = () => {
    const state = location.state;
    if (!state) {
      return null;
    }
    
    return {
      doctor_id: state.doctor_id || null,
      doctor_name: String(state.doctor_name || "Not specified"),
      specialization: String(state.specialization || "General"),
      hospital: String(state.hospital || "Not specified"),
      slot_id: state.slot_id || null,
      fees: Number(state.fees) || 0,
      next_available_date: String(state.next_available_date || "Not available"),
      start_time: String(state.start_time || "Not available"),
    };
  };

  const [appointmentData] = useState(() => getAppointmentData());

  // Check if we have valid data
  useEffect(() => {
    if (appointmentData && appointmentData.doctor_id && appointmentData.slot_id) {
      setHasValidData(true);
    } else {
      setHasValidData(false);
    }
  }, [appointmentData]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing delay - no actual payment
    setTimeout(() => {
      // Generate room details
      const roomNumber = "Room " + Math.floor(Math.random() * 100 + 1);
      const floor = "Floor " + Math.floor(Math.random() * 5 + 1);

      // Generate fake card details
      const fakeCardNumber = "4532" + Math.random().toString().slice(2, 14);
      const cardLast4 = fakeCardNumber.slice(-4);

      // Build success payload
      const successPayload = {
        patientName: "Patient Name",
        doctor: appointmentData.doctor_name,
        specialization: appointmentData.specialization,
        hospital: appointmentData.hospital,
        bookingId: `BOOK-${Math.floor(Math.random() * 100000)}`,
        date: appointmentData.next_available_date,
        time: appointmentData.start_time,
        roomNumber: roomNumber,
        floor: floor,
        fees: appointmentData.fees,
        cardholderName: "Visa Card",
        cardLast4: cardLast4,
        transactionId: `TXN-${Date.now()}`,
        paymentMethod: "Credit/Debit Card",
      };

      setIsProcessing(false);
      navigate(
        `/success?data=${encodeURIComponent(JSON.stringify(successPayload))}`
      );
    }, 1500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Valid appointment data - show payment form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">🔒 Secure Payment</h2>
          <p className="text-gray-300 text-sm">
            Complete your appointment booking safely
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Order Summary */}
          <div className="mb-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl p-6">
            <h3 className="text-cyan-400 text-sm font-bold uppercase tracking-wider mb-4">
              📋 Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-sm">Consultation Fee</span>
                <span className="font-semibold text-cyan-400">
                  ₹{appointmentData.fees}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-sm">Doctor</span>
                <span className="font-semibold text-white">
                  {appointmentData.doctor_name}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span className="text-sm">Date & Time</span>
                <span className="font-semibold text-white text-right">
                  {appointmentData.next_available_date} {appointmentData.start_time}
                </span>
              </div>

              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-green-400">
                    ₹{appointmentData.fees}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Payment */}
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-6">
                Click below to complete your appointment booking instantly
              </p>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wide text-lg"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="w-6 h-6 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    💳 Pay ₹{appointmentData.fees}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="w-full mt-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition uppercase tracking-wide border border-gray-500"
              >
                Cancel
              </button>
            </div>

            {/* Security Info */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-400"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>This is a demo payment gateway</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-xs mt-6">
          No actual payment processing - instant booking confirmation
        </p>
      </div>
    </div>
  );
}
