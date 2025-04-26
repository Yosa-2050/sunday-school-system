import { fetcher } from '@shega/shared';

interface JobApplication {
    id: string;
    isActive: boolean;
    status: string;
    job: {
        id: string;
        isActive: boolean;
        title: string;
        description: string;
        type: string;
        salaryFrom: number;
        salaryTo: number;
        salaryType: string | null;
        salaryFrequency: string;
        status: string;
        workPlace: string | null;
        currency: string;
        experianceLevel: string;
        experiance: number;
        deadline: string | null;
        educationalRequirment: string;
        notes: string;
        isPublished: boolean;
        postedDate: string | null;
        country: {
            id: string;
            isActive: boolean;
            name: string;
            continent: string;
            code: string;
            phoneCode: string;
            flag: string;
        };
        state: {
            id: string;
            isActive: boolean;
            name: string;
            type: string;
            isRoot: boolean;
            hasChild: boolean;
        };
        city: {
            id: string;
            isActive: boolean;
            name: string;
            type: string;
            isRoot: boolean;
            hasChild: boolean;
        };
        organization: {
            id: string;
            isActive: boolean;
            name: string;
            description: string | null;
            tinNumber: string | null;
            displayName: string | null;
            note: string | null;
            hasBranches: boolean;
            status: string;
        };
        postedBy: {
            id: string;
            isActive: boolean;
            type: string;
            employee: {
                id: string;
                isActive: boolean;
                id_number: string | null;
                profile: {
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
                };
            };
        };
    };
    applicants: {
        id: string;
        isActive: boolean;
        headline: string;
        bio: string;
        cv: string;
        coverLetter: string;
        profile: {
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
        };
    };
}

export type Response = {
    data: JobApplication[];
    total: number;
    limit: number;
    page: number;
    totalPages: number;
};

export const fetchAppliedJobs = async (pagination: {
    page: number;
    limit: number;
}) => {
    const response = await fetcher('/job-seeker/jobs/appliedByJobSeeker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            pagination,
        }),
    });

    return response as JobApplication[];
};
