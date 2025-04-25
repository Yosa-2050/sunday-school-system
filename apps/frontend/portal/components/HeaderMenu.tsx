import { Box, Group, Text } from '@mantine/core';
import { useAuth } from '@shega/ui';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    const { user } = useAuth();
    const isAuthenticated = !!user;

    const menuItems: MenuItem[] = [
        {
            label: t('findWork'),
            href: '/jobs',
            matchPattern: '/jobs',
        },
        {
            label: t('myJobs'),
            href: '/my-jobs',
            matchPattern: '/my-jobs',
            requiresAuth: true,
        },
        {
            label: t('reports'),
            href: '/reports',
            matchPattern: '/reports',
            requiresAuth: true,
        },
        {
            label: t('messages'),
            href: '/messages',
            matchPattern: '/messages',
            requiresAuth: true,
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
        <Group gap="xs">
            {filteredMenuItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 transition-colors duration-200 ${
                        isActive(item)
                            ? 'border-b-2 border-[var(--primary-color-5)] text-[var(--primary-color-text)] font-medium'
                            : 'text-gray-600 hover:border-b-2 hover:border-[var(--primary-color-1)] hover:text-[var(--primary-color-text)]'
                    }`}
                >
                    <Group gap="xs">
                        {item.icon && <Box>{item.icon}</Box>}
                        <Text size="sm">{item.label}</Text>
                    </Group>
                </Link>
            ))}
        </Group>
    );
}
