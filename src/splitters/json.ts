type SplitJson = {
	[key: string]: string;
};

class JsonSplitter {
	private static chunkPrefix = 'chunk_';
	private static chunkSize: number;

	public static split(json: object, size: number): SplitJson {
		this.chunkSize = size;
		const serialized = JSON.stringify(json);
		const chunks: SplitJson = {};
		let chunkIndex = 0;

		for (let start = 0; start < serialized.length; start += this.chunkSize, chunkIndex++) {
			const chunkKey = this.chunkPrefix + chunkIndex.toString();
			chunks[chunkKey] = serialized.slice(start, start + this.chunkSize);
		}

		return chunks;
	}

	public static combine(chunks: SplitJson): object {
		const chunkKeys = Object.keys(chunks).sort();
		let combinedString = '';

		for (const key of chunkKeys) {
			combinedString += chunks[key];
		}

		return JSON.parse(combinedString);
	}
}

// Example usage
const originalJson = {
	message: "Hello, this is a test message to demonstrate splitting and combining JSON based on content size.",
	nested: {
		level1: "Level 1 text",
		level2: {
			level2Text: "Level 2 text"
		}
	}
};

const size = 50; // Split size in characters

// Splitting
const splitJson = JsonSplitter.split(originalJson, size);
console.log(splitJson);

// Combining
const combinedJson = JsonSplitter.combine(splitJson);
console.log(combinedJson);
