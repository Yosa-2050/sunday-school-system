'use client';

import { Card, Container, Group, useMantineColorScheme } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../public/logo.svg';
import { ColorSchemeControl } from './ColorSchemeControl';
import { HeaderMenu } from './HeaderMenu';
import { UserMenu } from './UserMenu';

export function AppHeader() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';

    return (
        <header className="sticky top-0 z-50 ">
            <Card
                withBorder={false}
                className="w-full"
                w="100%"
                styles={{
                    root: {
                        borderBottom: dark
                            ? '1px solid var(--mantine-color-dark-4)'
                            : '1px solid var(--mantine-color-gray-2)',
                        backgroundColor: dark
                            ? 'var(--mantine-color-dark-7)'
                            : 'var(--mantine-color-white)',
                    },
                }}
            >
                <Container size="xl" w="100%">
                    <Group justify="space-between" className=" !w-full" h={40}>
                        <Group
                            gap="xl"
                            className="justify-between md:justify-start w-full"
                            w={{
                                base: '100%',
                                md: 'auto',
                            }}
                        >
                            <Link
                                href="/"
                                className="flex flex-1 md:flex-none items-center"
                            >
                                <Image
                                    src={Logo.src}
                                    alt="logo"
                                    width={120}
                                    height={40}
                                    className="object-contain"
                                />
                            </Link>
                            <HeaderMenu />
                        </Group>
                        <Group gap="xs">
                            <ColorSchemeControl />
                            <UserMenu />
                        </Group>
                    </Group>
                </Container>
            </Card>
        </header>
    );
}
