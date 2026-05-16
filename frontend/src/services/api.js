import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Auto-logout on token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/"; // Force redirect to login page
    }
    return Promise.reject(error);
  }
);

export default API;