import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

const extension: Extension = {
  id: 'github',
  name: 'GitHub',
  description:
    'This extension integrates GitHub functionality, allowing you to interact directly pull your repositories into your AI prompts .',
  icon: <Icon width={32} height={32} />,
  category: 'Productivity',
  propertiesUI: () => (
    <div>
      <Alert>
        <AlertDescription>This extension will be available soon.</AlertDescription>
      </Alert>
    </div>
  ),
};

export default extension;
