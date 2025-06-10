import { COOKIE_ACCESS_TOKEN, fetcher } from "@shega/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

export const uploadDocument = async (
  referenceId: string,
  documentType: string,
  file: File
): Promise<{ success: boolean; message?: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/document/upload/${referenceId}/${documentType}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Upload failed" }));
    throw new Error(error.message || "Failed to upload profile picture");
  }

  const data = await response.json();
  return data;
};

export const useUploadDocument = (
  referenceId: string,
  documentType: string,
  file: File
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => uploadDocument(referenceId, documentType, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobSeekerDetails"] });
    },
  });
};
