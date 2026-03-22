import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TouchableOpacityProps } from 'react-native-gesture-handler';

type Props = TouchableOpacityProps & {
  onPress: () => void;
  text: string;
};

const SeeImagensButton = ({ onPress, text }: Props) => {
  return (
    <TouchableOpacity style={styles.imagesButton} onPress={onPress}>
      <Feather name="camera" size={18} color="black" />
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export const styles = StyleSheet.create({
  imagesButton: {
    borderRadius: 6,
    padding: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D4DAE1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default SeeImagensButton;
