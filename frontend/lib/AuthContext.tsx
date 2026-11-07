"use client"
import { createContext, ReactNode, useContext, useState } from "react"
import axiosInstance from "./axiosinstance";
import { toast } from "react-toastify"

const AuthContext = createContext<any>({} as any);

interface SignupResponse {
  data: Record<string, unknown>,
  token: string
}
export const AuthProvider = ({ children }: {
  children: ReactNode
}) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");


  const Signup = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.post<SignupResponse>('/user/signup', { name, email, password })
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Signup Successful");
    } catch (e) {
      const msg = "Signup failed";
      setError(msg);
      toast.error(msg);
    }

  }

  const Login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.post<SignupResponse>('/user/login', { email, password })
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful");
    } catch (e) {
      const msg = "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };
  const Logout = async () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    toast.info("Logged out")
  };

  return (
    <AuthContext.Provider value={{ user, Signup, Login, Logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => useContext(AuthContext)
