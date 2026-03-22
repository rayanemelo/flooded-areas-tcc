import Authentication from '@/components/Authentication';
import AuthPrompt from '@/components/Authentication/AuthPrompt';
import { ThemedView } from '@/components/ui/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export function RenderAuth({ children }: Props) {
  const { authentication } = useAuth();

  const [auth, setAuth] = useState(false);

  const handleAuthenticate = () => {
    setAuth(true);
  };

  return !authentication.authenticated ? (
    <View style={{ flex: 1, marginTop: -120 }}>
      <AuthPrompt onAuthenticate={handleAuthenticate} />

      {auth && (
        <Authentication
          handleCancel={() => {
            setAuth(false);
          }}
          handleConfirm={() => setAuth(false)}
          // styles={{ marginTop: -100 }}
        />
      )}
    </View>
  ) : (
    <ThemedView>{children}</ThemedView>
  );
}
