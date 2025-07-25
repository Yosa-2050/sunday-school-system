'use client';

import { useAuth } from '@shega/ui';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { user } = useAuth();
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        const _user = user?.user;

        if (_user) {
            // Check roles properly
            if (
                _user.roles.some((r) => r.role === 'administrator') ||
                _user.roles.some((r) => r.role === 'super_admin')
            ) {
                router.replace(`/${locale}/admin/dashboard`);
                return;
            }

            if (_user.roles.some((r) => r.role === 'work_provider')) {
                router.replace(`/${locale}/work-provider/jobs`);
                return;
            }
        } else {
            router.replace(`/${locale}/auth/login`);
        }
    }, [user, locale, router]);

    return null; // nothing to display while redirecting
}
