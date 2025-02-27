'use client'

import type { JSX } from 'react'
import ForgetPassword from "./ForgetPassword";
import Login from './Login';
import ChangePassword from './ChangePassword';
import OTP from './OTP';

export function AuthWrapper({ path }: { path?: string[] }): JSX.Element {
  
    const render = () => {
        if (!Array.isArray(path) || path.length === 0) {
            return <></>;
        }

        if (path[0]?.startsWith('login')) {
            return <Login />;
        }
        if(path[0]?.startsWith('change-password')){
            return <ChangePassword />;
        }
        if(path[0]?.startsWith('forgot-password')){
            return <ForgetPassword />;
        }
        if(path[0]?.startsWith('otp')){
            return <OTP />;
        }
        if (path[0]?.startsWith('forgot-password')) {
            return <ForgetPassword />;
        }

        return <></>;
    };

    return render();
}

export default AuthWrapper;
