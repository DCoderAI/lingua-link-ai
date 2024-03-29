import React, { useCallback, useState } from "react";
import { Text, Box } from 'ink';
import SelectInput from 'ink-select-input';
import Link from 'ink-link';
import Spinner from 'ink-spinner';
import sharedIniFileLoader from "@aws-sdk/shared-ini-file-loader";
import TextInput from 'ink-text-input';
import { Config, SelectItem } from "./type.js";

// const profileOrAwsKey = [
// 	{label: 'Profile', value: 'profile'},
// 	{label: 'AWS Key', value: 'aws-key'}
// ];


type Props = {
	onComplete: (config: Config) => void;
}
const Bedrock = ({onComplete}: Props) => {
	const [userProfileOrKeys, setUserProfileOrKeys] = useState<string>("aws-key");
	const [accessKey, setAccessKey] = useState<string>("");
	const [secretKey, setSecretKey] = useState<string>("");
	const [region, setRegion] = useState<string>("");
	const [profileKey, setProfileKey] = useState<string>("");
	const [model, setModel] = useState<string>("");
	const [step, setStep] = useState<'accessKey' | 'secretKey' | 'region' | 'model'>('accessKey');
	const [loading, setLoading] = useState(false);
	const [profiles, setProfiles] = useState<string[]>([]);

	const onSubmit = () => {
		if (userProfileOrKeys === 'profile') {
			onComplete({
				profile: profileKey,
				region,
				model,
			});
		} else {
			onComplete({
				accessKey,
				secretKey,
				region,
				model,
			});
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

	// @ts-ignore
	const handleAccessMethodSelection = async (item: SelectItem) => {
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

	// if (!userProfileOrKeys) {
	// 	return (
	// 		<Box width="100%" flexDirection="column">
	// 			<Box width="100%" paddingBottom={1} flexDirection="column">
	// 				<Link url="https://aws.amazon.com/bedrock/?">
	// 					<Text color="cyan">Bedrock</Text>
	// 				</Link>
	// 			</Box>
	// 			<Box flexDirection="column">
	// 				<Box>
	// 					<Text>How you want to access the models?</Text>
	// 				</Box>
	// 				<SelectInput
	// 					items={profileOrAwsKey}
	// 					onSelect={handleAccessMethodSelection}
	// 				/>
	// 			</Box>
	// 		</Box>
	// 	);
	// }

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
							setStep('region');
						}}
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
					onSubmit={() => setStep('model')}
				/>
			</Box>
		);
	}

	if (step === 'model') {
		return (
			<Box flexDirection="column">
				<Box width="100%" paddingBottom={1} flexDirection="column">
					<Link url="https://aws.amazon.com/bedrock/?">
						<Text color="cyan">Bedrock</Text>
					</Link>
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text>Enter Bedrock Model Name:</Text>
					</Box>
					<TextInput
						value={model}
						onChange={setModel}
						onSubmit={onSubmit}
					/>
				</Box>
			</Box>
		);
	}

	return <Text>Configuration complete. You can now run the translate command.</Text>;
};

export default Bedrock;
