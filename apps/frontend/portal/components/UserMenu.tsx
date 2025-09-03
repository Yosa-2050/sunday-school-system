import { useRouter } from '@/i18n/routing';
import { Avatar, Group, Menu, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconLogout2, IconUser } from '@tabler/icons-react';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';

export function UserMenu() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const isAuthenticated = !!user;
    const t = useTranslations('header');
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!isAuthenticated) {
        return (
            <Group>
                <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                >
                    {t('login')}
                </button>
            </Group>
        );
    }

    return (
        <Menu shadow="md" width={280}>
            <Menu.Target>
                <Group gap="xs" className="cursor-pointer" visibleFrom="md">
                    <Avatar
                        size={isMobile ? 'sm' : 'md'}
                        radius="xl"
                        color="primary"
                    >
                        {user.firstName?.[0]}
                        {user.middleName?.[0]}
                    </Avatar>
                    {!isMobile && (
                        <div>
                            <Text size="sm" fw={500}>
                                {user.firstName} {user.middleName}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {user?.user?.email}
                            </Text>
                        </div>
                    )}
                </Group>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconUser size={14} />}
                    onClick={() => router.push('/profile')}
                >
                    {t('profile')}
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconLogout2 size={14} />}
                    color="red"
                    onClick={() => {
                        deleteCookie(COOKIE_ACCESS_TOKEN);
                        deleteCookie('role');
                        setUser(undefined);
                        router.push('/auth/login');
                    }}
                >
                    {t('logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
