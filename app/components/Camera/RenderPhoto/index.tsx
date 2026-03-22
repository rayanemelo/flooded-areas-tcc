import Button from '@/components/shared/Button';
import CloseButton from '@/components/shared/CloseButton';
import { Image, Text, View } from 'react-native';
import { styles } from '../styles';

type Props = {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  onClose: () => void;
  sendPhoto: () => void;
};

const RenderPhoto = ({ photoUri, setPhotoUri, onClose, sendPhoto }: Props) => (
  <View style={styles.photoContainer}>
    <View style={styles.closeButton}>
      <CloseButton onPress={onClose} />
    </View>
    {photoUri ? (
      <Image source={{ uri: photoUri }} style={styles.capturedImage} />
    ) : null}

    <View style={styles.modal}>
      <Text style={styles.text}>
        Enviar foto para comprovar o alagamento neste local
      </Text>
      <View style={styles.buttons}>
        <Button
          type="outline"
          text="Tirar outra foto"
          onPress={() => setPhotoUri(null)}
        />
        <Button type="filled" text="Enviar Foto" onPress={sendPhoto} />
      </View>
    </View>
  </View>
);

export default RenderPhoto;
