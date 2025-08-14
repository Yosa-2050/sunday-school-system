import { Box, Card, Drawer, Flex, Grid, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconBriefcase, IconFilter } from '@tabler/icons-react';
import type { Filter } from 'app/_api/jobs/fetch-jobs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FilterSidebar } from './FilterSidebar';

type JobHeaderProps = {
    total: number;
    filters: Filter;
    setFilters: (filters: Filter) => void;
    handleJobTypeChange: (value: string) => void;
    handleExperienceLevelChange: (value: string) => void;
    handleSearch: ((term: string | null) => void) & { flush: () => void };
    handleApplyFilters: () => void;
};

const JobHeader = ({
    total,
    filters,
    setFilters,
    handleJobTypeChange,
    handleExperienceLevelChange,
    handleSearch,
    handleApplyFilters,
}: JobHeaderProps) => {
    const t = useTranslations('jobListing');
    const [opened, setOpened] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Card
            shadow="lg"
            padding={isMobile ? 'sm' : 'md'}
            withBorder={false}
            style={{ width: '100%' }}
        >
            <Flex
                direction={'row'}
                align={isMobile ? 'flex-start' : 'center'}
                justify="space-between"
                gap={isMobile ? 'sm' : 'md'}
            >
                {/* Title + job count */}
                <Flex
                    align="center"
                    justify={isMobile ? 'flex-start' : 'center'}
                    gap="sm"
                    wrap="wrap"
                    className="flex-col md:flex-row"
                >
                    <Flex
                        align="center"
                        gap="xs"
                        className="bg-primary/10 rounded-lg px-2 py-1"
                    >
                        <IconBriefcase
                            size={isMobile ? 20 : 25}
                            className="text-primary"
                        />
                        <Title order={isMobile ? 4 : 2}>
                            {t('jobListings')}
                        </Title>
                    </Flex>
                    <Text
                        size={isMobile ? 'xs' : 'sm'}
                        c="dimmed"
                        className="whitespace-nowrap"
                    >
                        {total} {t('jobsFound')}
                    </Text>
                </Flex>

                {/* Mobile filter button */}
                {isMobile && (
                    <Box>
                        <Drawer
                            opened={opened}
                            onClose={() => setOpened(false)}
                            title={t('filterJobs')}
                            position="right"
                            size="100%"
                            padding="md"
                            radius={0}
                        >
                            <Grid.Col span={12}>
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    handleJobTypeChange={handleJobTypeChange}
                                    handleExperienceLevelChange={
                                        handleExperienceLevelChange
                                    }
                                    handleSearch={handleSearch}
                                    handleApplyFilters={() => {
                                        handleApplyFilters();
                                        setOpened(false);
                                    }}
                                />
                            </Grid.Col>
                        </Drawer>
                        <IconFilter
                            size={22}
                            className="text-primary cursor-pointer"
                            onClick={() => setOpened(true)}
                        />
                    </Box>
                )}
            </Flex>
        </Card>
    );
};

export default JobHeader;
