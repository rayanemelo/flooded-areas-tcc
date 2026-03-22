import Button from '@/components/shared/Button';
import { View, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { styles } from './styles';
import { cleanNumber } from '@/utils/functions/format-phone';

type Props = {
  form: { phone: string; code: string[] };
  setForm: (form: { phone: string; code: string[] }) => void;
  handleContinue: () => void;
  handleCancel: () => void;
};

const PhoneNumber = ({
  form,
  setForm,
  handleContinue,
  handleCancel,
}: Props) => {
  return (
    <View>
      <Text style={styles.title}>
        Para continuar, digite seu número de telefone para receber o código de
        verificação
      </Text>
      <TextInputMask
        style={styles.input}
        placeholder="(99) 99999-9999"
        value={form.phone}
        onChangeText={(phone) => {
          const formattedPhone = cleanNumber(phone);
          setForm({ ...form, phone: formattedPhone });
        }}
        keyboardType="phone-pad"
        maxLength={15}
        type={'custom'}
        options={{ mask: '(99) 99999-9999' }}
        placeholderTextColor="#aaa"
      />
      <View style={styles.buttonContainer}>
        <Button text="Cancelar" onPress={handleCancel} type="outline" />
        <Button
          text="Continuar"
          onPress={handleContinue}
          type="filled"
          disabled={form.phone.length < 11}
        />
      </View>
    </View>
  );
};

export default PhoneNumber;
