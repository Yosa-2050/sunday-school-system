import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import type { Organization } from 'app/_api/jobs/fetch-job-id';

export const OrganizationDetails = ({
    organization,
}: { organization?: Organization }) => {
    if (!organization) {
        return null;
    }

    return (
        <Card withBorder padding="lg">
            <Stack gap="md">
                <Group gap="md" wrap="nowrap">
                    <Avatar
                        size={72}
                        radius="md"
                        src={organization.logo || '/placeholder.svg'}
                        alt={organization.name}
                    />
                    <Stack gap={2}>
                        <Title order={4}>{organization.name}</Title>
                        <Text size="sm" c="dimmed">
                            {organization.type} · {organization.companySize}
                        </Text>
                    </Stack>
                </Group>
                <Text size="xs" c="dimmed">
                    Founded in {organization.yearFounded} ·{' '}
                    {organization.corporateEmail}
                </Text>
            </Stack>
        </Card>
    );
};
