import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { COLORS } from '@/styles/colors';
import { useSettingsNotifications } from '@/hooks/useSettingsNotifications';
import statesData from '@/constants/states.json';
import Authentication from '@/components/Authentication';

type StateType = {
  id: string;
  name: string;
};

type RawStateType = {
  codigo_uf: number;
  uf: string;
  nome: string;
  latitude: number;
  longitude: number;
  regiao: string;
};

const STATES: StateType[] = (statesData as RawStateType[]).map((state) => ({
  id: state.uf,
  name: state.nome,
}))
  .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

function SettingsNotificationContent() {
  const colorScheme = useColorScheme() ?? 'light';
  const isLightTheme = colorScheme === 'light';
  const [citySearch, setCitySearch] = useState('');

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
    cities,
    isStateOpen,
    isCitiesOpen,
    stateData,
    isSaving,
    isFetchingCities,
    shouldAuthenticate,
    setIsStateOpen,
    setIsCitiesOpen,
    setShouldAuthenticate,
    handleSelectState,
    toggleCity,
    handleSave,
  } = useSettingsNotifications(STATES);

  const selectedStateLabel = stateData?.name ?? 'Selecione...';
  const selectedCitiesLabel =
    selectedCities.length > 0 ? selectedCities.join(', ') : 'Selecione...';
  const isCitiesDisabled =
    !selectedState || isFetchingCities || cities.length === 0;
  const filteredCities = useMemo(() => {
    const normalizedSearch = citySearch.trim().toLocaleLowerCase('pt-BR');

    if (!normalizedSearch) {
      return cities;
    }

    return cities.filter((city) =>
      city.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
    );
  }, [cities, citySearch]);

  return (
    <>
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
                isCitiesDisabled && styles.buttonDisabled,
              ]}
              onPress={() => {
                if (isCitiesDisabled) return;
                setIsCitiesOpen((current) => !current);
              }}
              disabled={isCitiesDisabled}
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
                {isFetchingCities ? 'Carregando cidades...' : selectedCitiesLabel}
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
                <TextInput
                  value={citySearch}
                  onChangeText={setCitySearch}
                  placeholder="Buscar cidade..."
                  placeholderTextColor={colors.placeholder}
                  style={[
                    styles.searchInput,
                    {
                      borderColor: colors.inputBorder,
                      backgroundColor: colors.inputBackground,
                      color: colors.inputText,
                    },
                  ]}
                />
                <ScrollView
                  style={styles.dropdownScrollArea}
                  contentContainerStyle={styles.dropdownScrollContent}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {filteredCities.map((city) => {
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
                  {filteredCities.length === 0 && (
                    <View
                      style={[
                        styles.emptyState,
                        {
                          borderColor: colors.inputBorder,
                          backgroundColor: colors.inputBackground,
                        },
                      ]}
                    >
                      <Text style={[styles.emptyStateText, { color: colors.helper }]}>
                        Nenhuma cidade encontrada.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
            <Text style={[styles.helperText, { color: colors.helper }]}>
              {isFetchingCities
                ? 'Buscando cidades do Estado selecionado.'
                : 'Você pode selecionar mais de uma cidade.'}
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
            {isSaving ? 'Salvando...' : 'Salvar preferências'}
          </Text>
        </Pressable>


      </ScrollView>
      {shouldAuthenticate && (
        <View style={[StyleSheet.absoluteFillObject, styles.authOverlay]}>
          <Authentication
            handleCancel={() => {
              setShouldAuthenticate(false);
            }}
            handleConfirm={() => {
              setShouldAuthenticate(false);
            }}
          />
        </View>
      )}
    </>
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
  authOverlay: {
    top: -80,
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
  searchInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
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
  emptyState: {
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyStateText: {
    textAlign: 'center',
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
