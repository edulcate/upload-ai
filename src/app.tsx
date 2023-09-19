import { Github, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { VideoInputForm } from '@/components/video-input-form';
import { PromptSelect } from '@/components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react';

export function App() {
	const [videoId, setVideoId] = useState<string | null>(null);
	const [temperature, setTemperature] = useState<number>(0.5);

	const handleVideoChange = (videoId: string) => {
		setVideoId(videoId);
	}

	const {
		input,
		setInput,
		handleInputChange,
		handleSubmit,
		completion,
		isLoading
	} = useCompletion({
		api: 'http://localhost:3333/ai/complete',
		body: {
			videoId,
			temperature
		},
		headers: {
			'Content-Type': 'application/json'
		}
	})

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='px-6 py-3 flex justify-between items-center border-b'>
				<h1>upload.ai</h1>

				<div className='flex gap-3 items-center'>
					<span className='text-small text-muted-foreground'>Desenvolvido de ❤️ por Eduardo Lecate Guedes</span>

					<Separator orientation='vertical' className='h-6' />

					<Button
						variant='outline'
						asChild
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

			<main className='flex-1 p-6 flex gap-6'>
				<section className='flex flex-col flex-1 gap-4'>
					<div className='grid grid-rows-2 gap-4 flex-1'>
						<Textarea
							placeholder='Inclua o prompt para a IA...'
							className='resize-none p-4 leading-relaxed transition hover:border-emerald-300 focus:border-emerald-400'
							value={input}
							onChange={handleInputChange}
						/>
						<Textarea
							placeholder='Resultado gerado pela IA'
							className='resize-none p-4 leading-relaxed transition hover:border-emerald-300 focus:border-emerald-400'
							readOnly
							value={completion}
						/>
					</div>

					<p className='text-small text-muted-foreground'>Lembre-se: você pode utilizar a variável <code className='text-violet-400'>{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.</p>
				</section>

				<aside className='w-80 space-y-6'>
					<VideoInputForm
						onVideoChange={handleVideoChange}
					/>

					<Separator />

					<form
						action=""
						className='space-y-6'
						onSubmit={handleSubmit}
					>
						<div className='space-y-2'>
							<Label htmlFor='prompt'>Prompt</Label>
							<PromptSelect
								onPromptSelected={setInput}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='model'>Modelo</Label>
							<Select defaultValue='gpt-3.5-turbo' disabled>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value='gpt-3.5-turbo'>GPT 3.5-turbo 16k</SelectItem>
								</SelectContent>
							</Select>
							<span className='block text-xs text-muted-foreground italic'>Você poderá customizar essa opção em breve</span>
						</div>

						<Separator />

						<div className='space-y-4'>
							<Label htmlFor='temperature'>Temperatura</Label>
							<Slider
								min={0}
								max={1}
								step={.1}
								value={[temperature]}
								onValueChange={value => setTemperature(value[0])}
								className="transition hover:border-emerald-300 focus:border-emerald-400"
							/>
							<small className='text-muted-foreground'>{temperature}</small>

							<span className='block text-xs text-muted-foreground italic leading-relaxed'>Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.</span>
						</div>

						<Separator />

						<Button
							type='submit'
							className='w-full'
							disabled={isLoading} 
						>
							Executar
							<Wand2 className='w-4 h-4 ml-2' />
						</Button>
					</form>
				</aside>
			</main>
		</div>
	);
}
