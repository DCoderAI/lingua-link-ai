import processor from "./processor.js";

const languages = [
	// {"name": "English", "code": "en"},
	// {"name": "Spanish", "code": "es"},
	// {"name": "French", "code": "fr"},
	// {"name": "German", "code": "de"},
	// {"name": "Chinese (Simplified)", "code": "zh-CN"},
	// {"name": "Chinese (Traditional)", "code": "zh-TW"},
	{"name": "Japanese", "code": "ja"},
	{"name": "Korean", "code": "ko"},
	{"name": "Arabic", "code": "ar"},
	{"name": "Hindi", "code": "hi"},
	{"name": "Bengali", "code": "bn"},
	{"name": "Urdu", "code": "ur"},
	{"name": "Tamil", "code": "ta"},
	{"name": "Telugu", "code": "te"},
	{"name": "Marathi", "code": "mr"},
	{"name": "Gujarati", "code": "gu"},
	{"name": "Kannada", "code": "kn"},
	{"name": "Malayalam", "code": "ml"},
	{"name": "Punjabi", "code": "pa"},
	{"name": "Russian", "code": "ru"},
	{"name": "Portuguese", "code": "pt"},
	{"name": "Italian", "code": "it"},
	{"name": "Dutch", "code": "nl"},
	{"name": "Swedish", "code": "sv"},
	{"name": "Polish", "code": "pl"},
	{"name": "Turkish", "code": "tr"},
	{"name": "Vietnamese", "code": "vi"},
	{"name": "Thai", "code": "th"},
	{"name": "Greek", "code": "el"},
	{"name": "Indonesian", "code": "id"},
	{"name": "Czech", "code": "cs"},
	{"name": "Danish", "code": "da"},
	{"name": "Finnish", "code": "fi"},
	{"name": "Norwegian", "code": "no"},
	{"name": "Hungarian", "code": "hu"},
	{"name": "Romanian", "code": "ro"},
	{"name": "Slovak", "code": "sk"},
	{"name": "Ukrainian", "code": "uk"},
	{"name": "Hebrew", "code": "he"},
	{"name": "Malay", "code": "ms"},
	{"name": "Filipino", "code": "fil"},
	{"name": "Afrikaans", "code": "af"},
	{"name": "Bulgarian", "code": "bg"},
	{"name": "Catalan", "code": "ca"},
	{"name": "Estonian", "code": "et"},
	{"name": "Icelandic", "code": "is"},
	{"name": "Latvian", "code": "lv"},
	{"name": "Lithuanian", "code": "lt"},
	{"name": "Slovenian", "code": "sl"},
	{"name": "Swahili", "code": "sw"}
];


const cli = async () => {
	console.log('background is running')
	for (const lang of languages) {
		console.log(`Translating to ${lang.name}`)
		await processor("/Volumes/Code/DCoderAI/site/messages/en.json", `/Volumes/Code/DCoderAI/site/messages/${lang.code}.json`, lang.name);
		console.log(`Translation to ${lang.name} completed`)
	}

	// await processor("/Volumes/Code/DCoderAI/langchain-i18n-converter/messages/en.json", "/Volumes/Code/DCoderAI/langchain-i18n-converter/messages/de.json", "German");
	console.log('Translation completed')
}

cli();
