import { fetcher } from "@shega/shared";

export const getDocumentType = async (id: string) => {
  const response = await fetcher(`/organization/documentToUpload`, {
    method: "GET",
  });

  return response as { name: string };
};

export const getDocumentById = async (id: string) => {
  const response = await fetcher(`/document/reference/${id}`, {
    method: "GET",
  });

  return response as { name: string };
};
