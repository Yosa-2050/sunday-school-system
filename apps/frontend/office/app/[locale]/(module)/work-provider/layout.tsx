
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieValue = await cookies()
    const role = cookieValue.get('role')?.value;
    const locale = await getLocale();

    if (!role) {
        return redirect({ href: '/auth/login', locale });
    }

    if (role === 'administrator') {
        redirect({ href: '/admin/dashboard', locale });
    }

    return children;
};

export default Layout;
