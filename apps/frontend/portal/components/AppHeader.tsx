'use client';

import { Container, Group } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../public/logo.svg';
import { HeaderMenu } from './HeaderMenu';
import { UserMenu } from './UserMenu';

export function AppHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <Container size="xl">
                <Group justify="space-between" h={60}>
                    <Group gap="xl">
                        <Link href="/" className="flex items-center">
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
                    <UserMenu />
                </Group>
            </Container>
        </header>
    );
}
