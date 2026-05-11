"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Plane } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Redirection handled by middleware or manually
        const role = data?.user?.role;
        router.push(`/${role}/dashboard`);
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                Email / Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-900"
                  placeholder="admin@example.com"
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
              disabled={isLoading}
              className="w-full bg-slate-900 text-white rounded-xl py-4 font-bold hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px]"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
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
