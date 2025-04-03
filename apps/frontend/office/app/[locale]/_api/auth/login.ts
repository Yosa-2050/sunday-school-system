import { fetcher } from "@shega/shared";

type LoginRequest = {
  username: string;
  password: string;
  origin: "office";
};

export type Data = {
  role: string;
  email: string;
  access_token: string;
  pwdChangeRequired: boolean;
  id: string;
  details: {
    organizationId: string;
  };
};

export type Response = {
  data: Data;
};

export const login = async (data: LoginRequest) => {
  const response: Response = await fetcher("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response;
};
