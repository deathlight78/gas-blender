import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useAppTheme } from '../src/context/ThemeContext';
import DisclaimerModal from '../src/components/ui/DisclaimerModal';
import { useTranslation } from '../src/i18n';

function TabNavigator() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <>
      <DisclaimerModal />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopColor: theme.tabBarBorder,
          },
          headerShown: true,
          headerStyle: { backgroundColor: theme.header },
          headerTintColor: theme.headerText,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('tab_home'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blending"
          options={{
            title: t('tab_blending'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calculator"
          options={{
            title: t('tab_gas_info'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="analytics-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="deco"
          options={{
            title: t('tab_deco'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bar-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tab_settings'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TabNavigator />
    </ThemeProvider>
  );
}
