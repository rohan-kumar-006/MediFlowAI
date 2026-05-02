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
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(34,211,238,0.2)] text-white text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
          Appointment Confirmed
        </h2>
        <p className="text-slate-300 mb-10 text-lg">Your appointment has been successfully booked.</p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          
          <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-cyan-400 border-b border-white/10 pb-2">Appointment Summary</h3>
            <div className="space-y-2">
              <p><strong className="text-slate-400">Patient Name:</strong> <span className="block font-semibold">{data.patientName || "N/A"}</span></p>
              <p><strong className="text-slate-400">Doctor:</strong> <span className="block font-semibold">{data.doctor || "N/A"}</span></p>
              <p><strong className="text-slate-400">Hospital/Clinic:</strong> <span className="block font-semibold">{data.hospital || "N/A"}</span></p>
              <p><strong className="text-slate-400">Booking ID:</strong> <span className="block font-semibold text-cyan-300 font-mono">{data.bookingId || "N/A"}</span></p>
            </div>
          </div>

          <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-emerald-400 border-b border-white/10 pb-2">Additional Information</h3>
            <div className="space-y-2">
              <p><strong className="text-slate-400">Date:</strong> <span className="block font-semibold">{data.date || "N/A"}</span></p>
              <p><strong className="text-slate-400">Time:</strong> <span className="block font-semibold">{data.time || "N/A"}</span></p>
              <p><strong className="text-slate-400">Required Document:</strong> <span className="block font-semibold">Valid ID Proof</span></p>
              <p><strong className="text-slate-400">Support Contact:</strong> <span className="block font-semibold">1800-123-456</span></p>
            </div>
          </div>

        </div>

        <button 
          onClick={() => window.location.href = "/dashboard"}
          className="mt-12 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold hover:scale-105 transition-all shadow-lg active:scale-95"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
