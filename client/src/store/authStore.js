import { create } from "zustand";
import apiClient from "../services/apiClient";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  register: async (
    name,
    email,
    password,
    timezone = "Africa/Lagos",
    currency = "NGN"
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
        timezone,
        currency,
      });

      const { user, accessToken, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  fetchCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      set({
        user: response.data.data.user,
        isAuthenticated: true,
      });
      return response.data;
    } catch (error) {
      set({ isAuthenticated: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
