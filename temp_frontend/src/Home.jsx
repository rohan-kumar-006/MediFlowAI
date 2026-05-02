import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!BACKEND_URL) {
      setErrorMessage("Backend URL not configured")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || data?.message || "Login failed")

      localStorage.setItem("user_id", data.user_id)
      navigate("/dashboard")
    } catch (err) {
      setErrorMessage(err.message || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] px-4">

      {/* Animated Glow Background */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl bottom-[-120px] right-[-100px] animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.15)]">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/2 p-8 md:p-12">

          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              MediFlow AI
            </span>
          </h1>

          <p className="mt-3 text-slate-300">
            AI-powered healthcare agents for faster diagnosis & smart care
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              required
            />

            <div className="flex justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-cyan-400" />
                Remember
              </label>
              <span className="cursor-pointer hover:text-cyan-300">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-all duration-300 active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

          </form>

          {errorMessage && (
            <p className="mt-4 text-red-400 text-sm">
              {errorMessage}
            </p>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center bg-gradient-to-br from-cyan-600 to-blue-700 text-white p-10">

          {/* Floating elements */}
          <div className="absolute w-20 h-20 bg-cyan-300/30 rounded-full top-10 right-10 animate-pulse"></div>
          <div className="absolute w-12 h-12 bg-emerald-300/40 rounded-full bottom-10 left-10 animate-bounce"></div>

          <div className="text-center z-10">
            <h2 className="text-3xl font-bold">MediFlow</h2>
            <p className="mt-2 opacity-90">
              AI Agents for Smart Healthcare
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
