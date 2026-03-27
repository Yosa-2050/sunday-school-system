import { Avatar, Badge, Grid, Group, Paper, Text, Title } from '@mantine/core';
import {
    IconBuildingSkyscraper,
    IconBuildingStore,
    IconCalendar,
    IconCheck,
    IconClock,
    IconUsers,
} from '@tabler/icons-react';
import { useDownloadProfilePicture } from 'app/[locale]/_api/profile';
import type { Organization } from 'model/Organization';
import { formatDate } from 'utilities/format-date';
import { getStatusColor } from 'utilities/get-status-color';

const OrganizationBasic = ({
    organizationData,
}: { organizationData: Organization }) => {
    const { data: profilePicture } = useDownloadProfilePicture(
        organizationData?.logo ?? '',
    );

    const avatarSrc = profilePicture
        ? typeof profilePicture === 'string'
            ? profilePicture
            : URL.createObjectURL(profilePicture)
        : undefined;

    return (
        <Paper p="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
                <Group>
                    <Avatar
                        src={avatarSrc}
                        size={60}
                        radius={8}
                        style={{ cursor: 'pointer' }}
                    />
                    <div>
                        <Title order={2}>{organizationData.displayName}</Title>
                        <Text size="sm" c="dimmed">
                            {organizationData.name} •{' '}
                            {organizationData.registrationNumber}
                        </Text>
                    </div>
                </Group>
                <Group>
                    <Badge
                        color={getStatusColor(organizationData.status)}
                        variant="light"
                        leftSection={<IconCheck size={12} />}
                    >
                        {organizationData.status}
                    </Badge>
                    <Badge
                        color={organizationData.isActive ? 'green' : 'red'}
                        variant="outline"
                    >
                        {organizationData.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </Group>
            </Group>

            <Text mb="md" c="dimmed">
                {organizationData.description}
            </Text>

            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs">
                        <IconBuildingStore size={16} />
                        <Text size="sm">
                            <strong>Type:</strong> {organizationData.type}
                        </Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs">
                        <IconCalendar size={16} />
                        <Text size="sm">
                            <strong>Founded:</strong>{' '}
                            {organizationData.yearFounded}
                        </Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs">
                        <IconUsers size={16} />
                        <Text size="sm">
                            <strong>Size:</strong>{' '}
                            {organizationData.companySize}
                        </Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Group gap="xs">
                        <IconClock size={16} />
                        <Text size="sm">
                            <strong>Submitted:</strong>{' '}
                            {formatDate(organizationData.createdAt)}
                        </Text>
                    </Group>
                </Grid.Col>
                {organizationData.industry && (
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconBuildingSkyscraper size={16} />
                            <Text size="sm">
                                <strong>Industry:</strong>{' '}
                                {organizationData.industry.value}
                            </Text>
                        </Group>
                    </Grid.Col>
                )}
            </Grid>
        </Paper>
    );
};

export { OrganizationBasic };
