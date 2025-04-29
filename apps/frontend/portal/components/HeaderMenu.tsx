import {
    Avatar,
    Box,
    Burger,
    Drawer,
    Group,
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
import { usePathname, useRouter } from 'next/navigation';

interface MenuItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
    matchPattern?: string;
    requiresAuth?: boolean;
}

export function HeaderMenu() {
    const t = useTranslations('navigation');
    const pathname = usePathname();
    const router = useRouter();
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
            label: t('myJobs'),
            href: '/my-jobs',
            matchPattern: '/my-jobs',
            requiresAuth: true,
            icon: <IconList size={16} className="text-primary" />,
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

    const MenuLink = ({ item }: { item: MenuItem }) => (
        <Link
            href={item.href}
            className={`px-3 py-2 transition-colors duration-200 ${
                isActive(item)
                    ? 'border-b-2 border-[var(--primary-color-5)] text-[var(--primary-color-text)] font-medium'
                    : 'text-gray-600 hover:border-b-2 hover:border-[var(--primary-color-1)] hover:text-[var(--primary-color-text)]'
            }`}
            onClick={close}
        >
            <Group gap="xs">
                <Box hiddenFrom="md">{item.icon}</Box>
                <Text size="sm">{item.label}</Text>
            </Group>
        </Link>
    );

    return (
        <>
            {/* Desktop Menu */}
            <Group gap="xs" visibleFrom="md">
                {filteredMenuItems.map((item) => (
                    <MenuLink key={item.href} item={item} />
                ))}
            </Group>

            {/* Mobile Menu Button */}
            <Burger
                opened={opened}
                onClick={toggle}
                className="md:hidden"
                color={theme.colors.gray[6]}
            />

            {/* Mobile Drawer */}
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
                    {filteredMenuItems.map((item) => (
                        <MenuLink key={item.href} item={item} />
                    ))}
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
