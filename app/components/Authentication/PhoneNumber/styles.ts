import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  title: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
});
