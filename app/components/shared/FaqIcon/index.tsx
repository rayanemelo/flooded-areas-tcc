import { COLORS } from '@/styles/colors';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TouchableOpacity, useColorScheme } from 'react-native';

export const FaqIcon = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={{ paddingRight: 16 }}
      onPress={() => router.push('/faq')}
    >
      <Entypo
        name="help-with-circle"
        size={22}
        color={colorScheme === 'light' ? COLORS.grayDark : COLORS.gray}
      />
    </TouchableOpacity>
  );
};
