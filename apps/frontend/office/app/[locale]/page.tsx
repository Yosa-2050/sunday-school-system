import { Text } from '@mantine/core';
import { fetchUsers } from 'api/get-users';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
    const t = await getTranslations();
    const users = await fetchUsers();
    return (
        <main>
            {JSON.stringify(users)}
            <Text>{t('header.title')}</Text>
        </main>
    );
}
