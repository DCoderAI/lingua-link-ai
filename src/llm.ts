import { Ollama } from "@langchain/community/llms/ollama";

export const ollama = new Ollama({
	temperature: 0.1,
	model: "mistral",
})

