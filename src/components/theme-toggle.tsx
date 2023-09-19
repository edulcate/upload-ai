import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme(); 

    return (
        <>
            <Button
                onClick={() => setTheme('dark')}
                data-theme={theme}
                className='data-[theme="dark"]:hidden'
                variant='outline'
                title='Alternar para tema claro'
            >
                <Moon className='w-4 h-4 text-primary' />
            </Button>

            <Button
                onClick={() => setTheme('light')}
                data-theme={theme}
                className='data-[theme="light"]:hidden'
                variant='outline'
                title='Alternar para tema escuro'
            >
                <Sun
                    className='w-4 h-4 text-primary'
                />
            </Button>
        </>
    );    
}