import { Text } from '@mantine/core'
import {getTranslations} from 'next-intl/server'


export default async function HomePage() {
    const t = await getTranslations()
  return (
    <main>
      <Text>{t("header.title")}</Text>
    </main>
  )
}

