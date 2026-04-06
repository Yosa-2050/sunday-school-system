'use client';

import { Link } from '@/i18n/routing';
import { Flex, Image, Paper, Text } from '@mantine/core';
import { useAuth } from '@shega/ui';
import { getCookie } from 'cookies-next';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';
import { RoleEnum } from '@shega/shared';
import type React from 'react';
import { type JSX, useRef } from 'react';
import Logo from '../../../../public/logo.svg';

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    const t = useTranslations('auth.pageWrapper');
    const role = getCookie('role');
    const autoplay = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, active: true }),
    );

    const { user } = useAuth();

    if (user && role) {
        if (role === RoleEnum.administrator) {
            window.location.href = '/admin/dashboard';
        }
        if (role === RoleEnum.school_admin) {
            window.location.href = '/school_admin/dashboard';
        }
    }

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
            h="100vh"
            w="100%"
            className="bg-primary-50"
            px="md" // padding on small devices
        >
            <Paper
                withBorder
                shadow="md"
                radius="md"
                p="xl"
                w="100%"
                maw="90%" // responsive: 90% of viewport on small
                miw="300px" // never shrink too small
                style={{ maxWidth: '600px' }} // max width on large screens
                className="bg-primary-0"
            >
                {/* Header (Logo) */}
                <Flex justify="center" mb="lg">
                    <Link href="/">
                        <Image
                            src={Logo.src}
                            alt="Logo"
                            width={100}
                            height={60}
                        />
                        Herani Sunday School Management System.
                    </Link>
                </Flex>

                {/* Main Content */}
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    w="100%"
                >
                    {children}
                </Flex>

                {/* Footer */}
                <Text size="sm" c="gray" ta="center" mt="xl">
                    © {new Date().getFullYear()} Herani Sunday School Management
                    System. {t('rightsReserved')}
                </Text>
            </Paper>
        </Flex>
    );
}
