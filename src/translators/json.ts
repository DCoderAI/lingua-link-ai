import { translate } from "../llm.js";

const countProperties = (obj: Object): number => {
	let count = 0;

	// Check if the object is indeed an object (and not null, array, etc.)
	if (obj !== null && typeof obj === 'object' && !Array.isArray(obj)) {
		// Iterate over the object properties
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				count++; // Increment count for each property
				// If the property is an object, recursively count its properties
				// @ts-ignore
				count += countProperties(obj[key]);
			}
		}
	}

	return count;
};


export const jsonTranslator = async (data: Object, destLang: string, progress?: (percentage: number) => void) => {
	const totalRecords = countProperties(data);
	let currentRecord = 0;

	const translateJSON = async (json: any, destLang: string): Promise<any> => {
		const translatedJSON: any = {};

		// Translate each key-value pair
		for (const key in json) {
			if (json.hasOwnProperty(key)) {
				const value = json[key];
				if (typeof value === 'string') {
					translatedJSON[key] = await translate(value, destLang, "text");
					console.log(translatedJSON[key])
				} else if (typeof value === 'object') {
					translatedJSON[key] = await translateJSON(value, destLang);
				} else {
					translatedJSON[key] = value;
				}
				currentRecord++;
				progress?.((currentRecord / totalRecords) * 100);
			}
		}

		return translatedJSON;
	};

	const output = await translateJSON(data, destLang);
	console.log(JSON.stringify(output));
	return output;
};


export default jsonTranslator;
