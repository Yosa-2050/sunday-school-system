import {
    IconBriefcase, // Added for jobs
    IconBuilding,
    IconCategory,
    IconHome,
    IconMapPin, // Added for locations
    IconStar, // Added for skills
    IconUser,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { MenuTree } from './side-menu/SideMenu';

export const Menus = (): MenuTree[] => {
    const t = useTranslations('jobPortal');

    return [
      {
        label: t("dashboard"),
        icon: <IconHome stroke={1.4} size={20} />,
        link: "/admin/dashboard",
        role: "administrator",
      },
      {
        label: t("users"),
        icon: <IconUser stroke={1.4} size={20} />,
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
        label: t("job-explorer"),
        icon: <IconBriefcase stroke={1.4} size={20} />, // Updated icon for job explorer
        link: "/admin/jobs",
        role: "administrator",
      },
      {
        isGroup: true,
        label: "Lookup",
        role: "administrator",
        children: [
          {
            label: t("locations"),
            icon: <IconMapPin stroke={1.4} size={20} />, // Updated icon for locations
            link: "/admin/locations",
            role: "administrator",
          },
          {
            label: t("skills"),
            icon: <IconStar stroke={1.4} size={20} />, // Updated icon for skills
            link: "/admin/skills",
            role: "administrator",
          },
          {
            label: t("categories"),
            icon: <IconCategory stroke={1.4} size={20} />, // Updated icon for categories
            link: "/admin/categories",
            role: "administrator",
          },
        ],
      },
      {
        label: t("job-explorer"),
        icon: <IconBriefcase stroke={1.4} size={20} />, // Updated icon for job explorer
        link: "/work-provider/jobs",
        role: "work_provider",
      },
      {
        label: t("job-explorer-draft-jobs"),
        icon: <IconBriefcase stroke={1.4} size={20} />, // Updated icon for job explorer
        link: "/work-provider/draft-jobs",
        role: "work_provider",
      },
      {
        label: t("dashboard"),
        icon: <IconHome stroke={1.4} size={20} />,
        link: "/admin/dashboard",
        role: "super_admin",
      },
      {
        label: t("users"),
        icon: <IconUser stroke={1.4} size={20} />,
        link: "/admin/users",
        role: "super_admin",
      },
      {
        label: t("organizations"),
        icon: <IconBuilding stroke={1.4} size={20} />,
        link: "/admin/organizations",
        role: "super_admin",
      },
    ];
};
