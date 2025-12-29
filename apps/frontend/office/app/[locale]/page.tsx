'use client';

import { useAuth } from '@shega/ui';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RoleEnum } from 'node_modules/@shega/shared/src/types/role';
import { useEffect } from 'react';

export default function HomePage() {
    const { user } = useAuth();
    const locale = useLocale();
    const router = useRouter();

    useEffect(() => {
        const _user = user?.user;
        if (_user?.roles?.length) {
            // Convert all roles to lowercase for case-insensitive comparison
            const roles = _user.roles.map((r) => r.role?.toLowerCase() ?? '');

            if (
                roles.includes('administrator') ||
                roles.includes('super_admin')
            ) {
                router.replace(`/${locale}/admin/dashboard`);
                return;
            }

            if (
                roles.includes(RoleEnum.school_admin) ||
                roles.includes(RoleEnum.program_admin)
            ) {
                router.replace(`/${locale}/school_admin/dashboard`);
                return;
            }

            if (roles.includes(RoleEnum.teacher)) {
                router.replace(`/${locale}/teacher/dashboard`);
                return;
            }
        } else if (!_user) {
            router.replace(`/${locale}/auth/login`);
        }
    }, [user, locale, router]);

    return null;
}
