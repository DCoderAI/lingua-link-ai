const z = require("zod");
const zodToJsonSchema = require("zod-to-json-schema");

const OllamaFunctions = require("langchain/experimental/chat_models/ollama_functions");
const JsonOutputFunctionsParser = require("langchain/output_parsers");
const PromptTemplate = require("@langchain/core/prompts");

const EXTRACTION_TEMPLATE = `Extract and save the relevant entities mentioned in the following passage together with their properties.

	Passage:
{input}
`;

const prompt = PromptTemplate.fromTemplate(EXTRACTION_TEMPLATE);

// Use Zod for easier schema declaration
const schema = z.object({
	people: z.array(
		z.object({
			name: z.string().describe("The name of a person"),
			height: z.number().describe("The person's height"),
			hairColor: z.optional(z.string()).describe("The person's hair color"),
		})
	),
});

const model = new OllamaFunctions({
	temperature: 0.1,
	model: "mistral",
}).bind({
	functions: [
		{
			name: "information_extraction",
			description: "Extracts the relevant information from the passage.",
			parameters: {
				type: "object",
				properties: zodToJsonSchema(schema),
			},
		},
	],
	function_call: {
		name: "information_extraction",
	},
});

// Use a JsonOutputFunctionsParser to get the parsed JSON response directly.
const chain = prompt.pipe(model).pipe(new JsonOutputFunctionsParser());

chain.invoke({
	input:
		"Alex is 5 feet tall. Claudia is 1 foot taller than Alex and jumps higher than him. Claudia has orange hair and Alex is blonde.",
}).then(response => {
    console.log(response);
});

