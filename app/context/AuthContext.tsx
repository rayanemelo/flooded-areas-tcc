import { useAuthentication } from '@/hooks/useAuthentication';
import { createContext, useContext } from 'react';

type AuthProps = {
  authentication: {
    token: string;
    authenticated: boolean;
  };
  setAuthenticated: (token: string) => void;
  isLoading: boolean;
  signOut: () => void;
};

type AuthProviderProps = { children: JSX.Element | JSX.Element[] };

const AuthContext = createContext<AuthProps>({} as AuthProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { authentication, isLoading, setAuthenticated, signOut } =
    useAuthentication();

  return (
    <AuthContext.Provider
      value={{
        authentication,
        setAuthenticated,
        isLoading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
