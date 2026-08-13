// utils/api.js
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => refreshSubscribers.push(cb);
const onRrefreshed = (token) => refreshSubscribers.map((cb) => cb(token));
const API_URL =  "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          token: refreshToken,
        });
        const newToken = res.data.token;
        useAuthStore.getState().setToken(newToken);

        isRefreshing = false;
        onRrefreshed(newToken);
        refreshSubscribers = [];

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export const request = async ({ method, url, data, params, headers }) => {
  try {
    const res = await api({ method, url, data, params, headers });
    return res.data;
  } catch (err) {
    console.error("API request failed", err);
    throw err.response?.data || err;
  }
};

export default api;
