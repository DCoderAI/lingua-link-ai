import * as fs from "fs";
import * as path from "path";
import { translateCSVFile } from "./formats/csv.js";
import { translateMarkdownFile } from "./formats/markdown.js";
import { translateJsonFile } from "./formats/json.js";
import { EventList } from "./app/type.js";


export const processFile = async (filePath: string, destinationFilePath: string, destlang: string, progress?: (percentage: number) => void) => {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	let result = "";
	// if file extension is JSON then run jsonTranslator
	if (filePath.endsWith(".json")) {
		result = await translateJsonFile(fileContent, destlang, progress);
	} else if (filePath.endsWith(".csv") || filePath.endsWith(".tsv")) {
		result = await translateCSVFile(filePath, fileContent, destlang, progress);
	} else if (filePath.endsWith(".md") || filePath.endsWith(".mdx")) {
		result = await translateMarkdownFile(fileContent, filePath, destlang, progress);
	}

	// create directory if it does not exist
	if (!fs.existsSync(path.dirname(destinationFilePath))) {
		fs.mkdirSync(path.dirname(destinationFilePath), { recursive: true });
	}
	// create file if it does not exist
	if (!fs.existsSync(destinationFilePath)) {
		fs.writeFileSync(destinationFilePath, "");
	}
	// write the result to the destination file
	fs.writeFileSync(destinationFilePath, result);

};

export const processor = async (fileFolderPath: string, destinationPath: string, destlang: string, onProgress?: (events: EventList) => void) => {
	// check if the fileFolderPath exists and is a directory
	const events: EventList = [];
	if (!fs.existsSync(fileFolderPath)) {
		throw new Error("Invalid file folder path");
	}

	if (fs.lstatSync(fileFolderPath).isDirectory()) {
		// take one file at a tile and pass it to the translation model
		const files = fs.readdirSync(fileFolderPath);

		// update event list
		for (const file of files) {
			events.push({
				name: file,
				status: "pending",
				location: path.join(fileFolderPath, file),
				percentage: 0,
			});
		}

		onProgress?.([...events]);

		for (const file of files) {
			const index = events.findIndex((event) => event.name === file);
			if (events?.[index]) {
				// @ts-ignore
				events[index].status = "processing";
				onProgress?.([...events]);
			}
			const progress = (percentage: number) => {
				if (events?.[index]) {
					// @ts-ignore
					events[index].percentage = percentage;
					onProgress?.([...events]);
				}
			}
			const filePath = path.join(fileFolderPath, file);
			const destinationFilePath = path.join(destinationPath, file);
			await processFile(filePath, destinationFilePath, destlang, progress);
			if (events?.[index]) {
				// @ts-ignore
				events[index].status = "completed";
				onProgress?.([...events]);
			}
		}

		// else check if the fileFolderPath is a file
	} else if (fs.lstatSync(fileFolderPath).isFile()) {
		events.push({
			name: path.basename(fileFolderPath),
			status: "processing",
			location: fileFolderPath,
			percentage: 0,
		});

		const progress = (percentage: number) => {
			if (events?.[0])  {
				events[0].percentage = percentage;
				onProgress?.([...events]);
			}
		}
		await processFile(fileFolderPath, destinationPath, destlang, progress);
		if (events?.[0]) {
			events[0].status = "completed";
			onProgress?.([...events]);
		}
	}
}

export default processor;
