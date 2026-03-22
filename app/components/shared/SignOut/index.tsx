import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/styles/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from 'react-native';

export const SignOut = () => {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme();

  return (
    <MaterialIcons
      name="logout"
      size={22}
      color={colorScheme === 'light' ? COLORS.grayDark : COLORS.gray}
      onPress={signOut}
      style={{ paddingRight: 16 }}
    />
  );
};
