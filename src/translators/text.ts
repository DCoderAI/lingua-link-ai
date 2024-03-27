import translate from "../translator";
import { Runnable } from "@langchain/core/runnables";
import { BaseLanguageModelInput } from "@langchain/core/dist/language_models/base";
import { BaseMessageChunk } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";

const textTranslator = async (model: Runnable<BaseLanguageModelInput, BaseMessageChunk, any>, documents: Document[], destLang: string, fileFormat?: string) => {
	const texts = [];
	for (const document of documents) {
		const content = await translate(model, document.pageContent, destLang, fileFormat);
		texts.push(content);
	}
	return texts?.join("\n\n");
}

export default textTranslator;