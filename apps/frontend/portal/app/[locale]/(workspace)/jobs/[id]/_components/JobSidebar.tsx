import { Box, Stack } from '@mantine/core';
import type { Job, Organization } from 'app/_api/jobs/fetch-job-id';
import { ApplicationProgress } from './ApplicationProgress';
import { ApplicationTips } from './ApplicationTips';
import { OrganizationDetails } from './OrganizationDetails';
import { SimilarJobs } from './SimilarJobs';

type JobDetailSideBarProps = {
    organization?: Organization;
    setActiveTab: (value: string) => void;
    job: Job;
};

export const JobDetailSideBar = ({
    organization,
    setActiveTab,
    job,
}: JobDetailSideBarProps) => {
    return (
        <Box
            w={{ base: '100%', md: 400 }}
            miw={{ base: '100%', md: 400 }}
            maw={{ base: '100%', md: 400 }}
            flex={1}
        >
            <Stack gap="lg">
                <ApplicationProgress setActiveTab={setActiveTab} job={job} />
                <OrganizationDetails organization={organization} />
                <SimilarJobs />
                <ApplicationTips />
            </Stack>
        </Box>
    );
};
