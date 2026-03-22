import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomAlert from '../shared/CustomAlert';
import CloseButton from '../shared/CloseButton';
import { COLORS } from '@/styles/colors';

interface Props {
  close: () => void;
}

const ErrorMessage = ({ close }: Props) => {
  return (
    <CustomAlert>
      <CloseButton
        onPress={close}
        color={COLORS.gray}
        style={styles.closeButton}
      />
      <View style={styles.iconContainer}>
        <Ionicons name="close-circle-outline" size={75} color="#D84040" />
      </View>
      <Text style={styles.title}>
        Algo deu errado. Por favor, tente novamente mais tarde.
      </Text>
    </CustomAlert>
  );
};

const styles = StyleSheet.create({
  closeButton: { alignSelf: 'flex-end' },
  iconContainer: { alignItems: 'center' },
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

export default ErrorMessage;
