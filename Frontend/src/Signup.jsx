import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    date_of_birth: "",
    gender: "",
    contact_number: "",
    medical_record_number: "",
    blood_group: "",
    marital_status: "",
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }))
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setErrorMessage("")
    setSuccessMessage("")

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          contact_number: formData.contact_number,
          medical_record_number: formData.medical_record_number,
          blood_group: formData.blood_group || null,
          marital_status: formData.marital_status || null,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Signup failed")
      }

      localStorage.setItem("user_id", data.user_id)
      localStorage.setItem("patient_id", data.patient_id)
      setSuccessMessage("Account created successfully. Redirecting to dashboard...")

      setTimeout(() => {
        navigate("/dashboard")
      }, 900)
    } catch (error) {
      setErrorMessage(error.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#08111f] px-4 py-10">
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_0_50px_rgba(34,211,238,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-cyan-600 to-blue-700 p-10 text-white lg:flex">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">Patient signup</p>
              <h1 className="mt-4 text-4xl font-black leading-tight">Create your MediFlow account</h1>
              <p className="mt-4 max-w-md text-white/80">
                Register once and keep your patient profile, appointment history, and medical details in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm text-white/85">
              Secure registration for new patients. Your details are stored directly in the healthcare database.
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">MediFlow AI</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Sign up</h2>
                <p className="mt-2 text-sm text-slate-300">Fill in your patient details to create an account.</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
              >
                Back to login
              </button>
            </div>

            <form onSubmit={handleSignup} className="grid gap-4 md:grid-cols-2">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(event) => updateField("date_of_birth", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                required
              />
              <select
                value={formData.gender}
                onChange={(event) => updateField("gender", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.contact_number}
                onChange={(event) => updateField("contact_number", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="text"
                placeholder="Medical Record Number"
                value={formData.medical_record_number}
                onChange={(event) => updateField("medical_record_number", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
                required
              />
              <input
                type="text"
                placeholder="Blood Group"
                value={formData.blood_group}
                onChange={(event) => updateField("blood_group", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
              />
              <select
                value={formData.marital_status}
                onChange={(event) => updateField("marital_status", event.target.value)}
                className="w-full rounded-xl border border-white/20 bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>

              <div className="md:col-span-2 mt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-3 font-bold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>

                {errorMessage && <p className="text-sm text-red-300">{errorMessage}</p>}
                {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}