import Button from '@/components/shared/Button';
import { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useCountdown } from '@/hooks/useCountdown';
import { useMarkerFlood } from '@/context/MarkerFloodContext';

type Props = {
  form: { phone: string; code: string[] };
  setForm: (form: { phone: string; code: string[] }) => void;
  handleCancel: () => void;
  handleConfirm: () => void;
  handleResend: () => void;
};

const VerificationCode = ({
  form,
  setForm,
  handleCancel,
  handleConfirm,
  handleResend,
}: Props) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { isCounting, setIsCounting, countdown } = useCountdown();
  const { isLoading } = useMarkerFlood();

  function handleChange(text: string, index: number) {
    const newCode = [...form.code];
    newCode[index] = text.replace(/\D/g, '');
    setForm({ ...form, code: newCode });

    // Move para o próximo campo se o dígito for preenchido
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus(); // Foca no próximo campo
    }
  }

  function tryAgain() {
    if (!isCounting) {
      setIsCounting(true);
      handleResend();
      console.log('Código reenviado');
    }
  }

  return (
    <View>
      <Text style={styles.title}>
        Enviaremos um código de 6 dígitos para o número informado
      </Text>
      <View style={styles.codeContainer}>
        {form.code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <View>
        <Text style={styles.resendText}>Não recebeu?</Text>
        {isCounting ? (
          <Text style={styles.resendText}>
            Tentar novamente em {countdown} segundos
          </Text>
        ) : (
          <TouchableOpacity onPress={tryAgain}>
            <Text style={styles.resendText}>Tentar novamente</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Button text="Cancelar" onPress={handleCancel} type="outline" />
        <Button
          text="Confirmar"
          onPress={handleConfirm}
          type="filled"
          disabled={form.code.includes('')}
          isLoading={isLoading}
        />
      </View>
    </View>
  );
};

export default VerificationCode;
