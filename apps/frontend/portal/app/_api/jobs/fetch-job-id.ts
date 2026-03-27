import { fetcher } from '@shega/shared';

interface Profile {
    id: string;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    mothersFullName: string | null;
    birthDate: string | null;
    dobGregorian: string | null;
    gender: string | null;
    marriageStatus: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id: string | null;
}

interface Employee {
    id: string;
    isActive: boolean;
    id_number: string | null;
    profile: Profile;
}

interface PostedBy {
    id: string;
    isActive: boolean;
    type: string;
    employee: Employee;
}

export type Organization = {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    name: string;
    registrationNumber: string;
    description: string;
    displayName: string;
    type: string;
    yearFounded: string;
    companySize: string;
    hasBranches: boolean;
    status: string;
    corporateEmail: string;
    logo: string | null;
};

interface JobSkill {
    id: string;
    isActive: boolean;
    skill: string;
}

interface JobDescription {
    id: string;
    isActive: boolean;
    description: string;
    type: string;
}

export interface Job {
    workPlace: string;
    responsibilities: any;
    requirements: any;
    id: string;
    isActive: boolean;
    title: string;
    description: string;
    createdAt: string;
    type: string;
    salaryFrom: number;
    salaryTo: number;
    status: string;
    organization: Organization;
    currency: string;
    postedBy: PostedBy;
    jobSkills: JobSkill[];
    jobDescriptions: JobDescription[];
    applied: boolean;
    programId: string;
    saved: boolean;
    applicationData: {
        coverLetter?: string;
        noticePeriod?: number;
        relocationOption?: string;
        experience?: number;
        salaryExpectation?: number;
    };
}

export const fetchJobsById = async (id: string): Promise<Job> => {
    const response: Job = await fetcher(`/job-seeker/program/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};
