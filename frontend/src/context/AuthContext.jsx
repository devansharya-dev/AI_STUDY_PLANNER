import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, signup as signupService } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    if (data.success) {
      localStorage.setItem("token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data.user);
    }
    return data;
  };

  const signup = async (email, password) => {
    const data = await signupService(email, password);
    // signup returns session/user but we might want them to log in themselves or we auto log them in.
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);