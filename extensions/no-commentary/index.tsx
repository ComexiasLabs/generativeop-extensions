import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

const extension: Extension = {
  id: 'nocommentary',
  name: 'No Commentary',
  description:
    'This extension removes commentary generated by AI models, providing responses that focus solely on the main point of the message, without additional explanations or context.',
  icon: <Icon width={32} height={32} />,
  category: 'Productivity',
  propertiesUI: () => (
    <div>
      <Alert>
        <AlertDescription>No commentary enabled. Generated response will now remove commentary.</AlertDescription>
      </Alert>
    </div>
  ),
  onGenerating: async (event) => {
    const prompt = event.prompt + '\n\nWrite your response without any commentary.';
    return prompt;
  },
};

export default extension;
