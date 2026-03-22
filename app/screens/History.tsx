import { StyleSheet, useColorScheme } from 'react-native';

import { ThemedView } from '@/components/ui/ThemedView';
import CustomThemedView from '@/components/shared/CustomThemedView';
import { useHistory } from '@/hooks/useHistory';
import ListHistory from '@/components/ListHistory';
import { COLORS } from '@/styles/colors';

export default function History() {
  const { history } = useHistory();
  const theme = useColorScheme() ?? 'light';
  const colorTheme = theme === 'light' ? COLORS.white : COLORS.black;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colorTheme }]}>
      {history.length > 0 ? (
        <ListHistory />
      ) : (
        <CustomThemedView text="Nenhum histórico foi encontrado" />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
