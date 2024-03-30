import { recombineJsonChunks } from "../splitters/json.js";
import jsonTranslator from "../translators/json.js";

export const translateJsonFile = async (fileContent: string, destlang: string, progress?: (percentage: number) => void) => {
	const jsonData = JSON.parse(fileContent);
	const responseChunks = await jsonTranslator(jsonData, destlang,  progress);
	return JSON.stringify(recombineJsonChunks(responseChunks))
};
