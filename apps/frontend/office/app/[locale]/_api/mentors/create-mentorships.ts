import { fetcher } from '@shega/shared';
import type { JobDescriptionType } from 'app/[locale]/(module)/mentor/mentorship/create/components/shcema/job-schema';

export type CreateMentorship = {
  title: string
  description: string
  countryId: string
  stateId: string
  cityId: string
  numberOfApplicants?: number
  experianceLevel: string;
  experiance: number
  workPlace: string
  deadline: Date;
  educationalRequirment: string
  skills: string[]
  catagories: string[]
  jobDescriptions: { type: JobDescriptionType; description: string; }[]
  isPublished: boolean
  mentorshipType:  string;
  commitment: string
  duration: number
  audience?: string
}

export interface JobDescription {
  description: string
  type: string
}

export const createMentorship = async (data: CreateMentorship) => {
    const response: CreateMentorship[] = await fetcher('/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};
export const updateMentorship = async (data: CreateMentorship, id: string) => {
    const response: CreateMentorship[] = await fetcher(`/mentorship/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};
export const saveMentorshipDraft = async (data: CreateMentorship) => {
    const response: CreateMentorship[] = await fetcher('/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    return response;
};
