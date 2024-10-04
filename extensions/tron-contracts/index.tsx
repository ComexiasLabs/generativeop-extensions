import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const extension: Extension = {
  id: 'tronsmartcontracts',
  name: 'TRON Smart Contracts',
  description:
    'This extension enables the deployment and invocation of TRON smart contracts, allowing users to interact with the TRON blockchain directly. It simplifies the process of executing contract functions and managing contract life cycles within the TRON ecosystem.',
  icon: <Icon width={32} height={32} />,
  category: 'Blockchain',
  propertiesUI: (inputValues, handleInputChange) => (
    <div>
      <Label htmlFor="tron-contract">Contract Address</Label>
      <Input
        id="tron-contract"
        placeholder="Enter contract address"
        value={inputValues['contract'] || ''}
        onChange={(e) => handleInputChange('contract', e.target.value)}
      />
    </div>
  ),
  onInputDisplaying: (event) => {
    // TODO: read properties for wallet/contract address then call a fetch to blockscanner API
    // then assign the returning results in the appropriate inputs
    return {
      inputs: event.inputs,
    };
  },
};

export default extension;
