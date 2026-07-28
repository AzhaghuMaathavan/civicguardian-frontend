"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "https://cgapi.shyxon.com/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      const { token, id, roles } = response.data;

      // Make sure this is a government user (for dashboard)
      if (!roles.includes("ROLE_GOVERNMENT") && !roles.includes("ROLE_VOLUNTEER")) {
        setError("Unauthorized: Dashboard access restricted.");
        return;
      }

      dispatch(setCredentials({ token, userId: id, username, roles }));
      router.push("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl shadow-lg flex items-center justify-center mb-4 transform transition hover:scale-105 duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">CivicGuardian AI</h2>
          <p className="text-blue-200 mt-2 font-medium">Government Command Center</p>
        </div>
        
        {error && (
          <div className="mb-6 flex items-center gap-3 text-red-100 bg-red-500/20 border border-red-500/50 p-4 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Username</label>
            <input
              type="text"
              className="w-full px-5 py-3.5 bg-white border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-slate-900 font-medium placeholder-slate-400 shadow-inner transition-all duration-200"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-100 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="w-full px-5 py-3.5 bg-white border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-slate-900 font-medium placeholder-slate-400 shadow-inner transition-all duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transform transition hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Secure Login
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-blue-300/60">
            Authorized government personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
