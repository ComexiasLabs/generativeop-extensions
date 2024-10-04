import React from 'react';
import { Extension } from '@/types/extension';
import Icon from './Icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

const extension: Extension = {
  id: 'markdown',
  name: 'Markdown',
  description:
    'Automatically formats your generated text into Markdown syntax. Perfect for creating well-structured documents, notes, or articles.',
    // Error below: 'React' refers to a UMD global, but the current file is a module. Consider adding an import instead.ts(2686
  icon: <Icon width={32} height={32} />,
  category: 'Productivity',
  propertiesUI: () => (
    <div>
      <Alert>
        <AlertDescription>
          Markdown formatting enabled. Generated response will now be formatted when applicable.
        </AlertDescription>
      </Alert>
    </div>
  ),
  onGenerating: (event) => {
    const prompt = event.prompt + '\n\nPlease format your output in Markdown.';
    return {
      prompt,
    };
  },
};

export default extension;
