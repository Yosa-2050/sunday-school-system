'use client';

import { useRouter } from '@/i18n/routing';
import {
    ActionIcon,
    Avatar,
    Button,
    Container,
    Group,
    Menu,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useAuth } from '@shega/ui';
import {
    IconBell,
    IconLogout,
    IconSettings,
    IconUser,
} from '@tabler/icons-react';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';

function AppHeader() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const isAuthenticated = !!user;
    const t = useTranslations('jobPortal');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const openModal = () =>
        modals.openConfirmModal({
            title: 'Are you sure you want to logout?',
            children: (
                <Text size="sm">
                    You will be logged out of your account. Any unsaved changes
                    will be lost
                </Text>
            ),
            labels: { cancel: 'Cancel', confirm: 'Logout' },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                deleteCookie(COOKIE_ACCESS_TOKEN);
                deleteCookie('role');
                setUser(undefined);
                router.push('/auth/login');
            },
        });

    return (
        <Container
            size={'xl'}
            className="border-b border-gray-200 container mx-auto"
        >
            <Group h={80} justify="space-between">
                <Group>
                    <Text size="xl" fw={700} className="text-[#14a800]">
                        Shega Jobs
                    </Text>
                    {isAuthenticated && !isMobile && (
                        <Group ml={48} gap="xl" className="text-xs">
                            <Text className="text-xs font-medium hover:text-[#14a800] cursor-pointer">
                                Find Work
                            </Text>
                            <Text className="text-xs font-medium hover:text-[#14a800] cursor-pointer">
                                My Jobs
                            </Text>
                            <Text className="text-xs font-medium hover:text-[#14a800] cursor-pointer">
                                Reports
                            </Text>
                            <Text className="text-xs font-medium hover:text-[#14a800] cursor-pointer">
                                Messages
                            </Text>
                        </Group>
                    )}
                </Group>

                <Group>
                    {isAuthenticated ? (
                        <Group>
                            <ActionIcon variant="subtle" size="lg">
                                <IconBell size={20} />
                            </ActionIcon>
                            <Menu shadow="md" width={280}>
                                <Menu.Target>
                                    <Group gap="xs" className="cursor-pointer">
                                        <Avatar
                                            size={isMobile ? 'sm' : 'md'}
                                            radius="xl"
                                            color="green"
                                        >
                                            {user.firstName?.[0]}
                                            {user.lastName?.[0]}
                                        </Avatar>
                                        {!isMobile && (
                                            <div>
                                                <Text size="sm" fw={500}>
                                                    {user.firstName}{' '}
                                                    {user.lastName}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    {user.phoneNumber}
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
                                        leftSection={<IconSettings size={14} />}
                                        onClick={() => router.push('/settings')}
                                    >
                                        {t('settings')}
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item
                                        leftSection={<IconLogout size={14} />}
                                        color="red"
                                        onClick={openModal}
                                    >
                                        {t('logout')}
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    ) : (
                        <Group>
                            <Button
                                variant="subtle"
                                onClick={() => router.push('/auth/login')}
                            >
                                {t('login')}
                            </Button>
                        </Group>
                    )}
                </Group>
            </Group>
        </Container>
    );
}

export { AppHeader };
