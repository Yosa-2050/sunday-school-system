'use server';

import { COOKIE_ACCESS_TOKEN, type User, fetcher, logger } from '@shega/shared';
import { cookies } from 'next/headers';

export const getUserAction = async (
    token?: string,
): Promise<User | undefined> => {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

    // Use provided token or fall back to cookie token
    const authToken = token || cookieToken;

    // If no token is available, return early with no data
    if (!authToken) {
        logger.info('getUserAction: No authentication token provided');
        return undefined;
    }

    try {
        const response = await fetcher<User>('/profile/myprofile', {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        logger.log(
            'getUserAction: Successfully fetched user profile',
            response,
        );
        return response;
    } catch (error) {
        logger.error(error);
        return undefined;
    }
};
