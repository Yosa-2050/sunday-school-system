"use server";

import { COOKIE_ACCESS_TOKEN, fetcher, logger } from "@shega/shared";
import { cookies } from "next/headers";

// Define the expected shape of the user profile response
interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Add other fields as per your API response
}

// Define a consistent return type
interface UserActionResult {
  data: UserProfile | null;
  error?: {
    message: string;
    status?: number;
  };
}

export const getUserAction = async (
  token?: string
): Promise<UserActionResult | undefined> => {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_ACCESS_TOKEN)?.value;

  // Use provided token or fall back to cookie token
  const authToken = token || cookieToken;

  // If no token is available, return early with no data
  if (!authToken) {
    logger.info("getUserAction: No authentication token provided");
    return undefined;
  }

  try {
    const response = await fetcher<UserProfile>("/profile/myprofile", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    logger.log("getUserAction: Successfully fetched user profile", response);
    return { data: response };
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
