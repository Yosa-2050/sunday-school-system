import type { JobSeeker } from '@/models/job-seeker.type';

export type ProfileData = JobSeeker;

export type PersonalInfo = {
    id?: string;
    firstName: string;
    middleName: string;
    lastName: string;
    birthDate: string | null;
    gender: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id?: string;
};

export type About = {
    bio: string;
    objectives?: string;
    languages?: Array<{
        name: string;
        proficiency: 'basic' | 'intermediate' | 'advanced' | 'native';
    }>;
    interests?: string[];
};

export type Education = {
    id: string;
    school: string;
    level: string;
    fieldOfStudyId: string;
    startDate: string;
    endDate: string;
    grade: number;
    description: string;
};

export type Experience = {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    type: string;
    countryId: string;
    stateId: string;
    cityId: string;
    workPlace: string;
    currentlyWorking?: boolean;
    description?: string;
    employmentType?:
        | 'full-time'
        | 'part-time'
        | 'contract'
        | 'internship'
        | 'freelance';
    skills?: string[];
    achievements?: string[];
};

export type Skill = {
    id: string;
    isActive: boolean;
    skill: string;
};

export type Resume = {
    id: string;
    url: string;
    name: string;
    size: number;
    type: string;
    uploadDate?: string;
    isDefault?: boolean;
    version?: number;
};
