import { fetcher } from "@shega/shared";

export type CreateJob = {
  id?: string;
  organizationId: string;
  title: string;
  description: string;
  type: string;
  salaryFrom: number;
  salaryTo: number;
  deadline: Date;
  isPublished: boolean;
};

export const createJob = async (data: CreateJob) => {
  const response: CreateJob[] = await fetcher("/job-portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};
export const updateJob = async (data: CreateJob, id: string) => {
  const response: CreateJob[] = await fetcher(`/job-portal/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};
export const saveJobDraft = async (data: CreateJob) => {
  const response: CreateJob[] = await fetcher("/job-portal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};
