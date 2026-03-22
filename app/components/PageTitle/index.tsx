import { COLORS } from '@/styles/colors';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Link } from 'expo-router';
import { useNavigation } from 'expo-router';
type Props = { text: string; backButton?: boolean; helpButton?: boolean };

const PageTitle = ({ text, backButton = false, helpButton = true }: Props) => {
  const theme = useColorScheme() ?? 'light';
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {backButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Entypo
            name="chevron-left"
            size={22}
            color={theme === 'light' ? COLORS.grayDark : COLORS.gray}
          />
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.text,
          { color: theme === 'light' ? COLORS.black : '#FFF' },
        ]}
      >
        {text}
      </Text>
      {helpButton && (
        <Link href="/faq" asChild>
          <TouchableOpacity style={{ position: 'absolute', right: 16 }}>
            <Entypo
              name="help-with-circle"
              size={22}
              color={theme === 'light' ? COLORS.grayDark : COLORS.gray}
            />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingBottom: 16,
    borderBottomColor: '#BDBDBD',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: COLORS.black,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: -16,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
});

export default PageTitle;
