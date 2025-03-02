'use client';

import { Link } from '@/i18n/routing';
import { AppShell, Box, Burger, Flex, ScrollArea, CloseButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { IconBell, IconLayoutSidebarRightExpand, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
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
    const [sidebarOpen, { toggle: toggleSidebar }] = useDisclosure(true);

    return (
        <ModalsProvider>
            <Notifications />
            <AppShell
                layout='alt'
                header={{ height: 60 }}
                navbar={{
                    width: 340,
                    breakpoint: 'md',
                    collapsed: { mobile: !opened, desktop: !sidebarOpen },
                }}
                padding="md"
            >
                {/* Header */}
                <AppShell.Header className="bg-white border-b border-gray-200" h={60}>
                    <Flex
                        align="center"
                        justify={'space-between'}
                        h="100%"
                        px="md"
                    >
                        <Flex
                            onClick={toggleSidebar}
                            style={{ cursor: 'pointer' }}
                            visibleFrom='md'
                        >
                            {sidebarOpen ?  <IconLayoutSidebarRightExpand size={30} /> : <IconLayoutSidebarLeftExpand size={30} />}
                        </Flex>
                        <Flex hiddenFrom='md'>

                        <Link
                            href="/admin/dashboard"
                            className="ml-3 flex items-center gap-2"
                            >
                            <Image
                                src={Logo.src}
                                alt="logo"
                                width={150}
                                height={120}
                                />
                                </Link>
                                </Flex>
                        <Flex align="center" gap="md">
                            <LocaleSwitcherSelect />
                            <Flex style={{ cursor: 'pointer' }}>
                                <IconBell size={20} />
                            </Flex>
                            <UserProfile />
                           <Burger 
                            onClick={toggle}
                            style={{ cursor: 'pointer' }}
                            size={20}
                            hiddenFrom='md'
                           />
                        </Flex>
                    </Flex>
                </AppShell.Header>

                {/* Sidebar */}
                <AppShell.Navbar className="bg-white border-r border-gray-200" p={"md"} hidden={!sidebarOpen}>
                    <Flex align="center" justify={'space-between'} className='pb-2 border-b'>
                        <Link
                            href="/admin/dashboard"
                            className="ml-3 flex items-center gap-2"
                        >
                            <Image
                                src={Logo.src}
                                alt="logo"
                                width={150}
                                height={120}
                            />
                        </Link>
                        <CloseButton 
                            onClick={toggle}
                            style={{ cursor: 'pointer' }}
                            size={30}
                            hiddenFrom='md'
                        />
                    </Flex>
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
                    <Box className="w-full flex-1">{children}</Box>
                </AppShell.Main>
            </AppShell>
        </ModalsProvider>
    );
}
