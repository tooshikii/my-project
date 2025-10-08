"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FocusSession } from "@/lib/db/indexdb";
import {
  saveFocusSession as saveFocusSessionDB,
  getFocusSessions as getFocusSessionsDB,
} from "@/lib/db/data-service";

interface FocusSessionsState {
  // Data
  sessions: FocusSession[];

  // Current focus session (if active)
  activeSession: {
    startTime: number | null;
    task: string | null;
    isActive: boolean;
    elapsedSeconds: number;
  };

  // Status flags
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSessions: () => Promise<void>;
  startSession: (task: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => Promise<void>;
  cancelSession: () => void;
  tickTimer: () => void;

  // Computed stats
  getTotalFocusHours: () => number;
  getDailyAverage: (days?: number) => number;
}

export const useFocusSessionsStore = create<FocusSessionsState>()(
  immer((set, get) => ({
    // Initial state
    sessions: [],
    activeSession: {
      startTime: null,
      task: null,
      isActive: false,
      elapsedSeconds: 0,
    },
    isLoading: false,
    error: null,

    // Fetch sessions from DB
    fetchSessions: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const sessions = await getFocusSessionsDB();
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

    // Start a new focus session
    startSession: (task) => {
      set((state) => {
        state.activeSession = {
          startTime: Date.now(),
          task,
          isActive: true,
          elapsedSeconds: 0,
        };
      });
    },

    // Pause the current session
    pauseSession: () => {
      set((state) => {
        if (state.activeSession.isActive) {
          state.activeSession.isActive = false;
        }
      });
    },

    // Resume the paused session
    resumeSession: () => {
      set((state) => {
        if (
          !state.activeSession.isActive &&
          state.activeSession.startTime !== null
        ) {
          state.activeSession.isActive = true;
        }
      });
    },

    // Complete the current session and save it
    completeSession: async () => {
      const { activeSession } = get();

      if (!activeSession.startTime || !activeSession.task) {
        return;
      }

      const durationMinutes = Math.round(activeSession.elapsedSeconds / 60);

      // Don't save sessions less than 1 minute
      if (durationMinutes < 1) {
        set((state) => {
          state.activeSession = {
            startTime: null,
            task: null,
            isActive: false,
            elapsedSeconds: 0,
          };
        });
        return;
      }

      const newSession: Omit<FocusSession, "id" | "createdAt" | "updatedAt"> = {
        date: new Date(activeSession.startTime).toISOString(),
        duration: durationMinutes,
        task: activeSession.task,
        completed: true,
      };

      try {
        const savedSession = await saveFocusSessionDB(newSession);

        set((state) => {
          state.sessions.push(savedSession);
          state.activeSession = {
            startTime: null,
            task: null,
            isActive: false,
            elapsedSeconds: 0,
          };
        });
      } catch (error) {
        set((state) => {
          state.error =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
        });
      }
    },

    // Cancel the current session without saving
    cancelSession: () => {
      set((state) => {
        state.activeSession = {
          startTime: null,
          task: null,
          isActive: false,
          elapsedSeconds: 0,
        };
      });
    },

    // Increment the timer
    tickTimer: () => {
      const { activeSession } = get();

      if (activeSession.isActive) {
        set((state) => {
          state.activeSession.elapsedSeconds += 1;
        });
      }
    },

    // Get total focus hours
    getTotalFocusHours: () => {
      const { sessions } = get();
      return sessions.reduce(
        (total, session) => total + session.duration / 60,
        0,
      );
    },

    // Get daily average focus time
    getDailyAverage: (days = 7) => {
      const { sessions } = get();
      const now = new Date();
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentSessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        return sessionDate >= cutoffDate;
      });

      const totalMinutes = recentSessions.reduce(
        (total, session) => total + session.duration,
        0,
      );
      return totalMinutes / (days * 60); // Convert to hours and divide by days
    },
  })),
);
