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


type SchemaAdjustment = {
	keyPath: string;
	action: string;
};

function compareAndSuggestSchemaAdjustments(source: any, destination: any, parentKeyPath: string = ''): SchemaAdjustment[] {
	let adjustments: SchemaAdjustment[] = [];

	// Assuming both source and destination are objects here, for simplicity.
	if (typeof source === 'object' && source !== null && destination !== null) {
		const sourceKeys = Object.keys(source);
		const destinationKeys = Object.keys(destination);

		// Find missing keys in destination
		for (const key of sourceKeys) {
			const currentKeyPath = parentKeyPath ? `${parentKeyPath}.${key}` : key;
			if (!destinationKeys.includes(key)) {
				adjustments.push({
					keyPath: currentKeyPath,
					action: `The Original JSON does not have key ${currentKeyPath} key. Add missing key with type ${typeof source[key]}`,
				});
			} else if (typeof source[key] === 'object' && typeof destination[key] === 'object') {
				// Recurse into nested objects
				adjustments = adjustments.concat(compareAndSuggestSchemaAdjustments(source[key], destination[key], currentKeyPath));
			} else if (typeof source[key] !== typeof destination[key]) {
				// Type mismatch for non-object types
				adjustments.push({
					keyPath: currentKeyPath,
					action: `${currentKeyPath} do not match with original input text. The Original key ${currentKeyPath} is of type ${typeof source[key]}. Change the ${currentKeyPath} type to ${typeof source[key]}`,
				});
			}
		}

		// Find extra keys in destination
		for (const key of destinationKeys) {
			if (!sourceKeys.includes(key)) {
				const currentKeyPath = parentKeyPath ? `${parentKeyPath}.${key}` : key;
				adjustments.push({
					keyPath: currentKeyPath,
					action: `The Original JSON does not have key ${currentKeyPath}. Remove this key`,
				});
			}
		}
	}

	return adjustments;
}

export const jsonTextTranslator = async (documents: string[], destLang: string, fileFormat?: string, progress?: (percentage: number) => void) => {
	const texts = [];
	const errors = []; // To collect errors for each document
	progress?.(0);
	let index = 0;


	for (const document of documents) {
		let lastFailedInstructions = ""; // To store the last failed instruction for retrying
		let content;
		let attempts = 0;
		const maxAttempts = 5;

		while (attempts < maxAttempts) {
			try {
				// console.log("=====================================")
				// console.log({ lastFailedInstructions });
				// console.log(document)
				content = await translate(document, destLang, fileFormat, lastFailedInstructions);
				// console.log(content)

				// Try parsing the content right after fetching it
				try {
					// const parsedContent = extractAndCorrectJsonFromText(content);
					const parsedContent = JSON.parse(content);

					const mismatch = compareAndSuggestSchemaAdjustments(JSON.parse(document), parsedContent);
					if (mismatch.length > 0) {
						lastFailedInstructions = `The input JSON chunk and output JSON chunk keys or schema do not match. Make following changes in the response JSON: ${mismatch.map(adj => `${adj.action}`).join(', ')}`;
						throw new Error(lastFailedInstructions);
					}
					// console.log(parsedContent)
					// console.log("=====================================")
					texts.push(parsedContent);
					break; // Exit the loop if translation and parsing are successful
				} catch (parseError: any) {
					if (!parseError?.message?.includes(lastFailedInstructions)) {
						// console.log("Failed to parse JSON", parseError);
						lastFailedInstructions = "The result JSON is not a valid JSON object. Please ensure the translation is correct JSON format."
					}
					throw new Error(lastFailedInstructions);
				}
			} catch (e: any) {
				if (!e?.message?.includes(lastFailedInstructions)) {
					lastFailedInstructions = e?.message || e.toString();
				}
				console.error(`Document ${index + 1}, Attempt ${attempts + 1} failed:`);
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
