import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function validatePhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    return phoneRegex.test(phoneNumber);
}

export function validateUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
    });
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
