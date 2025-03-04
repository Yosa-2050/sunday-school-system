'use client';
import { ScrollArea } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { cn } from 'utilies/cn';
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
};

type MenuItemProps = {
    data: MenuTree;
    level?: number;
};

type MenuLabelProps = {
    link?: string;
    icon?: React.ReactNode;
    label: string;
    level?: number;
    pathMatch?: number;
};

const startsWith = (str: string, prefix: string) => str.startsWith(prefix);

const NavigationLink = ({
  href,
  children,
  onClick,
}: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} onClick={onClick}>
    {children}
  </Link>
);


function haveSameParentAtLevel(
    path1: string,
    path2: string,
    pathMatch: number,
  ): boolean {
    const getParentAtLevel = (path: string, level: number): string | undefined =>
      path.split('/').filter(Boolean)[level - 1];
  
    const parent1 = getParentAtLevel(path1, pathMatch);
    const parent2 = getParentAtLevel(path2, pathMatch);
  
    return parent1 !== undefined && parent1 === parent2;
  }

const findActiveSubMenu = (data: MenuTree[], pathname: string): string[] => {
    let activeMenus: string[] = [];
  
    for (const item of data) {
      if (item.link && pathname.startsWith(item.link)) {
        activeMenus.push(item.label);
        if (item.children) {
          const childActiveMenus = findActiveSubMenu(item.children, pathname);
          activeMenus = activeMenus.concat(childActiveMenus);
        }
      } else if (item.children) {
        const childActiveMenus = findActiveSubMenu(item.children, pathname);
        activeMenus = activeMenus.concat(childActiveMenus);
      }
    }
  
    return activeMenus;
  };

const MenuLabel = ({
    icon,
    link,
    label,
    pathMatch = 3,
    level = 0,
  }: MenuLabelProps) => {
    const pathname = usePathname();
  
    const active =
      link &&
      (startsWith(pathname, link) ||
        haveSameParentAtLevel(pathname, link, pathMatch));
  
    const paddingLeft = 20 * level;
  
    return (
      <div
        className={cn(
          classes.menuItem,
          'text-primary-text flex cursor-pointer items-center  rounded-md px-2 py-1 transition duration-300 ease-in-out',
          active ? classes.active : '',
        )}
        style={{ paddingLeft: paddingLeft <= 0 ? 20 : paddingLeft }}
      >
        <div
          className={cn(classes.activeIndicator, active ? 'bg-primary-5' : '')}
        />
        <div className={classes.labelIcon}>{icon}</div>
        <span className="ml-2 truncate">{label}</span>
      </div>
    );
  };

const MenuItem = ({ data, level = 0}: MenuItemProps) => {
    const {
      isGroup,
      label,
      link,
      icon,
      children,
      pathMatch: compare,
    } = data;
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
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

export function SideMenu({
    menu,
  }: {
    menu: MenuTree[];
  }) {
    return (
      <ScrollArea className="w-full px-4 py-4" scrollHideDelay={500}>
        <ul>
          {menu.map((group, index) => (
            <MenuItem
              data={group}
              key={`${group.label}-${index}`}
            />
          ))}
        </ul>
      </ScrollArea>
    );
  }