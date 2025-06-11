import { Card, Tabs } from '@mantine/core';
import type { Job } from 'app/_api/jobs/fetch-job-id';
import { ApplicationOverview } from './JobApplicationOverview';
import { JobApplicationPanel } from './JobApplicationPanel';

type JObContentProps = {
    setApplicationProgress: (value: number) => void;
    setCvUrl: (value: string) => void;
    setActiveTab: (value: string) => void;
    activeTab: string;
    job: Job;
};

export const JobContent = ({
    job,
    setApplicationProgress,
    setCvUrl,
    setActiveTab,
    activeTab,
}: JObContentProps) => {
    return (
        <Card className="!w-full">
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value || 'overview')}
            >
                <Tabs.List>
                    <Tabs.Tab value="overview" size="xs">
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab value="application" size="xs">
                        Application
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    <ApplicationOverview job={job} />
                </Tabs.Panel>

                <Tabs.Panel value="application" pt="md">
                    <JobApplicationPanel
                        job={job}
                        setCvUrl={setCvUrl}
                        setApplicationProgress={setApplicationProgress}
                    />
                </Tabs.Panel>
            </Tabs>
        </Card>
    );
};
