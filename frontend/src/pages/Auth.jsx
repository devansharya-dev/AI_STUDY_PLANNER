import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          navigate("/dashboard");
        } else {
          setError(res.error || "Login failed");
        }
      } else {
        const res = await signup(email, password);
        if (res.success) {
          setSuccessMsg("Account created! Please verify your email.");
          setIsLogin(true);
        } else {
          setError(res.error || "Signup failed");
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100dvh-132px)] w-full items-center justify-center px-1 selection:bg-[#d7b98d]/40">
      <Motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-panel w-full max-w-sm rounded-2xl p-8"
      >
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold tracking-normal text-[#17140f]">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#746b5f]">
            {isLogin ? "Enter your credentials to access your workspace." : "Enter your email below to initialize your planner."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <Motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600"
            >
              {error}
            </Motion.div>
          )}
          {successMsg && (
            <Motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-700"
            >
              {successMsg}
            </Motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#746b5f]">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#5b3215]/10 bg-[#fffdf8] px-4 py-3.5 text-[15px] font-semibold text-[#17140f] transition-all placeholder:text-[#9b907f] focus:border-[#8a5a2b]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8a5a2b]/10"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-extrabold uppercase tracking-[0.16em] text-[#746b5f]">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#5b3215]/10 bg-[#fffdf8] px-4 py-3.5 text-[15px] font-semibold text-[#17140f] transition-all placeholder:text-[#9b907f] focus:border-[#8a5a2b]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8a5a2b]/10"
              placeholder="Password"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17140f] px-4 py-4 text-[15px] font-extrabold text-[#fffaf1] shadow-[0_18px_35px_rgba(23,20,15,0.16)] transition-all hover:bg-[#5b3215] disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccessMsg(""); }}
            className="text-sm font-bold text-[#746b5f] transition-colors hover:text-[#17140f]"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </Motion.div>
    </div>
  );
}
