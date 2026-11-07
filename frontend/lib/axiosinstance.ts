import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.BACKEND_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

// Send the saved login token to protected backend routes.
axiosInstance.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export default axiosInstance
