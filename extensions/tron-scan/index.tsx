import React from 'react';
import { Extension } from '@/types/extension';
import Icon from './Icon';
import { Input } from '@/components/ui/input';
import { getFieldValue } from '@/helpers/extensionHelpers';
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
import { invokeViewMethod } from './tronHelper';

const extension: Extension = {
  id: 'tronscan',
  name: 'TRON',
  description:
    'Integrate with the TRON blockchain,  allowing AI access to TRON Scan APIs and TRON Contract Invocations to respond to your instructions.',
  icon: <Icon width={32} height={32} />,
  category: 'Blockchain',
  propertiesUI: (inputValues, handleInputChange) => (
    <>
      <div>
        Enable the following to give your AI access to the information it requires to service your prompt. Tips: For
        better performance, select only the information what you need.
      </div>

      <div>
        <Collapsible>
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">TRON Scan API</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-4 px-4">
              <div className="text-sm">Access TRON Scan public APIs to observe the resulting data.</div>
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
              <Input
                placeholder="Contract address to lookup"
                value={getFieldValue(inputValues, 'contract') || ''}
                onChange={(e) => handleInputChange('contract', e.target.value)}
              />
              <Input
                placeholder="Wallet address to lookup"
                value={getFieldValue(inputValues, 'wallet') || ''}
                onChange={(e) => handleInputChange('wallet', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div></div>
      <div>
        <Collapsible>
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Direct Contract Invocation (Experimental)</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-4 px-4">
              <div className="text-sm">Directly invoke read methods in your smart contract to observe the resulting data.</div>
              <Input
                placeholder="Contract address"
                value={getFieldValue(inputValues, 'invokeContractAddress') || ''}
                onChange={(e) => handleInputChange('invokeContractAddress', e.target.value)}
              />
              <Textarea
                placeholder="Contract ABI"
                value={getFieldValue(inputValues, 'invokeContractABI') || ''}
                onChange={(e) => handleInputChange('invokeContractABI', e.target.value)}
              />
              <Input
                placeholder="Method name"
                value={getFieldValue(inputValues, 'invokeContractMethod') || ''}
                onChange={(e) => handleInputChange('invokeContractMethod', e.target.value)}
              />
              <Input
                placeholder="Arguments"
                value={getFieldValue(inputValues, 'invokeContractArgs') || ''}
                onChange={(e) => handleInputChange('invokeContractArgs', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  ),
  onGenerating: async (event) => {

    const contract = getFieldValue(event.properties, 'contract');
    const wallet = getFieldValue(event.properties, 'wallet');
    const environment = getFieldValue(event.properties, 'environment');

    const invokeContractAddress = getFieldValue(event.properties, 'invokeContractAddress');
    const invokeContractABI = getFieldValue(event.properties, 'invokeContractABI');
    const invokeContractMethod = getFieldValue(event.properties, 'invokeContractMethod');
    const invokeContractArgs = getFieldValue(event.properties, 'invokeContractArgs');

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
    let contractInvocationData = '';

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

    if (enableBlock) {
      try {
        const response = await axios.get(`${baseUrl}/block/statistic`);
        if (response.status === 200) {
          blockDetailsData = JSON.stringify(response.data);
        }
      } catch {}
    }

    if (invokeContractAddress) {
      try {
        const response = await invokeViewMethod(invokeContractABI, invokeContractAddress, invokeContractMethod, [invokeContractArgs]);
        if (response) {
          contractInvocationData  = `${response}`;
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

Contract Invocation Results:
${contractInvocationData}
`;
    return prompt.trim();
  },
};

export default extension;
