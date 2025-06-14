'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { PageBody, PageContainer, PageTitle } from '@/components/PageContainer';
import { Card, Grid, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconDashboard } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchReportAdmin } from 'app/[locale]/_api/admin/fetch-count-totals';
import { type StatKeys, stats } from './const/stats.const';

export default function Dashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['report'],
        queryFn: fetchReportAdmin,
    });

    if (isLoading) {
        return <EntityPageLoading />;
    }
    return (
        <PageContainer>
            <Group
                justify="space-between"
                className="w-full border-b border-gray-200"
            >
                <PageTitle icon={<IconDashboard size={28} />}>
                    <Text>Dashboard</Text>
                </PageTitle>
            </Group>

            <PageBody>
                <Stack w="100%" align="stretch" justify="center">
                    <Grid mt="md">
                        {Object.entries(data ?? {}).map(([key, value]) => {
                            const stat = stats[key as StatKeys];
                            return (
                                <Grid.Col
                                    span={{ base: 12, md: 6, lg: 3 }}
                                    key={key}
                                >
                                    <StatisticCard
                                        title={stat.title}
                                        count={value}
                                        icon={stat.icon}
                                    />
                                </Grid.Col>
                            );
                        })}
                    </Grid>
                </Stack>
            </PageBody>
        </PageContainer>
    );
}

type StatisticCardProps = {
    title: string;
    count: number;
    icon: React.ReactNode;
};

const StatisticCard = ({ title, count, icon }: StatisticCardProps) => {
    return (
        <Card withBorder radius="md" p="md" shadow="sm">
            <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>
                    {title}
                </Text>
                <ThemeIcon variant="light" radius="xl" size="lg" color="blue">
                    {icon}
                </ThemeIcon>
            </Group>
            <Text size="xl" fw={700}>
                {count}
            </Text>
        </Card>
    );
};
