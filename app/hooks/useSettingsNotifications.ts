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
      'Notificacoes desativadas',
      'Precisamos da sua permissao para enviar alertas da sua localidade.',
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
    throw new Error('Projeto EAS nao configurado para notificacoes push.');
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
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);

  const stateData = useMemo(
    () => states.find((state) => state.id === selectedState) ?? null,
    [states, selectedState]
  );

  const savePreferencesMutation = useMutation({
    mutationFn: async (payload: SaveAlertPreferencesDTO) =>
      API.post('/user/alert-preferences', payload),
    onSuccess: () => {
      Alert.alert(
        'Preferencias salvas',
        `Voce recebera alertas para ${stateData?.name ?? 'seu estado'} nas cidades: ${selectedCities.join(', ')}.`
      );
    },
    onError: () => {
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel salvar suas preferencias agora. Tente novamente.'
      );
    },
  });

  function handleSelectState(stateId: string) {
    setSelectedState(stateId);
    setSelectedCities([]);
    setIsStateOpen(false);
    setIsCitiesOpen(false);
  }

  function toggleCity(city: string) {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city]
    );
  }

  async function handleSave() {
    if (!authentication.authenticated) {
      Alert.alert(
        'Autenticacao necessaria',
        'Entre na sua conta para salvar preferencias de notificacao.'
      );
      return;
    }

    if (!selectedState) {
      Alert.alert(
        'Erro ao salvar',
        'Selecione um estado antes de salvar suas preferencias.'
      );
      return;
    }

    if (selectedCities.length === 0) {
      Alert.alert(
        'Erro ao salvar',
        'Selecione pelo menos uma cidade antes de salvar suas preferencias.'
      );
      return;
    }

    if (!stateData) {
      Alert.alert(
        'Erro ao salvar',
        'Nao foi possivel identificar o estado selecionado.'
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
        'Erro nas notificacoes',
        'Nao foi possivel ativar as notificacoes neste dispositivo.'
      );
    }
  }

  return {
    selectedState,
    selectedCities,
    isStateOpen,
    isCitiesOpen,
    stateData,
    isSaving: savePreferencesMutation.status === 'pending',
    setIsStateOpen,
    setIsCitiesOpen,
    handleSelectState,
    toggleCity,
    handleSave,
  };
}
