import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PPO2_DECO, DEFAULT_PPO2_WORK } from '../lib/gas/constants';
import { DepthUnit, PressureUnit } from '../types/gas.types';

interface SettingsState {
  depthUnit: DepthUnit;
  pressureUnit: PressureUnit;
  ppO2Work: number;
  ppO2Deco: number;
  gfLow: number;
  gfHigh: number;
  ascentRate: number;   // m/min
  descentRate: number;  // m/min

  setDepthUnit: (unit: DepthUnit) => void;
  setPressureUnit: (unit: PressureUnit) => void;
  setPpO2Work: (v: number) => void;
  setPpO2Deco: (v: number) => void;
  setGf: (low: number, high: number) => void;
  setAscentRate: (v: number) => void;
  setDescentRate: (v: number) => void;
  resetToDefaults: () => void;
}

const DEFAULTS = {
  depthUnit: 'm' as DepthUnit,
  pressureUnit: 'bar' as PressureUnit,
  ppO2Work: DEFAULT_PPO2_WORK,
  ppO2Deco: DEFAULT_PPO2_DECO,
  gfLow: 0.3,
  gfHigh: 0.8,
  ascentRate: 9,
  descentRate: 20,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setDepthUnit: (depthUnit) => set({ depthUnit }),
      setPressureUnit: (pressureUnit) => set({ pressureUnit }),
      setPpO2Work: (ppO2Work) => set({ ppO2Work }),
      setPpO2Deco: (ppO2Deco) => set({ ppO2Deco }),
      setGf: (gfLow, gfHigh) => set({ gfLow, gfHigh }),
      setAscentRate: (ascentRate) => set({ ascentRate }),
      setDescentRate: (descentRate) => set({ descentRate }),
      resetToDefaults: () => set(DEFAULTS),
    }),
    {
      name: 'gas-blender-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
