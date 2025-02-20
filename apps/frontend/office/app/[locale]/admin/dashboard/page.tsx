'use client';

import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger, Group, ScrollArea, NavLink, Text, Title, rem } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconDashboard, IconSettings, IconUsers, IconBriefcase } from '@tabler/icons-react';

export default function NavbarSection() {
  const [opened, { toggle }] = useDisclosure();
  const t = useTranslations();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header h={60}>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={700}>
            {t('header.title')}
          </Text>
        </Group>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar p={0}>
        <AppShell.Section px="md" py="md" mt={"md"}>
          <Text size="lg" fw={600}>
            {t('navbar.header')}
          </Text>
        </AppShell.Section>

        <AppShell.Section grow component={ScrollArea} scrollbarSize={4} px="md">
          <NavLink
            label={t('navbar.dashboard')}
            leftSection={<IconDashboard size={18} />}
            color="primary"
            active
          />
          <NavLink label={t('navbar.jobListings')} leftSection={<IconBriefcase size={18} />} />
          <NavLink label={t('navbar.applicants')}leftSection={<IconUsers size={18} />} />
          <NavLink label={t('navbar.settings')}leftSection={<IconSettings size={18} />} />
        </AppShell.Section>

        <AppShell.Section px="md">
          <Text size="sm" c="dimmed">
            {t('navbar.footer')}
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main>
        <Title order={1} mb="md">
          {t('main.welcome')}
        </Title>
        <Text>{t('main.description')}</Text>
      </AppShell.Main>
    </AppShell>
  );
}
