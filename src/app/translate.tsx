import React, { useCallback, useEffect, useState } from "react";
import processor from "../processor.js";
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import { Text, Box, useInput } from 'ink';
import { EventList } from "./type.js";
import Table from "./table.js";
import {useApp} from 'ink';

const Translate = () => {
	const [step, setStep] = useState<'source' | 'destination' | 'language' | 'processing' | 'done'>('source');
	const [source, setSource] = useState<string>('');
	const [destination, setDestination] = useState<string>('');
	const [language, setLanguage] = useState<string>('');
	const [events, setEvents] = useState<EventList>([]);
	const {exit} = useApp();

	const updateEvents = (newEvents: EventList) => {
		setEvents(newEvents);
	};

	const runTranslation = useCallback(async () => {
		console.log(`Source: ${source}, Destination: ${destination}, Language: ${language}`);
		await processor(source, destination, language, updateEvents);
		setStep('done');
		exit();
	}, [source, destination, language]);

	useEffect(() => {
		if (step === 'processing') {
			runTranslation();
			// Here, implement your file processing logic based on the source, destination, and language
		}
	}, [step]);

	useInput((_, key) => {
		if (key.escape) {
			process.exit(); // Exit on ESC
		}
	});

	switch (step) {
		case 'source':
			return (
				<Box>
					<Box>
						<Text>Enter source folder or file:</Text>
					</Box>
					<TextInput
						value={source}
						onChange={setSource}
						onSubmit={() => setStep('destination')}
					/>
				</Box>
			);
		case 'destination':
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter destination folder or file:</Text>
					</Box>
					<TextInput
						value={destination}
						onChange={setDestination}
						onSubmit={() => setStep('language')}
					/>
				</Box>
			);
		case 'language':
			return (
				<Box>
					<Box>
						<Text>Select language:</Text>
					</Box>
					<SelectInput
						items={[
							{label: 'English', value: 'English'},
							{label: 'Spanish', value: 'Spanish'},
							// Add more languages as needed
						]}
						onSelect={({value}) => {
							setLanguage(value);
							setStep('processing');
						}}
					/>
				</Box>
			);
		case 'processing':
			return <Table data={events} columns={['name', 'status', 'percentage']} />;
		case 'done':
			return <Table data={events} columns={['name', 'status', 'percentage']} />;
		default:
			return null;
	}
};

export default Translate;
