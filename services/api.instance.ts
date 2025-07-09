import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Automatically attach your DID‐session JWT (if present) to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const jwt = localStorage.getItem("didSession")
    if (jwt) {
      config.headers = config.headers ?? {}
      config.headers["Authorization"] = `Bearer ${jwt}`
    }
  }
  return config
})

export default api
