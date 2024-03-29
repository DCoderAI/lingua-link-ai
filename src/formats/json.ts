import { recombineJsonChunks, splitJsonObject } from "../splitters/json.js";
import { jsonTextTranslator } from "../translators/text.js";

export const translateJsonFile = async (fileContent: string, destlang: string, progress?: (percentage: number) => void) => {
	const jsonData = JSON.parse(fileContent);
	const chunks = splitJsonObject(jsonData, 500);
	const documents: string[] = [];
	chunks.forEach((chunk) => {
		documents.push(JSON.stringify(chunk));
	});
	const responseChunks = await jsonTextTranslator(documents, destlang, "json", progress);
	return JSON.stringify(recombineJsonChunks(responseChunks))
};
