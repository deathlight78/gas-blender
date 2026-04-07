import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionEntry } from '../types/deco.types';

interface SessionState {
  entries: SessionEntry[];
  addEntry: (entry: Omit<SessionEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  updateSurfaceInterval: (id: string, minutes: number) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, { ...entry, id: Date.now().toString() }],
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      updateSurfaceInterval: (id, minutes) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, surfaceIntervalMin: minutes } : e
          ),
        })),

      clearSession: () => set({ entries: [] }),
    }),
    {
      name: 'gas-blender-dive-session',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
