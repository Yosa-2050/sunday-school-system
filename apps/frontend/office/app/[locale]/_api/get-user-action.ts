'use server';

import { COOKIE_ACCESS_TOKEN, fetcher } from "@shega/shared";
import { cookies } from "next/headers";

export const getUserAction = async () => {
    const cookieValue = await cookies();
    const token = cookieValue.get(COOKIE_ACCESS_TOKEN)?.value;

    if (!token) {
        return null;
    }

    const response = await fetcher('/profile/myprofile', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};