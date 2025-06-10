import { fetcher } from "@shega/shared";

interface UpdateOrganizationPayload {
  registrationNumber: string;
  description: string;
  displayName: string;
  type: string;
  sectorId: string;
  yearFounded: number;
  companySize: string;
}

export const updateOrganization = async (
  id: string,
  data: UpdateOrganizationPayload
) => {
  const response = await fetcher(`/organization/companyDetail/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response as { success: boolean; message?: string };
};

export interface UpdateLocationPayload {
  country: string;
  region: string;
  subcity: string;
  city: string;
  woreda: string;

  houseNumber: string;
}

export const updateLocation = async (
  id: string,
  data: UpdateLocationPayload
) => {
  const response = await fetcher(`/organization/location/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response as { success: boolean; message?: string };
};
