import { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, lightTheme, darkTheme } from '../../constants/theme';
import { useAppStore } from '../store/app.store';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const themeOverride = useAppStore((s) => s.themeOverride);

  const scheme = themeOverride ?? systemScheme ?? 'light';
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppTheme {
  return useContext(ThemeContext);
}
