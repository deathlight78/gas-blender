export interface AppTheme {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  primary: string;
  accent: string;
  accentSub: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  warningBg: string;
  warningText: string;
  errorText: string;
  successBg: string;
  successText: string;
  tabBar: string;
  tabBarBorder: string;
  header: string;
  headerText: string;
  inputBg: string;
  inputDisabledBg: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  infoBg: string;
  infoText: string;
}

export const lightTheme: AppTheme = {
  background: '#f5f7fa',
  surface: '#ffffff',
  surfaceAlt: '#F1F5F9',
  border: '#CBD5E1',
  primary: '#003366',
  accent: '#0077CC',
  accentSub: '#005599',
  text: '#1E293B',
  textSecondary: '#334155',
  textMuted: '#64748B',
  warningBg: '#FFF3CD',
  warningText: '#856404',
  errorText: '#CC0000',
  successBg: '#F0FDF4',
  successText: '#166534',
  tabBar: '#ffffff',
  tabBarBorder: '#E2E8F0',
  header: '#003366',
  headerText: '#ffffff',
  inputBg: '#ffffff',
  inputDisabledBg: '#F1F5F9',
  buttonPrimary: '#003366',
  buttonPrimaryText: '#ffffff',
  infoBg: '#EFF6FF',
  infoText: '#0077CC',
};

export const darkTheme: AppTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  border: '#475569',
  primary: '#93C5FD',
  accent: '#38BDF8',
  accentSub: '#7DD3FC',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  warningBg: '#422006',
  warningText: '#FCD34D',
  errorText: '#F87171',
  successBg: '#052e16',
  successText: '#4ADE80',
  tabBar: '#1E293B',
  tabBarBorder: '#334155',
  header: '#1E293B',
  headerText: '#F1F5F9',
  inputBg: '#0F172A',
  inputDisabledBg: '#1E293B',
  buttonPrimary: '#1D4ED8',
  buttonPrimaryText: '#ffffff',
  infoBg: '#1e3a5f',
  infoText: '#93C5FD',
};
