import { KeyValue } from "../types/extension";

export const getFieldValue = (values: KeyValue[], key: string): string | undefined => {
    return values.find(x => x.key === key)?.value;
}

export const setFieldValue = (values: KeyValue[], key: string, value: string): KeyValue[] => {
    const existingIndex = values.findIndex(x => x.key === key);

    if (existingIndex !== -1) {
        // Key exists, so update the value at the found index
        const updatedValues = [...values];
        updatedValues[existingIndex].value = value;
        return updatedValues;
    } else {
        // Key does not exist, so add a new key-value pair
        return [...values, { key, value }];
    }
};
