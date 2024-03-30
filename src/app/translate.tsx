import React, { useCallback, useEffect, useState } from "react";
import processor from "../processor.js";
import TextInput from 'ink-text-input';
import { Text, Box, useInput } from 'ink';
import { EventList } from "./type.js";
import Table, { CellProps } from "./table.js";
import { useApp } from 'ink';
import languages from "./languages.js";
import AutoComplete from "./auto-complete.js";

type Props = {
	source?: string;
	destination?: string;
	language?: string;
}

const CustomCell = (props: CellProps) => {
	if (props.column === 1) {
		if (props.children === ' processing ') {
			return <Box>
				<Text color="yellow">{props.children}</Text>
			</Box>;
		}
		if (props.children === ' completed ') {
			return <Box>
				<Text color="green">{props.children}</Text>
			</Box>;
		}
	}
	if (props.column === 2) {
		if (props.children === ' processing ') {
			return <Box>
				<Text color="yellow">{Math.round(Number(props.children),)}</Text>
			</Box>;
		}
		if (props.children === ' completed ') {
			return <Box>
				<Text color="green">{props.children}</Text>
			</Box>;
		}
	}
	return <Text>{props.children}</Text>;
}

const Translate = ({source: inputSource, destination: inputDestination, language: inputLanguage}: Props) => {
	const [step, setStep] = useState<'source' | 'destination' | 'language' | 'processing' | 'done'>('source');
	const [source, setSource] = useState<string>(inputSource ?? "");
	const [destination, setDestination] = useState<string>(inputDestination ?? "");
	const [language, setLanguage] = useState<any>(inputLanguage ?? "");
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
					<Box marginRight={2}>
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
				<Box width="100%" flexDirection="column">
					<Box marginRight={2}>
						<Text>Enter source folder or file: {source}</Text>
					</Box>
					<Box>
						<Box marginRight={2}>
							<Text>Enter destination folder or file:</Text>
						</Box>
						<TextInput
							value={destination}
							onChange={setDestination}
							onSubmit={() => setStep('language')}
						/>
					</Box>
				</Box>
			);
		case 'language':
			return (
				<Box flexDirection="column" width="100%">
					<AutoComplete
						title="Enter target language:"
						value={language}
						onChange={setLanguage}
						items={languages?.map((lang) => ({label: lang.name, value: lang.name}))}
						onSubmit={(item) => {
							setLanguage(item.value);
							setStep('processing');
						}}
					/>
				</Box>
			);
		case 'processing':
			return <Table data={events} columns={['name', 'status', 'percentage']} cell={CustomCell}/>;
		case 'done':
			return <Table data={events} columns={['name', 'status', 'percentage']}/>;
		default:
			return null;
	}
};

export default Translate;
