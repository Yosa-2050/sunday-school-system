import { Title,Text, Box, Card, Drawer, Grid } from '@mantine/core'
import { IconBriefcase, IconFilter } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { FilterSidebar } from './FilterSidebar'
import { useState } from 'react'
import type { Filter } from 'app/_api/jobs/fetch-jobs'

type JobHeaderProps = {
    total: number;
    filters: Filter;
    setFilters: (filters: Filter) => void;
    handleJobTypeChange:  (value: string) => void
    handleExperienceLevelChange: (value: string) => void;
    handleSearch: ((term: string | null) => void) & {
    flush: () => void;
    };
    handleApplyFilters: () => void
}

const JobHeader = ({total, filters, setFilters, handleJobTypeChange, handleExperienceLevelChange, handleSearch, handleApplyFilters}: JobHeaderProps) => {
  const t = useTranslations('jobListing');
  const [opened, setOpened] = useState(false);
  
  return (
     <Card
                                    className="flex items-center justify-between w-full py-0 shadow-lg"
                                    withBorder={false}
                                >
     <div className="flex items-center justify-between gap-3 w-full">
        <div className="bg-primary/10 p-2.5 rounded-lg flex items-center justify-center gap-1">
            <IconBriefcase
                size={25}
                className="text-primary"
            />
            <Title order={2} className=" text-xl">
                {t('jobListings')}
            </Title>
        </div>
        <div>
            <Text
                size="xs"
                c={'dimmed'}
                className="mt-0.5"
            >
                {total} {t('jobsFound')}
            </Text>
        </div>
    </div>
    <Box className="md:hidden">
                                        <Drawer
                                            opened={opened}
                                            onClose={() => setOpened(false)}
                                            title={t('filterJobs')}
                                            position="left"
                                            size="sm"
                                            padding="md"
                                        >
                                            <Grid.Col
                                                span={{ base: 12, md: 3 }}
                                                hiddenFrom="md"
                                            >
                                                <FilterSidebar
                                                    filters={filters}
                                                    setFilters={setFilters}
                                                    handleJobTypeChange={
                                                        handleJobTypeChange
                                                    }
                                                    handleExperienceLevelChange={
                                                        handleExperienceLevelChange
                                                    }
                                                    handleSearch={handleSearch}
                                                    handleApplyFilters={
                                                        handleApplyFilters
                                                    }
                                                />
                                            </Grid.Col>
                                        </Drawer>
                                        <IconFilter
                                            size={20}
                                            className="text-primary"
                                            onClick={() => setOpened(true)}
                                        />
                                    </Box>
                                    </Card>
  )
}

export default JobHeader