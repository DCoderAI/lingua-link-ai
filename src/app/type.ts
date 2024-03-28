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

export type BedrockModel = BedrockModelProfile | BedrockModelAwsKey;


export type Config = OllamaModel | OpenAIModel | BedrockModel;
