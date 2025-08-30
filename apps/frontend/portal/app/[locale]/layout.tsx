import { ColorSchemeScript } from '@mantine/core';
import { AuthProvider } from '@shega/ui';
import { getUserAction } from 'app/_api/get-user-action';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Roboto } from 'next/font/google';
import { cookies } from 'next/headers';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import MantineThemeProvider from 'providers/MantineProviders';
import QueryProviders from 'providers/Query.provider';

import type { ReactNode } from 'react';
import { cn } from 'utility/cn';
import { generateColors } from 'utility/colors';

const inter = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    style: ['normal', 'italic'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Shega Jobs',
    description:
        'Empowering Job Seekers and connecting them to the best of the best',
};

//bluish theme
const defaultTheme = '#004c4c';

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    const cookieValues = await cookies();
    const messages = await getMessages();
    const user = await getUserAction();

    const role = cookieValues.get('role')?.value as
        | 'administrator'
        | 'school_admin';

    const colorArray = generateColors(defaultTheme);
    const styles: Record<string, string> = {
        '--primary-color-default': defaultTheme,
        '--primary-radius': '8px',
        color: 'var(--mantine-color-text)',
    };

    colorArray.forEach((color, index) => {
        styles[`--primary-color-${index}`] = color;
    });

    return (
        <html
            lang="en"
            style={styles}
            className={cn(' w-full', inter.className)}
            suppressHydrationWarning={true}
        >
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <NuqsAdapter>
                    <NextIntlClientProvider messages={messages}>
                        <QueryProviders>
                            <MantineThemeProvider
                                color={defaultTheme}
                                radius={'8px'}
                            >
                                <AuthProvider
                                    user={user ? { ...user, role } : undefined}
                                >
                                    {/* <OnlineStatusHeader /> */}
                                    {children}
                                </AuthProvider>
                            </MantineThemeProvider>
                        </QueryProviders>
                    </NextIntlClientProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
