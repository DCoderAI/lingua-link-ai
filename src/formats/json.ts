import { recombineJsonChunks, splitJsonObject } from "../splitters/json.js";
import { jsonTextTranslator } from "../translators/text.js";
import { ollama } from "../llm.js";

export const translateJsonFile = async (fileContent: string, destlang: string) => {
	const jsonData = JSON.parse(fileContent);
	const chunks = splitJsonObject(jsonData, 500);
	const documents: string[] = [];
	chunks.forEach((chunk) => {
		documents.push(JSON.stringify(chunk));
	});
	const responseChunks = await jsonTextTranslator(ollama, documents, destlang, "json");
	return JSON.stringify(recombineJsonChunks(responseChunks))
};
