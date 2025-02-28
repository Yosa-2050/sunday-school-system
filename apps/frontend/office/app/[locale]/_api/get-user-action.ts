import { COOKIE_ACCESS_TOKEN } from "@shega/shared";
import { cookies } from "next/headers";

export const getUserAction = async () => {
    const cookieValue = await cookies();
    const token = cookieValue.get(COOKIE_ACCESS_TOKEN);
    
    if (!token) {
        return null;
    }

    const response = await fetch('/api/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
};