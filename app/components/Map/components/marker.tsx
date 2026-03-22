import { FontAwesome5 } from '@expo/vector-icons';
import { Marker, MapMarkerProps } from 'react-native-maps';

const CustomMarker = ({ ...rest }: MapMarkerProps) => {
  return (
    <Marker {...rest}>
      <FontAwesome5 name="map-marker-alt" size={35} color="#D84040" />
    </Marker>
  );
};

export default CustomMarker;
