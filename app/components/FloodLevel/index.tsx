import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Button from '../shared/Button';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import CustomAlert from '../shared/CustomAlert';
import { COLORS } from '@/styles/colors';
import { styles } from './styles';
import { useFloodAreaForm } from '@/stores/flood-area-form';
import { useMarkerFlood } from '@/context/MarkerFloodContext';

type Props = {
  onClose: () => void;
  handleContinue: () => void;
};

const FloodLevel = ({ onClose, handleContinue }: Props) => {
  const { floodAreaForm, setFloodAreaForm } = useFloodAreaForm();

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { isLoading } = useMarkerFlood();

  const floodLevels = [
    {
      id: 1,
      title: 'Leve',
      description: 'Água cobrindo apenas a rua.',
      color: COLORS.yellow,
      borderColor: '#FDE9AB',
      icon: <Entypo name="water" size={22} color="white" />,
    },
    {
      id: 2,
      title: 'Moderado',
      description: 'Água invadindo calçadas e imóveis.',
      color: COLORS.orange,
      borderColor: '#F5D699',
      icon: <FontAwesome6 name="water" size={22} color="white" />,
    },
    {
      id: 3,
      title: 'Interditado',
      description: 'Impossível transitar pelo local.',
      color: COLORS.red,
      borderColor: '#EA9E9E',
      icon: <FontAwesome6 name="house-flood-water" size={22} color="white" />,
    },
  ];

  function handleSelectedLevel(level: number) {
    if (selectedLevel === level) {
      setSelectedLevel(null);
      return;
    }

    setSelectedLevel(level);

    setFloodAreaForm({
      ...floodAreaForm,
      floodLevelId: level,
    });
  }

  return (
    <CustomAlert>
      <Text style={styles.title}>Qual é o nível da enchente neste local?</Text>
      {floodLevels.map((level) => (
        <TouchableOpacity
          key={level.id}
          style={styles.levelButton}
          onPress={() => handleSelectedLevel(level.id)}
        >
          <View
            style={[
              styles.levelIcon,
              {
                backgroundColor: level.color,
                borderColor:
                  selectedLevel === level.id ? COLORS.black : level.borderColor,
              },
            ]}
          >
            {level.icon}
          </View>
          <View>
            <Text style={styles.levelTitle}>{level.title}</Text>
            <Text style={styles.levelDescription}>{level.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.buttonContainer}>
        <Button text="Cancelar" onPress={onClose} type="outline" />

        <Button
          text="Continuar"
          onPress={handleContinue}
          disabled={selectedLevel === null}
          type="filled"
          isLoading={isLoading}
        />
      </View>
    </CustomAlert>
  );
};

export default FloodLevel;
