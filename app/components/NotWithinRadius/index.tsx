import { COLORS } from '@/styles/colors';
import CloseButton from '../shared/CloseButton';
import CustomAlert from '../shared/CustomAlert';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  close: () => void;
};

export function NotWithinRadius({ close }: Props) {
  return (
    <CustomAlert>
      <CloseButton
        onPress={close}
        color={COLORS.gray}
        style={styles.closeButton}
      />
      <View style={styles.wrapper}>
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={60}
          color={COLORS.blue}
        />
        <Text style={styles.text}>
          Você precisa estar dentro de um raio de 100 metros da área que deseja
          marcar.
        </Text>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  closeButton: { alignSelf: 'flex-end' },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 18,
    paddingHorizontal: 14,
    gap: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.black,
  },
});
