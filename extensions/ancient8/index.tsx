import { Extension } from '@/extensions/types/extension';
import Icon from './Icon';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getFieldValue } from '@/extensions/helpers/extensionHelpers';
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
  id: 'ancient8',
  name: 'Ancient8 (A8 Scan)',
  description:
    'Integrate with the Ancient8 blockchain, allowing AI access to data on Ancient8 to respond to your instructions.',
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
          Access to public wallet, account and token data
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
              <SelectLabel>Ancient8 Environments</SelectLabel>
              <SelectItem value="mainnet">Mainnet</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contractAddress">Account Address</Label>
        <Input
          id="account"
          placeholder="Account address. Eg: 0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
          value={getFieldValue(inputValues, 'account') || ''}
          onChange={(e) => handleInputChange('account', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="wallet">Token</Label>
        <Input
          id="token"
          placeholder="Token address. Eg: 0xD812d616A7C54ee1C8e9c9CD20D72090bDf0d424"
          value={getFieldValue(inputValues, 'token') || ''}
          onChange={(e) => handleInputChange('token', e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="transaction">Transaction Hash</Label>
        <Input
          id="transaction"
          placeholder="Transaction hash. Eg: 0xa26510f291b5e7052bae9e40b3a1bb83551624d28077dd46b3d71499829d675d"
          value={getFieldValue(inputValues, 'transaction') || ''}
          onChange={(e) => handleInputChange('transaction', e.target.value)}
        />
      </div>
    </>
  ),
  onGenerating: async (event) => {
    // References:
    // https://scan.ancient8.gg/api-docs (Scan API)

    const account = getFieldValue(event.properties, 'account');
    const token = getFieldValue(event.properties, 'token');
    const transactionHash = getFieldValue(event.properties, 'transaction');

    // TODO: Temporarily enable all endpoints for beta
    // const enableAccount = getFieldValue(event.properties, 'enableAccount');
    const enableAccount = true;
    const enableToken = true;
    const enableTransaction = true;
    const enableBlock = true;

    const baseUrl = 'https://0fbrzurzrj.execute-api.us-east-1.amazonaws.com/prod/api/v2'; // Proxies to 'https://scan.ancient8.gg/api/v2';

    let accountDetailsData = '';
    let tokenDetailsData = '';
    let transactionDetailsData = '';
    let blockDetailsData = '';

    if (enableAccount) {
      if (account) {
        try {
          // https://scan.ancient8.gg/api/v2/addresses/0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001
          const response = await axios.get(`${baseUrl}/addresses/${account}`);
          if (response.status === 200) {
            accountDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableToken) {
      if (token) {
        try {
          // https://scan.ancient8.gg/api/v2/tokens/0xD812d616A7C54ee1C8e9c9CD20D72090bDf0d424
          const response = await axios.get(`${baseUrl}/tokens/${token}`);
          if (response.status === 200) {
            tokenDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableTransaction) {
      if (transactionHash) {
        try {
          // https://scan.ancient8.gg/api/v2/transactions/0xa26510f291b5e7052bae9e40b3a1bb83551624d28077dd46b3d71499829d675d
          const response = await axios.get(`${baseUrl}/transactions/${transactionHash}`);
          if (response.status === 200) {
            transactionDetailsData = JSON.stringify(response.data);
          }
        } catch {}
      }
    }

    if (enableBlock) {
      try {
        // https://scan.ancient8.gg/api/v2/blocks
        const response = await axios.get(`${baseUrl}/blocks`);
        if (response.status === 200) {
          if (response.data?.items?.length > 0) {
            blockDetailsData = JSON.stringify(response.data.items[0]);
          }
        }
      } catch {}
    }

    const prompt = `
${event.prompt}
Here are the context data that you could refer to:

Account Details JSON:
${accountDetailsData}

Token Details JSON:
${tokenDetailsData}

Transaction Details JSON:
${transactionDetailsData}

Block Details JSON:
${blockDetailsData}
`;

    return prompt.trim();
  },
};

export default extension;
