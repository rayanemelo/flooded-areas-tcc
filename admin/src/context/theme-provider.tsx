import React, { createContext, useContext, useEffect, useState } from 'react';

/** Define os temas disponíveis na aplicação. */
type Theme = 'light' | 'dark';

/** Estrutura do contexto de tema. */
interface ThemeContextProps {
  /** Tema atual da aplicação (`light` ou `dark`). */
  theme: Theme;
  /** Função para alternar entre os temas. */
  toggleTheme: () => void;
}

/** Contexto que armazena o tema atual e a função de alternância. */
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * Provedor responsável por gerenciar o tema da aplicação.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      // Sync initial client theme from persisted storage after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(savedTheme);
      return;
    }

    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  /** Alterna o tema entre `light` e `dark`. */
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext() {
  return useContext(ThemeContext);
}
