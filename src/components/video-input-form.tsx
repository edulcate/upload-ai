import { FileVideo, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useState, useMemo, useRef, ChangeEvent, FormEvent } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/axios';

type Status = 'waiting' | 'converting' | 'uploading' | 'generatingTranscription' | 'success';

const statusMessages = {
	waiting: 'Carregar vídeo',
	converting: 'Convertendo...',
	uploading: 'Carregando...',
	generatingTranscription: 'Criando transcrição...',
	success: 'Sucesso'
}

interface VideoInputFormProps {
	onVideoChange: (videoId: string) => void;
}

export function VideoInputForm(props: VideoInputFormProps) {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const promptInputRef = useRef<HTMLTextAreaElement | null>(null);
	const [status, setStatus] = useState<Status>('waiting');

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const { files } = event.currentTarget;

		if (! files) {
			return;
		}

		const file = files[0];
		
		setVideoFile(file);
	}

	const previewURL = useMemo<string | null>(() => {
		if (! videoFile) {
			return null;
		}

		return URL.createObjectURL(videoFile);
	}, [videoFile]);

	const convertVideoToAudio = async (video: File) => {
		console.log('Starting Conversion');

		const ffmpeg = await getFFmpeg();

		await ffmpeg.writeFile('input.mp4', await fetchFile(video));

		// ffmpeg.on('log', (log) => {
		// 	console.log(log);
		// });

		ffmpeg.on('progress', (progress) => {
			console.log(`Converting Proccess: ${Math.round(progress.progress * 100)}%`);
		});

		await ffmpeg.exec([
			'-i',
			'input.mp4',
			'-map',
			'0:a',
			'-b:a',
			'20k',
			'-acodec',
			'libmp3lame',
			'output.mp3'
		]);

		const data = await ffmpeg.readFile('output.mp3');

		const audioFileBlob = new Blob([data], {
			type: 'audio/mpeg'
		});
		const audioFile = new File([audioFileBlob], 'audio.mp3', {
			type: 'audio/mpeg'
		});

		console.log('Convert finished');

		return audioFile;
	}

	const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		setStatus('converting');

		const prompt = promptInputRef.current?.value;

		if (! videoFile) {
			setStatus('waiting');
			return;
		}

		const audioFile = await convertVideoToAudio(videoFile);

		setStatus('uploading');

		const data = new FormData();

		data.append('file', audioFile);

		const response = await api.post('/videos', data);

		const videoId = response.data.id;
		props.onVideoChange(videoId);

		setStatus('generatingTranscription');

		await api.post(`/videos/${videoId}/transcription`, {
			prompt
		});

		setStatus('success');
	}

	return (
	<>
		<form
			action=""
			className='space-y-6'
			onSubmit={handleUploadVideo}
		>
			<label
				htmlFor="video"
				className='relative border flex rounded-md aspect-video cursor-pointer border-dashed text-primary text-small flex-col gap-2 justify-center items-center transition hover:bg-primary/5 hover:border-emerald-400 hover:border-solid data-[success=true]:border-solid data-[success=true]:border-input'
				data-success={setVideoFile !== null}
			>
				{previewURL ? (
					<video
						src={previewURL}
						controls={false}
						className="absolute inset-0 pointer-events-none rounded-md aspect-video"
					>

					</video>
				) : (
					<>
						
						<FileVideo />
						Selecione um vídeo
						
					</>
				)}
			</label>

			<input
				type="file"
				id='video'
				accept='video/mp4'
				className='sr-only'
				onChange={handleFileUpload}
				disabled={status !== 'waiting'}
			/>

			<Separator />

			<div className='space-y-2'>
				<Label htmlFor='transcriptionPrompt' className='text-primary'>Prompt de transcrição</Label>
				<Textarea
					disabled={status !== 'waiting'}
					ref={promptInputRef}
					id='transcriptionPrompt'
					className='h-20 leading-relaxed resize-none text-primary transition hover:border-emerald-300 focus:border-emerald-400'
					placeholder='Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)'
				>
				</Textarea>
			</div>

			<Button
				disabled={status !== 'waiting'}
				type='submit'
				className='w-full data-[success=true]:bg-emerald-400'
				data-success={status === 'success'}
			>
				{status === 'waiting' ? (
					<>
						Carregar vídeo
						<Upload className='w-4 h-14 ml-2' />
					</>
				) : (
					status === 'success' ?
					<>
						{statusMessages[status]}
						<CheckCircle className='w-4 h-14 ml-2' />
					</> : statusMessages[status]
				)}
			</Button>
		</form>
	</>
	);
}