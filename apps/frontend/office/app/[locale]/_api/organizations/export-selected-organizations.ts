import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { getCookie } from 'cookies-next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const exportSelectedOrganization = async ({
    payload,
    type,
}: {
    payload: string[] | string;
    type: 'filter' | 'selected';
}) => {
    const token = getCookie(COOKIE_ACCESS_TOKEN);

    const response = await fetch(
        `${API_BASE_URL}/organization/exportSelected`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'text/csv',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                type === 'selected'
                    ? { list: payload }
                    : { list: [], q: payload },
            ),
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
        );
    }

    const csvText: string = await response.text();

    const rows = csvText.trim().split('\n');
    return rows;
};
