import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CustomAlert from '../shared/CustomAlert';
import CloseButton from '../shared/CloseButton';
import { COLORS } from '@/styles/colors';

interface Props {
  close: () => void;
}

const SuccessMessage = ({ close }: Props) => {
  return (
    <CustomAlert>
      <CloseButton
        onPress={close}
        color={COLORS.gray}
        style={styles.closeButton}
      />
      <View style={styles.iconContainer}>
        <FontAwesome5 name="check-circle" size={75} color={COLORS.green} />
      </View>
      <Text style={styles.title}>
        Obrigado por contribuir para a segurança da comunidade!
      </Text>
      <Text style={styles.message}>
        Estamos analisando a imagem enviada. Assim que for confirmada, a área
        será marcada como alagada no mapa.
      </Text>
    </CustomAlert>
  );
};

const styles = StyleSheet.create({
  closeButton: { alignSelf: 'flex-end' },
  iconContainer: { marginVertical: 15, alignItems: 'center' },
  title: {
    fontSize: 17,
    color: '#333',
    marginVertical: 12,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    marginHorizontal: 20,
  },
});

export default SuccessMessage;
