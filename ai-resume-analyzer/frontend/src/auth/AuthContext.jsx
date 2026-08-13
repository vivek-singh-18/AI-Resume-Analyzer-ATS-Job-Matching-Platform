import React, { createContext, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "@/stores/authStore";
import { request } from "@/utils/api";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { token, setUser, setSocket, logout } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return setUser(null);

      try {
        const res = await request({ method: "GET", url: "/auth/profile" });
        setUser(res.user);

        // Connect socket
        const sock = io(API_URL, { auth: { token } });

        sock.on("connect", () => {
          console.log("Socket connected:", sock.id);
          sock.emit("join", String(res.user.id));
        });

        setSocket(sock);
      } catch (err) {
        console.error("Profile fetch failed", err);
        logout();
      }
    };
    loadUser();
  }, [token, setUser, setSocket, logout]);

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
