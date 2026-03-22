import { COLORS } from '@/styles/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  levelButton: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  levelIcon: { borderRadius: 100, padding: 15, borderWidth: 3 },
  levelTitle: { fontSize: 16, fontWeight: 'bold' },
  levelDescription: { fontSize: 14, color: COLORS.grayDark },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
});
