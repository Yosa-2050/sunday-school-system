"use client";

import { redirect } from "@/i18n/routing";
import { useAuth } from "@shega/ui";
import { useLocale } from "next-intl";

export default function HomePage() {
  const { user } = useAuth();
  const locale = useLocale();

  if (user) {
    if (user.role === "administrator") {
      redirect({ href: "/admin/dashboard", locale });
    }
    if (user.role === "work_provider") {
      redirect({ href: "/work-provider/jobs", locale });
    }
  } else {
    redirect({ href: "/auth/login", locale });
  }
}
