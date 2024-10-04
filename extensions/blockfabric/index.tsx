import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

const extension: Extension = {
  id: 'blockfabric',
  name: 'BlockFabric',
  description:
    'Integrates with the BlockFabric platform (www.blockfabric.dev) to deploy contracts and view contract metrics.',
  icon: <Icon width={32} height={32} />,
  category: 'Blockchain',
  propertiesUI: () => (
    <div>
      <Alert>
        <AlertDescription>This extension will be available soon.</AlertDescription>
      </Alert>
    </div>
  ),
};

export default extension;
