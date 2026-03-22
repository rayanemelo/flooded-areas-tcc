import { ThemedText } from '@/components/ui/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView';
import { COLORS } from '@/styles/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type AuthPromptProps = {
  onAuthenticate: () => void;
};

const AuthPrompt: React.FC<AuthPromptProps> = ({ onAuthenticate }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="map-marker-account"
          size={120}
          color={COLORS.lightBlue}
        />
        <ThemedText style={styles.message}>
          Para acessar sua conta, entre com seu número de telefone
        </ThemedText>
      </View>
      <View style={styles.textContainer}>
        <TouchableOpacity style={styles.button} onPress={onAuthenticate}>
          <Text style={styles.buttonText}>Acessar</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginTop: 120,
  },
  iconContainer: {
    paddingTop: 60,
    gap: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2 / 4,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 300,
  },
  button: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 6,
    padding: 15,
    width: 320,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AuthPrompt;
