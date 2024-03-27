import model from "./src/llm";
import * as fs from "fs";
import * as path from "path";
import jsonTranslator from "./src/translators/json";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import textTranslator from "./src/translators/text";

export const processFile = async (filePath: string, destinationFilePath: string, destlang: string) => {
	const fileContent = fs.readFileSync(filePath, "utf-8");
	
	// if file extension is JSON then run jsonTranslator
	if (filePath.endsWith(".json")) {
		const result = await jsonTranslator(model, fileContent, destlang);
		
		// create file if it does not exist
		if (!fs.existsSync(destinationFilePath)) {
			fs.writeFileSync(destinationFilePath, "");
		}
		// write the result to the destination file
		fs.writeFileSync(destinationFilePath, JSON.stringify(result));
	} else if (filePath.endsWith(".txt")) {
		// if file extension is txt then run textTranslator
		throw new Error("Text translation is not supported yet");
	} else if (filePath.endsWith(".csv")) {
		// if file extension is csv then run csvTranslator
	} else if (filePath.endsWith(".tsv")) {
		// if file extension is tsv then run tsvTranslator
	} else if (filePath.endsWith(".xlsx")) {
		// if file extension is xlsx then run xlsxTranslator
	} else if (filePath.endsWith(".docx")) {
		// if file extension is docx then run docxTranslator
	} else if (filePath.endsWith(".md") || filePath.endsWith(".mdx")) {
		const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
			chunkSize: 1000,
			chunkOverlap: 0,
		});
		const documents = await splitter.createDocuments([fileContent]);
		const translatedContent = await textTranslator(model, documents, destlang, "markdown");
		// create file if it does not exist
		if (!fs.existsSync(destinationFilePath)) {
			fs.writeFileSync(destinationFilePath, "");
		}
		// write the result to the destination file
		fs.writeFileSync(destinationFilePath, translatedContent);
	}
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

processor("/Volumes/Code/DCoderAI/site/posts/building-a-successful-saas--the-crucial-role-of-early-user-feedback.mdx", "/Volumes/Code/DCoderAI/site/posts/building-a-successful-saas--the-crucial-role-of-early-user-feedback.de.mdx", "German")

export default processor;