export interface Extension {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  category: string;
  configUI?: (config?: KeyValue[], handleConfigChange?: (key: string, value: string) => void) => JSX.Element;
  propertiesUI: (properties?: KeyValue[], handlePropertyChange?: (key: string, value: string) => void) => JSX.Element;
  onInputDisplaying?: (event: OnInputDisplayingEvent) => { inputs?: KeyValue[] };
  onGenerating?: (event: OnGeneratingEvent) => Promise<string>;
  onGenerated?: (event: OnGeneratedEvent) => { output: string };
}

export interface OnInputDisplayingEvent {
  config: KeyValue[];
  properties: KeyValue[];
  inputs: KeyValue[];
}

export interface OnGeneratingEvent {
  config: KeyValue[];
  properties: KeyValue[];
  prompt: string;
}

export interface OnGeneratedEvent {
  config: KeyValue[];
  properties: KeyValue[];
  prompt: string;
  generatedOutput: string;
}

export interface KeyValue {
  key: string;
  value: string;
}
