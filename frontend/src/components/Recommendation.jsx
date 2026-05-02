import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const handleBookAppointment = (doctor) => {
    navigate("/payment", { state: { doctor } });
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-8 text-white">
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        Consult Recommendation
      </h2>

      {recommended_specialists.length > 0 ? (
        <div className="max-w-4xl mx-auto mb-12 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
          <p className="text-lg text-slate-300 mb-4">
            Based on your symptoms, we recommend consulting one of the following specialists:
          </p>
          <div className="flex flex-wrap gap-3">
            {recommended_specialists.map((specialist) => (
              <span key={specialist} className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full font-medium">
                {specialist}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-red-400 mb-8">No specialist recommendations available.</p>
      )}

      {doctors.length > 0 ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-2xl" key={`${doctor.doctor_id}-${doctor.slot_id}`}>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-cyan-400">{doctor.name}</p>
                <div className="space-y-1 text-slate-300 text-sm">
                  <p><strong className="text-white">Specialization:</strong> {doctor.specialization}</p>
                  <p><strong className="text-white">Hospital:</strong> {doctor.hospital}</p>
                  <p><strong className="text-white">Rating:</strong> ⭐ {doctor.rating} / 5</p>
                  <p><strong className="text-white">Fee:</strong> Rs. {doctor.fees}</p>
                  <p><strong className="text-white">Next Slot:</strong> {formatDateTime(doctor.next_available_date, doctor.start_time)}</p>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all active:scale-95" 
                    onClick={() => handleBookAppointment(doctor)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-red-400">No doctors available for the selected specialists.</p>
      )}
    </div>
  );
}
