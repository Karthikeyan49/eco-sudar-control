import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  adminEmail: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_CREDENTIALS = {
  email: "admin@ecosudar.com",
  password: "admin123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("eco_admin_auth");
    if (stored) {
      const data = JSON.parse(stored);
      setIsAuthenticated(true);
      setAdminEmail(data.email);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setAdminEmail(email);
      localStorage.setItem("eco_admin_auth", JSON.stringify({ email }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail("");
    localStorage.removeItem("eco_admin_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
