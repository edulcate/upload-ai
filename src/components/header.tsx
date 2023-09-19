import { Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export const Header = () => {
    return (
        <header className='px-6 py-3 flex flex-wrap gap-6 justify-between items-center border-b border-input'>
            <div className='flex gap-3 items-center'>
                <h1 className='text-primary'>upload.ai</h1>
                <Separator orientation='vertical' className='h-6' />
                <ThemeToggle />
            </div>

            <div className='flex gap-3 items-center'>
                <span className='text-small text-muted-foreground'>Desenvolvido de ❤️ por Eduardo Lecate Guedes</span>

                <Separator orientation='vertical' className='h-6' />

                <Button
                    variant='outline'
                    asChild
                    className='text-primary'
                >
                    <a
                        href='https://github.com/edulcate'
                        target='_blank'
                    >
                        <Github className='w-4 h-4 mr-2' />
                        GitHub
                    </a>
                </Button>
            </div>
        </header>
    );
}