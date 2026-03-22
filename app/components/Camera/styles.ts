import { COLORS } from '@/styles/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '91%',
    flex: 1,
    justifyContent: 'center',
  },
  infos: { flexDirection: 'row', alignItems: 'center', paddingLeft: 36 },
  closeButton: { position: 'absolute', top: 50, left: 20, zIndex: 1 },
  photoContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  capturedImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  modal: {
    position: 'absolute',
    display: 'flex',
    bottom: 20,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Elevação para Android
  },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 25 },
  buttons: { flexDirection: 'row', gap: 10 },
  camera: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: { marginBottom: 20 },
});
