import { Marker } from 'react-native-maps';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/styles/colors';
import { FloodArea } from '@/types/flood-area';
import { useFloodedAreas } from '@/hooks/useFloodedAreas';

type Props = {
  selectedArea: FloodArea | null;
  onAreaPress: (area: FloodArea) => void;
};

const FloodedAreas = ({ selectedArea, onAreaPress }: Props) => {
  const { floodedAreas } = useFloodedAreas();
  // console.log('floodedAreas: ', floodedAreas);

  return floodedAreas?.map((area, index) => (
    <Marker
      coordinate={area}
      key={index}
      onPress={(e) => {
        e.stopPropagation();
        onAreaPress(area);
      }}
    >
      <View
        style={[
          styles.container,
          selectedArea?.id === area.id && styles.selectedArea,
          {
            backgroundColor: area.status.includes('pending')
              ? COLORS.orange
              : COLORS.lightBlue,
          },
        ]}
      >
        <MaterialIcons name="waves" size={19} color="white" />
      </View>
    </Marker>
  ));
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightBlue,
    padding: 6,
    borderRadius: 100,
  },
  selectedArea: { backgroundColor: COLORS.red },
});

export default FloodedAreas;
