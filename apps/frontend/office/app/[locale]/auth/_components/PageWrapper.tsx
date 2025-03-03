'use client';

import { Link, redirect } from '@/i18n/routing';
import { Carousel } from '@mantine/carousel';
import { Box, Flex, Image, Text } from '@mantine/core';
import { useAuth } from '@shega/ui';
import Autoplay from 'embla-carousel-autoplay';
import { useLocale, useTranslations } from 'next-intl';
import type React from 'react';
import { type JSX, useEffect, useRef } from 'react';
import Logo from '../../../../public/logo.svg';

export default function PageWrapper({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    const { user } = useAuth();
    const locale = useLocale();
    const t = useTranslations('auth.pageWrapper');
    const autoplay = useRef(Autoplay({ delay: 2000 }));

    useEffect(() => {
        if (user) {
            redirect({ href: '/admin/dashboard', locale });
        }
    }, [user, locale]);

    return (
        <Flex className="relative min-h-screen w-full">
            {/* Background Carousel - Moves to Background on Mobile */}
            <Box
                className={`absolute inset-0 w-full h-[100vh] z-0 md:w-1/2 md:relative
                `}
            >
                <Carousel
                    withControls={false}
                    plugins={[autoplay.current]}
                    onMouseEnter={autoplay.current.stop}
                    onMouseLeave={autoplay.current.reset}
                    className="absolute inset-0 w-full h-[100vh]"
                >
                    <Carousel.Slide>
                        <Image
                            src="/job-search-im-unemployed-free-photo.webp"
                            alt="Background 1"
                            className="w-full h-[100vh] object-cover"
                        />
                    </Carousel.Slide>
                    <Carousel.Slide>
                        <Image
                            src="/istockphoto-537503733-612x612.jpg"
                            alt="Background 2"
                            className="w-full h-[100vh] object-cover"
                        />
                    </Carousel.Slide>
                    <Carousel.Slide>
                        <Image
                            src="/0270_637846635946108934.png"
                            alt="Background 3"
                            className="w-full h-[100vh] object-cover"
                        />
                    </Carousel.Slide>
                </Carousel>

                {/* Dark overlay to improve contrast on mobile */}
                <Box className="absolute inset-0 bg-black/20" />
            </Box>

            {/* Content Section (Ensures it's above background) */}
            <Flex
                direction="column"
                align="center"
                justify="center"
                className={
                    'relative z-10 w-full md:w-1/2  backdrop-blur-none p-6 bg-primary-5'
                }
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

                {/* Footer */}
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
