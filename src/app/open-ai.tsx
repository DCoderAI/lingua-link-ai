import React, { useState } from "react";
import { Text, Box } from 'ink';
import Link from 'ink-link';
import TextInput from 'ink-text-input';
import { Config } from "./type.js";

type Props = {
	onComplete: (config: Config) => void;
}
const OpenAI = ({onComplete}: Props) => {
	const [apiKey, setApiKey] = useState<string>("");
	const [model, setModel] = useState<string>("");
	const [step, setStep] = useState<'apiKey' | 'model'>('apiKey');

	const onSubmit = () => {
		onComplete({
			apiKey,
			model,
		});
	}

	if (step === 'apiKey') {
		return (
			<Box flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Link url="https://platform.openai.com/docs/quickstart?context=python">
						<Text color="cyan">Instruction on how to get Open AI API Key</Text>
					</Link>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text>Enter Open AI Key:</Text>
					</Box>
					<TextInput
						value={apiKey}
						onChange={setApiKey}
						onSubmit={() => setStep('model')}
					/>
				</Box>
			</Box>
		);
	}

	if (step === 'model') {
		return (
			<Box flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Link url="https://platform.openai.com/docs/models/overview">
						<Text color="cyan">Get the GPT Model ID:</Text>
					</Link>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text>Enter GPT Model ID:</Text>
					</Box>
					<TextInput
						value={model}
						onChange={setModel}
						onSubmit={onSubmit}
					/>
				</Box>
			</Box>
		);
	}

	return <Text>Configuration complete. You can now run the translate command.</Text>;
};

export default OpenAI;
