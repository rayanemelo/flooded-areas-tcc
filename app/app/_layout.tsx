import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import * as Notifications from 'expo-notifications';

import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '@/styles/colors';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="faq"
                options={{
                  headerBackButtonDisplayMode: 'minimal',
                  headerTitle: 'PERGUNTAS FREQUENTES',
                  headerStyle: {
                    backgroundColor:
                      colorScheme === 'light'
                        ? COLORS.lightThemeBackground
                        : COLORS.blackDefault,
                  },
                  headerTitleStyle: {
                    fontSize: 16,
                    color:
                      colorScheme === 'light' ? COLORS.black : COLORS.white,
                    fontWeight: 'bold',
                  },
                  headerTintColor: COLORS.grayDark,
                }}
              />
              <Stack.Screen
                name="settings-notification"
                options={{
                  headerBackButtonDisplayMode: 'minimal',
                  headerTitle: 'CONFIGURAÇÕES',
                  headerStyle: {
                    backgroundColor:
                      colorScheme === 'light'
                        ? COLORS.lightThemeBackground
                        : COLORS.blackDefault,
                  },
                  headerTitleStyle: {
                    fontSize: 16,
                    color:
                      colorScheme === 'light' ? COLORS.black : COLORS.white,
                    fontWeight: 'bold',
                  },
                  headerTintColor: COLORS.grayDark,
                }}
              />
              <Stack.Screen
                name="history/[id]"
                options={{
                  headerBackButtonDisplayMode: 'minimal',
                  headerTintColor: COLORS.grayDark,
                  headerTitle: 'DETALHES',
                  headerStyle: {
                    backgroundColor:
                      colorScheme === 'light'
                        ? COLORS.lightThemeBackground
                        : COLORS.blackDefault,
                  },
                  headerTitleStyle: {
                    fontSize: 16,
                    color:
                      colorScheme === 'light' ? COLORS.black : COLORS.white,
                    fontWeight: 'bold',
                  },
                }}
              />
            </Stack>
          </GestureHandlerRootView>
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
