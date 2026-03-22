import { COLORS } from '@/styles/colors';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export const SettingsNotificationIcon = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={{ paddingLeft: 16 }}
      onPress={() => router.push('/settings-notification')}
    >
      <Entypo
        name="cog"
        size={22}
        color={colorScheme === 'light' ? COLORS.grayDark : COLORS.gray}
      />
    </TouchableOpacity>
  );
};
