import React, { useCallback, useState } from "react";
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import Link from 'ink-link';
import Spinner from 'ink-spinner';
import sharedIniFileLoader from "@aws-sdk/shared-ini-file-loader";
import TextInput from 'ink-text-input';
import { SelectItem } from "./type.js";

const profileOrAwsKey = [
	{label: 'Profile', value: 'profile'},
	{label: 'AWS Key', value: 'aws-key'}
];


type Props = {
	onComplete: (llmModel: string) => void;
}
const Bedrock = ({onComplete}: Props) => {
	const [userProfileOrKeys, setUserProfileOrKeys] = useState<string>("");
	const [accessKey, setAccessKey] = useState<string>("");
	const [secretKey, setSecretKey] = useState<string>("");
	const [region, setRegion] = useState<string>("");
	const [profileKey, setProfileKey] = useState<string>("");
	const [step, setStep] = useState<'accessKey' | 'secretKey' | 'region'>('accessKey');
	const [loading, setLoading] = useState(false);
	const [profiles, setProfiles] = useState<string[]>([]);

	const onSubmit = () => {
		if (userProfileOrKeys === 'profile') {
			onComplete(profileKey);
		} else {
			onComplete('aws-key');
		}
	}

	const loadProfiles = useCallback(async () => {
		setLoading(true);
		try {
			const profiles = await sharedIniFileLoader.loadSharedConfigFiles();
			setProfiles(Object.keys(profiles.credentialsFile));
		} catch (error) {
			console.log('Error fetching profiles from AWS config');
		}
		setLoading(false);
	}, []);

	const handleAWSPRofileSelect = async (item: SelectItem) => {
		setUserProfileOrKeys(item.value);
		if (item.value === 'profile') {
			loadProfiles();
		}
	}

	if (loading) {
		return (
			<Text>
				<Text color="green">
					<Spinner type="dots"/>
				</Text>
				{' Loading'}
			</Text>
		);
	}

	if (!userProfileOrKeys) {
		return (
			<Box width="100%" flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Link url="https://aws.amazon.com/bedrock/?">
						<Text color="cyan">Bedrock</Text>
					</Link>
				</Box>
				<Box flexDirection="column">
					<Box>
						<Text>How you want to access the models?</Text>
					</Box>
					<SelectInput
						items={profileOrAwsKey}
						onSelect={handleAWSPRofileSelect}
					/>
				</Box>
			</Box>
		);
	}

	if (userProfileOrKeys === 'profile') {
		if (!profileKey) {
			return (
				<Box width="100%" flexDirection="column">
					<Box>
						<Text>Select AWS Profile:</Text>
					</Box>
					<SelectInput
						items={profiles.map(profile => ({label: profile, value: profile}))}
						onSelect={({value}) => {
							setProfileKey(value);
						}}
					/>
				</Box>
			);
		} else {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter AWS Region:</Text>
					</Box>
					<TextInput
						value={region}
						onChange={setRegion}
						onSubmit={onSubmit}
					/>
				</Box>
			);
		}

	}

	if (userProfileOrKeys === 'aws-key') {
		if (step === 'accessKey') {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter AWS Access Key:</Text>
					</Box>
					<TextInput
						value={accessKey}
						onChange={setAccessKey}
						onSubmit={() => setStep('secretKey')}
					/>
				</Box>
			);
		}
		if (step === 'secretKey') {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter AWS Secret Key:</Text>
					</Box>
					<TextInput
						value={secretKey}
						onChange={setSecretKey}
						onSubmit={() => setStep('region')}
					/>
				</Box>
			);
		}

		if (step === 'region') {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter AWS Region:</Text>
					</Box>
					<TextInput
						value={region}
						onChange={setRegion}
						onSubmit={onSubmit}
					/>
				</Box>
			);
		}
	}
	return <Text>Configuration complete. You can now run the translate command.</Text>;
};

export default Bedrock;
