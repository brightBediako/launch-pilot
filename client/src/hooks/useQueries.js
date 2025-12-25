import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// ===== LAUNCHES QUERIES =====

export const useLaunches = (filters = {}) => {
  return useQuery({
    queryKey: ["launches", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);

      const response = await apiClient.get(`/launches?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
  });
};

export const useLaunchDetail = (launchId) => {
  return useQuery({
    queryKey: ["launches", launchId],
    queryFn: async () => {
      const response = await apiClient.get(`/launches/${launchId}`);
      return response.data.data;
    },
    enabled: !!launchId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateLaunch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (launchData) => {
      const response = await apiClient.post("/launches", launchData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["launches"] });
    },
  });
};

export const useUpdateLaunch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ launchId, data }) => {
      const response = await apiClient.put(`/launches/${launchId}`, data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["launches", variables.launchId],
      });
      queryClient.invalidateQueries({ queryKey: ["launches"] });
    },
  });
};

export const useDeleteLaunch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (launchId) => {
      await apiClient.delete(`/launches/${launchId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["launches"] });
    },
  });
};

// ===== PARTNERS QUERIES =====

export const usePartners = (filters = {}) => {
  return useQuery({
    queryKey: ["partners", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.service) params.append("service", filters.service);
      if (filters.search) params.append("search", filters.search);

      const response = await apiClient.get(`/partners?${params.toString()}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const usePartnerDetail = (partnerId) => {
  return useQuery({
    queryKey: ["partners", partnerId],
    queryFn: async () => {
      const response = await apiClient.get(`/partners/${partnerId}`);
      return response.data.data;
    },
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5,
  });
};

// ===== TASKS QUERIES =====

export const useTasks = (launchId) => {
  return useQuery({
    queryKey: ["tasks", launchId],
    queryFn: async () => {
      const response = await apiClient.get(`/launches/${launchId}/tasks`);
      return response.data.data;
    },
    enabled: !!launchId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ launchId, taskData }) => {
      const response = await apiClient.post(
        `/launches/${launchId}/tasks`,
        taskData
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.launchId],
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ launchId, taskId, data }) => {
      const response = await apiClient.put(
        `/launches/${launchId}/tasks/${taskId}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", variables.launchId],
      });
    },
  });
};

// ===== ANALYTICS QUERIES =====

export const useLaunchAnalytics = (launchId) => {
  return useQuery({
    queryKey: ["analytics", launchId],
    queryFn: async () => {
      const response = await apiClient.get(`/launches/${launchId}/analytics`);
      return response.data.data;
    },
    enabled: !!launchId,
    staleTime: 1000 * 60 * 5,
  });
};

// ===== CONTENT GENERATION QUERIES =====

export const useGenerateContent = () => {
  return useMutation({
    mutationFn: async ({ launchId, contentType, context }) => {
      const response = await apiClient.post(
        `/launches/${launchId}/generate-content`,
        {
          contentType,
          context,
        }
      );
      return response.data.data;
    },
  });
};

// ===== AI PLANNING QUERIES =====

export const useGenerateLaunchPlan = () => {
  return useMutation({
    mutationFn: async ({ productName, description, targetMarket }) => {
      const response = await apiClient.post("/launches/generate-plan", {
        productName,
        description,
        targetMarket,
      });
      return response.data.data;
    },
  });
};

// ===== USER/PROFILE QUERIES =====

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.put("/users/profile", userData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
