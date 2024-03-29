# Lingua Link AI

Welcome to LinguaLinkAI, your go-to command-line utility for translating JSON, Markdown, CSV, and TSV files into your specified language. Powered by state-of-the-art language models, LinguaLinkAI offers flexibility, ease of use, and support for multiple translation engines.

## Features

- **Multiple Format Support**: Translate JSON, Markdown, CSV, and TSV files seamlessly.
- **Flexible Language Model Options**: Choose from Ollama (recommended and free), Amazon BedRock, and OpenAI. We're open to adding more models—submit a GitHub request!
- **Simple Configuration**: A straightforward setup process asks for your preferred language model and specific configurations.
- **Batch Translation**: Provide source and destination files or folders, specify your target language, and let LinguaLinkAI handle the rest.
- **Built with Node.js**: A robust and efficient foundation for cross-platform utility.

## Getting Started

### Installation

Ensure you have Node.js installed on your system. Install LinguaLinkAI globally using npm:

```bash
npm install -g lingua-link-ai
```

### Configuration

Run LinguaLinkAI to configure your preferred translation model:

```bash
lingua-link-ai
```

You will be prompted to select a language model from the following options:

- Ollama
- Amazon Bedrock
- OpenAI

Follow the on-screen instructions to complete the configuration for the selected model.

### Usage

Once configured, start a translation job by specifying the source and destination paths, along with the target language:

```bash
lingua-link-ai
```

LinguaLinkAI will process the files in the source location and output the translated files to the destination location.

## Contributing

Feedback and contributions are highly appreciated. If you have ideas for new features, encounter bugs, or want to add support for additional language models, please visit our GitHub repository:

[https://github.com/DCoderAI/lingua-link-ai](https://github.com/DCoderAI/lingua-link-ai)

## Support

For support, feature requests, or bug reports, please file an issue on our GitHub repository. Our team is committed to providing timely and helpful responses.

Thank you for choosing LinguaLinkAI for your translation needs. We're excited to be a part of your multilingual projects!

## Disclaimer
The translations are powered by AI and, while highly effective, may not always achieve perfection.
Depending on context, some nuances, idioms, or cultural expressions might not be fully captured.
