import { useMemo, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { API } from '@/service/api';
import { useAuth } from '@/context/AuthContext';

type SaveAlertPreferencesDTO = {
  state: string;
  cities: string[];
  pushToken: string;
};

type StateOption = {
  id: string;
  name: string;
};

type FetchCitiesResponse = {
  state: string;
  cities: string[];
};

async function getPushToken() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Notificações desativadas',
      'Precisamos da sua permissão para enviar alertas da sua localidade.',
      [
        { text: 'Agora nao', style: 'cancel' },
        {
          text: 'Abrir configuracoes',
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ]
    );

    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error('Projeto EAS não configurado para notificações push.');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const response = await Notifications.getExpoPushTokenAsync({ projectId });

  return response.data;
}

export function useSettingsNotifications(states: StateOption[]) {
  const { authentication } = useAuth();

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false);

  const stateData = useMemo(
    () => states.find((state) => state.id === selectedState) ?? null,
    [states, selectedState]
  );

  const savePreferencesMutation = useMutation({
    mutationFn: async (payload: SaveAlertPreferencesDTO) =>
      API.post('/user/alert-preferences', payload),
    onSuccess: () => {
      Alert.alert(
        'Preferências salvas',
        `Você receberá alertas para ${stateData?.name ?? 'seu estado'} nas cidades: ${selectedCities.join(', ')}.`
      );
    },
    onError: () => {
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar suas preferências agora. Tente novamente.'
      );
    },
  });

  const fetchCitiesMutation = useMutation({
    mutationFn: async (stateId: string) => {
      const response = await API.get<FetchCitiesResponse>('/location/cities', {
        params: { state: stateId },
      });

      return response.data;
    },
    onSuccess: (data) => {
      setCities(data.cities);
    },
    onError: () => {
      setCities([]);
      Alert.alert(
        'Erro ao carregar cidades',
        'Não foi possível buscar as cidades desse Estado agora. Tente novamente.'
      );
    },
  });

  async function handleSelectState(stateId: string) {
    setSelectedState(stateId);
    setSelectedCities([]);
    setCities([]);
    setIsStateOpen(false);
    setIsCitiesOpen(false);

    try {
      await fetchCitiesMutation.mutateAsync(stateId);
    } catch {
      // Alert handled by the mutation.
    }
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]
    );
  }

  async function handleSave() {
    if (!authentication.authenticated) {
      setShouldAuthenticate(true);
      return;
    }

    if (!selectedState) {
      Alert.alert(
        'Erro ao salvar',
        'Selecione um Estado antes de salvar suas preferências.'
      );
      return;
    }

    if (selectedCities.length === 0) {
      Alert.alert(
        'Erro ao salvar',
        'Selecione pelo menos uma cidade antes de salvar suas preferências.'
      );
      return;
    }

    if (!stateData) {
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possível identificar o Estado selecionado.'
      );
      return;
    }

    try {
      const pushToken = await getPushToken();

      if (!pushToken) return;

      await savePreferencesMutation.mutateAsync({
        state: stateData.id,
        cities: selectedCities,
        pushToken,
      });
    } catch {
      Alert.alert(
        'Erro nas notificações',
        'Nao foi possível ativar as notificações neste dispositivo.'
      );
    }
  }

  return {
    selectedState,
    selectedCities,
    cities,
    isStateOpen,
    isCitiesOpen,
    stateData,
    isSaving: savePreferencesMutation.status === 'pending',
    isFetchingCities: fetchCitiesMutation.status === 'pending',
    shouldAuthenticate,
    setIsStateOpen,
    setIsCitiesOpen,
    setShouldAuthenticate,
    handleSelectState,
    toggleCity,
    handleSave,
  };
}
