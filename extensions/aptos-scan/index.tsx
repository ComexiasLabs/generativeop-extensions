import React from 'react';
import { Extension } from '@//types/extension';
import Icon from './Icon';
import { Label } from '@/components/ui/label';
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
  id: 'aptosscan',
  name: 'Aptos Scan',
  description: 'Integrate with the Aptos blockchain, allowing AI access to Aptos Scan and Aptos Indexer APIs to respond to your instructions.',
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
          id="enableAccount"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableAccount', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableAccount" className="text-sm font-medium">
          Access to public wallet, account and coin data
        </label>
      </div>
      <div>
        <Checkbox
          id="enableTransaction"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableTransaction', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableTransaction" className="text-sm font-medium">
          Access to public transactions data
        </label>
      </div>
      <div>
        <Checkbox
          id="enableNFT"
          checked={true}
          onCheckedChange={(checked) => handleInputChange('enableNFT', checked ? 'true' : 'false')}
        />
        <label htmlFor="enableNFT" className="text-sm font-medium">
          Access to public NFT data
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
        <Select onValueChange={(value) => handleInputChange('environment', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Aptos Environments</SelectLabel>
              <SelectItem value="mainnet">Mainnet</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contractAddress">Account Address</Label>
        <Input
          id="account"
          placeholder="Enter account address"
          value={getFieldValue(inputValues, 'account') || ''}
          onChange={(e) => handleInputChange('account', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="nft">NFT Address</Label>
        <Input
          id="nft"
          placeholder="Enter NFT contract address"
          value={getFieldValue(inputValues, 'nft') || ''}
          onChange={(e) => handleInputChange('nft', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="wallet">Coin</Label>
        <Input
          id="coin"
          placeholder="Coin type. Eg: 0x1::aptos_coin::AptosCoin"
          value={getFieldValue(inputValues, 'coin') || ''}
          onChange={(e) => handleInputChange('coin', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="transaction">Transaction Hash</Label>
        <Input
          id="transaction"
          placeholder="Enter transaction hash"
          value={getFieldValue(inputValues, 'transaction') || ''}
          onChange={(e) => handleInputChange('transaction', e.target.value)}
        />
      </div>
    </>
  ),
  onGenerating: async (event) => {
    // References:
    // https://api.aptoscan.com/public-api-docs/v1.0#/ (Scan API)
    // https://aptos.dev/en/build/indexer/aptos-hosted (Indexer GraphQL)

    const account = getFieldValue(event.properties, 'account');
    const nft = getFieldValue(event.properties, 'nft');
    const coin = getFieldValue(event.properties, 'coin'); // 0x1::aptos_coin::AptosCoin
    const transactionHash = getFieldValue(event.properties, 'transaction');

    // TODO: Temporarily enable all endpoints for beta
    // const enableAccount = getFieldValue(event.properties, 'enableAccount');
    const enableAccount = true;
    const enableNFT = true;
    const enableCoin = true;
    const enableTransaction = true;
    const enableBlock = true;

    const baseUrl = 'https://public-api.aptoscan.com/v1';

    let accountDetailsData = '';
    let coinDetailsData = '';
    let transactionDetailsData = '';
    let nftDetailsData = '';
    let blockDetailsData = '';

    if (enableAccount) {
      if (account) {
        try {
          const responseResources = await axios.get(`${baseUrl}/accounts/${account}/resources`);
          if (responseResources.status === 200) {
            accountDetailsData = JSON.stringify(responseResources.data);
          }
          const responseScModules = await axios.get(`${baseUrl}/accounts/${account}/sc-modules`);
          if (responseScModules.status === 200) {
            accountDetailsData += JSON.stringify(responseScModules.data);
          }
        } catch {}
      }
    }

    if (enableNFT) {
      if (nft) {
        try {
          const response = await axios.get(`${baseUrl}/collections/${nft}`);
          if (response.status === 200) {
            nftDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableCoin) {
      if (coin) {
        try {
          const response = await axios.get(`${baseUrl}/coins/${coin}`);
          if (response.status === 200) {
            coinDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableTransaction) {
      if (transactionHash) {
        try {
          const response = await axios.get(`${baseUrl}/transactions/${transactionHash}`);
          if (response.status === 200) {
            transactionDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableBlock) {
      try {
        const response = await axios.get(`${baseUrl}/blocks?page=1`);
        if (response.status === 200) {
          if (response.data?.data?.length > 0) {
            blockDetailsData = JSON.stringify(response.data.data[0]);
          }
        }
      } catch {}
    }

    const prompt = `
${event.prompt}
Here are the context data that you could refer to:

Account Details JSON:
${accountDetailsData}

NFT Details JSON:
${nftDetailsData}

Coin Details JSON:
${coinDetailsData}

Transaction Details JSON:
${transactionDetailsData}

Block Details JSON:
${blockDetailsData}
`;

    return prompt.trim();
  },
};

export default extension;
