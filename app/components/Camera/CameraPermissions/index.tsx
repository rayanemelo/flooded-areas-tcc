import { useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, View } from 'react-native';

const CameraPermissions = () => {
  const [permission, requestPermission] = useCameraPermissions();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>We need your permission to show the camera</Text>
      <Button onPress={requestPermission} title="grant permission" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '91%',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});

export default CameraPermissions;