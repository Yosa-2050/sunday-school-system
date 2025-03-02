'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Select } from '@mantine/core';
import { useTransition } from 'react';

type Locale = 'en' | 'am';

export default function LocaleSwitcherSelect() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();

    function onSelectChange(value: string | null) {
        if (!value) {
            return;
        }
        const nextLocale = value as Locale;

        startTransition(() => {
            router.replace({ pathname }, { locale: nextLocale });
        });
    }

    return (
        <Select
            data={[
                { value: 'en', label: 'En' },
                { value: 'am', label: 'አማ' },
            ]}
            onChange={onSelectChange}
            placeholder="Select language"
            style={{ width: 100 }}
            disabled={isPending}
        />
    );
}
