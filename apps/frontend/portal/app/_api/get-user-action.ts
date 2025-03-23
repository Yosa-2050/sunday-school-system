"use server";

import {
  COOKIE_ACCESS_TOKEN,
  fetcher,
  isTokenExpired,
  logger,
  type User,
} from "@shega/shared";
import { cookies } from "next/headers";

export const getUserAction = async (token?: string) => {
  const cookieValue = await cookies();
  const newToken = cookieValue.get(COOKIE_ACCESS_TOKEN)?.value;

  const actualToken = token ?? newToken;
  if (!actualToken) {
    return null;
  }

  if (isTokenExpired(actualToken)) {
    return null;
  }

  try {
    const response = await fetcher("/profile/myprofile", {
      headers: {
        Authorization: `Bearer ${token ?? newToken}`,
      },
    });

    logger.log("getUserAction", response);

    if (!response) {
      return undefined;
    }
    return response as User;
  } catch (error) {
    return undefined;
  }
};
