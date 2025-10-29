"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login success:", data);
        console.log("User role:", data.user?.role);

        // Add a small delay and force full page redirect
        setTimeout(() => {
          if (data.user?.role === "ADMIN") {
            window.location.href = "/dashboard/admin";
          } else {
            window.location.href = "/dashboard/staff";
          }
        }, 100);
      } else {
        const errorData = await response.json();
        console.log("Login error:", errorData);
        setError(errorData.error || "خطا در ورود");
      }
    } catch (error) {
      console.log("Fetch error:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center"
      dir="rtl"
    >
      <div className="bg-zinc-900 p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-orange-400 text-2xl font-bold mb-2">
            فست فود سالیوان
          </h1>
          <p className="text-zinc-400">ورود به پنل مدیریت</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              نام کاربری
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none text-white"
              placeholder="نام کاربری خود را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none text-white"
              placeholder="رمز عبور خود را وارد کنید"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-400 text-center">
          <p>حساب‌های پیش‌فرض:</p>
          <p>ادمین: admin / admin123</p>
          <p>گارسون: waiter / staff123</p>
        </div>
      </div>
    </div>
  );
}
