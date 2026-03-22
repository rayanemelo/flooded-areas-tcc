import { View, Text, StyleSheet } from 'react-native';
import Modal from '../shared/Modal';
import { COLORS } from '@/styles/colors';
import Button from '../shared/Button';
import { useFloodAreaForm } from '@/stores/flood-area-form';

type Props = {
  // address: string;
  isVisible: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
};

const ConfirmFloodLocation = ({
  isVisible,
  handleCancel: handleCancel,
  handleConfirm,
}: Props) => {
  const { floodAreaForm } = useFloodAreaForm();
  return (
    <Modal isVisible={isVisible}>
      <Text style={styles.title}>
        Deseja marcar este local como ponto de alagamento?
      </Text>
      <Text style={styles.address}>{floodAreaForm.address}</Text>
      <View style={styles.buttonContainer}>
        <Button type="outline" onPress={handleCancel} text="Não" />
        <Button type="filled" onPress={handleConfirm} text="Sim" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.black,
  },
  address: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    color: COLORS.black,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default ConfirmFloodLocation;
