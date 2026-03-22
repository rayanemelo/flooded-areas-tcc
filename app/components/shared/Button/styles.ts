import { COLORS } from '@/styles/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    borderRadius: 6,
    height: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D4DAE1',
  },
  filled: { backgroundColor: COLORS.blue },
  outlineText: { color: COLORS.blue, textAlign: 'center' },
  filledText: { color: COLORS.white, textAlign: 'center' },
});
