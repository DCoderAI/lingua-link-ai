import { OllamaFunctions } from "langchain/experimental/chat_models/ollama_functions";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { Ollama } from "@langchain/community/llms/ollama";

export const schema = z.object({
	translated_text: z.string(),
});


export const ollamaFunction = new OllamaFunctions({
	temperature: 0.1,
	model: "mistral",
})
	.bind({
		functions: [
			{
				name: "text_translation",
				description: "Translate text from one language to another.",
				parameters: {
					type: "object",
					properties: zodToJsonSchema(schema),
				},
			},
		],
		function_call: {
			name: "text_translation",
		},
	});

export const ollama = new Ollama({
	temperature: 0.3,
	model: "mistral",
})

