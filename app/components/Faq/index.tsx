import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '../ui/ThemedView';
import { ThemedText } from '../ui/ThemedText';
import { IFAQ } from '@/hooks/useFaq';

type Props = {
  faqs: IFAQ[];
  theme: string;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
};

const Faqs = ({ faqs, theme, openIndex, setOpenIndex }: Props) => {
  return faqs.map((item, index) => (
    <ThemedView
      key={index}
      style={[
        styles.accordionContainer,
        {
          borderColor: theme === 'light' ? '#BDBDBD' : '#444',
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.accordionHeader,
          { backgroundColor: theme === 'light' ? '#BDBDBD' : '#555' },
        ]}
        onPress={() => setOpenIndex(openIndex === index ? null : index)}
      >
        <ThemedText type="defaultSemiBold">{`${index + 1}. ${item.question}`}</ThemedText>
      </TouchableOpacity>
      {openIndex === index && (
        <ThemedText
          style={[
            styles.accordionContent,
            { backgroundColor: theme === 'light' ? '#F5F5F5' : '#333' },
          ]}
        >
          {item.answer}
        </ThemedText>
      )}
    </ThemedView>
  ));
};

const styles = StyleSheet.create({
  accordionContainer: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 5,
    overflow: 'hidden',
  },
  accordionHeader: {
    backgroundColor: '#BDBDBD',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  accordionContent: {
    padding: 12,
    backgroundColor: '#F5F5F5',
    textAlign: 'auto',
  },
});

export default Faqs;
