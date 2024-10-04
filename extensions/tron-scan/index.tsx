import React from 'react';
import { Extension } from '@/types/extension';
import Icon from './Icon';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getFieldValue, setFieldValue } from '@/helpers/extensionHelpers';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axios from 'axios';

const extension: Extension = {
  id: 'tronscan',
  name: 'TRON Scan',
  description:
    'Integrate with the TRON blockchain, allowing you to retrieve, analyze, and include TRON-based transaction details in your generated outputs.',
  icon: <Icon width={32} height={32} />,
  category: 'Blockchain',
  propertiesUI: (inputValues, handleInputChange) => (
    <>
      <div>
        Enable the following to give your AI access to the information it requires to service your prompt. Tips: For
        better performance, select only the information what you need.
      </div>
      <div>
        <Checkbox
          id="enableWallet"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableWallet', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableWallet" className="text-sm font-medium">
          Access to public wallet and account data
        </label>
      </div>
      <div>
        <Checkbox
          id="enableBlock"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableBlock', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableBlock" className="text-sm font-medium">
          Access to public block data
        </label>
      </div>
      <div>
        <Checkbox
          id="enableContract"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableContract', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableContract" className="text-sm font-medium">
          Access to public contract data
        </label>
      </div>
      <div>
        <Select onValueChange={(value) => handleInputChange('environment', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>TRON Environments</SelectLabel>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="testnet">Testnet (Nile)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contractAddress">Contract Address</Label>
        <Input
          id="contract"
          placeholder="Enter contract address"
          value={getFieldValue(inputValues, 'contract') || ''}
          onChange={(e) => handleInputChange('contract', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="wallet">Wallet Address</Label>
        <Input
          id="wallet"
          placeholder="Enter wallet address"
          value={getFieldValue(inputValues, 'wallet') || ''}
          onChange={(e) => handleInputChange('wallet', e.target.value)}
        />
      </div>
    </>
  ),
  onGenerating: async (event) => {
    console.log(event);

    const contract = getFieldValue(event.properties, 'contract');
    const wallet = getFieldValue(event.properties, 'wallet');
    const environment = getFieldValue(event.properties, 'environment');
    // const enableWallet = getFieldValue(event.properties, 'enableWallet');
    // const enableBlock = getFieldValue(event.properties, 'enableBlock');
    // const enableContract = getFieldValue(event.properties, 'enableContract');
    const enableBlock = true;

    // Testnet: https://nileapi.tronscan.org/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TRaGggHkr9YVswe3e5ZYCit1rdSCKXaoN6
    // Mainnet: https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=20&start=0&address=TSirzn8bNjqQsfKokKpGrz3LtfLuoBkuRg

    let baseUrl = 'https://apilist.tronscanapi.com/api';
    if (environment === 'testnet') {
      baseUrl = 'https://nileapi.tronscan.org/api';
    }

    let accountDetailsData = '';
    let contractDetailsData = '';
    let blockDetailsData = '';

    if (wallet) {
      try {
        const urlParams = new URLSearchParams({ address: wallet });
        const response = await axios.get(`${baseUrl}/accountv2?${urlParams.toString()}`);
        if (response.status === 200) {
          accountDetailsData = JSON.stringify(response.data);
        }
      } catch {}
    }

    if (contract) {
      try {
        const urlParams = new URLSearchParams({ contract });
        const response = await axios.get(`${baseUrl}/contract?${urlParams.toString()}`);
        if (response.status === 200) {
          contractDetailsData = JSON.stringify(response.data);
        }
      } catch {}
    }

    if (enableBlock) {
      try {
        const response = await axios.get(`${baseUrl}/block/statistic`);
        if (response.status === 200) {
          blockDetailsData = JSON.stringify(response.data);
        }
      } catch {}
    }

    const prompt = `
${event.prompt}
Here are the context data that you could refer to:

Account Details JSON:
${accountDetailsData}

Contract Details JSON:
${contractDetailsData}

Block Details JSON:
${blockDetailsData}
`;
    return prompt.trim();
  },
};

export default extension;
