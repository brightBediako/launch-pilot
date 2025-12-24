import { create } from "zustand";
import apiClient from "../services/apiClient";

const useLaunchStore = create((set, get) => ({
  launches: [],
  currentLaunch: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },

  fetchLaunches: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 10,
        ...(filters.status && { status: filters.status }),
      });

      const response = await apiClient.get(`/launches?${params}`);
      const { launches, pagination } = response.data.data;

      set({
        launches,
        pagination,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch launches";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  getLaunchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/launches/${id}`);
      set({
        currentLaunch: response.data.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch launch";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  createLaunch: async (launchData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/launches", launchData);
      const newLaunch = response.data.data;

      set((state) => ({
        launches: [newLaunch, ...state.launches],
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create launch";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  updateLaunch: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch(`/launches/${id}`, updates);
      const updatedLaunch = response.data.data;

      set((state) => ({
        launches: state.launches.map((l) => (l._id === id ? updatedLaunch : l)),
        currentLaunch:
          state.currentLaunch?._id === id ? updatedLaunch : state.currentLaunch,
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update launch";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  deleteLaunch: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/launches/${id}`);

      set((state) => ({
        launches: state.launches.filter((l) => l._id !== id),
        currentLaunch:
          state.currentLaunch?._id === id ? null : state.currentLaunch,
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete launch";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  generatePlan: async (launchId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(
        `/launches/${launchId}/generate-plan`
      );
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to generate plan";
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useLaunchStore;
