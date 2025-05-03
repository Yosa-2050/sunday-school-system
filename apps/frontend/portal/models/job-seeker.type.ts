import type {
    About,
    Education,
    Experience,
    PersonalInfo,
    Skill,
} from '../lib/types';

export type JobSeeker = {
    id: string;
    isActive: boolean;
    bio: About;
    cv: string;
    headline: string;
    coverLetter: string;
    experiance: Experience[];
    __experiance__: Experience[];
    educationalHistory: Education[];
    __educationalHistory__: Education[];
    skills: Skill[];
    profile: PersonalInfo;
};

export interface Profile {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    // mothersFullName: string;
    birthDate: string | null;
    // dobGregorian: string;
    gender: string | null;
    // marriageStatus: string;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id?: string;
}
