import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { COLORS } from '@/styles/colors';
import { useSettingsNotifications } from '@/hooks/useSettingsNotifications';

type StateType = {
  id: string;
  name: string;
  cities: string[];
};

const STATES: StateType[] = [
  {
    id: 'RS',
    name: 'Rio Grande do Sul',
    cities: ['Porto Alegre', 'Sapiranga', 'Novo Hamburgo', 'Taquara'],
  },
  {
    id: 'SP',
    name: 'Sao Paulo',
    cities: ['Sao Paulo', 'Campinas', 'Santos', 'Sorocaba'],
  },
  {
    id: 'SC',
    name: 'Santa Catarina',
    cities: ['Florianopolis', 'Blumenau', 'Joinville'],
  },

];

function SettingsNotificationContent() {
  const colorScheme = useColorScheme() ?? 'light';
  const isLightTheme = colorScheme === 'light';

  const colors = {
    background: isLightTheme ? COLORS.white : COLORS.black,
    title: isLightTheme ? '#111827' : COLORS.white,
    subtitle: isLightTheme ? '#6B7280' : COLORS.gray,
    label: isLightTheme ? '#374151' : COLORS.white,
    helper: isLightTheme ? '#6B7280' : COLORS.gray,
    inputBorder: isLightTheme ? '#E5E7EB' : '#3F3F46',
    inputBackground: isLightTheme ? '#FAFAFA' : '#2A2A2A',
    inputText: isLightTheme ? '#111827' : COLORS.white,
    placeholder: isLightTheme ? '#9CA3AF' : '#A1A1AA',
    icon: isLightTheme ? '#6B7280' : '#A1A1AA',
    dropdownBackground: isLightTheme ? COLORS.white : '#1F1F1F',
    optionText: isLightTheme ? '#374151' : '#E5E7EB',
    optionTextSelected: isLightTheme ? '#111827' : COLORS.white,
    optionSelectedBackground: isLightTheme ? '#F0F9FF' : 'rgba(0, 126, 164, 0.18)',
  };

  const {
    selectedState,
    selectedCities,
    isStateOpen,
    isCitiesOpen,
    stateData,
    isSaving,
    setIsStateOpen,
    setIsCitiesOpen,
    handleSelectState,
    toggleCity,
    handleSave,
  } = useSettingsNotifications(STATES);

  const selectedStateLabel = stateData?.name ?? 'Selecione...';
  const selectedCitiesLabel =
    selectedCities.length > 0 ? selectedCities.join(', ') : 'Selecione...';

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: colors.title }]}>
        Notificações por localidade
      </Text>
      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        Escolha um Estado e selecione as cidades onde você deseja receber alertas.
      </Text>

      <Text style={[styles.label, { color: colors.label }]}>Estado</Text>
      <Pressable
        style={[
          styles.inputField,
          {
            borderColor: colors.inputBorder,
            backgroundColor: colors.inputBackground,
          },
        ]}
        onPress={() => setIsStateOpen((current) => !current)}
      >
        <Text
          style={[
            styles.inputValue,
            { color: colors.inputText },
            !selectedState && styles.placeholderText,
            !selectedState && { color: colors.placeholder },
          ]}
        >
          {selectedStateLabel}
        </Text>
        <Ionicons
          name={isStateOpen ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.icon}
        />
      </Pressable>

      {isStateOpen && (
        <View
          style={[
            styles.dropdown,
            {
              borderColor: colors.inputBorder,
              backgroundColor: colors.dropdownBackground,
            },
          ]}
        >
          <ScrollView
            style={styles.dropdownScrollArea}
            contentContainerStyle={styles.dropdownScrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {STATES.map((state) => {
              const isSelected = state.id === selectedState;

              return (
                <Pressable
                  key={state.id}
                  style={[
                    styles.optionRow,
                    {
                      borderColor: colors.inputBorder,
                    },
                    isSelected && styles.optionRowSelected,
                    isSelected && {
                      backgroundColor: colors.optionSelectedBackground,
                    },
                  ]}
                  onPress={() => handleSelectState(state.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.optionText },
                      isSelected && styles.optionTextSelected,
                      isSelected && { color: colors.optionTextSelected },
                    ]}
                  >
                    {state.name}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.lightBlue}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {stateData && (
        <>
          <Text style={[styles.label, { color: colors.label }]}>Cidades</Text>
          <Pressable
            style={[
              styles.inputField,
              {
                borderColor: colors.inputBorder,
                backgroundColor: colors.inputBackground,
              },
            ]}
            onPress={() => setIsCitiesOpen((current) => !current)}
          >
            <Text
              style={[
                styles.inputValue,
                { color: colors.inputText },
                selectedCities.length === 0 && styles.placeholderText,
                selectedCities.length === 0 && { color: colors.placeholder },
              ]}
              numberOfLines={1}
            >
              {selectedCitiesLabel}
            </Text>
            <Ionicons
              name={isCitiesOpen ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.icon}
            />
          </Pressable>

          {isCitiesOpen && (
            <View
              style={[
                styles.dropdown,
                {
                  borderColor: colors.inputBorder,
                  backgroundColor: colors.dropdownBackground,
                },
              ]}
            >
              <ScrollView
                style={styles.dropdownScrollArea}
                contentContainerStyle={styles.dropdownScrollContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {stateData.cities.map((city) => {
                  const isSelected = selectedCities.includes(city);

                  return (
                    <Pressable
                      key={city}
                      style={[
                        styles.optionRow,
                        {
                          borderColor: colors.inputBorder,
                        },
                        isSelected && styles.optionRowSelected,
                        isSelected && {
                          backgroundColor: colors.optionSelectedBackground,
                        },
                      ]}
                      onPress={() => toggleCity(city)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: colors.optionText },
                          isSelected && styles.optionTextSelected,
                          isSelected && { color: colors.optionTextSelected },
                        ]}
                      >
                        {city}
                      </Text>
                      <Ionicons
                        name={isSelected ? 'checkbox' : 'square-outline'}
                        size={20}
                        color={isSelected ? COLORS.lightBlue : colors.icon}
                      />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
          <Text style={[styles.helperText, { color: colors.helper }]}>
            Voce pode selecionar mais de uma cidade.
          </Text>
        </>
      )}

      <Pressable
        style={[styles.button, isSaving && styles.buttonDisabled]}
        onPress={() => {
          void handleSave();
        }}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>
          {isSaving ? 'Salvando...' : 'Salvar preferencias'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

export default function SettingsNotificationScreen() {
  return <SettingsNotificationContent />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 22,
  },
  label: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 8,
    lineHeight: 20,
  },
  inputField: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputValue: {
    flex: 1,
    fontSize: 16,
  },
  placeholderText: {},
  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  dropdownScrollArea: {
    maxHeight: 220,
  },
  dropdownScrollContent: {
    gap: 8,
  },
  optionRow: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionRowSelected: {
    borderColor: COLORS.lightBlue,
  },
  optionText: {
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  button: {
    marginTop: 30,
    backgroundColor: COLORS.lightBlue,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
