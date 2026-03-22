# 🌧️ App de Monitoramento Colaborativo de Enchentes

Este aplicativo foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas. Seu objetivo é permitir que moradores da região do Vale do Paranhana (RS) colaborem com o monitoramento de enchentes em tempo real, por meio de relatos com geolocalização, imagens e informações visuais sobre o nível da água.

## 📱 Funcionalidades

- Autenticação por SMS (Twilio)
- Envio de relatos com foto, localização e nível da enchente
- Visualização dos relatos em mapa interativo (Google Maps)
- Histórico do usuário

## ⚙️ Tecnologias Utilizadas

- **React Native + Expo**
- **Cloudinary** para imagens
- **Twilio** para autenticação por SMS
- **Google Maps API** para geolocalização

---

## 🚀 Instalação do App (modo desenvolvimento)

### Pré-requisitos

- Node.js instalado
- Expo CLI
- Conta na [Expo](https://expo.dev)
- Conta na [Cloudinary](https://cloudinary.com/)
- Conta na [Twilio](https://www.twilio.com/)
- Conta no [Google Cloud Console](https://console.cloud.google.com/) com chave da API de Maps

### 1. Clone o repositório

```bash
git clone https://github.com/rayanemelo/tcc-app
cd tcc-app
```

### 2. Instale as dependências
```bash
yarn install
```

### 3. Inicie o Expo
```bash
npx expo start
``` 
Escaneie o QR code com o aplicativo Expo Go no seu celular (Android ou iOS) para visualizar o app.