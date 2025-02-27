'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Select } from '@mantine/core';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

type Locale = 'en' | 'am';

export default function LocaleSwitcherSelect() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: string | null) {
    if (!value) { return; }
    const nextLocale = value as Locale;

    startTransition(() => {
      router.replace(
        { pathname, query: params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select
      data={[
        { value: 'en', label: 'English' },
        { value: 'am', label: 'አማርኛ' },
      ]}
      defaultValue={Array.isArray(params?.locale) ? params.locale[0] : (params?.locale || 'en')}
      onChange={onSelectChange}
      placeholder="Select language"
      size="xs"
      disabled={isPending}
    />
  );
}
