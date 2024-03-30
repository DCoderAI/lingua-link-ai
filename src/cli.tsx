#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from "./app/main.js";
import meow from 'meow';

const cli = meow(`
    Usage
      $ lingua-link-ai [input]

    Options
      --config, -c  Set config flag (boolean)
      --source, -s  Source text to translate
      --destination, -d  Destination for the translated text
      --language, -l  Language to translate the text into

    Commands
      translate  Translate text from one language to another (default command if no input is given)

    Examples
      $ lingua-link-ai (assumes "translate" command)
      $ lingua-link-ai --config
      $ lingua-link-ai translate --source "Hello, world!" --destination "Bonjour, monde!" --language "French"
      $ lingua-link-ai --source "Hello, world!" --language "French"  (assumes "translate" command)
`, {
	importMeta: import.meta,
	flags: {
		config: {
			type: 'boolean',
			alias: 'c',
			default: false
		},
		source: {
			type: 'string',
			alias: 's',
		},
		destination: {
			type: 'string',
			alias: 'd',
		},
		language: {
			type: 'string',
			alias: 'l',
		}
	},
	autoHelp: true,
	autoVersion: true
});

// Default command behavior
const { config, source, destination, language } = cli.flags;

render(<App config={config} source={source} destination={destination} language={language} />);
