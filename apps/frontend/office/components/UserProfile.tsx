import { useRouter } from '@/i18n/routing';
import { Box, Button, Divider, Menu, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import { useAuth } from '@shega/ui';
import { IconChevronDown, IconLogout2 } from '@tabler/icons-react';
import { deleteCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';

const createAvatar = (fn?: string, ln?: string) => {
    return (
        (fn?.charAt(0).toUpperCase() ?? '') +
        (ln?.charAt(0).toUpperCase() ?? '')
    );
};

export default function UserProfile() {
    const t = useTranslations('jobPortal');
    const { user, setUser } = useAuth();
    const [opened, { toggle }] = useDisclosure(false);
    const router = useRouter();

    const avatarName = createAvatar(user?.firstName, user?.lastName);
    return (
        <Menu
            width={250}
            position="bottom-end"
            shadow="md"
            trigger="click-hover"
        >
            <Menu.Target>
                <Button variant="subtle" className="px-2">
                    <Box className="flex items-center justify-between  gap-2 ">
                        <Box className="flex items-center gap-2">
                            <Box className=" bg-primary-1 w-8 h-8 font-normal text-xs text-center rounded-full flex items-center justify-center">
                                <span>{avatarName}</span>
                            </Box>
                            <Box className="hidden md:flex gap-0.5 text-primary-6">
                                <Text variant="title" size="xs">
                                    {user?.firstName}
                                </Text>
                                <Text variant="title" size="xs">
                                    {user?.lastName}
                                </Text>
                            </Box>
                        </Box>
                        <IconChevronDown className="w-4 h-4 text-primary-6" />
                    </Box>
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                {/* <Menu.Item leftSection={<IconUserDown className="w-4 h-4" />}>
                    {t('users')}
                </Menu.Item>
                <Menu.Item leftSection={<IconSettings2 className="w-4 h-4" />}>
                    {t('settings')}
                </Menu.Item> */}

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
