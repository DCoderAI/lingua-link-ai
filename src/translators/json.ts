import { Runnable } from "@langchain/core/runnables";
import { BaseLanguageModelInput } from "@langchain/core/dist/language_models/base";
import { BaseMessageChunk } from "@langchain/core/messages";
import { ChatOllamaFunctionsCallOptions } from "langchain/experimental/chat_models/ollama_functions";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
const translateJSON = async (model: Runnable<BaseLanguageModelInput, BaseMessageChunk, any>, json: any, destLang: string): Promise<any> => {
	const translatedJSON: any = {};
	
	// Translate each key-value pair
	for (const key in json) {
		if (json.hasOwnProperty(key)) {
			const value = json[key];
			if (typeof value === 'string') {
				translatedJSON[key] = await translate(model, value, destLang);
				console.log(key, translatedJSON[key])
			} else if (typeof value === 'object') {
				translatedJSON[key] = await translateJSON(model, value, destLang);
			} else {
				translatedJSON[key] = value;
			}
		}
	}
	
	return translatedJSON;
};


const jsonTranslator = async (model: Runnable<BaseLanguageModelInput, BaseMessageChunk, ChatOllamaFunctionsCallOptions>, fileContent: string, destLang: string) => translateJSON(model, JSON.parse(fileContent), destLang)


const TRANSLATE_TEMPLATE = `
Instructions:
- You are expert in translation.
- The translated text should persist the format of the original text like space, new line, etc.
- The translated text should not the key value which is starting before the colon.
- The translated text should not write anything else except the translation.
- The translated text should not worry about the perfect translation.
- The translated text should not break the unique words into parts and translate e.g. NextGenAIKit -> Next Gen AI Kit is wrong, it should be NextGenAIKit.
- If translation is not possible, write the original text.
- Translate the following sentence from English to {destLang}

{text}
`;


const prompt = PromptTemplate.fromTemplate(TRANSLATE_TEMPLATE);


const translate = async (model: Runnable<BaseLanguageModelInput, BaseMessageChunk, any>, text: string, destLang: string, fileFormat: string = "text") => {
	try {
		const chain = await prompt.pipe(model).pipe(new JsonOutputFunctionsParser());
		const response = await chain.invoke({
			destLang,
			text,
			fileFormat
		});
		
		// @ts-ignore
		const translatedText = response?.translated_text ?? response?.type?.translated_text ?? response?.properties?.translated_text?.value ?? response?.properties?.translated_text?.example ?? response?.properties?.translated_text?.enum ?? response?.properties?.translated_text;
		if (!translatedText) {
			// fallback to the original text
			return text;
		}
		if (typeof translatedText === "string") {
			return translatedText;
		}
		console.log("Translated text:", response);
		return text;
		
	} catch (e) {
		console.error(e);
		return text;
	}
	
	
}

export default jsonTranslator;