import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieValue = await cookies();
    const role = cookieValue.get('role')?.value;
    const locale = await getLocale();
    const pathname = '/teacher/dashboard';

    if (!role) {
        redirect({ href: '/auth/login', locale });
    }

    if (role === 'teacher' && pathname !== '/teacher/dashboard') {
        redirect({ href: '/teacher/dashboard', locale });
    }
    return <>{children}</>; // Ensure JSX is always returned
};

export default Layout;
