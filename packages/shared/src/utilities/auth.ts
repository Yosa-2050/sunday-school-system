// utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string) => {
    if (!token) {
        return true;
    }

    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp ? decoded.exp < currentTime : true; // If decoded.exp is undefined, treat it as expired
    } catch (error) {
        return true; // If token is invalid, treat it as expired
    }
};
