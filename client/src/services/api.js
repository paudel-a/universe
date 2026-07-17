import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});

// REQUEST interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE interceptor (FIXED)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.log("Unauthorized - NOT redirecting");
      // window.location.href = "/"; ❌ disabled for now
    }

    return Promise.reject(error);
  },
);

export default API;
