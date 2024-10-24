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

const extension: Extension = {
  id: 'near',
  name: 'NEAR',
  description: 'Integrate with the NEAR blockchain, allowing AI access to NEAR RPC to respond to your instructions.',
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
            <h4 className="text-sm font-semibold">NEAR RPC</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <div className="space-y-4 px-4">
              <div className="text-sm">Access NEAR RPC to observe the resulting data.</div>
              <div>
                <Checkbox
                  id="enableAccount"
                  checked={true}
                  onCheckedChange={(checked) => handleInputChange('enableAccount', checked ? 'true' : 'false')}
                />
                <label htmlFor="enableAccount" className="text-sm font-medium">
                  Access to account and contracts data
                </label>
              </div>
              <div>
                <Checkbox
                  id="enableBlock"
                  checked={true}
                  onCheckedChange={(checked) => handleInputChange('enableBlock', checked ? 'true' : 'false')}
                />
                <label htmlFor="enableBlock" className="text-sm font-medium">
                  Access to block and gas price data
                </label>
              </div>
              <div>
                <Checkbox
                  id="enableTx"
                  checked={true}
                  onCheckedChange={(checked) => handleInputChange('enableTx', checked ? 'true' : 'false')}
                />
                <label htmlFor="enableTx" className="text-sm font-medium">
                  Access to transactions data
                </label>
              </div>
              <Select onValueChange={(value) => handleInputChange('environment', value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Environments</SelectLabel>
                    <SelectItem value="mainnet">Mainnet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Input
                placeholder="Account ID to lookup"
                value={getFieldValue(inputValues, 'accountId') || ''}
                onChange={(e) => handleInputChange('accountId', e.target.value)}
              />
              <Input
                placeholder="Transaction Hash"
                value={getFieldValue(inputValues, 'txHash') || ''}
                onChange={(e) => handleInputChange('txHash', e.target.value)}
              />
              <Input
                placeholder="Receipt ID"
                value={getFieldValue(inputValues, 'receiptId') || ''}
                onChange={(e) => handleInputChange('receiptId', e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  ),
  onGenerating: async (event) => {
    // const environment = getFieldValue(event.properties, 'environment');
    const accountId = getFieldValue(event.properties, 'accountId');
    const txHash = getFieldValue(event.properties, 'txHash');
    const receiptId = getFieldValue(event.properties, 'receiptId');

    // const enableAccount = getFieldValue(event.properties, 'enableAccount');
    // const enableBlock = getFieldValue(event.properties, 'enableBlock');
    // const enableTx = getFieldValue(event.properties, 'enableTx');
    const enableAccount = true;
    const enableTx = true;
    const enableBlock = true;

    const baseUrl = 'https://rpc.mainnet.near.org';

    let accountDetailsData = '';
    let transactionStatusData = '';
    let blockDetailsData = '';

    if (enableAccount && accountId) {
      try {
        const response = await axios.post(`${baseUrl}`, {
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'query',
          params: {
            request_type: 'view_account',
            finality: 'final',
            account_id: accountId,
          },
        });

        if (response.status === 200) {
          accountDetailsData = JSON.stringify(response.data);
        }
      } catch {}
    }

    if (enableTx) {
      if (receiptId) {
        try {
          const response = await axios.post(`${baseUrl}`, {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'EXPERIMENTAL_receipt',
            params: { receipt_id: receiptId },
          });

          if (response.status === 200) {
            transactionStatusData = JSON.stringify(response.data);
          }
        } catch {}
      } else if (txHash && accountId) {
        try {
          const response = await axios.post(`${baseUrl}`, {
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'tx',
            params: {
              tx_hash: txHash,
              sender_account_id: accountId,
              wait_until: 'EXECUTED',
            },
          });

          if (response.status === 200) {
            transactionStatusData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableBlock) {
      try {
        const response = await axios.post(`${baseUrl}`, {
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'block',
          params: {
            finality: 'final',
          },
        });
        if (response.status === 200) {
          blockDetailsData = JSON.stringify(response.data);
        }

        const responseGasPrice = await axios.post(`${baseUrl}`, {
          jsonrpc: '2.0',
          id: 'dontcare',
          method: 'gas_price',
          params: [null],
        });
        if (responseGasPrice.status === 200) {
          blockDetailsData += JSON.stringify(responseGasPrice.data);
        }
      } catch {}
    }

    const prompt = `
${event.prompt}
Here are the context data that you could refer to:

Account Details JSON:
${accountDetailsData}

Transaction Status JSON:
${transactionStatusData}

Block Details and Gas Price JSON:
${blockDetailsData}
`;
    return prompt.trim();
  },
};

export default extension;
