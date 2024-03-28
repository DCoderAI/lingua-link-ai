#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
// import meow from 'meow';
import App from "./main.js";

// const cli = meow(
// 	`
// 	Usage
// 	  $ i18n-ai-translator
//
// 	Options
// 		--config  Set Ollama model configuration
// 		--translate  Translate text using Ollama model
//
// 	Examples
// 	  $ i18n-ai-translator --config
// `,
// 	{
// 		importMeta: import.meta,
// 		flags: {
// 			name: {
// 				type: 'string',
// 			},
// 		},
// 	},
// );

render(<App />);
