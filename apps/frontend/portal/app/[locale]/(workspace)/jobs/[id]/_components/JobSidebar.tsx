import { Box, Stack } from '@mantine/core';
import { ApplicationProgress } from './ApplicationProgress';
import { ApplicationTips } from './ApplicationTips';
import { OrganizationDetails } from './OrganizationDetails';
import { SimilarJobs } from './SimilarJobs';

type JobDetailSideBarProps = {
    organizationName: string;
    setActiveTab: (value: string) => void;
};

export const JobDetailSideBar = ({
    organizationName,
    setActiveTab,
}: JobDetailSideBarProps) => {
    return (
        <Box
            w={{ base: '100%', md: 400 }}
            miw={{ base: '100%', md: 400 }}
            maw={{ base: '100%', md: 400 }}
            flex={1}
        >
            <Stack gap="lg">
                <ApplicationProgress setActiveTab={setActiveTab} />
                <OrganizationDetails organizationName={organizationName} />
                <SimilarJobs />
                <ApplicationTips />
            </Stack>
        </Box>
    );
};
