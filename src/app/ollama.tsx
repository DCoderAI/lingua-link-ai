import React, { useCallback, useEffect, useState } from "react";
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import { getListOfTags } from "./ollama-api.js";
import Link from 'ink-link';
interface SelectItem {
	label: string;
	value: string;
}

type Props = {
	onComplete: (llmModel: string) => void;
}
const Ollama = ({ onComplete }: Props) => {
	const [hasOllamaInstalled, setHasOllamaInstalled] = useState(true);
	const [hasMistralInstalled, setHasMistralInstalled] = useState(false);

	const getModels = useCallback(async () => {
		// Fetch available models from API
		try {
			const models = await getListOfTags();
			if (models.models.length === 0) {
				console.log('No models found in Ollama');
				setHasOllamaInstalled(false);
			} else {
				if (models.models.some(model => model.name.toLowerCase().includes('mistral'))) {
					setHasMistralInstalled(true);
					const mistralModel = models.models.find(model => model.name.toLowerCase().includes('mistral'));
					onComplete(mistralModel?.name || "mistral");
				}
			}
		} catch (error) {
			console.log('Error fetching models from API');
			setHasOllamaInstalled(false);
		}
		// Update models state
	}, []);

	useEffect(() => {
		getModels();
	}, [])

	const handleOllamaInstalledSelect = async (item: SelectItem) => {
		if (item.value === 'yes') {
			await getModels();
		} else {
			console.log('Please install Ollama first');
		}
	};

	if (!hasOllamaInstalled) {
		return (
			<Box width="100%" flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Link url="https://ollama.com">
						<Text color="cyan">Ollama</Text>
					</Link>
				</Box>
				<Box flexDirection="column">
					<Box>
						<Text>Have you installed Ollama?</Text>
					</Box>
					<SelectInput
						items={[
							{label: 'Yes', value: 'yes'},
							{label: 'No', value: 'no'}
						]}
						onSelect={handleOllamaInstalledSelect}
					/>
				</Box>
			</Box>
		);
	}

	if(!hasMistralInstalled){
		return (
			<Box width="100%" flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Box width="100%">
						<Text>
							If Mistral is not installed, run the following command in Ollama to install it:
						</Text>
					</Box>
					<Box width="100%">
						<Text color="red">ollama serve mistral</Text>
					</Box>
					<Link url="https://ollama.com/library/mistral">
						<Text color="cyan">Ollama Mistral</Text>
					</Link>
				</Box>
				<Box flexDirection="column">
					<Box>
						<Text>Have you installed Mistral Model?</Text>
					</Box>
					<SelectInput
						items={[
							{label: 'Yes', value: 'yes'},
							{label: 'No', value: 'no'}
						]}
						onSelect={getModels}
					/>
				</Box>
			</Box>
		);
	}

	return <Text>Configuration complete. You can now run the translate command.</Text>;
};

export default Ollama;
