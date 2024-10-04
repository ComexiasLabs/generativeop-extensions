import React from 'react';
import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getFieldValue, setFieldValue } from '@/helpers/extensionHelpers';

const extension: Extension = {
  id: 'aptosscan',
  name: 'Aptos Scan',
  description:
    'Integrate with the Aptos blockchain to scan transactions, validate data, and incorporate blockchain insights directly into your prompts and responses.',
  icon: <Icon width={32} height={32} />,
  category: 'Blockchain',
  propertiesUI: (inputValues, handleInputChange) => (
    <>
      <div>
        <Label htmlFor="aptos-contract">Contract Address</Label>
        <Input
          id="aptos-contract"
          placeholder="Enter contract address"
          value={getFieldValue(inputValues, 'contract') || ''}
          onChange={(e) => handleInputChange('contract', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="aptos-wallet">Wallet Address</Label>
        <Input
          id="aptos-wallet"
          placeholder="Enter wallet address"
          value={getFieldValue(inputValues, 'wallet') || ''}
          onChange={(e) => handleInputChange('wallet', e.target.value)}
        />
      </div>
    </>
  ),
  onInputDisplaying: (event) => {
    console.log(`aptosscan onInputDisplaying: ${JSON.stringify(event)}`);
    // {"config":[],"properties":[{"key":"contract","value":"abcd"},{"key":"wallet","value":"1234"}],"inputs":[{"key":"aptosscan:Wallet Address"},{"key":"aptosscan:Wallet Balance"}]}

    // TODO: read properties for wallet/contract address then call a fetch to blockscanner API
    // then assign the returning results in the appropriate inputs

    setFieldValue(event.inputs, 'aptosscan:Wallet Address', 'replaced by extension wallet address');
    setFieldValue(event.inputs, 'aptosscan:Wallet Balance', 'replaced by extension wallet Balance');

    return {
      inputs: event.inputs,
    };
  },
};

export default extension;
