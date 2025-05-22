import { fetcher } from '@shega/shared';
export type MentorshipResponse = {
    data: Daum[];
    total: number;
    totalPages: number;
};

export interface Daum {
    id: string;
    createdAt: string;
    isActive: boolean;
    mentorshipType: string;
    commitment: string;
    duration: number;
    audience: string;
    mentor: Mentor;
    program: Program;
}

export interface Mentor {
    id: string;
    createdAt: string;
    isActive: boolean;
    status: string;
    note: string;
}

export interface Program {
    id: string;
    createdAt: string;
    isActive: boolean;
    title: string;
    description: string;
    status: string;
    workPlace: string;
    numberOfApplicants: number;
    experianceLevel: string;
    experiance: number;
    deadline: string;
    educationalRequirment: string;
    notes: string;
    isPublished: boolean;
    postedDate: string;
}

export const fetchMentorships = async (
    payload: string,
): Promise<MentorshipResponse> => {
    const response: MentorshipResponse = await fetcher(
        '/mentorship/listByAdmin',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
};




export type MentorshipProgram = {
  id: string
  createdAt: string
  isActive: boolean
  mentorshipType: string
  commitment: string
  duration: number
  audience: string
  program: Program
  mentor: Mentor
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
  jobCategory: JobCategory[]
  jobSkills: JobSkill[]
  jobDescriptions: JobDescription[]
  city: City
  country: Country
  state: State
}

export interface JobCategory {
  id: string
  createdAt: string
  isActive: boolean
}

export interface JobSkill {
  id: string
  createdAt: string
  isActive: boolean
  skill: string
}

export interface JobDescription {
  id: string
  createdAt: string
  isActive: boolean
  description: string
  type: string
}

export interface City {
  id: string
  createdAt: string
  isActive: boolean
  name: string
  type: string
  isRoot: boolean
}

export interface Country {
  id: string
  createdAt: string
  isActive: boolean
  name: string
  continent: string
  code: string
  phoneCode: string
  flag: string
}

export interface State {
  id: string
  createdAt: string
  isActive: boolean
  name: string
  type: string
  isRoot: boolean
}

export interface Mentor {
  id: string
  createdAt: string
  isActive: boolean
  status: string
  note: string
  profile: Profile
}

export interface Profile {
  id: string
  createdAt: string
  isActive: boolean
  firstName: string
  middleName: string
  lastName: string
  mothersFullName: string
  birthDate: string
  dobGregorian: string
  gender: string
  marriageStatus: string
  title: string
  phoneNumber: string
  profile_picture_id: string
}



export const fetchMentorshipProgramsById = async (
    mentorshipId: string,
): Promise<MentorshipProgram> => {
    const response: MentorshipProgram = await fetcher(
        `/mentorship/program/${mentorshipId}`,
        {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    return response;
}