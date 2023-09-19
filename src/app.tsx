import { Wand2 } from 'lucide-react';
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
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';

export function App() {
	const [videoId, setVideoId] = useState<string | null>(null);
	const [temperature, setTemperature] = useState<number>(0.5);

	const handleVideoChange = (videoId: string) => {
		setVideoId(videoId);
	}

	const handleTemperatureChange = (value: number[]) => {
		setTemperature(value[0]);
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
	});

	return (
		<ThemeProvider storageKey='user-theme'>
			<div className='bg-background min-h-screen flex flex-col transition'>
				<Header />

				<main className='flex-1 p-6 grid grid-cols-1 lg:grid-cols-[3fr_7fr] xl:grid-cols-[2fr_8fr] gap-6'>
					<aside className='space-y-6'>
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
								<Label htmlFor='prompt' className='text-primary'>Prompt</Label>
								<PromptSelect
									onPromptSelected={setInput}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='model' className='text-primary'>Modelo</Label>
								<Select defaultValue='gpt-3.5-turbo' disabled>
									<SelectTrigger className='text-primary'>
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
								<Label htmlFor='temperature' className='text-primary'>Temperatura</Label>
								<Slider
									min={0}
									max={1}
									step={.1}
									value={[temperature]}
									onValueChange={handleTemperatureChange}
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

					<section className='flex flex-col gap-4'>
						<div className='grid grid-rows-2 gap-4 flex-1'>
							<Textarea
								placeholder='Inclua o prompt para a IA...'
								className='text-primary min-h-[200px] md:min-h-[60px] resize-none p-4 leading-relaxed transition hover:border-emerald-300 focus:border-emerald-400'
								value={input}
								onChange={handleInputChange}
							/>
							<Textarea
								placeholder='Resultado gerado pela IA'
								className='text-primary resize-none p-4 leading-relaxed'
								readOnly
								value={completion}
							/>
						</div>

						<p className='text-small text-muted-foreground'>Lembre-se: você pode utilizar a variável <code className='text-violet-400'>{'{transcription}'}</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.</p>

						<Separator
							className='lg:hidden'
						/>
					</section>
				</main>
			</div>
		</ThemeProvider>
	);
}
