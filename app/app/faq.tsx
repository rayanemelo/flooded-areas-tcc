import { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import ParallaxScrollView from '@/components/ui/ParallaxScrollView';
import { ThemedView } from '@/components/ui/ThemedView';
import { useFaqs } from '@/hooks/useFaq';
import Faqs from '@/components/Faq';
import CustomThemedView from '@/components/shared/CustomThemedView';

export default function FAQScreen() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const theme = useColorScheme() ?? 'light';

  const { faqs } = useFaqs();

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.container}>
        {faqs.length > 0 ? (
          <Faqs
            faqs={faqs}
            theme={theme}
            openIndex={openIndex}
            setOpenIndex={setOpenIndex}
          />
        ) : (
          <CustomThemedView text="Nenhuma pergunta foi encontrada" />
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 8,
    paddingBottom: 100,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
