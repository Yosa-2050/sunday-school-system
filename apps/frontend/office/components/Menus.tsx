import {
    IconBell,
    IconCategory,
    IconClipboardList,
    IconHome,
    IconMapPin,
    IconStar,
    IconUserSquare,
    IconUsersGroup,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import type { MenuTree } from './side-menu/SideMenu';

export const Menus = (): MenuTree[] => {
    const t = useTranslations('menus');

    return [
        {
            label: t('dashboard'),
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/admin/dashboard',
            role: 'administrator',
        },
        {
            label: t('users'),
            icon: <IconUsersGroup stroke={1.4} size={20} />,
            link: '/admin/users',
            role: 'administrator',
        },
        {
            label: t('programManagement'),
            icon: <IconUserSquare stroke={1.4} size={20} />,
            link: '/admin/programs',
            role: 'administrator',
        },
        {
            label: t('notifications'),
            icon: <IconBell stroke={1.4} size={20} />,
            link: '/admin/notifications',
            role: 'administrator',
        },

        {
            isGroup: true,
            label: 'Lookup',
            role: 'administrator',
            children: [
                {
                    label: t('locations'),
                    icon: <IconMapPin stroke={1.4} size={20} />,
                    link: '/admin/locations',
                    role: 'administrator',
                },
                {
                    label: t('skills'),
                    icon: <IconStar stroke={1.4} size={20} />,
                    link: '/admin/skills',
                    role: 'administrator',
                },
                {
                    label: t('categories'),
                    icon: <IconCategory stroke={1.4} size={20} />,
                    link: '/admin/categories',
                    role: 'administrator',
                },
            ],
        },
        // School Admin Role
        {
            label: t('dashboard'),
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/school_admin/dashboard',
            role: 'school_admin',
        },
        {
            label: 'Department',
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/school_admin/department',
            role: 'school_admin',
        },
        {
            isGroup: true,
            label: t('classManagement'),
            role: 'school_admin',
            children: [
                {
                    label: t('class'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/classes',
                    role: 'school_admin',
                },
                {
                    label: t('subject'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/subject',
                    role: 'school_admin',
                },
                {
                    label: t('assignSubject'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/assign_subject',
                    role: 'school_admin',
                },
                {
                    label: t('test'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/test',
                    role: 'school_admin',
                },
                {
                    label: t('result'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/result',
                    role: 'school_admin',
                },
            ],
        },
        {
            isGroup: true,
            label: t('studentManagement'),
            role: 'school_admin',
            children: [
                {
                    label: t('students'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/students',
                    role: 'school_admin',
                },
                {
                    label: t('attendance'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/attendance',
                    role: 'school_admin',
                },
                {
                    label: t('notifications'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/notification',
                    role: 'school_admin',
                },
            ],
        },
        {
            isGroup: true,
            label: t('teacherManagement'),
            role: 'school_admin',
            children: [
                {
                    label: t('teacher'),
                    icon: <IconClipboardList stroke={1.4} size={20} />,
                    link: '/school_admin/teacher',
                    role: 'school_admin',
                },
            ],
        },
        // Super Admin Roles
        {
            label: t('dashboard'),
            icon: <IconHome stroke={1.4} size={20} />,
            link: '/admin/dashboard',
            role: 'super_admin',
        },
        {
            label: t('users'),
            icon: <IconUsersGroup stroke={1.4} size={20} />,
            link: '/admin/users',
            role: 'super_admin',
        },
        {
            label: t('organization'),
            icon: <IconUsersGroup stroke={1.4} size={20} />,
            link: '/admin/organizations',
            role: 'super_admin',
        },
        {
            label: t('programManagement'),
            icon: <IconUserSquare stroke={1.4} size={20} />,
            link: '/admin/programs',
            role: 'super_admin',
        },
        {
            label: t('notifications'),
            icon: <IconBell stroke={1.4} size={20} />,
            link: '/admin/notifications',
            role: 'super_admin',
        },
        {
            isGroup: true,
            label: 'Lookup',
            role: 'super_admin',
            children: [
                {
                    label: t('locations'),
                    icon: <IconMapPin stroke={1.4} size={20} />,
                    link: '/admin/locations',
                    role: 'super_admin',
                },
                {
                    label: t('skills'),
                    icon: <IconStar stroke={1.4} size={20} />,
                    link: '/admin/skills',
                    role: 'super_admin',
                },
                {
                    label: t('categories'),
                    icon: <IconCategory stroke={1.4} size={20} />,
                    link: '/admin/categories',
                    role: 'super_admin',
                },
            ],
        },
    ];
};
