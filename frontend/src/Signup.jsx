import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    date_of_birth: "",
    gender: "Male",
    contact_number: "",
    medical_record_number: "",
    blood_group: "",
    marital_status: "",
  })

  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!formData.email || !formData.password || !formData.name) {
      setErrorMessage("Email, password, and name are required")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters")
      return
    }

    if (!formData.contact_number || !formData.medical_record_number) {
      setErrorMessage("Contact number and medical record number are required")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`${BACKEND_URL}/signup`, {
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

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Signup failed")
      }

      localStorage.setItem("user_id", data.user_id)
      localStorage.setItem("patient_id", data.patient_id)
      navigate("/dashboard")
    } catch (err) {
      setErrorMessage(err.message || "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4 py-10">

      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">

          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Create Account
          </h1>
          <p className="text-slate-400 text-center mb-6">
            Sign up to access healthcare services
          </p>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm md:col-span-2">
              {errorMessage}
            </div>
          )}

          {/* GRID FORM */}
          <form onSubmit={handleSignup} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Email - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* Name - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Contact Number</label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* MRN */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Medical Record Number</label>
              <input
                type="text"
                name="medical_record_number"
                value={formData.medical_record_number}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              />
            </div>

            {/* Blood */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="">Select</option>
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
              </select>
            </div>

            {/* Marital */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Marital Status</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 w-full mt-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>

            {/* Login */}
            <p className="md:col-span-2 text-center text-slate-400 mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-cyan-400">
                Login here
              </a>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}