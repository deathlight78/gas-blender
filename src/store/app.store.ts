import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'ko' | 'en';
type ThemeOverride = 'light' | 'dark' | null;

interface AppState {
  language: Language;
  themeOverride: ThemeOverride;
  hasSeenDisclaimer: boolean;

  setLanguage: (lang: Language) => void;
  setThemeOverride: (t: ThemeOverride) => void;
  markDisclaimerSeen: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'ko',
      themeOverride: null,
      hasSeenDisclaimer: false,

      setLanguage: (language) => set({ language }),
      setThemeOverride: (themeOverride) => set({ themeOverride }),
      markDisclaimerSeen: () => set({ hasSeenDisclaimer: true }),
    }),
    {
      name: 'gas-blender-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
