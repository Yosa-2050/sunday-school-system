'use client'

import type { User } from '@shega/shared';
import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextType = {
    user?: User;
    setUser: (user?: User) => void;
};

type AuthProviderProps = {
    user?: User;
    children: ReactNode;
};

const defaultAuthContext: AuthContextType = {
    user: undefined,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
    setUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ user, children }: AuthProviderProps) {
    const [userInfo, setUserInfo] = useState<User | undefined>(user);

    return (
        <AuthContext.Provider value={{ user: userInfo, setUser: setUserInfo }}>
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
