export const estimateSize = (jsonObject: any): number => new Blob([JSON.stringify(jsonObject)]).size;

export const parentChildSeparator = '$DoNotRemoveOrChange$';

export const splitJsonObject = (jsonObject: any, maxSize: number, parentKey: string = ''): any[] => {
	const chunks: any[] = [];
	let currentChunk: any = {};
	let currentSize: number = 0;

	const addItemToChunk = (fullKey: string, value: any) => {
		let valueSize = estimateSize(value);
		if (currentSize + valueSize > maxSize) {
			if (currentSize > 0) {
				chunks.push(currentChunk);
				currentChunk = {};
				currentSize = 0;
			}
			if (typeof value === 'object' && value !== null && valueSize > maxSize) {
				chunks.push(...splitJsonObject(value, maxSize, fullKey));
			} else {
				currentChunk[fullKey] = value;
				currentSize += valueSize;
			}
		} else {
			currentChunk[fullKey] = value;
			currentSize += valueSize;
		}
	};

	if (Array.isArray(jsonObject)) {
		jsonObject.forEach((item, index) => {
			const fullKey = `${parentKey}${parentChildSeparator}[${index}]`; // Modified for arrays
			addItemToChunk(fullKey, item);
		});
	} else {
		Object.entries(jsonObject).forEach(([key, value]) => {
			const fullKey = parentKey ? `${parentKey}${parentChildSeparator}${key}` : key; // Modified for objects
			addItemToChunk(fullKey, value);
		});
	}

	if (currentSize > 0) {
		chunks.push(currentChunk);
	}

	return chunks;
};

export const recombineJsonChunks = (chunks: any[]): any => {
	let recombinedJson: any = {};

	chunks.forEach(chunk => {
		Object.entries(chunk).forEach(([fullKey, value]) => {
			let pathParts = fullKey.split(/\$DoNotRemoveOrChange\$|\[|\]/).filter(p => p !== ''); // Modified split
			let currentPart: any = recombinedJson;

			pathParts.forEach((part, index) => {
				let isLastPart = index === pathParts.length - 1;
				let isArrayIndex = /^\d+$/.test(part);

				if (isLastPart) {
					if (isArrayIndex) {
						if (!(currentPart instanceof Array)) currentPart = [];
						currentPart[parseInt(part)] = value;
					} else {
						currentPart[part] = value;
					}
				} else {
					// @ts-ignore
					if (/^\d+$/.test(pathParts[index + 1])) { // Next part is an array index
						if (!currentPart[part] || !(currentPart[part] instanceof Array)) {
							currentPart[part] = [];
						}
					} else { // Next part is an object key
						if (!currentPart[part] || typeof currentPart[part] !== 'object') {
							currentPart[part] = {};
						}
					}
					currentPart = currentPart[part];
				}
			});
		});
	});

	// Correctly format the root if it's an array
	if (Object.keys(recombinedJson).every(key => /^\d+$/.test(key))) {
		recombinedJson = Object.values(recombinedJson);
	}

	return recombinedJson;
};

// Example usage
// const originalJson: any = /* Your deeply nested JSON with arrays here */;
// const maxSize: number = 200; // Example size limit
//
// const chunks = splitJsonObject(originalJson, maxSize);
// console.log("Chunks:", JSON.stringify(chunks, null, 2));
//
// const recombinedJson = recombineJsonChunks(chunks);
// console.log("Recombined JSON:", JSON.stringify(recombinedJson, null, 2));
