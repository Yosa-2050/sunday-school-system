"use server";

import { COOKIE_ACCESS_TOKEN, fetcher, logger, type User } from "@shega/shared";
import { cookies } from "next/headers";

// Define the expected shape of the user profile response
interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Add other fields as per your API response
}

export const getUserAction = async (
  token?: string
): Promise<User | undefined> => {
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
    const response = await fetcher<User>("/profile/myprofile", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    logger.log("getUserAction: Successfully fetched user profile", response);
    return response;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};
