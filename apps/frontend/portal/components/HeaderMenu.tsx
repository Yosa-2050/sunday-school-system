'use client';

import {
    Avatar,
    Box,
    Burger,
    Drawer,
    Group,
    Menu,
    Stack,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useAuth } from '@shega/ui';
import {
    IconBriefcase,
    IconChartBar,
    IconList,
    IconLogout2,
    IconMessage,
    IconUser,
} from '@tabler/icons-react';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    matchPattern?: string;
    requiresAuth?: boolean;
    children?: MenuItem[];
}

export function HeaderMenu() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const { user, setUser } = useAuth();
    const isAuthenticated = !!user;
    const theme = useMantineTheme();
    const [opened, { toggle, close }] = useDisclosure(false);

    const menuItems: MenuItem[] = [
        {
            label: t('findWork'),
            href: '/jobs',
            matchPattern: '/jobs',
            icon: <IconBriefcase size={16} className="text-primary" />,
        },
        {
            label: t('jobs'),
            icon: <IconList size={16} className="text-primary" />,
            requiresAuth: true,
            matchPattern: '/my-jobs',
            children: [
                {
                    label: t('myJobs'),
                    href: '/my-jobs',
                    matchPattern: '/my-jobs',
                },
                {
                    label: t('savedJobs'),
                    href: '/saved-jobs',
                    matchPattern: '/saved-jobs',
                },
            ],
        },
        {
            label: t('reports'),
            href: '/reports',
            matchPattern: '/reports',
            requiresAuth: true,
            icon: <IconChartBar size={16} className="text-primary" />,
        },
        {
            label: t('messages'),
            href: '/messages',
            matchPattern: '/messages',
            requiresAuth: true,
            icon: <IconMessage size={16} className="text-primary" />,
        },
    ];

    const isActive = (item: MenuItem) => {
        if (item.matchPattern) {
            return pathname.startsWith(item.matchPattern);
        }
        return pathname === item.href;
    };

    const filteredMenuItems = menuItems.filter(
        (item) => !item.requiresAuth || isAuthenticated,
    );

    return (
        <>
            {/* Desktop */}
            <Group gap="xs" visibleFrom="md">
                {filteredMenuItems.map((item) =>
                    item.children ? (
                        <Menu
                            key={item.label}
                            trigger="hover"
                            openDelay={100}
                            closeDelay={200}
                        >
                            <Menu.Target>
                                <Box
                                    className={`px-3 py-2 cursor-pointer transition-colors duration-200 ${
                                        isActive(item)
                                            ? 'border-b-2 border-[var(--primary-color-5)] font-medium'
                                            : 'hover:border-b-2 hover:border-[var(--primary-color-1)]'
                                    }`}
                                >
                                    <Group gap="xs">
                                        {item.icon}
                                        <Text size="sm">{item.label}</Text>
                                    </Group>
                                </Box>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {item.children.map((child) => (
                                    <Menu.Item
                                        key={child.href}
                                        component={Link}
                                        // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                        href={child.href!}
                                        onClick={close}
                                    >
                                        {child.label}
                                    </Menu.Item>
                                ))}
                            </Menu.Dropdown>
                        </Menu>
                    ) : (
                        <Link
                            key={item.label}
                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                            href={item.href!}
                            className={`px-3 py-2 transition-colors duration-200 ${
                                isActive(item)
                                    ? 'border-b-2 border-[var(--primary-color-5)] font-medium'
                                    : 'hover:border-b-2 hover:border-[var(--primary-color-1)]'
                            }`}
                        >
                            <Group gap="xs">
                                {item.icon}
                                <Text size="sm">{item.label}</Text>
                            </Group>
                        </Link>
                    ),
                )}
            </Group>

            {/* Mobile */}
            <Burger
                opened={opened}
                onClick={toggle}
                className="md:hidden"
                color={theme.colors.gray[6]}
            />

            <Drawer
                opened={opened}
                onClose={close}
                position="right"
                size="100%"
                className="md:hidden"
                overlayProps={{ opacity: 0.5, blur: 4 }}
            >
                <Group
                    gap="xs"
                    className="cursor-pointer border-b border-gray-100 py-3"
                >
                    <Avatar size="md" radius="xl" color="primary">
                        {user?.firstName?.[0]}
                        {user?.middleName?.[0]}
                    </Avatar>
                    <div>
                        <Text size="sm" fw={500}>
                            {user?.firstName} {user?.middleName}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {user?.updatedBy}
                        </Text>
                    </div>
                </Group>

                <Stack p="md" gap="lg">
                    {filteredMenuItems.map((item) =>
                        item.children ? (
                            <Box key={item.label}>
                                <Text size="sm" fw={600} className="mb-1">
                                    {item.label}
                                </Text>
                                <Stack pl="md" gap={4}>
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                            href={child.href!}
                                            className={`px-3 py-2 text-sm transition-colors duration-200 ${
                                                isActive(child)
                                                    ? 'border-b-2 border-[var(--primary-color-5)] font-medium'
                                                    : 'hover:border-b-2 hover:border-[var(--primary-color-1)]'
                                            }`}
                                            onClick={close}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </Stack>
                            </Box>
                        ) : (
                            <Link
                                key={item.label}
                                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                href={item.href!}
                                className={`px-3 py-2 transition-colors duration-200 ${
                                    isActive(item)
                                        ? 'border-b-2 border-[var(--primary-color-5)] font-medium'
                                        : 'hover:border-b-2 hover:border-[var(--primary-color-1)]'
                                }`}
                                onClick={close}
                            >
                                <Group gap="xs">
                                    {item.icon}
                                    <Text size="sm">{item.label}</Text>
                                </Group>
                            </Link>
                        ),
                    )}

                    {isAuthenticated && (
                        <>
                            <Link
                                href="/profile"
                                className="px-3 py-2 transition-colors duration-200 text-gray-600 hover:border-b-2 hover:border-[var(--primary-color-1)] hover:text-[var(--primary-color-text)]"
                                onClick={close}
                            >
                                <Group gap="xs">
                                    <IconUser
                                        size={16}
                                        className="text-primary"
                                    />
                                    <Text size="sm">Profile</Text>
                                </Group>
                            </Link>
                            <Link
                                href="/auth/login"
                                className="px-3 py-2 transition-colors duration-200 text-red-600 hover:border-b-2 hover:border-red-200 hover:text-red-700"
                                onClick={() => {
                                    deleteCookie(COOKIE_ACCESS_TOKEN);
                                    deleteCookie('role');
                                    setUser(undefined);
                                    close();
                                }}
                            >
                                <Group gap="xs">
                                    <IconLogout2
                                        size={16}
                                        className="text-red-500"
                                    />
                                    <Text size="sm">Logout</Text>
                                </Group>
                            </Link>
                        </>
                    )}
                </Stack>
            </Drawer>
        </>
    );
}
