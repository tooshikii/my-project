"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { CodingSession } from "@/lib/db/indexdb";
import {
  saveCodingSession as saveCodingSessionDB,
  getCodingSessions as getCodingSessionsDB,
} from "@/lib/db/data-service";

interface CodingSessionsState {
  // Data
  sessions: CodingSession[];

  // Status flags
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: () => Promise<void>;
  addSession: (
    session: Omit<CodingSession, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;

  // Computed stats - could expand this with more analytics
  getTotalHours: () => number;
  getRecentSessions: (days?: number) => CodingSession[];
}

export const useCodingSessionsStore = create<CodingSessionsState>()(
  immer((set, get) => ({
    // Initial state
    sessions: [],
    isLoading: false,
    error: null,

    // Fetch sessions from DB
    fetchSessions: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const sessions = await getCodingSessionsDB();
        set((state) => {
          state.sessions = sessions;
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

    // Add a new session
    addSession: async (sessionData) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const newSession = await saveCodingSessionDB(sessionData);
        set((state) => {
          state.sessions.push(newSession);
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

    // Get total coding hours
    getTotalHours: () => {
      const { sessions } = get();
      return sessions.reduce(
        (total, session) => total + session.duration / 60,
        0,
      );
    },

    // Get recent sessions
    getRecentSessions: (days = 7) => {
      const { sessions } = get();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      return sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= cutoffDate;
      });
    },
  })),
);
