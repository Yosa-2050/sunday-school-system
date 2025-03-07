import { redirect } from '@/i18n/routing';
import { useAuth } from '@shega/ui';
import { getCookie } from 'cookies-next';
import { useLocale } from 'next-intl';

interface UseIsAuthorizedProps {
    resourceRole: string;
    userRole: string;
}

const useIsAuthorized = ({ resourceRole, userRole }: UseIsAuthorizedProps) => {
    const { user } = useAuth();
    const locale = useLocale();

    // Determine user role from API or fallback to cookie
    const currentRole = user?.role || getCookie('role');
    const isAuthorized = currentRole === resourceRole;

    // Redirect logic inline (avoiding useEffect)
    if (!user) { return redirect({ href: '/login', locale }); }
    // if(!user?.organizationId && userRole === 'work_provider') { return redirect({ href: '/auth/login', locale }); }

    if (!isAuthorized) {
        const dashboardPaths: Record<string, string> = {
            administrator: '/admin/dashboard',
            work_provider: '/work-provider/dashboard',
        };

        return redirect({ href: dashboardPaths[userRole] || '/login', locale });
    }

    return { user, isAuthorized };
};

export default useIsAuthorized;
