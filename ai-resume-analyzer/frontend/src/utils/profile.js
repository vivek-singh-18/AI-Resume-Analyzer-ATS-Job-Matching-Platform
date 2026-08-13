import { request } from "./api";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getProfile = async () => {
  const res = await request({
    method: "GET",
    url: `${API_URL}/api/auth/profile`,
  });
  return res.user; 
};

export const updateProfile = async (data) => {
  const res = await request({
    method: "PUT",
    url: `${API_URL}/api/auth/profile`,
    data,
  });
  return res.user;
};
