import { fetcher } from '@shega/shared';
import type { EnumValues } from './type';

export const çß = async (enumType: string): Promise<EnumValues[]> => {
    const response: EnumValues[] = await fetcher(`/enums/${enumType}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
};
