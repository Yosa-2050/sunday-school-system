import { AuthProvider } from '@shega/ui';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import MantineThemeProvider from 'providers/MantineProviders';
import QueryProviders from 'providers/Query.provider';
import type { PropsWithChildren } from 'react';
import { generateColors, lightenHexColor } from 'utility/colors';
import { getUserAction } from './_api/get-user-action';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Shega Jobs',
    description:
        'Impeding Job Seekers and connecting them to the best of the best',
};

//bluish theme
const defaultTheme = '#004c4c';

export default async function RootLayout({
    children,
}: Readonly<PropsWithChildren>) {
    const user = await getUserAction();

    const messages = await getMessages();

    const colorArray = generateColors(defaultTheme);
    const styles: Record<string, string> = {
        '--primary-color-default': defaultTheme,
        '--primary-radius': '8px',
        backgroundColor: lightenHexColor(defaultTheme, 98) || '#014d4e',
    };

    colorArray.forEach((color, index) => {
        styles[`--primary-color-${index}`] = color;
    });
    return (
        <html lang="en">
            <body className={inter.className} style={styles}>
                <NextIntlClientProvider messages={messages}>
                    <QueryProviders>
                        <MantineThemeProvider
                            color={defaultTheme}
                            radius={'8px'}
                        >
                            <AuthProvider user={user}>
                                <NuqsAdapter>{children}</NuqsAdapter>
                            </AuthProvider>
                        </MantineThemeProvider>
                    </QueryProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
