import { fetcher } from "@shega/shared";

export interface JobDetailsViewProps {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  type: string;
  salaryFrom: number;
  salaryTo: number;
  salaryType: string | null;
  salaryFrequency: string;
  status: "APPROVED" | "DECLINED" | "WAITINGAPPROVAL";
  workPlace: string | null;
  currency: string;
  experianceLevel: string;
  experiance: number;
  deadline: string;
  educationalRequirment: string;
  notes: string | null;
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
    hasBranches: boolean;
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
        middleName: string | null;
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
}

export const fetchJobsAdminById = async (
  id: string
): Promise<JobDetailsViewProps> => {
  const response: JobDetailsViewProps = await fetcher(`/job-portal/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return response;
};
