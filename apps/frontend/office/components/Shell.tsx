'use client';

import { Link } from '@/i18n/routing';
import { AppShell, Box, Burger, Button, Flex, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
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
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <ModalsProvider>
            <Notifications />
            <AppShell
                header={{ height: 56 }}
                navbar={{
                    width: 280,
                    breakpoint: 'md', // Sidebar hides on small screens
                    collapsed: { mobile: !opened },
                }}
                padding="md"
            >
                {/* Header */}
                <AppShell.Header className="bg-white border-b border-gray-200">
                    <Flex
                        align="center"
                        justify="space-between"
                        h="100%"
                        px="md"
                    >
                        <Flex align="center">
                            <Link
                                href="/admin/dashboard"
                                className="ml-3 flex items-center gap-2"
                            >
                                <Image
                                    src={Logo.src}
                                    alt="logo"
                                    width={80}
                                    height={120}
                                />
                            </Link>
                        </Flex>
                        <Flex align="center" gap="md">
                            <LocaleSwitcherSelect />
                            <Button variant="subtle" size="xs" c={'gray'}>
                                <IconBell size={20} />
                            </Button>
                            <UserProfile />
                            <Burger
                                opened={opened}
                                onClick={toggle}
                                hiddenFrom="md"
                                size="sm"
                            />
                        </Flex>
                    </Flex>
                </AppShell.Header>

                {/* Sidebar */}
                <AppShell.Navbar className="bg-white border-r border-gray-200">
                    <ScrollArea className="flex-1">
                        <SideMenu menu={Menus()} />
                    </ScrollArea>
                    <Box className="h-14 border-t text-sm px-4 flex items-center justify-center">
                        <span className="text-gray-500">
                            © {new Date().getFullYear()} All rights reserved by
                            Shega Jobs
                        </span>
                    </Box>
                </AppShell.Navbar>

                {/* Main Content */}
                <AppShell.Main>
                    <Box className=" flex-1 overflow-y-auto">{children}</Box>
                </AppShell.Main>
            </AppShell>
        </ModalsProvider>
    );
}
