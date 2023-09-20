import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Theme, useTheme } from '@/components/theme-provider';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme(); 
    const toggleToTheme: Theme = (theme === 'dark' ? 'light' : 'dark');

    return (
        <>
            <Button
                onClick={() => setTheme(toggleToTheme)}
                data-theme={theme}
                className={`data-[theme="${toggleToTheme}"]:hidden`}
                variant='outline'
                title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            >
                { theme === 'light' && (
                    <Moon className=' w-4 h-4 text-primary' />
                ) }
                { theme === 'dark' && (
                    <Sun className=' w-4 h-4 text-primary' />
                ) }
                <span className='text-primary ml-2'>Modo {theme === 'dark' ? 'claro' : 'escuro'}</span>
            </Button>
        </>
    );    
}