import {
    IconBell,
    IconBook,
    IconBook2,
    IconBuilding,
    IconBuildingCommunity,
    IconCalendarCheck,
    IconCategory,
    IconChalkboard,
    IconChalkboardTeacher,
    IconFileCheck,
    IconHierarchy,
    IconLayoutDashboard,
    IconLink,
    IconMapPin,
    IconReportAnalytics,
    IconSchool,
    IconStar,
    IconUser,
    IconUserCheck,
    IconUserPlus,
    IconUserShield,
    IconUsers,
    IconUsersGroup,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { RoleEnum } from 'node_modules/@shega/shared/src/types/role';
import type { MenuTree } from './side-menu/SideMenu';

export const Menus = (): MenuTree[] => {
    const t = useTranslations('menus');

    return [
        // Super Admin
        {
            label: t('dashboard'),
            icon: <IconLayoutDashboard stroke={1.4} size={20} />,
            link: '/admin/dashboard',
            role: RoleEnum.super_admin,
        },
        {
            label: t('organization'),
            icon: <IconBuilding stroke={1.4} size={20} />,
            link: '/admin/organizations',
            role: RoleEnum.super_admin,
        },
        {
            label: t('users'),
            icon: <IconUsers stroke={1.4} size={20} />,
            link: '/admin/users',
            role: RoleEnum.super_admin,
        },
        {
            label: t('programManagement'),
            icon: <IconBook stroke={1.4} size={20} />,
            link: '/admin/programs',
            role: RoleEnum.super_admin,
        },
        {
            label: t('rootClass'),
            icon: <IconHierarchy stroke={1.4} size={20} />,
            link: '/school_admin/root_classes',
            role: RoleEnum.super_admin,
        },
        {
            label: t('notifications'),
            icon: <IconBell stroke={1.4} size={20} />,
            link: '/admin/notifications',
            role: RoleEnum.super_admin,
        },

        // Administrator
        {
            label: t('dashboard'),
            icon: <IconLayoutDashboard stroke={1.4} size={20} />,
            link: '/admin/dashboard',
            role: RoleEnum.administrator,
        },
        {
            label: t('users'),
            icon: <IconUsers stroke={1.4} size={20} />,
            link: '/admin/users',
            role: RoleEnum.administrator,
        },
        {
            label: t('programManagement'),
            icon: <IconBook stroke={1.4} size={20} />,
            link: '/admin/programs',
            role: RoleEnum.administrator,
        },
        {
            label: t('memberManagement'),
            icon: <IconUserCheck stroke={1.4} size={20} />,
            link: '/admin/members',
            role: RoleEnum.administrator,
        },
        {
            label: t('assignMember'),
            icon: <IconUsersGroup stroke={1.4} size={20} />,
            link: '/admin/assign-member',
            role: RoleEnum.administrator,
        },
        {
            label: t('rootClass'),
            icon: <IconHierarchy stroke={1.4} size={20} />,
            link: '/school_admin/root_classes',
            role: RoleEnum.administrator,
        },
        {
            label: t('notifications'),
            icon: <IconBell stroke={1.4} size={20} />,
            link: '/admin/notifications',
            role: RoleEnum.administrator,
        },
        {
            isGroup: true,
            label: 'Lookup',
            role: RoleEnum.administrator,
            children: [
                {
                    label: t('locations'),
                    icon: <IconMapPin stroke={1.4} size={20} />,
                    link: '/admin/locations',
                    role: RoleEnum.administrator,
                },
                {
                    label: t('skills'),
                    icon: <IconStar stroke={1.4} size={20} />,
                    link: '/admin/skills',
                    role: RoleEnum.administrator,
                },
                {
                    label: t('categories'),
                    icon: <IconCategory stroke={1.4} size={20} />,
                    link: '/admin/categories',
                    role: RoleEnum.administrator,
                },
            ],
        },

        // School Admin
        {
            label: t('dashboard'),
            icon: <IconLayoutDashboard stroke={1.4} size={20} />,
            link: '/school_admin/dashboard',
            role: RoleEnum.school_admin,
        },
        {
            label: t('Department'),
            icon: <IconBuildingCommunity stroke={1.4} size={20} />,
            link: '/school_admin/department',
            role: RoleEnum.school_admin,
        },
        {
            label: t('programManagement'),
            icon: <IconBook stroke={1.4} size={20} />,
            link: '/admin/programs',
            role: RoleEnum.school_admin,
        },
        {
            label: t('memberManagement'),
            icon: <IconUserCheck stroke={1.4} size={20} />,
            link: '/admin/members',
            role: RoleEnum.school_admin,
        },
        {
            label: t('assignMember'),
            icon: <IconUserPlus stroke={1.4} size={20} />,
            link: '/admin/assign-member',
            role: RoleEnum.school_admin,
        },
        {
            isGroup: true,
            label: t('classManagement'),
            // icon: <IconUsersGroup stroke={1.4} size={20} />,
            role: RoleEnum.school_admin,
            children: [
                {
                    label: t('class'),
                    icon: <IconSchool stroke={1.4} size={20} />,
                    link: '/school_admin/classes',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('subject'),
                    icon: <IconBook2 stroke={1.4} size={20} />,
                    link: '/school_admin/subject',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('assignSubject'),
                    icon: <IconLink stroke={1.4} size={20} />,
                    link: '/school_admin/assign_subject',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('test'),
                    icon: <IconFileCheck stroke={1.4} size={20} />,
                    link: '/school_admin/test',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('result'),
                    icon: <IconReportAnalytics stroke={1.4} size={20} />,
                    link: '/school_admin/result',
                    role: RoleEnum.school_admin,
                },
            ],
        },
        {
            isGroup: true,
            label: t('studentManagement'),
            icon: <IconUsers stroke={1.4} size={20} />,
            role: RoleEnum.school_admin,
            children: [
                {
                    label: t('students'),
                    icon: <IconUser stroke={1.4} size={20} />,
                    link: '/school_admin/students',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('attendance'),
                    icon: <IconCalendarCheck stroke={1.4} size={20} />,
                    link: '/school_admin/attendance',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('notifications'),
                    icon: <IconBell stroke={1.4} size={20} />,
                    link: '/school_admin/notification',
                    role: RoleEnum.school_admin,
                },
            ],
        },
        {
            isGroup: true,
            label: t('teacherManagement'),
            icon: <IconChalkboardTeacher stroke={1.4} size={20} />,
            role: RoleEnum.school_admin,
            children: [
                {
                    label: t('teacher'),
                    icon: <IconChalkboard stroke={1.4} size={20} />,
                    link: '/school_admin/teacher',
                    role: RoleEnum.school_admin,
                },
                {
                    label: t('homeroom'),
                    icon: <IconUserShield stroke={1.4} size={20} />,
                    link: '/school_admin/home_room_teacher',
                    role: RoleEnum.school_admin,
                },
            ],
        },

        // Teacher role
        {
            label: t('dashboard'),
            icon: <IconLayoutDashboard stroke={1.4} size={20} />,
            link: '/teacher/dashboard',
            role: RoleEnum.teacher,
        },
        {
            label: t('attendance'),
            icon: <IconCalendarCheck stroke={1.4} size={20} />,
            link: '/lms/attendance',
            role: RoleEnum.teacher,
        },
        {
            label: t('test'),
            icon: <IconFileCheck stroke={1.4} size={20} />,
            link: '/lms/test',
            role: RoleEnum.teacher,
        },
        {
            label: t('result'),
            icon: <IconReportAnalytics stroke={1.4} size={20} />,
            link: '/lms/result',
            role: RoleEnum.teacher,
        },
        {
            label: t('notifications'),
            icon: <IconBell stroke={1.4} size={20} />,
            link: '/lms/notification',
            role: RoleEnum.teacher,
        },

        //home room
        {
            label: t('dashboard'),
            icon: <IconLayoutDashboard stroke={1.4} size={20} />,
            link: '/home_room/dashboard',
            role: RoleEnum.home_room,
        },
        {
            isGroup: true,
            label: t('studentManagement'),
            role: RoleEnum.home_room,
            children: [
                {
                    label: t('students'),
                    icon: <IconUser stroke={1.4} size={20} />,
                    link: '/school_admin/students',
                    role: RoleEnum.home_room,
                },
                {
                    label: t('attendance'),
                    icon: <IconCalendarCheck stroke={1.4} size={20} />,
                    link: '/school_admin/attendance',
                    role: RoleEnum.home_room,
                },
                {
                    label: t('notifications'),
                    icon: <IconBell stroke={1.4} size={20} />,
                    link: '/school_admin/notification',
                    role: RoleEnum.home_room,
                },
            ],
        },

        {
            isGroup: true,
            label: t('classManagement'),
            role: RoleEnum.home_room,
            children: [
                {
                    label: t('assignSubject'),
                    icon: <IconLink stroke={1.4} size={20} />,
                    link: '/school_admin/assign_subject',
                    role: RoleEnum.home_room,
                },
                {
                    label: t('test'),
                    icon: <IconFileCheck stroke={1.4} size={20} />,
                    link: '/school_admin/test',
                    role: RoleEnum.home_room,
                },
                {
                    label: t('result'),
                    icon: <IconReportAnalytics stroke={1.4} size={20} />,
                    link: '/school_admin/result',
                    role: RoleEnum.home_room,
                },
            ],
        },
    ];
};
