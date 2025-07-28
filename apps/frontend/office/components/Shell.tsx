'use client';
import { ActionIcon, Box, Drawer, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2 } from '@tabler/icons-react';
import NotificationPopover from 'app/[locale]/(module)/_components/Notification';
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

export default function Shell({ children }: Readonly<ShellProps>): ReactNode {
    const schema = useComputedColorScheme();
    const [opened, { open, close }] = useDisclosure(false);
    const [isSidebarOpen, toggleSidebar] = useToggle(true);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) {
            close();
        }
    }, [pathname, close]);

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
                        'flex-col border-r hidden lg:flex  !h-full',
                        isSidebarOpen ? 'w-[265px]' : 'w-[60px] hidden',
                    )}
                >
                    <Sidebar isSidebarOpen={isSidebarOpen} />
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
                            <NotificationPopover />
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
                <Sidebar isSidebarOpen={isSidebarOpen} />
            </Drawer>
        </>
    );
}
