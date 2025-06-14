import { useNetwork } from '@mantine/hooks';

import { Box, useComputedColorScheme } from '@mantine/core';
import { useAuth } from '@shega/ui';
import Link from 'next/link';
import { Menus } from './Menus';
import { SideMenu } from './side-menu/SideMenu';

function getContrastColor(bgColor: string): string {
    const rgb = Number.parseInt(bgColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 128 ? '#000000' : '#FFFFFF';
}
export const Sidebar = () => {
    const networkStatus = useNetwork();
    const schema = useComputedColorScheme();
    const { user } = useAuth();

    const year = new Date().getFullYear();

    return (
        <>
            <Box
                className={`${schema === 'light' ? 'border-gray-200' : 'border-[var(--mantine-color-dark-4)]'} hidden md:flex h-10   border-b  px-4 max-h-14 overflow-hidden w-[255px] bg-primary-3`}
            >
                <Link
                    href="/dashboard"
                    className="text-xl flex    font-bold items-center gap-4 "
                    style={{
                        color: getContrastColor('#000000'),
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        aria-label="Logo"
                        role="img"
                    >
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M16 16h4v4h-4zm-6 0h4v4h-4zm-6 0h4v4H4zm12-6h4v4h-4zm-6 0h4v4h-4zm-6 0h4v4H4zm12-6h4v4h-4zm-6 0h4v4h-4zM4 4h4v4H4z"
                        />
                    </svg>
                </Link>
            </Box>
            <Box className="flex-1 overflow-y-auto overflow-x-hidden">
                <SideMenu
                    menu={Menus()}
                    role={
                        user?.role as
                            | 'administrator'
                            | 'work_provider'
                            | 'super_admin'
                    }
                />
            </Box>
            <Box
                className={`${schema === 'light' ? 'border-gray-200 bg-white' : 'border-[var(--mantine-color-dark-4)]'} flex h-14 items-stretch border-t px-4 py-2 justify-between text-xs`}
            >
                <Box className="flex flex-col gap-1 justify-between">
                    <span
                        className={
                            networkStatus.online
                                ? 'text-green-500'
                                : 'text-red-500'
                        }
                    >
                        {networkStatus.online ? 'Online' : 'Offline'}
                    </span>
                    <Box className="text-center">
                        {process.env.NEXT_PUBLIC_VERSION ?? 'V 0.0.1'}
                    </Box>
                </Box>
                <Box className="flex flex-col gap-1 justify-between">
                    <Box className="text-right">
                        {' '}
                        &copy; {year}{' '}
                        {/* <LocaleText text={tenant.settings?.copyright?.short} /> */}
                    </Box>
                    <Box className="flex gap-2 justify-between items-center">
                        <span className="text-xs">Powered by</span>
                        {/* <Image alt="Perago" height={40} src={Perago} width={60} />{' '} */}
                    </Box>
                </Box>
            </Box>
        </>
    );
};
