'use client';

import { AppHeader } from '@/components/AppHeader';
import { useRouter } from '@/i18n/routing';
import { Box } from '@mantine/core';
import { useAuth } from '@shega/ui';
import { useLocale } from 'next-intl';
import type React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const locale = useLocale();
    const router = useRouter();

    if (!user) {
        router.push('/auth/login');
    }
    return (
        <Box>
            <AppHeader />
            {children}
        </Box>
    );
};

export default Layout;
