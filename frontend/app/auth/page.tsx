"use client";
import { useAuth } from "@/lib/AuthContext";
import { Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function AuthPage() {
  const router = useRouter();
  const { Login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("All fields are required")
      return
    }

    try {
      await Login(form)
      router.push("/")
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9f9] px-4 py-10 text-sm text-[#0c0d0e]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif' }}
    >
      <Link href="/" className="mb-8 flex items-center gap-2 text-2xl">
        <Layers size={32} className="text-orange-500" />
        <span>Stack<span className="font-bold">let</span></span>
      </Link>

      <div className="w-full max-w-[410px] rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Log in to your account</h1>
        <p className="mt-2 text-center text-gray-500">
          Enter your email and password to access Stacklet
        </p>

        <div className="mt-4 space-y-3">
          <button type="button" className="flex h-9 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">
            <span className="text-lg font-bold">G</span>
            Log in with Google
          </button>
          <button type="button" className="flex h-9 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .75a11.25 11.25 0 0 0-3.56 21.92c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.8 10.8 0 0 1 5.62 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.32-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.78.54A11.25 11.25 0 0 0 12 .75Z" />
            </svg>
            Log in with GitHub
          </button>
        </div>

        <div className="my-3 flex items-center gap-2 text-xs text-gray-500">
          <hr className="flex-1 border-gray-200" />
          <span>OR CONTINUE WITH</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        {/* Connect this form to authentication later. */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="mb-2 block">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="m@example.com"
              required
              className="h-9 w-full rounded-lg border border-gray-200 px-3 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="h-9 w-full rounded-lg border border-gray-200 px-3 shadow-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button type="submit" className="h-9 w-full rounded-lg bg-[#0b5cf0] text-white hover:bg-blue-700">
            Log in
          </button>
        </form>

        <div className="mt-3 space-y-3 text-center">
          <button type="button" className="text-[#39739D] hover:underline">Forgot your password?</button>
          <p>
            Don&apos;t have an account? <button type="button"
              onClick={() => {
                router.push('/signup')
              }}

              className="text-[#39739D] hover:underline">Sign up</button>
          </p>
        </div>
      </div>
    </main>
  );
}
