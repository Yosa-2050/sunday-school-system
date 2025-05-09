'use client';

import { Link, useRouter } from '@/i18n/routing';
import { Carousel } from '@mantine/carousel';
import { Box, Flex, Image, Text } from '@mantine/core';
import { useAuth } from '@shega/ui';
import { getCookie } from 'cookies-next';
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
    const t = useTranslations('auth.pageWrapper');
    const role = getCookie('role');
    const router = useRouter();
    const locale = useLocale();
    const autoplay = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false, active: true }),
    );

    const { user } = useAuth();

    useEffect(() => {
        if (user && role) {
            router.push('/');
        }
    }, [user, role, router]);
    return (
        <Flex className="relative min-h-screen w-full">
            <Box
                className={`absolute inset-0 w-full h-[100vh] z-0 md:w-1/2 md:relative
                `}
            >
                <Carousel
                    loop={true}
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
                    'relative z-10 w-full md:w-1/2  backdrop-blur-none p-6 bg-primary-0'
                }
                h={'100vh'}
            >
                <Link href="/">
                    <Image
                        src={Logo.src}
                        alt="Logo"
                        width={60}
                        height={90}
                        fit="contain"
                        className="block !w-[30%] absolute top-10 left-2"
                    />
                </Link>

                {children}

                {/* Footer */}
                <Text
                    size="sm"
                    c="gray"
                    className="absolute bottom-4 text-center"
                >
                    {new Date().getFullYear()} Shega Jobs. {t('rightsReserved')}
                </Text>
            </Flex>
        </Flex>
    );
}
