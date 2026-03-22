import { COLORS } from '@/styles/colors';
import { View, Text, StyleSheet } from 'react-native';

type Props = { text: string };

const InfoMessage = ({ text }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Elevação para Android
  },
  messageText: { fontSize: 16, textAlign: 'center', color: COLORS.black },
});

export default InfoMessage;
