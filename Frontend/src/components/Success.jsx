import { useNavigate } from "react-router-dom";

function readSuccessData() {
  const params = new URLSearchParams(window.location.search);
  const rawData = params.get("data");
  if (!rawData) {
    return {
      patientName: "",
      doctor: "",
      specialization: "",
      hospital: "",
      bookingId: "",
      date: "",
      time: "",
      roomNumber: "",
      floor: "",
      fees: "",
      cardholderName: "",
      cardLast4: "",
      transactionId: "",
      paymentMethod: "",
    };
  }

  try {
    return JSON.parse(rawData);
  } catch {
    return {
      patientName: "",
      doctor: "",
      specialization: "",
      hospital: "",
      bookingId: "",
      date: "",
      time: "",
      roomNumber: "",
      floor: "",
      fees: "",
      cardholderName: "",
      cardLast4: "",
      transactionId: "",
      paymentMethod: "",
    };
  }
}

export default function Success() {
  const navigate = useNavigate();
  const data = readSuccessData();

  const handleBackHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎉 Appointment Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your appointment has been successfully booked
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Appointment Details */}
          <div className="space-y-6">
            {/* Patient & Doctor Info */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>👤</span> Patient & Doctor Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Patient Name:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.patientName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Doctor Name:</span>
                  <span className="text-blue-600 font-semibold text-lg">
                    Dr. {data.doctor || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Specialization:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.specialization || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Hospital/Clinic:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.hospital || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment Timing */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📅</span> Appointment Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Date:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.date || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Time:</span>
                  <span className="text-red-600 font-semibold text-lg">
                    ⏰ {data.time || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Room Number:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                    {data.roomNumber || "TBD"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Floor:</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    {data.floor || "TBD"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment & Booking Info */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💳</span> Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Payment Method:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Cardholder:</span>
                  <span className="text-gray-900 font-semibold">
                    {data.cardholderName || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Card Number:</span>
                  <span className="font-mono text-gray-900 font-semibold">
                    •••• •••• •••• {data.cardLast4 || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Consultation Fee:</span>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{data.fees || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600 font-medium">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {data.transactionId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Reference */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📄</span> Booking Reference
              </h2>
              <div className="bg-white/20 rounded-lg p-4 mb-3">
                <p className="text-sm text-blue-100 mb-1">Booking ID:</p>
                <p className="text-2xl font-bold font-mono">{data.bookingId || "N/A"}</p>
              </div>
              <p className="text-sm text-blue-100">
                ✓ Payment Status: <span className="font-bold text-green-300">Completed</span>
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-900 mb-3">📌 Important Instructions</h3>
          <ul className="space-y-2 text-yellow-800 text-sm">
            <li>✓ Please arrive 10-15 minutes before your appointment time</li>
            <li>✓ Carry a valid ID proof and insurance documents if applicable</li>
            <li>✓ Contact us if you need to reschedule: 1800-123-456</li>
            <li>✓ A confirmation message has been sent to your registered contact</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleBackHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4"
              />
            </svg>
            Back to Dashboard
          </button>

          <button
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition border-2 border-gray-600 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9m12 0v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m8-4V9m4 4a2 2 0 11-4 0m4 0a2 2 0 11-4 0"
              />
            </svg>
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}
