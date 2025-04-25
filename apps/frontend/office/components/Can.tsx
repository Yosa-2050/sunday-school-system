import { useAuth } from '@shega/ui';
import type React from 'react';

const Can = ({
    children,
    roles,
}: {
    children: React.ReactNode;
    roles: string[];
}) => {
    const { user } = useAuth();
    const hasRole = roles.includes(user?.role ?? '');
    return <>{hasRole && children}</>;
};

export default Can;
