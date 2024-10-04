# GenOp AI Extensions

Welcome to the **GenOp AI Extensions** repository! This repository is the home of various open-source extensions that can be integrated with the **GenOp AI** app, available at [www.genop.ai](https://www.genop.ai). GenOp is a generative AI platform that allows users to enhance their AI workflows by activating extensions that integrate with external systems, blockchains, or custom features.

## Table of Contents

- [About](#about)
- [Available Extensions](#available-extensions)
- [Creating Your Own Extension](#creating-your-own-extension)
  - [Basic Structure](#basic-structure)
  - [Required Interface](#required-interface)
  - [Handling Events](#handling-events)
- [Contributing](#contributing)
- [License](#license)

## About

GenOp Extensions allow users to extend the capabilities of the GenOp AI platform by adding integrations with third-party services, custom functionality, or domain-specific tools. Extensions can be activated through the GenOp app's extension interface, providing additional features to prompts or modifying the behavior of the AI model during the generation process.

Each extension is self-contained and can be activated or deactivated by users. Examples include blockchain integrations, third-party API integrations, or custom logic applied to AI-generated prompts.

## Available Extensions

### Productivity Extensions

- **Markdown**: Automatically formats your generated text into Markdown syntax.

- **No Commentary**: Removes commentary conversation in the AI generated content and show only the wanted results.

- **PII Remover**: Automatically remove or masks PII data found AI generated content.

- **GitHub**: Read source files directly from GitHub that can be inserted directly into your prompts.

### Blockchain Extensions

- **TRON Scan**: Integrate with the TRON blockchain to fetch transaction, wallet and contract data that can be fed directly into your prompts.

- **Aptos Scan**: Integrate with the Aptos blockchain to fetch transaction, wallet and contract data that can be fed directly into your prompts.

- **BlockFabric**: Deploy smart contracts directly via the BlockFabric platform.

Explore more extensions in the `extensions/` directory.

## Creating Your Own Extension

To create a new extension, follow the structure and guidelines below. Extensions must adhere to the `Extension` interface, and the extension should define its functionality, UI elements, and event handlers as needed.

### Basic Structure

Each extension lives in its own folder under the `extensions/` directory. The main file should export an `Extension` object that defines the extension’s properties and behavior.

Example file structure:

```
/extensions
  /your-extension
    index.tsx
    Icon.tsx
```

### Required Interface

All extensions must implement the following interface:

```typescript
export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  category: string;
  configUI?: (config?: KeyValue[], handleConfigChange?: (key: string, value: string) => void) => JSX.Element;
  propertiesUI: (properties?: KeyValue[], handlePropertyChange?: (key: string, value: string) => void) => JSX.Element;
  onInputDisplaying?: (event: OnInputDisplayingEvent) => { inputs?: KeyValue[] };
  onGenerating?: (event: OnGeneratingEvent) => { prompt: string };
  onGenerated?: (event: OnGeneratedEvent) => { output: string };
}
```

#### Properties Breakdown

- id: A unique identifier for the extension, typically lower case of the name with no spaces, dashes and special characters.
- name: The display name of the extension.
- description: A short description of the extension’s functionality.
- icon: An icon representing the extension.
- category: The category under which this extension falls (e.g., Blockchain, Finance, E-Commerce).
- configUI (optional): A function returning JSX for the configuration UI in the Extensions settings.
- propertiesUI: A function returning JSX for the property configuration in prompt settings.
- onInputDisplaying (optional): Event hook triggered when inputs are displayed to the user.
- onGenerating (optional): Event hook triggered before AI generation.
- onGenerated (optional): Event hook triggered after AI generation.

### Handling Events

Extensions can respond to different events within the GenOp app by defining event handlers:

onInputDisplaying: Modify or populate input fields before they are displayed.
onGenerating: Modify the AI prompt before it is generated.
onGenerated: Modify the AI output after it has been generated.

### Extension Helpers

You can use the following helper methods to manage input values:

getFieldValue(inputValues: KeyValue[], key: string): string | undefined: Get a field value by key.
setFieldValue(inputValues: KeyValue[], key: string, value: string): void: Set a field value by key.

### Contributing

We welcome contributions! To contribute:

1. Fork this repository.
2. Create a new branch for your extension.
3. Submit a pull request with a detailed description of your extension.

Make sure your extension follows the required structure and interface.

### License

This repository is licensed under the MIT License.
