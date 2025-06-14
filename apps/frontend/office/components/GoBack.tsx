'use client';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function GoBack() {
    const t = useTranslations('ui');
    const router = useRouter();
    return (
        <Tooltip label={t('go-back')} withArrow>
            <ActionIcon variant="subtle" onClick={() => router.back()}>
                <IconArrowLeft stroke={1.5} />
            </ActionIcon>
        </Tooltip>
    );
}
