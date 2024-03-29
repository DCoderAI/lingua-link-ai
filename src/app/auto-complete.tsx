import React from 'react';
import Select from 'ink-select-input';
import TextInput from 'ink-text-input';
import { Box, Text } from 'ink';
import { SelectItem } from "./type.js";

interface AutoCompleteProps {
	value?: string;
	title?: string;
	items?: SelectItem[];
	getMatch?: (input: string) => (item: SelectItem) => boolean;
	onChange?: (input: string) => void;
	onSubmit?: (item: SelectItem) => void;
	indicatorComponent?: any;
	itemComponent?: any;
}

// Helpers -------------------------------------------------------------------

const noop = () => {
};
const not = (a: boolean) => !a;
const isEmpty = (arr: any[]) => arr.length === 0;
const getMatchItem = (input: string) => ({label}: SelectItem) =>
	input.length > 0 && label.toLowerCase().indexOf(input.toLowerCase()) > -1;

// AutoComplete --------------------------------------------------------------

const AutoComplete = ({
	                      value = '',
	                      items = [],
												title,
	                      getMatch = getMatchItem,
	                      onChange = noop,
	                      onSubmit = noop,
	                      indicatorComponent,
	                      itemComponent,
                      }: AutoCompleteProps) => {
	const matches = items.filter(getMatch(value));
	const hasSuggestion = not(isEmpty(matches));

	return (
		<Box width="100%" flexDirection="column">
			<Box>
				<Box marginRight={2}>
					<Text>{title}</Text>
				</Box>
				<TextInput
					value={value}
					onChange={onChange}
				/>
			</Box>
			{hasSuggestion && (
				<Select
					limit={5}
					items={matches}
					onSelect={onSubmit}
					indicatorComponent={indicatorComponent}
					itemComponent={itemComponent}
				/>
			)}
		</Box>
	);
};


export default AutoComplete;
