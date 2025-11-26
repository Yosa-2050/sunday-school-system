export type User = {
    id: string;
    createdBy: string;
    updatedBy: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    deletedAt: string | null;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    mothersFullName: string | null;
    baptistName: string | null;
    birthDate: string | null; // Consider using `Date | null` if you plan to work with Date objects
    dobGregorian: string | null;
    gender: string | null;
    marriageStatus: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id: string | null;
    roles: Record<string, string>; // Adjust based on the structure of roles
    role:
        | 'administrator'
        | 'school_admin'
        | 'super_admin'
        | 'program_admin'
        | 'mentor';
    organizationId: string | null;
    user: {
        id: string;
        isActive: boolean;
        email: string;
        userName: string | null;
        pwd_change_required: boolean;
        email_confirmed: boolean;
        note: string | null;
        profile: Record<string, string>;
        roles: Array<{
            id: string;
            isActive: boolean;
            role: string;
            isDefault: boolean;
        }>;
    };
};
