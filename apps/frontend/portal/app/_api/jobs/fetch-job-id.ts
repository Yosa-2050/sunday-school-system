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

interface Organization {
    id: string;
    isActive: boolean;
    name: string;
    description: string | null;
    tinNumber: string | null;
    displayName: string | null;
    hasBranches: boolean;
}

interface Job {
    id: string;
    isActive: boolean;
    title: string;
    description: string;
    type: string;
    salaryFrom: number;
    salaryTo: number;
    status: string;
    organization: Organization;
    postedBy: PostedBy;
}

export const fetchJobsById = async (id: string): Promise<Job> => {
    const response = await fetcher(`/job-portal/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};
