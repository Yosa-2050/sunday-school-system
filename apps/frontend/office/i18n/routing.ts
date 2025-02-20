import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';
import { locales } from './config';

export const routing = defineRouting({
    locales,
    defaultLocale: 'en',
    localePrefix: 'as-needed',
});

export const {
    Link,
    redirect: _redirect,
    usePathname,
    useRouter,
} = createNavigation(routing);

// Enable type narrowing after calling `redirect`
export const redirect: typeof _redirect = _redirect;
