import type { ProfileResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';

export type CreateMemberRequest = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    mothersFullName?: string;
    birthDate?: string;
    baptistName?: string;
    gender?: string;
    phoneNumber?: string;
    idNumber?: string;
    email?: string;
    relationShip?: CreateRelationRequest;
};

export type CreateRelationRequest = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    type?: string;
    isParent: boolean;
    isEmergency: boolean;
    email?: string;
    profileId?: string;
};

export type OrganizationMemberList = {
    id: string;
    department?: string;
    isActive: boolean;
    profile: ProfileResponse;
    type: string;
    relationShip?: CreateRelationRequest;
};

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    p: number;
    pp: number;
};
