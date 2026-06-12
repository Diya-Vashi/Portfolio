"use client";

import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic client-side check if cookie exists
    if (document.cookie.includes("admin_auth_status=logged_in")) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
    } else {
      const data = await res.json();
      setError(data.error || "Incorrect credentials");
    }
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm glass-card rounded-3xl p-8 space-y-8 border border-border">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Admin Access</h1>
            <p className="text-sm text-muted-foreground">Enter your secure credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 text-center"
                autoFocus
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground focus:outline-none focus:border-primary/50 text-center tracking-[0.2em]"
                required
              />
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
