import { PermissionType } from '../permission/permission';
import { Locale } from '../utilities/locale';

export type User = {
    accountId: string;
    userId: string;
    firstName: Locale;
    lastName: Locale;
    phoneNumber?: string;
    email?: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    preferredLanguage: string;
    permissions: PermissionType[];
};
