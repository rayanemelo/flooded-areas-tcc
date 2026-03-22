export const messages = {
  response: {
    limitExceeded: 'Limite de tentativas excedido',
    userNotFound: 'Usuário não encontrado',
    codeNotFound: 'Código não encontrado',
    invalidCode: 'Código inválido',
    expiredCode: 'Código expirado',
    notAuthorized: 'Não autorizado',
    inactiveUser:
      'Usuário inativo. Entre em contato com o suporte para mais informações.',
    faqNotFound: 'FAQ não encontrada',
    floodAreaNotFound: 'Área de inundação não encontrada',
    notificationNotFound: 'Notificação não encontrada',
    userAlertPreferenceNotFound:
      'Preferência de alerta do usuário não encontrada',
    userDeviceNotFound: 'Dispositivo do usuário não encontrado',
    internalServerError: 'Erro interno do servidor',
    invalidToken: 'Token inválido',
    notCreated: 'Não foi possível criar o usuário',
    faqNotCreated: 'Não foi possível criar o FAQ',
  },
  validations: {
    phoneMinLength: 'Número de celular deve ter pelo menos 10 dígitos.',
    phoneMaxLength: 'Número de celular deve ter no máximo 15 dígitos.',
    phoneDigits: 'Número de celular deve conter apenas dígitos.',
  },
  sms: {
    codeMessage: (code: string) => `Seu código de verificação é: ${code}`,
  },
};
