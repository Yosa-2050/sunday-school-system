'use client';

import { Flex, Grid, Stack, Text } from '@mantine/core';
import {
    IconBriefcase,
    IconSitemapFilled,
    IconUserFilled,
    IconUserPlus,
    IconUsersGroup,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchReportAdmin } from 'app/[locale]/_api/admin/fetch-count-totals';
import { useState } from 'react';
import ReportCard from './_components/charts/ReportCard';

export default function Dashboard() {
    const [value, setValue] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const { data, isLoading, error } = useQuery({
        queryKey: ['report'],
        queryFn: () => fetchReportAdmin(),
    });

    return (
        <Flex w="100%" direction="column" align="start" gap={30}>
            <Flex w="100%" align="center" justify="space-between">
                <Text fz={{ base: 18, md: 22, lg: 22 }} fw={600}>
                    Admin dashboard
                </Text>
                {/* <DatePickerInput
          type="range"
          size="xs"
          leftSection={<IconCalendar size={20} />}
          placeholder="Pick a date"
          value={value}
          classNames={{
            input: dateStyleClasses.date_input,
            placeholder: dateStyleClasses.date_input_placeholder,
          }}
          onChange={setValue}
        /> */}
            </Flex>
            <Stack w="100%" align="stretch" justify="center" p="md">
                <Grid gutter="md" justify="flex-start">
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                        <ReportCard
                            count={data?.totalRegisteredUsers ?? 0}
                            color={'green'}
                            title={'Total Users'}
                            Icon={IconUsersGroup}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                        <ReportCard
                            count={data?.totalPostedJobs ?? 0}
                            color={'gray'}
                            title={'Total Jobs'}
                            Icon={IconBriefcase}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                        <ReportCard
                            count={data?.totalRegisteredAdmin ?? 0}
                            color={'orange'}
                            title={'Total Admin'}
                            Icon={IconUserPlus}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                        <ReportCard
                            count={data?.totalRegisteredEmployer ?? 0}
                            color={'blue'}
                            title={'Total Employer'}
                            Icon={IconSitemapFilled}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6, sm: 4, md: 3 }}>
                        <ReportCard
                            count={data?.totalRegisteredJobSeekers ?? 0}
                            color={'purple'}
                            title={'Total Job Seeker'}
                            Icon={IconUserFilled}
                        />
                    </Grid.Col>
                </Grid>
            </Stack>

            <Stack w="100%" align="stretch" justify="center">
                <Grid columns={10} w="100%">
                    {/* <Grid.Col h={400} span={{ base: 10, md: 7, lg: 7 }}>
              <ReportSnapshot />
            </Grid.Col> */}

                    {/* <Grid.Col h={400} span={{ base: 10, md: 3, lg: 3 }}>
                        <UserChart />
                    </Grid.Col> */}

                    {/* <Grid.Col h={350} span={{ base: 10, md: 5, lg: 4 }}>
                        <StatsSection />
                    </Grid.Col>
                    <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
                        <ReturningUserChart />
                    </Grid.Col>

                    <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
                        <DeviceBreakdownChart />
                    </Grid.Col> */}
                </Grid>
            </Stack>
        </Flex>
    );
}
