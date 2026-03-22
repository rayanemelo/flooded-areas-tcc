import { COLORS } from '@/styles/colors';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

type Props = ViewProps & {
  type: number;
};

const Tag = ({ type, ...rest }: Props) => {
  const types: Record<number, { color: string; label: string }> = {
    1: {
      color: COLORS.yellow,
      label: 'Leve',
    },
    2: {
      color: COLORS.orange,
      label: 'Moderado',
    },
    3: {
      color: COLORS.red,
      label: 'Interditado',
    },
    4: {
      color: '#40AAD8',
      label: 'Em análise',
    },
    5: {
      color: COLORS.green,
      label: 'Aprovado',
    },
    6: {
      color: COLORS.red,
      label: 'Rejeitado',
    },
  };

  return (
    <View
      style={[styles.container, { backgroundColor: types[type]?.color }]}
      {...rest}
    >
      <Text style={styles.label}>{types[type]?.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 5,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Tag;
