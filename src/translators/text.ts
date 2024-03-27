import { Document } from "@langchain/core/documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { Ollama } from "@langchain/community/llms/ollama";

const TRANSLATE_TEMPLATE = `
Instructions for Translation:
- You are expert in translation. Translate the following sentence from English to {destLang}
- You should follow {fileFormat} file format.
- You will be directly written to the file.
- You should not worry about the perfect translation.
- For the mdx file format, keep the header section keys unchanged and only translate the values. Keys include title, description, image, date, modifiedDate etc
- You should not worry about the perfect translation.
- You should not break the unique words into parts and translate e.g. NextGenAIKit -> Next Gen AI Kit is wrong, it should be NextGenAIKit.
- The translated content will be send to end user without human intervention. You should not include any line which end user can think that this content is generated by the AI e.g. Here is the translation of the given text from English to or similar kind of messages.
- You should not ask for any feedback and should not include any remarks.
- You should not add any Note or Warning: messages to the translation.
- You should not add any introductory or explanatory messages in the response.
- You should return only translated message without any additional messages generated by you. It could be Note: or Warning: or general message.

Original Text:
{text}
`;

const prompt = PromptTemplate.fromTemplate(TRANSLATE_TEMPLATE);

const translate = async (model: Ollama, text: string, destLang: string, fileFormat: string = "text") => {
	try {
		// console.log("File format:", fileFormat)
		const chain = prompt.pipe(model);
		const response = await chain.invoke({
			destLang,
			text,
			fileFormat,
		});
		
		const regex1 = /Here is the translation \w.+/gi; // remove the full like
		const regex2 = /Note: \w.+/gi; // remove the full like
		const regex3 = /Sure, \w.+/gi; // remove the full like
		return response.replace(regex1, "").replace(regex2, "").replace(regex3, "");
		
	} catch (e) {
		console.error(e);
		return text;
	}
}


const textTranslator = async (model: Ollama, documents: string[], destLang: string, fileFormat?: string) => {
	const texts = [];
	for (const document of documents) {
		const content = await translate(model, document, destLang, fileFormat);
		// console.log(document)
		// console.log(content)
		texts.push(content);
	}
	return texts?.join("\n\n");
}

export default textTranslator;