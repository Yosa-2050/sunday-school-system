import { Avatar, Box, Divider, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '@shega/ui';
import { IconLogout2, IconSettings2, IconUserDown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {deleteCookie} from 'cookies-next'
import { useRouter } from '@/i18n/routing';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';

export default function UserProfile() {
    const t = useTranslations('jobPortal');
    const {user} = useAuth();
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
                >
                    <Avatar radius="xl" color="blue">
                        {user?.firstName[0]} {user?.lastName[0]}
                    </Avatar>
                </Box>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item leftSection={<IconUserDown className="w-4 h-4" />}>
                    {t('profile')}
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings2 className="w-4 h-4" />}>
                    {t('settings')}
                </Menu.Item>

                <Divider />

                <Menu.Item
                    leftSection={<IconLogout2 className="w-4 h-4" />}
                    color="red"
                    onClick={() => {
                        deleteCookie(COOKIE_ACCESS_TOKEN);
                        router.push('/auth/login');
                    }}
                >
                    {t('logout')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
