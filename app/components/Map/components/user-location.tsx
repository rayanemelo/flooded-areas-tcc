import { Marker } from 'react-native-maps';

import { StyleSheet, View } from 'react-native';

type Props = {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const UserLocation = ({ userLocation }: Props) => {
  return userLocation && (
    <Marker coordinate={userLocation}>
      <View style={styles.shadow}>
        <View style={styles.white} >
          <View style={styles.blue} />
        </View>
      </View>
    </Marker>
  );
};


const styles = StyleSheet.create({
  blue: {
    backgroundColor: '#007EA4',
    padding: 8,
    borderRadius: '100%',
  },
  white: {
    opacity: 0.9,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: '100%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }

});

export default UserLocation;