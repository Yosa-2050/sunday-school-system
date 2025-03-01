'use client';

import { Link, redirect } from '@/i18n/routing';
import { Carousel } from '@mantine/carousel';
import { Box, Flex, Image, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@shega/ui';
import { useLocale, useTranslations } from 'next-intl';
import type React from 'react';
import type { JSX } from 'react';
import Logo from '../../../../public/logo.svg';

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    const { user } = useAuth();
    const locale = useLocale();
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (user) {
        redirect({ href: '/admin/dashboard', locale });
    }

    const t = useTranslations('auth.pageWrapper');

    return (
        <Flex className="min-h-screen bg-primary-1 w-full">
            {/* Hide left section on mobile */}
            {!isMobile && (
                <Box className="relative h-screen bg-primary-1 md:w-1/2">
                    <Carousel
                        withIndicators
                        height="100%"
                        className="absolute inset-0 w-full h-full"
                        loop
                    >
                        <Carousel.Slide>
                            <Image
                                src="/job-search-im-unemployed-free-photo.webp"
                                alt="Background 1"
                                className="w-full h-full object-cover"
                            />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                src="/istockphoto-537503733-612x612.jpg"
                                alt="Background 2"
                                className="w-full h-full object-cover"
                            />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                src="/0270_637846635946108934.png"
                                alt="Background 3"
                                className="w-full h-full object-cover"
                            />
                        </Carousel.Slide>
                    </Carousel>
                </Box>
            )}

            {/* Right section with content */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                className="w-full md:w-1/2 relative bg-gray-100 overflow-hidden"
                h={'100vh'}
            >
                <Link href="/">
                    <Image
                        src={Logo.src}
                        alt="Logo"
                        width={40}
                        height={30}
                        className="block w-[30%] absolute top-10 left-2"
                    />
                </Link>

                {children}

                {/* Copyright text at the bottom */}
                <Text
                    size="sm"
                    color="gray"
                    className="absolute bottom-4 text-center"
                >
                    {new Date().getFullYear()} Shega Jobs. {t('rightsReserved')}
                </Text>
            </Flex>
        </Flex>
    );
}
