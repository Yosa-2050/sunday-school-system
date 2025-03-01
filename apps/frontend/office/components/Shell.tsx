'use client';
import { Box, Button, Flex } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
// import { Menus } from './Menus';

import { Link } from '@/i18n/routing';
import { IconBell } from '@tabler/icons-react';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import LocaleSwitcherSelect from './LocaleSwitcher';
import { Menus } from './Menus';
import UserProfile from './UserProfile';
import { SideMenu } from './side-menu/SideMenu';

interface ShellProps {
    children: React.ReactNode;
}

export default function WrapperShell({
    children,
}: ShellProps): React.ReactNode {
    return (
        <ModalsProvider>
            <Notifications />
            <Box className="w-full flex flex-1 h-screen">
                <Box className="bg-white flex flex-col border-r border-gray-200 w-96">
                    <Box className="sticky top-0 left-0 right-0 bg-white z-10">
                        <Box className="flex h-14 items-center border-b px-4">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2"
                            >
                                <Image
                                    src={Logo.src}
                                    alt="logo"
                                    width={80}
                                    height={120}
                                />
                            </Link>
                        </Box>
                    </Box>
                    <Box className="flex-1 overflow-y-auto">
                        <SideMenu menu={Menus()} />
                    </Box>
                    <Box className="flex h-14 items-center border-t text-sm px-4 justify-center bg-white">
                        <span className="text-gray-500">
                            © {new Date().getFullYear()} All rights reserved by
                            Shega Jobs
                        </span>
                    </Box>
                </Box>
                <Box className="w-full flex flex-col">
                    <Box className="w-full h-14 py-2 px-4 bg-white flex items-center justify-between border-b border-gray-200 z-10">
                        <Box />
                        <Flex align={'center'}>
                            <Box className="flex items-center h-14 px-4">
                                <LocaleSwitcherSelect />
                            </Box>
                            <Button variant="subtle" size="xs" c={'gray'}>
                                <IconBell size={20} />
                            </Button>
                            <UserProfile />
                        </Flex>
                    </Box>
                    <Box className="m-4 flex-1 overflow-y-auto">{children}</Box>
                </Box>
            </Box>
        </ModalsProvider>
    );
}
