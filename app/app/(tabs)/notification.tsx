import { StyleSheet, useColorScheme, View } from 'react-native';

import { useNotifications } from '@/hooks/useNotifications';
import CustomThemedView from '@/components/shared/CustomThemedView';
import { ListNotifications } from '@/components/ListNotification';
import { COLORS } from '@/styles/colors';

export default function NotificationScreen() {
  const { notifications } = useNotifications();

  const theme = useColorScheme() ?? 'light';
  const colorTheme = theme === 'light' ? COLORS.white : COLORS.black;

  return (
    <View style={[styles.container, { backgroundColor: colorTheme }]}>
      {notifications.length > 0 ? (
        <ListNotifications />
      ) : (
        <CustomThemedView text="Nenhuma notificação foi encontrada. Configure suas cidades para começar a receber alertas." />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
