import { fetcher } from "@shega/shared";

export const getOrganizationById = async (id: string) => {
  const response = await fetcher(`/organization/${id}`, {
    method: "GET",
  });

  return response as { name: string };
};
