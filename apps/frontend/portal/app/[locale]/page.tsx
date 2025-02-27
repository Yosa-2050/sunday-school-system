import { Text } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
    const t = await getTranslations();
    return (
        <main className='bg-red-500 pt-20'>
            <Text className='bg-green-800'>{t('header.title')}</Text>
        </main>
    );
}
