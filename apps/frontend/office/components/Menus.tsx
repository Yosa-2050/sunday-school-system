import {
    IconBuilding,
    IconFileText,
    IconHome,
    IconSearch,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export const Menus = () => {
    const t = useTranslations('jobPortal');

    return [
        {
            label: t('dashboard'),
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/admin/dashboard',
        },
        {
            label: t('users'),
            icon: <IconFileText stroke={1.4} size={20} />,
            link: '/admin/users',
        },
        // {
        //     label: t('job-seekers'),
        //     icon: <IconUserCircle stroke={1.4} size={20} />,
        //     isGroup: true,
        //     children: [
        //         {
        //             label: t('users'),
        //             icon: <IconFileText stroke={1.4} size={20} />,
        //             link: '/admin/users',
        //         },
        //         {
        //             label: t('resume-builder'),
        //             icon: <IconFileDescription stroke={1.4} size={20} />,
        //             link: '/job-seekers/resume-builder',
        //         },
        //         {
        //             label: t('applied-jobs'),
        //             icon: <IconClipboardList stroke={1.4} size={20} />,
        //             link: '/job-seekers/applied-jobs',
        //         },
        //         {
        //             label: t('saved-jobs'),
        //             icon: <IconChecklist stroke={1.4} size={20} />,
        //             link: '/job-seekers/saved-jobs',
        //         },
        //         {
        //             label: t('notifications'),
        //             icon: <IconBell stroke={1.4} size={20} />,
        //             link: '/job-seekers/notifications',
        //         },
        //     ],
        // },
        // {
        //     label: t('employers'),
        //     icon: <IconBuildingStore stroke={1.4} size={20} />,
        //     isGroup: true,
        //     children: [
        //         {
        //             label: t('company-profile'),
        //             icon: <IconFileText stroke={1.4} size={20} />,
        //             link: '/employers/company-profile',
        //         },
        //         {
        //             label: t('job-postings'),
        //             icon: <IconBriefcase stroke={1.4} size={20} />,
        //             link: '/employers/job-postings',
        //         },
        //         {
        //             label: t('applicants'),
        //             icon: <IconUsers stroke={1.4} size={20} />,
        //             link: '/employers/applicants',
        //         },
        //         {
        //             label: t('shortlisted-candidates'),
        //             icon: <IconChecklist stroke={1.4} size={20} />,
        //             link: '/employers/shortlisted-candidates',
        //         },
        //         {
        //             label: t('reports'),
        //             icon: <IconReportAnalytics stroke={1.4} size={20} />,
        //             link: '/employers/reports',
        //         },
        //     ],
        // },
        {
            label: t('job-explorer'),
            icon: <IconSearch stroke={1.4} size={20} />,
            link: '/admin/jobs',
        },
        {
            label: t('organizations'),
            icon: <IconBuilding stroke={1.4} size={20} />,
            link: '/admin/organizations',
        },
        // {
        //     label: t('messages'),
        //     icon: <IconMessageCircle stroke={1.4} size={20} />,
        //     link: '/messages',
        // },
        // {
        //     label: t('analytics'),
        //     icon: <IconChartBar stroke={1.4} size={20} />,
        //     link: '/analytics',
        // },
        // {
        //     label: t('settings'),
        //     icon: <IconSettings stroke={1.4} size={20} />,
        //     link: '/settings',
        // },
    ];
};
