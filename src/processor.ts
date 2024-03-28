import * as fs from "fs";
import * as path from "path";
import { translateCSVFile } from "./formats/csv.js";
import { translateMarkdownFile } from "./formats/markdown.js";
import { translateJsonFile } from "./formats/json.js";


export const processFile = async (filePath: string, destinationFilePath: string, destlang: string) => {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	let result = "";
	// if file extension is JSON then run jsonTranslator
	if (filePath.endsWith(".json")) {
		result = await translateJsonFile(fileContent, destlang);
	} else if (filePath.endsWith(".csv") || filePath.endsWith(".tsv")) {
		result = await translateCSVFile(filePath, fileContent, destlang);
	} else if (filePath.endsWith(".md") || filePath.endsWith(".mdx")) {
		result = await translateMarkdownFile(fileContent, filePath, destlang);
	}

	// create file if it does not exist
	if (!fs.existsSync(destinationFilePath)) {
		fs.writeFileSync(destinationFilePath, "");
	}
	// write the result to the destination file
	fs.writeFileSync(destinationFilePath, result);

};

export const processor = async (fileFolderPath: string, destinationPath: string, destlang: string) => {
	// check if the fileFolderPath exists and is a directory
	if (!fs.existsSync(fileFolderPath)) {
		throw new Error("Invalid file folder path");
	}

	if (fs.lstatSync(fileFolderPath).isDirectory()) {
		// take one file at a tile and pass it to the translation model
		const files = fs.readdirSync(fileFolderPath);

		for (const file of files) {
			console.log("Processing file: ", file)
			const filePath = path.join(fileFolderPath, file);
			const destinationFilePath = path.join(destinationPath, file);
			await processFile(filePath, destinationFilePath, destlang);
		}

		// else check if the fileFolderPath is a file
	} else if (fs.lstatSync(fileFolderPath).isFile()) {
		console.log("Processing file");
		await processFile(fileFolderPath, destinationPath, destlang);
	}
}

export default processor;
