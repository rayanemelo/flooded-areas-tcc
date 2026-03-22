import { COLORS } from '@/styles/colors';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';

type Props = TouchableOpacityProps & {
  type: 'outline' | 'filled';
  text: string;
  isLoading?: boolean;
};

const Button = ({ type, text, isLoading, disabled, ...rest }: Props) => {
  const buttonStyle = type === 'outline' ? styles.outline : styles.filled;

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, disabled && { opacity: 0.5 }]}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={text}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={type === 'outline' ? COLORS.blue : COLORS.white}
        />
      ) : (
        <Text
          style={type === 'outline' ? styles.outlineText : styles.filledText}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
