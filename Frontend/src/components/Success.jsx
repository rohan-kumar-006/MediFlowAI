import "./Success.css";


function readSuccessData() {
  const params = new URLSearchParams(window.location.search);
  const rawData = params.get("data");
  if (!rawData) {
    return {
      patientName: "",
      doctor: "",
      hospital: "",
      bookingId: "",
      date: "",
      time: "",
    };
  }

  try {
    return JSON.parse(rawData);
  } catch {
    return {
      patientName: "",
      doctor: "",
      hospital: "",
      bookingId: "",
      date: "",
      time: "",
    };
  }
}


export default function Success() {
  const data = readSuccessData();

  return (
    <div className="success-container">
      <h2 className="success-title">Appointment Confirmed</h2>
      <p className="success-message">Your appointment has been successfully booked.</p>

      <div className="summary-box">
        <div className="summary-column">
          <h3>Appointment Summary</h3>
          <p><strong>Patient Name:</strong> {data.patientName || "N/A"}</p>
          <p><strong>Doctor:</strong> {data.doctor || "N/A"}</p>
          <p><strong>Hospital/Clinic:</strong> {data.hospital || "N/A"}</p>
          <p><strong>Booking ID:</strong> {data.bookingId || "N/A"}</p>
        </div>

        <div className="summary-column">
          <h3>Additional Information</h3>
          <p><strong>Date:</strong> {data.date || "N/A"}</p>
          <p><strong>Time:</strong> {data.time || "N/A"}</p>
          <p><strong>Required Document:</strong> Valid ID Proof</p>
          <p><strong>Support Contact:</strong> 1800-123-456</p>
        </div>
      </div>
    </div>
  );
}
