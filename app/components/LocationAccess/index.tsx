import { COLORS } from '@/styles/colors';
import CloseButton from '../shared/CloseButton';
import CustomAlert from '../shared/CustomAlert';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../shared/Button';
import { useUserLocation } from '@/hooks/useUserLocation';

type Props = {
  close: () => void;
};

export function LocationAccess({ close }: Props) {
  const { requestLocationPermission } = useUserLocation();

  return (
    <CustomAlert>
      <CloseButton
        onPress={close}
        color={COLORS.gray}
        style={styles.closeButton}
      />
      <View style={styles.wrapper}>
        <Text style={styles.text}>
          Você está prestes a marcar um ponto de alagamento. Deseja permitir o
          uso da sua localização atual?
        </Text>
        <View style={styles.buttonContainer}>
          <Button type="outline" onPress={close} text="Cancelar" />
          <Button
            type="filled"
            onPress={requestLocationPermission}
            text="Confirmar"
          />
        </View>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  closeButton: { alignSelf: 'flex-end' },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.black,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});
