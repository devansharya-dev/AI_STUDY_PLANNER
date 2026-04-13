import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-sm text-slate-400">
            {isLogin ? "Enter your credentials to access your workspace." : "Enter your email below to initialize your planner."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4"
            >
              {error}
            </motion.div>
          )}
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4"
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder-slate-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm px-4 py-3 rounded-xl transition-colors disabled:opacity-70 disabled:hover:bg-indigo-500"
          >
            {loading ? "Authenticating..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccessMsg(""); }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
