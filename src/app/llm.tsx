import React from "react";
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';

interface SelectItem {
	label: string;
	value: string;
}

type Props = {
	onComplete: (llmModel: string) => void;
}

const LLMModels = [
	{
		label: "Ollama (Recommended & It's Free)",
		value: "ollama"
	},
	{
		label: "Open AI",
		value: "open-ai"
	},
	{
		label: "Amazon BedRock",
		value: "bedrock"
	},
]

const LLMSelection = ({ onComplete }: Props) => {
	const handleSelect = async (item: SelectItem) => {
		onComplete(item.value);
	};

	return (
		<Box width="100%" flexDirection="column">
			<Box>
				<Text>Select LLM Models:</Text>
			</Box>
			<Box>
				<SelectInput
					items={LLMModels}
					onSelect={handleSelect}
				/>
			</Box>
		</Box>
	);
};

export default LLMSelection;
