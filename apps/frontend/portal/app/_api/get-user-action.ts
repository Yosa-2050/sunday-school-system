'use server';

import { COOKIE_ACCESS_TOKEN, fetcher, logger } from '@shega/shared';
import { cookies } from 'next/headers';

export const getUserAction = async (token?: string) => {
    const cookieValue = await cookies();
    const newToken = cookieValue.get(COOKIE_ACCESS_TOKEN)?.value;

    console.log;

    if (!(token || newToken)) {
        return null;
    }

    const response = await fetcher('/profile/myprofile', {
        headers: {
            Authorization: `Bearer ${token ?? newToken}`,
        },
    });

    logger.log('getUserAction', response);

    if (!response) {
        return undefined;
    }
    return response;
};
