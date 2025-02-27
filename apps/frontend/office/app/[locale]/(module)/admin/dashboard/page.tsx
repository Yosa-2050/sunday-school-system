'use client';

import {
    Text,
    Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from 'api/get-users';
import { useTranslations } from 'next-intl';

export default function NavbarSection() {
    const [opened, { toggle }] = useDisclosure();
    const t = useTranslations();

    const { isLoading, data, isError } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    return (<>
        
                <Title order={1} mb="md">
                    {t('main.welcome')}
                </Title>
                <Text>{t('main.description')}</Text>
    </>
            
    );
}
