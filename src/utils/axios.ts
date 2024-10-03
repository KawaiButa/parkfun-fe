"use client";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOSTNAME;
const REFRESH_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/refresh";
const optionsHeader = { "Content-Type": "application/json" };
const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  ...optionsHeader,
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

AxiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes("auth/login") && response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(REFRESH_URL, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/auth/login";
};

export default AxiosInstance;
