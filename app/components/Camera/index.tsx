import { useCameraPermissions } from 'expo-camera';
import { View } from 'react-native';
import CameraPermissions from './CameraPermissions';
import { useRef, useState } from 'react';
import RenderCamera from './RenderCamera';
import RenderPhoto from './RenderPhoto';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFloodAreaForm } from '@/stores/flood-area-form';
import { styles } from './styles';
import * as FileSystem from 'expo-file-system/legacy';

type Props = {
  onClose: () => void;
  sendPhoto: () => void;
};

const Camera = ({ onClose, sendPhoto }: Props) => {
  const { floodAreaForm, setFloodAreaForm } = useFloodAreaForm();

  const [permission] = useCameraPermissions();
  const cameraRef = useRef<any | null>();
  const [photoUri, setPhotoUri] = useState<string | null>();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return <CameraPermissions />;
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });
      setPhotoUri(photo?.uri);

      const base64Image = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setFloodAreaForm({
        ...floodAreaForm,
        image: `data:image/jpeg;base64,${base64Image}`,
      });
    }
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        {photoUri ? (
          <RenderPhoto
            photoUri={photoUri}
            setPhotoUri={setPhotoUri}
            onClose={onClose}
            sendPhoto={sendPhoto}
          />
        ) : (
          <RenderCamera
            cameraRef={cameraRef}
            onClose={onClose}
            takePicture={takePicture}
          />
        )}
      </GestureHandlerRootView>
    </View>
  );
};

export default Camera;
