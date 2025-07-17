import {
  IconBell,
  IconBriefcase,
  IconBuilding,
  IconCategory,
  IconClipboardList,
  IconFileText,
  IconHierarchy,
  IconHome,
  IconMapPin,
  IconPencil,
  IconStar,
  IconUserSquare,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { MenuTree } from "./side-menu/SideMenu";

export const Menus = (): MenuTree[] => {
  const t = useTranslations("jobPortal");

  return [
    {
      label: t("dashboard"),
      icon: <IconHome stroke={1.4} size={20} />,
      link: "/admin/dashboard",
      role: "administrator",
    },
    {
      label: t("users"),
      icon: <IconUsersGroup stroke={1.4} size={20} />,
      link: "/admin/users",
      role: "administrator",
    },
    {
      label: t("organizations"),
      icon: <IconBuilding stroke={1.4} size={20} />,
      link: "/admin/organizations",
      role: "administrator",
    },
    {
      label: t("mentorManagement"),
      icon: <IconUserSquare stroke={1.4} size={20} />,
      link: "/admin/mentors",
      role: "administrator",
    },
    {
      label: t("job-explorer"),
      icon: <IconBriefcase stroke={1.4} size={20} />,
      link: "/admin/jobs",
      role: "administrator",
    },
    {
      label: t("mentorship"),
      icon: <IconHierarchy stroke={1.4} size={20} />,
      link: "/admin/programs",
      role: "administrator",
    },
    {
      label: t("notifications"),
      icon: <IconBell stroke={1.4} size={20} />,
      link: "/admin/notifications",
      role: "administrator",
    },

    {
      isGroup: true,
      label: "Lookup",
      role: "administrator",
      children: [
        {
          label: t("locations"),
          icon: <IconMapPin stroke={1.4} size={20} />,
          link: "/admin/locations",
          role: "administrator",
        },
        {
          label: t("skills"),
          icon: <IconStar stroke={1.4} size={20} />,
          link: "/admin/skills",
          role: "administrator",
        },
        {
          label: t("categories"),
          icon: <IconCategory stroke={1.4} size={20} />,
          link: "/admin/categories",
          role: "administrator",
        },
      ],
    },
    // Work Provider Role
    {
      label: t("job-explorer"),
      icon: <IconClipboardList stroke={1.4} size={20} />,
      link: "/work-provider/jobs",
      role: "work_provider",
    },
    {
      label: t("job-explorer-draft-jobs"),
      icon: <IconPencil stroke={1.4} size={20} />,
      link: "/work-provider/draft-jobs",
      role: "work_provider",
    },
    {
      label: t("job-explorer-applicants"),
      icon: <IconFileText stroke={1.4} size={20} />,
      link: "/work-provider/applicants",
      role: "work_provider",
    },
    {
      label: t("notifications"),
      icon: <IconBell stroke={1.4} size={20} />,
      link: "/work-provider/notifications",
      role: "work_provider",
    },
    // Super Admin Role
    {
      label: t("dashboard"),
      icon: <IconHome stroke={1.4} size={20} />,
      link: "/admin/dashboard",
      role: "super_admin",
    },
    {
      label: t("users"),
      icon: <IconUsersGroup stroke={1.4} size={20} />,
      link: "/admin/users",
      role: "super_admin",
    },
    {
      label: t("organizations"),
      icon: <IconBuilding stroke={1.4} size={20} />,
      link: "/admin/organizations",
      role: "super_admin",
    },
    {
      label: t("mentorManagement"),
      icon: <IconUserSquare stroke={1.4} size={20} />,
      link: "/admin/mentors",
      role: "super_admin",
    },
    {
      label: t("job-explorer"),
      icon: <IconBriefcase stroke={1.4} size={20} />,
      link: "/admin/jobs",
      role: "super_admin",
    },
    {
      label: t("mentorship"),
      icon: <IconHierarchy stroke={1.4} size={20} />,
      link: "/admin/programs",
      role: "super_admin",
    },
    {
      label: t("notifications"),
      icon: <IconBell stroke={1.4} size={20} />,
      link: "/admin/notifications",
      role: "super_admin",
    },
    {
      isGroup: true,
      label: "Lookup",
      role: "super_admin",
      children: [
        {
          label: t("locations"),
          icon: <IconMapPin stroke={1.4} size={20} />,
          link: "/admin/locations",
          role: "super_admin",
        },
        {
          label: t("skills"),
          icon: <IconStar stroke={1.4} size={20} />,
          link: "/admin/skills",
          role: "super_admin",
        },
        {
          label: t("categories"),
          icon: <IconCategory stroke={1.4} size={20} />,
          link: "/admin/categories",
          role: "super_admin",
        },
      ],
    },
    // Mentor Role
    {
      label: t("mentorship"),
      icon: <IconHierarchy stroke={1.4} size={20} />,
      link: "/mentor/mentorship",
      role: "mentor",
    },
    {
      label: t("draft-mentorship"),
      icon: <IconPencil stroke={1.4} size={20} />,
      link: "/mentor/mentorship/draft",
      role: "mentor",
    },
    {
      label: t("notifications"),
      icon: <IconBell stroke={1.4} size={20} />,
      link: "/mentor/notifications",
      role: "mentor",
    },
  ];
};
