"use client";

import { LoadingOverlay } from "@mantine/core";
import { COOKIE_ACCESS_TOKEN, isTokenExpired, logger } from "@shega/shared";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // biome-ignore lint/suspicious/useAwait: <explanation>
    const checkAuth = async () => {
      try {
        const token = getCookie(COOKIE_ACCESS_TOKEN);

        if (!token || typeof token !== "string") {
          router.push("/auth/login");
          return;
        }

        logger.log(isTokenExpired(token));
        if (isTokenExpired(token)) {
          deleteCookie(COOKIE_ACCESS_TOKEN);
          router.push("/auth/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        logger.error("Authentication check failed:", error);
        deleteCookie(COOKIE_ACCESS_TOKEN);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export { ProtectedRoute };
