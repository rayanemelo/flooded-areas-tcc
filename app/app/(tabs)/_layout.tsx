import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/ui/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/context/AuthContext';
import { MarkerFloodProvider } from '@/context/MarkerFloodContext';
import { COLORS } from '@/styles/colors';
import { FaqIcon } from '@/components/shared/FaqIcon';
import { SignOut } from '@/components/shared/SignOut';
import { SettingsNotificationIcon } from '@/components/ListNotification/components/SettingsIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { authentication } = useAuth();

  return (
    <MarkerFloodProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapa',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="map-marker-alt" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            headerTitle: 'HISTÓRICO',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="folder" size={24} color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === 'light'
                  ? COLORS.lightThemeBackground
                  : COLORS.blackDefault,
            },
            headerTitleStyle: {
              fontSize: 16,
              color: colorScheme === 'light' ? COLORS.black : COLORS.white,
              fontWeight: 'bold',
            },
            headerTintColor: COLORS.grayDark,
            headerRight() {
              if (!authentication.authenticated) return <></>;
              return <SignOut />;
            },
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notificações',
            headerTitle: 'NOTIFICAÇÕES',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" size={24} color={color} />
            ),
            headerStyle: {
              backgroundColor:
                colorScheme === 'light'
                  ? COLORS.lightThemeBackground
                  : COLORS.blackDefault,
            },
            headerTitleStyle: {
              fontSize: 16,
              color: colorScheme === 'light' ? COLORS.black : COLORS.white,
              fontWeight: 'bold',
            },
            headerTintColor: COLORS.grayDark,
            headerRight() {
              return <FaqIcon />;
            },
            headerLeft() {
              return <SettingsNotificationIcon />;
            }
          }}
        />
      </Tabs>
    </MarkerFloodProvider>
  );
}
