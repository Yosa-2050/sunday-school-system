'use client';

import { Link } from '@/i18n/routing';
import {
    AppShell,
    Box,
    Burger,
    CloseButton,
    Flex,
    ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
    IconLayoutSidebarLeftExpand,
    IconLayoutSidebarRightExpand,
} from '@tabler/icons-react';
import Image from 'next/image';

import Logo from '../public/logo.svg';
import { Menus } from './Menus';
import UserProfile from './UserProfile';
import { SideMenu } from './side-menu/SideMenu';

interface ShellProps {
    role: 'administrator' | 'work_provider';
    children: React.ReactNode;
}

export default function WrapperShell({
    children,
    role,
}: ShellProps): React.ReactNode {
    const [opened, { toggle }] = useDisclosure(false);
    const [sidebarOpen, { toggle: toggleSidebar }] = useDisclosure(true);

    return (
        <>
            <AppShell
                layout="alt"
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'md',
                    collapsed: { mobile: !opened, desktop: !sidebarOpen },
                }}
                padding="md"
            >
                <AppShell.Header className=" border-b border-gray-200" h={60}>
                    <Flex
                        align="center"
                        justify={'space-between'}
                        h="100%"
                        px="md"
                    >
                        <Flex
                            onClick={toggleSidebar}
                            style={{ cursor: 'pointer' }}
                            visibleFrom="md"
                        >
                            {sidebarOpen ? (
                                <IconLayoutSidebarRightExpand
                                    size={30}
                                    stroke={1.5}
                                    className="text-gray-600"
                                />
                            ) : (
                                <IconLayoutSidebarLeftExpand
                                    size={30}
                                    stroke={1.5}
                                    className="text-gray-600"
                                />
                            )}
                        </Flex>
                        <Flex hiddenFrom="md">
                            <Link
                                href={
                                    role === 'administrator'
                                        ? '/admin/dashboard'
                                        : '/work-provider/jobs'
                                }
                                className="ml-3 flex items-center gap-2"
                            >
                                <div className="relative w-[150px] h-[60px]">
                                    <Image
                                        src={Logo.src}
                                        alt="logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </Link>
                        </Flex>
                        <Flex align="center" gap="md">
                            {/* <LocaleSwitcherSelect />
              <Flex style={{ cursor: "pointer" }}>
                <IconBell size={20} />
              </Flex> */}
                            <UserProfile />
                            {/* <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                variant="default"
                size="xl"
                aria-label="Toggle color scheme"
                className="border-none"
              >
                {computedColorScheme === "dark" ? (
                  <IconSun className="w-5.5 h-5.5 stroke-1.5" />
                ) : (
                  <IconMoon className="w-5.5 h-5.5 stroke-1.5" />
                )}
              </ActionIcon> */}
                            <Burger
                                onClick={toggle}
                                style={{ cursor: 'pointer' }}
                                size={20}
                                hiddenFrom="md"
                            />
                        </Flex>
                    </Flex>
                </AppShell.Header>

                <AppShell.Navbar
                    className=" border-r border-gray-200 text-xs"
                    p={'md'}
                    hidden={!sidebarOpen}
                >
                    <Flex
                        align="center"
                        justify={'space-between'}
                        className="pb-2 border-b border-gray-300"
                    >
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
                            hiddenFrom="md"
                        />
                    </Flex>
                    <ScrollArea className="flex-1">
                        <SideMenu menu={Menus()} role={role} />
                    </ScrollArea>
                    <Box className="h-14 border-t border-gray-300 text-sm px-4 flex flex-col items-center justify-center">
                        <span className="text-gray-500">
                            © {new Date().getFullYear()} All rights reserved by{' '}
                        </span>
                        <span className="text-gray-500">Shega Jobs</span>
                    </Box>
                </AppShell.Navbar>

                <AppShell.Main className="bg-primary-5 dark:bg-primary-1">
                    <Box className="w-full flex-1 ">
                        {children}
                        </Box>
                </AppShell.Main>
            </AppShell>
        </>
    );
}
