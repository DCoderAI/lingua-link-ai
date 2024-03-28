import axios from 'axios';

interface ModelDetail {
	format: string;
	family: string;
	families: null | string[];
	parameter_size: string;
	quantization_level: string;
}

interface Model {
	name: string;
	modified_at: string;
	size: number;
	digest: string;
	details: ModelDetail;
}

interface ModelsResponse {
	models: Model[];
}

// Function to get the list of models (tags) from Ollama
export const getListOfTags = async (): Promise<ModelsResponse> => {
	try {
		const response = await axios.get<ModelsResponse>('http://localhost:11434/api/tags');
		return response.data;
	} catch (error) {
		console.error('Error fetching the list of tags:', error);
		throw error; // Or handle the error as you see fit

	}
};

// Call the function
// getListOfTags().then(models => {
// 	console.log('Models:', models);
// }).catch(error => {
// 	console.error('Failed to fetch models:', error);
// });
