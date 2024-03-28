import * as d3 from "d3-dsv";
import { jsonTextTranslator } from "../translators/text.js";

export const translateCSVFile = async (filePath: string, fileContent: string, destlang: string) => {
	let chunks = [];
	if (filePath.endsWith(".csv")) {
		chunks = d3.csvParse(fileContent)
	} else {
		chunks = d3.tsvParse(fileContent)
	}
	const documents: string[] = [];
	chunks.forEach((chunk) => {
		documents.push(JSON.stringify(chunk));
	});
	const responseChunks = await jsonTextTranslator(documents, destlang, "json");

	if (filePath.endsWith(".csv")) {
		return d3.csvFormat(responseChunks)
	} else {
		return d3.tsvFormat(responseChunks)
	}
};
