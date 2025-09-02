// biome-ignore lint/style/useImportType: <explanation>
import { Gender } from 'app/[locale]/_api/job-seeker';

export type StudentResponse = {
    id: string;
    fullName: string;
    firstName: string;
    middleName: string;
    lastName: string;
    idNumber: string;
    isActive: boolean;
    dateOfBirth: string;
    gender: Gender;
};

export interface ProfileResponse {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    firstName: string;
    middleName: string | null;
    lastName: string;
    mothersFullName: string | null;
    birthDate: string | null;
    dobGregorian: string | null;
    gender: 'MALE' | 'FEMALE' | string;
    marriageStatus: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id: string | null;
    baptistName: string | null;
    relation: {
        firstName: string;
        middleName: string | null;
        lastName: string;
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        type: string; // e.g., "MOTHER", "FATHER", etc.
        isParent: boolean;
        isEmergency: boolean;
    }[];
}

export interface RelationShipsResponse extends ProfileResponse {
    isEmergency: boolean;
    isParent: boolean;
    type: string;
}
export interface StudentByIdResponse {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    idNumber: string;
    schoolName: string | null;
    schoolGrade: string | null;
    profile: ProfileResponse;
    class: {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        name: string;
        description: string;
        hasSection: boolean;
        isSection: boolean;
        root: {
            id: string;
            createdBy: string;
            createdAt: string;
            isActive: boolean;
            name: string;
        };
    };
}

export type CreateStudentRequest = {
    firstName: '';
    middleName: '';
    lastName: '';
    mothersFullName: '';
    birthDate: '';
    baptistName: '';
    gender: '';
    marriageStatus: '';
    title: '';
    phoneNumber: '';
    idNumber: '';
};

export type CreateRelationRequest = {
    firstName: '';
    lastName: '';
    phoneNumber: '';
    type: '';
    isParent: false;
    isEmergency: false;
};
