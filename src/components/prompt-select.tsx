import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

interface Prompt {
	id: string,
	title: string,
	template: string
}

interface PromptSelectProps {
	onPromptSelected: (template: string) => void;
}

export const PromptSelect = (props: PromptSelectProps) => {
	const [prompts, setPrompts] = useState<Prompt[] | null>(null);

	useEffect(() => {
		api.get('/prompts')
			.then(response => {
				setPrompts(response.data);
			});
	}, []);

	const handlePromptSelected  = (id: string ): string | void => {
		const selectedPrompt = prompts?.find(prompt => prompt.id === id);

		if (! selectedPrompt) {
			return;
		}

		props.onPromptSelected(selectedPrompt.template);
	}

	return (
		<Select
			onValueChange={handlePromptSelected}
			
		>
			<SelectTrigger
				className="transition hover:border-emerald-400 active:border-emerald-400"
			>
				<SelectValue placeholder='Selecione um prompt' />
			</SelectTrigger>

			<SelectContent>
				{prompts?.map(prompt => {
					return (
						<SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	)
}