import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = TouchableOpacityProps & {
  color?: string;
};

const CloseButton = ({ color = 'white', ...rest }: Props) => (
  <TouchableOpacity {...rest}>
    <AntDesign name="close-circle" size={28} color={color} />
  </TouchableOpacity>
);

export default CloseButton;