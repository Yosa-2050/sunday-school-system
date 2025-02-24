'use client';

import { User } from '@shega/shared';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
    user?: User;
    setUser: (user: User) => void;
};

type AuthProviderProps = {
    user?: User;
    children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
