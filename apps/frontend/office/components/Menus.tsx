import {
    IconBuilding,
    IconHome,
    IconSearch,
    IconUser,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { MenuTree } from './side-menu/SideMenu';

export const Menus = (): MenuTree[] => {
    const t = useTranslations('jobPortal');

    return [
        {
            label: t('dashboard'),
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/admin/dashboard',
            role: 'administrator',
        },
        {
            label: t('users'),
            icon: <IconUser stroke={1.4} size={20} />,
            link: '/admin/users',
            role: 'administrator',
        },

        {
            label: t('organizations'),
            icon: <IconBuilding stroke={1.4} size={20} />,
            link: '/admin/organizations',
            role: 'administrator',
        },
        {
            label: t('job-explorer'),
            icon: <IconSearch stroke={1.4} size={20} />,
            link: '/admin/jobs',
            role: 'administrator',
        },
        // {
        //     label: t('dashboard'),
        //     icon: <IconHome stroke={1.4} size={20} />,
        //     link: '/work-provider/dashboard',
        //     role: 'work_provider',
        // },
        {
            label: t('job-explorer'),
            icon: <IconSearch stroke={1.4} size={20} />,
            link: '/work-provider/jobs',
            role: 'work_provider',
        },
    ];
};
