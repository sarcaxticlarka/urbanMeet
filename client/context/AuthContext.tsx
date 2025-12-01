"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import API from "@/lib/api";

interface AuthContextType {
  user: { id: string; name: string; avatarUrl?: string } | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string; avatarUrl?: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AuthContext initialized", { user, isLoggedIn });
    if (token) {
      setIsLoggedIn(true);
      API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          const u = res.data?.user;
          if (u) {
            setUser({ id: u.id, name: u.name || "Me", avatarUrl: u.avatarUrl });
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          setUser(null);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const login = (token: string) => {
    console.log("Login called with token:", token);
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const u = res.data?.user;
        if (u) {
          setUser({ id: u.id, name: u.name || "Me", avatarUrl: u.avatarUrl });
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
        console.log("User after login:", user);
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
      });
  };

  const logout = () => {
    console.log("Logout called");
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};