import { useRouter } from '@/i18n/routing';
import { Avatar, Box, Divider, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconLogout2, IconUser } from '@tabler/icons-react';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';

export default function UserProfile() {
    const t = useTranslations('jobPortal');
    const { user, setUser } = useAuth();
    const [opened, { toggle }] = useDisclosure(false);
    const router = useRouter();

    return (
        <Menu
            opened={opened}
            onChange={toggle}
            width={200}
            position="bottom-end"
            shadow="md"
        >
            <Menu.Target>
                <Box
                    variant="subtle"
                    className="flex items-center space-x-2 text-primary cursor-pointer"
                    // visibleFrom="md"
                >
                    <Avatar radius="xl" color="blue" size={'sm'}>
                        {user?.firstName?.[0]} {user?.lastName?.[0]}
                    </Avatar>
                    <Text size="xs" visibleFrom="md">
                        {user?.firstName} {user?.lastName}
                    </Text>
                </Box>
            </Menu.Target>

            <Menu.Dropdown>
                {user?.role === 'school_admin' && (
                    <Menu.Item
                        leftSection={<IconUser size={14} />}
                        onClick={() => router.push('/school_admin/profile')}
                    >
                        {t('profile')}
                    </Menu.Item>
                )}
                <Divider />

                {user && (
                    <Menu.Item
                        leftSection={<IconLogout2 className="w-4 h-4" />}
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
                )}
            </Menu.Dropdown>
        </Menu>
    );
}
