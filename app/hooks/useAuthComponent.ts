import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/service/auth-service';
import { useUserAccess } from '@/stores/user-access';
import type { Coordinate } from '@/types/coordinate';

const authService = new AuthService();

export function useAuthComponent() {
  const { setAuthenticated } = useAuth();
  const { setUser } = useUserAccess();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    phone: '',
    code: ['', '', '', '', '', ''],
  });

  function nextStep() {
    setCurrentStep((prev) => prev + 1);
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }

  // Envio do código
  const {
    mutate: sendCode,
    status: isSendingCodeStatus,
    isError: isSendCodeError,
    error: sendCodeError,
  } = useMutation({
    mutationFn: (userLocation: Coordinate | null) =>
      authService.sendCode(form.phone, userLocation),
    onSuccess: (res) => {
      if (res?.status === 204) {
        nextStep();
      }
    },
  });

  // Verificação do código
  const {
    mutateAsync: confirmCode,
    status: isConfirmingCode,
    isError: isConfirmCodeError,
    error: confirmCodeError,
  } = useMutation({
    mutationFn: () => authService.verifyCode(form.phone, form.code.join('')),
    onSuccess: (response) => {
      if (response?.status === 200) {
        const { token, user } = response.data;
        setAuthenticated(token);
        setUser(user);
      }
    },
  });

  return {
    currentStep,
    form,
    setForm,
    prevStep,
    sendCode,
    isSendingCode: isSendingCodeStatus === 'pending',
    isSendCodeError,
    sendCodeError,
    confirmCode,
    isConfirmingCode,
    isConfirmCodeError,
    confirmCodeError,
  };
}
