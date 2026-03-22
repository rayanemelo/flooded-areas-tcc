import { View, Text } from 'react-native';
import { COLORS } from '@/styles/colors';
import CloseButton from '../../shared/CloseButton';
import { styles } from '../styles';
import SeeImagens from '../../shared/SeeImagensButton';
import { FloodArea } from '@/types/flood-area';

type Props = {
  area: FloodArea;
  onClose: () => void;
  onPress: () => void;
};

export function PrivatePendingArea({ area, onClose, onPress }: Props) {
  const { address } = area;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.address}>{address}</Text>
        <CloseButton onPress={onClose} color={COLORS.gray} />
      </View>
      <View style={styles.content}>
        <Text style={styles.pendingText}>
          Sua marcação está em analise. Assim que aprovada, ela estará
          disponível para todos os usuários visualizarem.
        </Text>
      </View>
      <SeeImagens onPress={onPress} text="Ver imagens" />
    </View>
  );
}
