'use client';

import { Flex, Grid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';
import DeviceBreakdownChart from './_components/charts/DeviceBreaddownChart';
import ReportSnapshot from './_components/charts/ReportSnapshot';
import ReturningUserChart from './_components/charts/ReturningUserChart';
import StatsSection from './_components/charts/StatsSection';
import UserChart from './_components/charts/UserChart';
import dateStyleClasses from './_components/styles/date.module.css';

export default function Dashboard() {
    const [value, setValue] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    return (
        <Flex w="100%" direction="column" align="start" gap={30}>
            <Flex w="100%" align="center" justify="space-between">
                <Text fz={{ base: 18, md: 22, lg: 22 }} fw={600}>
                    Admin dashboard
                </Text>
                <DatePickerInput
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
                />
            </Flex>

            <Stack w="100%" align="stretch" justify="center">
                <Grid columns={10} w="100%">
                    <Grid.Col h={400} span={{ base: 10, md: 7, lg: 7 }}>
                        <ReportSnapshot />
                    </Grid.Col>
                    <Grid.Col h={400} span={{ base: 10, md: 3, lg: 3 }}>
                        <UserChart />
                    </Grid.Col>

                    <Grid.Col h={350} span={{ base: 10, md: 5, lg: 4 }}>
                        <StatsSection />
                    </Grid.Col>
                    <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
                        <ReturningUserChart />
                    </Grid.Col>

                    <Grid.Col h={350} span={{ base: 10, md: 5, lg: 3 }}>
                        <DeviceBreakdownChart />
                    </Grid.Col>
                </Grid>
            </Stack>
        </Flex>
    );
}
