import React, { useCallback, useEffect, useState } from 'react';
import { Text, Box, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import fs from 'fs-extra';
import path from 'path';
import { getListOfTags } from "./ollama.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import processor from "./processor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SelectItem {
	label: string;
	value: string;
}

const ConfigStep = () => {
	const [completed, setCompleted] = useState(false);
	const [models, setModels] = useState<SelectItem[]>([]);

	const getModels = useCallback(async () => {
		// Fetch available models from API
		const models = await getListOfTags();
		setModels(models.models.map(model => ({ label: model.name, value: model.name })));
		// Update models state
	}, []);

	useEffect(() => {
		getModels();
	}, [])

	const handleSelect = async (item: SelectItem) => {
		// Save selected model to config file
		await fs.writeJson(path.join(__dirname, 'config.json'), { ollamaModel: item.value });
		console.log('Configuration saved.');
		setCompleted(true);
	};

	if (completed) {
		return <Text>Configuration complete. You can now run the translate command.</Text>;
	}

	return (
		<Box>
			<Text>Select the Ollama Model:</Text>
			<SelectInput
				items={models}
				onSelect={handleSelect}
			/>
		</Box>
	);
};

const TranslateStep = () => {
	const [step, setStep] = useState<'source' | 'destination' | 'language' | 'processing'| 'done'>('source');
	const [source, setSource] = useState<string>('');
	const [destination, setDestination] = useState<string>('');
	const [language, setLanguage] = useState<string>('');

	const runTranslation = useCallback(async () => {
		console.log(`Source: ${source}, Destination: ${destination}, Language: ${language}`);
		await processor(source, destination, language);
		setStep('done');
	}, [source, destination, language]);

	useEffect(() => {
		if (step === 'processing') {
			runTranslation();
			// Here, implement your file processing logic based on the source, destination, and language
		}
	}, [step]);

	useInput((_, key) => {
		if (key.escape) {
			process.exit(); // Exit on ESC
		}
	});

	switch (step) {
		case 'source':
			return (
				<Box>
					<Box>
						<Text>Enter source folder or file:</Text>
					</Box>
					<TextInput
						value={source}
						onChange={setSource}
						onSubmit={() => setStep('destination')}
					/>
				</Box>
			);
		case 'destination':
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter destination folder or file:</Text>
					</Box>
					<TextInput
						value={destination}
						onChange={setDestination}
						onSubmit={() => setStep('language')}
					/>
				</Box>
			);
		case 'language':
			return (
				<Box>
					<Box>
						<Text>Select language:</Text>
					</Box>
					<SelectInput
						items={[
							{ label: 'English', value: 'English' },
							{ label: 'Spanish', value: 'Spanish' },
							// Add more languages as needed
						]}
						onSelect={({ value }) => {
							setLanguage(value);
							setStep('processing');
						}}
					/>
				</Box>
			);
		case 'processing':
			return <Text>Processing...</Text>;
		default:
			return null;
	}
};

const App = () => {
	const [currentStep, setCurrentStep] = useState<'loading' | 'config' | 'translate'>('config');
	const getConfig = useCallback(async () => {
		const configPath = path.join(__dirname, 'config.json');
		if (fs.existsSync(configPath)) {
			const config = await fs.readJson(configPath);
			if (config.ollamaModel) {
				setCurrentStep('translate');
			} else {
				setCurrentStep('config');
			}
		} else {
			// No config found, render config step
			setCurrentStep('config');
		}
	}, []);

	useEffect(() => {
		getConfig();
	}, []);

	if (currentStep === 'loading') {
		return <Text>Loading...</Text>;
	}

	// Determine which step to render based on command-line arguments or stored config

	return currentStep === 'config' ? <ConfigStep /> : <TranslateStep />;
};

export default App;
