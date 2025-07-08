import { fetcher } from '@shega/shared';
import { useQuery } from '@tanstack/react-query';

type LookupType = 'IndustryType';
export const fetchLookup = async (group: LookupType) => {
    const response = await fetcher(`/lookup/${group}`, {
        method: 'GET',
        headers: { accept: '*/*' },
    });
    return response as {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        code: string;
        value: string;
        description: string;
        group: string;
        subGroup: string;
    }[];
};

const useGetIndustry = () => {
    return useQuery({
        queryKey: ['industry'],
        queryFn: () => fetchLookup('IndustryType'),
    });
};

export { useGetIndustry };
