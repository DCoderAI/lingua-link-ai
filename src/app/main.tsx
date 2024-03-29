import React, { useCallback, useEffect, useState } from 'react';
import { Text } from 'ink';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import LLMSelection from "./llm.js";
import Ollama from "./ollama.js";
import Bedrock from "./bedrock.js";
import { Config } from "./type.js";
import Translate from "./translate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type ConfigStepProps = {
	onComplete: () => void;
}

const ConfigStep = ({onComplete}: ConfigStepProps) => {
	const [llm, setLLM] = useState<string>();

	const onModelSelection = useCallback(async (config: Config) => {
		await fs.writeJson(path.join(__dirname, "..", 'config.json'), {llm, config});
		onComplete();
	}, [llm]);

	if (!llm) {
		return <LLMSelection onComplete={setLLM}/>;
	}
	if (llm === 'ollama') {
		return <Ollama onComplete={onModelSelection}/>;
	} else if (llm === 'bedrock') {
		return <Bedrock onComplete={onModelSelection}/>;
	}
	return <Text>Configuration complete.</Text>;
};


const App = () => {
	const [currentStep, setCurrentStep] = useState<'loading' | 'config' | 'translate'>('config');
	const getConfig = useCallback(async () => {
		const configPath = path.join(__dirname, "..", 'config.json');
		if (fs.existsSync(configPath)) {
			const config = await fs.readJson(configPath);
			if (config.llm) {
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

	return currentStep === 'config' ? <ConfigStep onComplete={() => {
		setCurrentStep('translate');
	}}/> : <Translate/>;
};

export default App;
