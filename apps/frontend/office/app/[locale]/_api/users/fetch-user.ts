import { fetcher } from "@shega/shared";

export type Users = {
  id: string;
  firstName: string;
  lastName: string;
  userType: string;
  status: string;
  email: string;
  createdBy: string;
  createdAt: string;
};

export type FetchUsersPayload = {
  status?: string;
  pagination: {
    search: string;
    page: number;
    limit: number;
  };
};

export interface Response {
  data: Daum[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface Daum {
  fullName?: string;
  email?: string;
  isActive?: boolean;
  createdBy?: string;
  createdDate?: string;
  role?: string;
}

export const fetchUsers = async (payload: FetchUsersPayload) => {
  const response: Response = await fetcher("/users/all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return response;
};
