import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { StyleSheet, View } from 'react-native';
import Tag from '@/components/shared/Tag';
import { mapStatusToTagType } from '@/utils/functions/map-status-to-tag-type';
import { formatCustomDate } from '@/utils/functions/format-custom-date';
import SeeImagensButton from '@/components/shared/SeeImagensButton';
import { useHistoryDetails } from '@/hooks/useHistoryDetails';
import ImageCarousel from '@/components/ImageCarousel';

export default function HistoryDetails() {
  const { history, setVisibleImages, visibleImages } = useHistoryDetails();
  return history ? (
    <ThemedView style={styles.wrapper}>
      <View style={{ flex: 1, gap: 16 }}>
        <View>
          <ThemedText style={styles.bold}>Local</ThemedText>
          <ThemedText>{history.address}</ThemedText>
          <ThemedText>{formatCustomDate(history.createdAt)}</ThemedText>
        </View>

        <View style={styles.flex}>
          <ThemedText style={styles.bold}>Status</ThemedText>
          <Tag type={mapStatusToTagType(history.status)} />
        </View>

        <View style={styles.flex}>
          <ThemedText style={styles.bold}>Nível da enchente</ThemedText>
          <Tag type={history.floodLevelId} />
        </View>

        {history.commentsAdmin && (
          <View style={styles.border}>
            <ThemedText style={[styles.bold, styles.flex]}>
              Comentários
            </ThemedText>
            <ThemedText>{history.commentsAdmin}</ThemedText>
          </View>
        )}

        <SeeImagensButton
          text="Ver imagem"
          onPress={() => setVisibleImages(true)}
        />
      </View>

      {visibleImages && history.images && (
        <ImageCarousel
          images={history.images}
          onClose={() => setVisibleImages(false)}
        />
      )}
    </ThemedView>
  ) : null;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#D9D9D9',
    paddingVertical: 16,
    marginTop: 16,
  },
});
