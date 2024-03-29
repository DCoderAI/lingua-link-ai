import { translate } from "../llm.js";

const textTranslator = async (documents: string[], destLang: string, fileFormat?: string, progress?: (percentage: number) => void) => {
	const texts = [];
	progress?.(0);
	let index = 0;
	for (const document of documents) {
		const content = await translate(document, destLang, fileFormat);
		index++;
		progress?.((index / documents.length) * 100);
		// console.log("=====================================")
		// console.log(document)
		// console.log(content)
		// console.log("=====================================")
		texts.push(content);
	}
	return texts?.join("\n\n");
}

//  @ts-ignore
function extractAndCorrectJsonFromText(text: string) {
	const lines = text.split('\n');
	let correctedJson = null;

	for (const line of lines) {
		// Simplistic check to find a line that looks like it starts with JSON
		if (line.trim().startsWith('{')) {
			// Attempt to correct and parse the JSON
			try {
				correctedJson = correctJsonStructure(line);
				// Attempt to parse to check validity
				return JSON.parse(correctedJson);
			} catch (error) {
				console.error("Found JSON-like line, but couldn't correct or parse it:", line);
				// Optionally, handle the error or attempt further corrections
			}
		}
	}

	return correctedJson;
}

function correctJsonStructure(jsonString: string) {
	let balance = 0;
	let correctedString = '';

	for (const char of jsonString) {
		correctedString += char;
		if (char === '{') balance++;
		if (char === '}') balance--;
	}

	// If there are more opening braces, add the necessary closing braces
	if (balance > 0) correctedString += '}'.repeat(balance);

	return correctedString;
}



export const jsonTextTranslator = async (documents: string[], destLang: string, fileFormat?: string, progress?: (percentage: number) => void) => {
	const texts = [];
	const errors = []; // To collect errors for each document
	progress?.(0);
	let index = 0;

	for (const document of documents) {
		let content;
		let attempts = 0;
		const maxAttempts = 3;

		while (attempts < maxAttempts) {
			try {
				content = await translate(document, destLang, fileFormat);
				// console.log("=====================================")
				// console.log(document)

				// Try parsing the content right after fetching it
				try {
					// const parsedContent = extractAndCorrectJsonFromText(content);
					const parsedContent = JSON.parse(content);
					// if (parsedContent === null) {
					// 	throw new Error("No valid JSON object found in the translation");
					// }
					// console.log(content)
					// console.log(parsedContent)
					// console.log("=====================================")
					texts.push(parsedContent);
					break; // Exit the loop if translation and parsing are successful
				} catch (parseError) {
					// @ts-ignore
					throw new Error(`Parsing error: ${parseError?.message || parseError?.toString()}`);
				}
			} catch (e) {
				console.error(`Document ${index + 1}, Attempt ${attempts + 1} failed:`, e);
				// @ts-ignore
				errors.push({documentIndex: index + 1, attempt: attempts + 1, error: e?.message || e.toString()});
				attempts++;
				if (attempts >= maxAttempts) {
					throw new Error(`Failed to translate document after ${maxAttempts} attempts`);
				}
			}
			if (attempts < maxAttempts) {
				await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retrying
			}
		}

		index++;
		progress?.((index / documents.length) * 100);
	}

	return texts;
};


export default textTranslator;
