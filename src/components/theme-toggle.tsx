import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  const toggleTheme = useCallback(
    (theme: string) => {
      setTheme(theme);
    },
    [setTheme],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="transition-colors duration-200">
          <Sun className="transition-all duration-300 ease-in-out dark:hidden" />
          <Moon className="hidden transition-all duration-300 ease-in-out dark:block" />
          <span className="sr-only">{t('theme.toggle', 'Toggle theme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="transition-all duration-200 ease-in-out">
        <DropdownMenuItem onClick={() => toggleTheme('light')} className="transition-colors duration-150 hover:bg-accent">
          <Sun className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          {t('theme.light', 'Light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('dark')} className="transition-colors duration-150 hover:bg-accent">
          <Moon className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          {t('theme.dark', 'Dark')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme('system')} className="transition-colors duration-150 hover:bg-accent">
          <Monitor className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
          {t('theme.system', 'System')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
