/* eslint-disable @typescript-eslint/no-explicit-any */

export const invokeViewMethod = async (abi: any, contractAddress: string, methodName: string, args: any[] = []): Promise<any> => {
    if (!window?.tronWeb) {
        return ''
    };

    const contract = window.tronWeb.contract(abi, contractAddress);
    const method = contract[methodName];
    return await method(...args).call();
  };
