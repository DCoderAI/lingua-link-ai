import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import textTranslator from "../translators/text.js";
import { ollama } from "../llm.js";

export const translateMarkdownFile = async (fileContent: string, filePath: string, destlang: string) => {
	const documents: string[] = [];
	let content = fileContent;
	if (filePath.endsWith(".mdx")) {
		// split the header and content
		let headerContentSection = fileContent.split("---");
		const header = headerContentSection[1];
		console.log({header: `---${header}---`});
		documents.push(`---${header}---`);
		content = headerContentSection[2] as string;
		console.log(content)
	}
	const splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
		chunkSize: 900,
		chunkOverlap: 0,
	});
	const newDocs = await splitter.createDocuments([content]);
	newDocs.forEach((doc) => {
		documents.push(doc.pageContent);
	});

	return await textTranslator(ollama, documents, destlang, "mdx");
};
