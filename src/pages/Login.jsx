"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Plane } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
      return;
    }

    setError("Invalid credentials. Try admin / admin123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex bg-orange-500 p-3 rounded-2xl mb-4 shadow-xl shadow-orange-500/20">
            <Plane className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif text-slate-900">Admin Login</h2>
          <p className="mt-2 text-slate-500">Access the Kishori Travel management portal</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Demo Credentials: <span className="font-bold text-slate-600">admin / admin123</span>
        </p>
      </div>
    </div>
  );
}
