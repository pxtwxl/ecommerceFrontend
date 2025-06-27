import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/",
});

// Add a request interceptor to include JWT token if present, except for login and register
API.interceptors.request.use(
  (config) => {
    // Do not attach token for login or register endpoints
    if (!config.url.includes("user/login") && !config.url.includes("user/register")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
