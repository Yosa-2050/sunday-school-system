'use client';

import type { User } from '@shega/shared';
import { type ReactNode, createContext, useContext, useState } from 'react';

type AuthContextType = {
    user?: Partial<User>;
    setUser: (user?: Partial<User>) => void;
};

type AuthProviderProps = {
    user?: Partial<User>;
    children: ReactNode;
};

const defaultAuthContext: AuthContextType = {
    user: undefined,
    setUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({
    user: initialUser,
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<Partial<User> | undefined>(initialUser);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
};
