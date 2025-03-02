'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Button, Menu } from '@mantine/core';
import { useState, useTransition } from 'react';

type Locale = 'en' | 'am';

const localeLabels: Record<Locale, string> = {
    en: 'En',
    am: 'አማ',
};

export default function LocaleSwitcherMenu() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const [selectedLocale, setSelectedLocale] = useState<Locale>('en');

    function onSelectChange(value: Locale) {
        setSelectedLocale(value);
        startTransition(() => {
            router.replace({ pathname }, { locale: value });
        });
    }

    return (
        <Menu disabled={isPending}>
            <Menu.Target>
                <Button variant="light" className="rounded-full">
                    {localeLabels[selectedLocale]}
                </Button>
            </Menu.Target>
            <Menu.Dropdown>
                {(['en', 'am'] as Locale[]).map((locale) => (
                    <Menu.Item
                        key={locale}
                        onClick={() => onSelectChange(locale)}
                    >
                        {localeLabels[locale]}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}
