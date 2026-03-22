import { View, Text } from 'react-native';
import { COLORS } from '@/styles/colors';
import Tag from '../../shared/Tag';
import CloseButton from '../../shared/CloseButton';
import { styles } from '../styles';
import SeeImagens from '../../shared/SeeImagensButton';
import { FloodArea } from '@/types/flood-area';
import { formatDate } from '@/utils/functions/format-date';

type Props = {
  area: FloodArea;
  onClose: () => void;
  onPress: () => void;
};

export function PublicArea({ area, onClose, onPress }: Props) {
  const { createdAt, address } = area;
  const publishedDateRelativeToNow = formatDate(createdAt);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.address}>{address}</Text>
        <CloseButton onPress={onClose} color={COLORS.gray} />
      </View>
      <View style={styles.content}>
        <Text style={styles.createdAt}>
          Criado {publishedDateRelativeToNow}
        </Text>
        <Tag type={area.floodLevelId} />
      </View>
      <SeeImagens onPress={onPress} text="Ver imagens" />
    </View>
  );
}
