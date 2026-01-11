"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    setLoading(true);

    const initAuth = () => {
      try {
        const token = Cookies.get("token");

        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);