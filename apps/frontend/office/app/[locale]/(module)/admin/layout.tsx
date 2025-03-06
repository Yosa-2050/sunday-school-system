import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieValue = await cookies();
    const role = cookieValue.get('role')?.value;
    const locale = await getLocale();

    if (!role) {
        redirect({ href: '/auth/login', locale });
    }

    if (role === 'work_provider') {
        redirect({ href: '/work-provider/dashboard', locale });
    }

    return <>{children}</>; // Ensure hooks are not skipped
};

export default Layout;
