// 'use client';

// import { Link } from '@/i18n/routing';
// import {
//     AppShell,
//     Box,
//     Burger,
//     CloseButton,
//     Flex,
//     Paper,
//     ScrollArea,
//     useMantineColorScheme,
// } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import {
//     IconLayoutSidebarLeftExpand,
//     IconLayoutSidebarRightExpand,
// } from '@tabler/icons-react';
// import Image from 'next/image';

// import Logo from '../public/logo.svg';
// import { Menus } from './Menus';
// import UserProfile from './UserProfile';
// import { SideMenu } from './side-menu/SideMenu';
// import { ColorSchemeControl } from './ColorSchema';

// interface ShellProps {
//     role: 'administrator' | 'work_provider';
//     children: React.ReactNode;
// }

// export default function WrapperShell({
//     children,
//     role,
// }: ShellProps): React.ReactNode {
//     const [opened, { toggle }] = useDisclosure(false);
//     const [sidebarOpen, { toggle: toggleSidebar }] = useDisclosure(true);
//     const { colorScheme, toggleColorScheme } = useMantineColorScheme();
//     const dark = colorScheme === 'dark';

//     return (
//         <Paper>
//             <AppShell
//                 layout="alt"
//                 header={{ height: 60 }}
//                 navbar={{
//                     width: 300,
//                     breakpoint: 'md',
//                     collapsed: { mobile: !opened, desktop: !sidebarOpen },
//                 }}
//                 padding="xl"
//             >
//                 <AppShell.Header className=" border-b border-gray-200" h={60}>
//                     <Flex
//                         align="center"
//                         justify={'space-between'}
//                         h="100%"
//                         px="md"
//                     >
//                         <Flex
//                             onClick={toggleSidebar}
//                             style={{ cursor: 'pointer' }}
//                             visibleFrom="md"
//                         >
//                             {sidebarOpen ? (
//                                 <IconLayoutSidebarRightExpand
//                                     size={30}
//                                     stroke={1.5}
//                                     className="text-gray-600"
//                                 />
//                             ) : (
//                                 <IconLayoutSidebarLeftExpand
//                                     size={30}
//                                     stroke={1.5}
//                                     className="text-gray-600"
//                                 />
//                             )}
//                         </Flex>
//                         <Flex hiddenFrom="md">
//                             <Link
//                                 href={
//                                     role === 'administrator'
//                                         ? '/admin/dashboard'
//                                         : '/work-provider/jobs'
//                                 }
//                                 className="ml-3 flex items-center gap-2"
//                             >
//                                 <div className="relative w-[150px] h-[60px]">
//                                     <Image
//                                         src={Logo.src}
//                                         alt="logo"
//                                         fill
//                                         className="object-contain"
//                                     />
//                                 </div>
//                             </Link>
//                         </Flex>
//                         <Flex align="center" gap="md">
//                             <ColorSchemeControl />
//                             <UserProfile />
//                             <Burger
//                                 onClick={toggle}
//                                 style={{ cursor: 'pointer' }}
//                                 size={20}
//                                 hiddenFrom="md"
//                             />
//                         </Flex>
//                     </Flex>
//                 </AppShell.Header>

//                 <AppShell.Navbar
//                     className=" border-r border-gray-200 text-xs"
//                     p={'md'}
//                     hidden={!sidebarOpen}
//                 >
//                     <Flex
//                         align="center"
//                         justify={'space-between'}
//                         className="pb-2 border-b border-gray-300"
//                     >
//                         <Link
//                             href="/admin/dashboard"
//                             className="ml-3 flex items-center gap-2"
//                         >
//                             <Image
//                                 src={Logo.src}
//                                 alt="logo"
//                                 width={150}
//                                 height={120}
//                             />
//                         </Link>
//                         <CloseButton
//                             onClick={toggle}
//                             style={{ cursor: 'pointer' }}
//                             size={30}
//                             hiddenFrom="md"
//                         />
//                     </Flex>
//                     <ScrollArea className="flex-1">
//                         <SideMenu menu={Menus()} role={role} />
//                     </ScrollArea>
//                     <Box className="h-14 border-t border-gray-300 text-sm px-4 flex flex-col items-center justify-center">
//                         <span className="text-gray-500">
//                             © {new Date().getFullYear()} All rights reserved by{' '}
//                         </span>
//                         <span className="text-gray-500">Shega Jobs</span>
//                     </Box>
//                 </AppShell.Navbar>

//                 <AppShell.Main className="h-full bg-red-400">
//                     {children}
//                 </AppShell.Main>
//             </AppShell>
//         </Paper>
//     );
// }

'use client';
import { ActionIcon, Box, Drawer, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import NotificationDrawer from 'app/[locale]/(module)/work-provider/notification/page';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useToggle } from 'react-use';
import { cn } from 'utilies/cn';
import { ColorSchemeControl } from './ColorSchema';
import { Sidebar } from './Sidebar';
import UserProfile from './UserProfile';

type ShellProps = {
    children: ReactNode;
    type?: 'office' | 'portal';
};

export default function Shell({
    children,
    type = 'office',
}: ShellProps): ReactNode {
    const schema = useComputedColorScheme();
    const [opened, { open, close }] = useDisclosure(false);
    const [isSidebarOpen, toggleSidebar] = useToggle(true);
    const pathname = usePathname();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                close();
                toggleSidebar(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [close, toggleSidebar]);

    useEffect(() => {
        if (pathname) {
            close();
            if (window.innerWidth <= 1024) {
                toggleSidebar(false);
            }
        }
    }, [pathname, close, toggleSidebar]);

    const handleMenuClick = () => {
        if (window.innerWidth <= 1024) {
            open();
        } else {
            toggleSidebar();
        }
    };

    return (
        <>
            <Box className="w-full flex flex-1 h-screen">
                <Box
                    className={cn(
                        schema === 'light'
                            ? 'bg-white border-gray-200'
                            : ' border-[var(--mantine-color-dark-4)]',
                        'flex-col border-r  hidden lg:flex !h-full',
                        isSidebarOpen ? 'w-[265px]' : 'w-0 hidden',
                    )}
                >
                    {isSidebarOpen && <Sidebar />}
                </Box>
                <Box
                    className={`${schema === 'light' ? ' bg-gray-50' : 'bg-[var(--mantine-color-dark-6)] border-[var(--mantine-color-dark-4)]'} w-full flex flex-col overflow-y-auto`}
                >
                    <header
                        className={`${schema === 'light' ? 'bg-white border-gray-200' : 'bg-[var(--mantine-color-body)] border-[var(--mantine-color-dark-4)]'} w-full h-10 py-2 px-4 flex items-center justify-between border-b z-10 sticky top-0`}
                    >
                        <Box className="flex gap-2 items-center">
                            <ActionIcon
                                className="hidden lg:block"
                                variant="subtle"
                                onClick={handleMenuClick}
                            >
                                <IconMenu2 stroke={1.5} />
                            </ActionIcon>
                            <ActionIcon
                                className="lg:hidden"
                                variant="subtle"
                                onClick={handleMenuClick}
                            >
                                <IconMenu2 stroke={1.5} />
                            </ActionIcon>
                        </Box>
                        <Box className="flex gap-2 items-center">
                            <ColorSchemeControl />
                            <NotificationDrawer />
                            <UserProfile />
                        </Box>
                    </header>
                    <Box
                        className={cn(
                            ' py-4 flex-1',
                            isSidebarOpen ? 'container mx-auto' : 'w-full px-4',
                        )}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>
            <Drawer opened={opened} onClose={close} title="Menu">
                <Sidebar />
            </Drawer>
        </>
    );
}
