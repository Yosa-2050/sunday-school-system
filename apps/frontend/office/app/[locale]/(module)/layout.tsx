import Shell from '@/components/Shell';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { cookies } from 'next/headers';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieValue = await cookies();
    const locale = await getLocale();
    const role = cookieValue.get('role')?.value;

    if (!role) {
        redirect({ href: '/auth/login', locale });
    }
    return (
        <Shell role={role as 'administrator' | 'work_provider'}>
            {children}
        </Shell>
    );
};

export default Layout;
