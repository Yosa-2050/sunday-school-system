import Shell from '@/components/Shell';
import { useRouter } from '@/i18n/routing';
import { cookies } from 'next/headers';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const cookieValue = await cookies();
    const router = useRouter();
    const role = cookieValue.get('role')?.value;

    if (!role) {
        router.push('/auth/login');
        return null;
    }
    return (
        <Shell role={role as 'administrator' | 'work_provider'}>
            {children}
        </Shell>
    );
};

export default Layout;
