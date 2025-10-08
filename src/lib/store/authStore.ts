"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    setUser: (user) => {
      set((state) => {
        state.user = user;
        state.isAuthenticated = !!user;
      });
    },

    setLoading: (isLoading) => {
      set((state) => {
        state.isLoading = isLoading;
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
      });
    },

    signIn: async (email, password) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Replace with actual Supabase implementation
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        // Mock implementation for now
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: "mock-user-id",
          email,
          name: email.split("@")[0],
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },

    signUp: async (email, password, name) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Replace with actual Supabase implementation
        // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });

        // Mock implementation for now
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
          id: "mock-user-id",
          email,
          name: name || email.split("@")[0],
        };

        set((state) => {
          state.user = mockUser;
          state.isAuthenticated = true;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },

    signOut: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // TODO: Replace with actual Supabase implementation
        // const { error } = await supabase.auth.signOut();

        // Mock implementation for now
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },

    checkAuth: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        // TODO: Replace with actual Supabase implementation
        // const { data: { session } } = await supabase.auth.getSession();

        // Mock implementation for now
        await new Promise((resolve) => setTimeout(resolve, 500));

        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          state.isLoading = false;
        });
      }
    },
  })),
);
