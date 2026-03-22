import { MoonIcon, SunIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/ui/button';
import { useThemeContext } from '@/context/theme-provider';

/**
 * Botão que alterna entre o tema claro e escuro da aplicação.
 *
 * Exibe o ícone do sol no modo claro e o ícone da lua no modo escuro.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={twMerge(
        'cursor-pointer rounded-full border border-slate-200 bg-white text-slate-700 transition-colors duration-300 hover:bg-slate-100 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-slate-600'
      )}
    >
      {theme === 'light' ? (
        <SunIcon className="h-5 w-5 text-[#3B6790]" />
      ) : (
        <MoonIcon className="h-5 w-5 text-sky-300" />
      )}
    </Button>
  );
}
