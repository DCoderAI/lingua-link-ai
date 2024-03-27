import translate from "../translator";
import { Runnable } from "@langchain/core/runnables";
import { BaseLanguageModelInput } from "@langchain/core/dist/language_models/base";
import { BaseMessageChunk } from "@langchain/core/messages";
import { ChatOllamaFunctionsCallOptions } from "langchain/experimental/chat_models/ollama_functions";

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

export default jsonTranslator;