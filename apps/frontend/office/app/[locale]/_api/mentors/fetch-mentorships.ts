import { fetcher } from '@shega/shared';
type MentorshipResponse = {
  data: Daum[]
  total: number
  totalPages: number
}

export interface Daum {
  id: string
  createdAt: string
  isActive: boolean
  mentorshipType: string
  commitment: string
  duration: number
  audience: string
  mentor: Mentor
  program: Program
}

export interface Mentor {
  id: string
  createdAt: string
  isActive: boolean
  status: string
  note: string
}

export interface Program {
  id: string
  createdAt: string
  isActive: boolean
  title: string
  description: string
  status: string
  workPlace: string
  numberOfApplicants: number
  experianceLevel: string
  experiance: number
  deadline: string
  educationalRequirment: string
  notes: string
  isPublished: boolean
  postedDate: string
}
export const fetchMentorships = async (
    payload: string,
): Promise<MentorshipResponse> => {
    const response: MentorshipResponse = await fetcher('/mentorship/allPrograms?published=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};
export const fetchMentorshipsDraft = async (
    payload: string,
): Promise<MentorshipResponse> => {
    const response: MentorshipResponse = await fetcher('/mentorship/allPrograms?published=false', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    return response;
};
