export interface SelectItem {
	label: string;
	value: string;
}

export type OllamaModel = {
	model: string;
}

export type OpenAIModel = {
	apiKey: string;
	model: string;
}

export type BedrockModelProfile = {
	profile: string;
	region: string;
	model: string;
}

export type BedrockModelAwsKey = {
	accessKey: string;
	secretKey: string;
	region: string;
	model: string;
}

export type Event = {
	name: string;
	location: string;
	status: 'pending' | 'processing' | 'completed' | 'failed'; // Assuming status can be one of these values
	percentage: number; // Assuming this is a number from 0 to 100
};

export type EventList = Event[];


export type BedrockModel = BedrockModelProfile | BedrockModelAwsKey;


export type Config = OllamaModel| OpenAIModel | BedrockModel;
