import { Ollama } from "@langchain/community/llms/ollama";
import path, { dirname } from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configPath = path.join(__dirname, 'config.json');


const getLLMModel = async () => {
	const config = await fs.readJson(configPath);
	if (config.llm) {
		return new Ollama({
			temperature: 0.1,
			model: config.model,
		})
	}
	throw new Error("LLM not found in config");
};

export default getLLMModel;
