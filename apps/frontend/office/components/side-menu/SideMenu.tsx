'use client';
import { ScrollArea, useMantineColorScheme } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from 'utilities/cn';
import classes from './SideMenu.module.css';
export type MenuTree = {
    isGroup?: boolean;
    hasMore?: boolean;
    label: string;
    icon?: React.ReactNode;
    link?: string;
    isExternal?: string;
    children?: MenuTree[];
    pathMatch?: number;
    role: 'super_admin' | 'administrator' | 'school_admin' | 'mentor';
};

type MenuItemProps = {
    data: MenuTree;
    level?: number;
    role: 'super_admin' | 'administrator' | 'school_admin';
    isSidebarOpen: boolean;
};

type MenuLabelProps = {
    link?: string;
    icon?: React.ReactNode;
    label: string;
    level?: number;
    pathMatch?: number;
    isSidebarOpen: boolean;
};

const startsWith = (str: string, prefix: string) => str.startsWith(prefix);

const NavigationLink = ({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}) => (
    <Link href={href} onClick={onClick}>
        {children}
    </Link>
);

const findActiveSubMenu = (data: MenuTree[], pathname: string): string[] => {
    let activeMenus: string[] = [];

    for (const item of data) {
        if (item.link && pathname.startsWith(item.link)) {
            activeMenus.push(item.label);
            if (item.children) {
                const childActiveMenus = findActiveSubMenu(
                    item.children,
                    pathname,
                );
                activeMenus = activeMenus.concat(childActiveMenus);
            }
        } else if (item.children) {
            const childActiveMenus = findActiveSubMenu(item.children, pathname);
            activeMenus = activeMenus.concat(childActiveMenus);
        }
    }

    return activeMenus;
};

function haveSameParentAtLevel(path1: string, path2: string, level: number) {
    const seg1 = path1.split('/').filter(Boolean);
    const seg2 = path2.split('/').filter(Boolean);
    return seg1.slice(0, level).join('/') === seg2.slice(0, level).join('/');
}

function isActivePath(pathname: string, link: string) {
    const pathSegments = pathname.split('/').filter(Boolean);
    const linkSegments = link.split('/').filter(Boolean);

    // Match exactly the same segments
    if (pathSegments.length === linkSegments.length) {
        return pathSegments.join('/') === linkSegments.join('/');
    }

    return false;
}

export const MenuLabel = ({
    icon,
    link,
    label,
    pathMatch = 3,
    level = 0,
    isSidebarOpen,
}: MenuLabelProps) => {
    const pathname = usePathname();
    const theme = useMantineColorScheme();

    const active =
        link &&
        (isActivePath(pathname, link) ||
            haveSameParentAtLevel(pathname, link, pathMatch));

    const paddingLeft = 20 * level;

    return (
        <div
            className={cn(
                classes.menuItem,
                `flex cursor-pointer items-center rounded-md ${
                    isSidebarOpen && 'px-2'
                } py-1 transition duration-300 ease-in-out ${
                    theme.colorScheme === 'dark'
                        ? 'text-gray-50'
                        : 'text-gray-700'
                }`,
                active ? classes.active : '',
            )}
            style={{ paddingLeft: paddingLeft <= 0 ? 20 : paddingLeft }}
        >
            <div
                className={cn(
                    classes.activeIndicator,
                    active ? 'bg-primary-5' : '',
                )}
            />
            <div className={classes.labelIcon}>{icon}</div>
            {isSidebarOpen && <span className="ml-2 truncate">{label}</span>}
        </div>
    );
};

const MenuItem = ({ data, level = 0, role, isSidebarOpen }: MenuItemProps) => {
    const { isGroup, label, link, icon, children, pathMatch: compare } = data;
    const pathname = usePathname();

    const [open, toggle] = useToggle([false, true]);

    const isActiveChildren = useMemo(() => {
        if (children?.length) {
            const foundActiveMenus = findActiveSubMenu(children, pathname);
            return foundActiveMenus.length > 0;
        }
        return false;
    }, [pathname, children]);

    const left = 20 * level + 10;
    const hasChildren = (children?.length ?? 0) > 0;
    const showChildren = (isGroup || open || isActiveChildren) && hasChildren;

    return (
        <li className={cn('relative', isGroup ? 'mt-2' : 'mt-1')}>
            {isGroup && <span className={classes.groupLabel}>{label}</span>}

            {!isGroup &&
                (link ? (
                    <NavigationLink href={link} onClick={() => toggle()}>
                        <MenuLabel
                            icon={icon}
                            label={label}
                            level={level}
                            link={link}
                            pathMatch={compare}
                            isSidebarOpen={isSidebarOpen}
                        />
                    </NavigationLink>
                ) : (
                    <button
                        type="button"
                        className="block w-full"
                        onClick={() => toggle()}
                    >
                        <MenuLabel
                            icon={icon}
                            label={label}
                            level={level}
                            pathMatch={compare}
                            isSidebarOpen={isSidebarOpen}
                        />
                    </button>
                ))}

            {showChildren && (
                <ul className={cn('relative', isGroup ? 'mt-1' : '')}>
                    <div
                        className={cn(open ? classes.menuItemContainer : '')}
                        style={{ left }}
                    />
                    {(children ?? []).map((child) => (
                        <MenuItem
                            data={child}
                            level={level + 1}
                            key={`${child.label}-${child.link}`}
                            role={role}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export function SideMenu({
    menu,
    role,
    isSidebarOpen,
}: Readonly<{
    menu: MenuTree[];
    role: 'super_admin' | 'administrator' | 'school_admin';
    isSidebarOpen: boolean;
}>) {
    return (
        <ScrollArea
            className={`w-full ${isSidebarOpen ? 'px-4' : 'px-1'} py-4 overflow-x-hidden`}
            scrollHideDelay={500}
        >
            <ul>
                {menu.map((group, index) => {
                    if (group.role === role) {
                        return (
                            <MenuItem
                                data={group}
                                key={`${group.label}-${index}`}
                                role={role}
                                isSidebarOpen={isSidebarOpen}
                            />
                        );
                    }
                    return null;
                })}
            </ul>
        </ScrollArea>
    );
}
