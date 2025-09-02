'use client';

import {
    Badge,
    Box,
    Grid,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { IconPhone, IconUser } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchRelationshipsApi } from '../schemas/api';
import type { RelationShipsResponse } from '../schemas/type';

interface RelationshipListProps {
    profileId: string;
    title?: string;
    emptyMessage?: string;
}

export function RelationshipList({
    profileId,
    title = 'Emergency Contacts & Relationships',
    emptyMessage = 'No emergency contacts found',
}: RelationshipListProps) {
    const {
        data: relationships,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['student-relationships', profileId],
        queryFn: () => fetchRelationshipsApi(profileId),
        enabled: !!profileId,
    });

    if (isLoading) {
        return (
            <Box style={{ textAlign: 'center' }} py="md">
                <Loader size="sm" />
                <Text size="sm" c="dimmed" mt="sm">
                    Loading relationships...
                </Text>
            </Box>
        );
    }

    if (error) {
        return (
            <Box style={{ textAlign: 'center' }} py="md">
                <Text size="sm" c="red">
                    Failed to load relationships
                </Text>
            </Box>
        );
    }

    if (!relationships || relationships.length === 0) {
        return (
            <Box style={{ textAlign: 'center' }} py="md">
                <Text size="sm" c="dimmed">
                    {emptyMessage}
                </Text>
            </Box>
        );
    }

    return (
        <Box>
            {title && (
                <Title order={4} mb="md">
                    {title}
                </Title>
            )}
            <Grid>
                {relationships.map((relationship) => (
                    <Grid.Col key={relationship.id} span={{ base: 12, md: 6 }}>
                        <RelationshipCard relationship={relationship} />
                    </Grid.Col>
                ))}
            </Grid>
        </Box>
    );
}

// Individual Relationship Card Component
export function RelationshipCard({
    relationship,
}: { relationship: RelationShipsResponse }) {
    const fullName = [
        relationship.firstName,
        relationship.middleName,
        relationship.lastName,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Paper p="md" withBorder radius="sm" h="100%">
            <Stack gap="xs">
                {/* Name and Baptist Name */}
                <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="sm" style={{ lineHeight: 1.2 }}>
                        {fullName}
                    </Text>
                    {relationship.baptistName && (
                        <Badge color="blue" variant="light" size="sm">
                            {relationship.baptistName}
                        </Badge>
                    )}
                </Group>

                {/* Phone Number */}
                {relationship.phoneNumber && (
                    <Group gap="xs">
                        <ThemeIcon variant="light" color="cyan" size="sm">
                            <IconPhone size={14} />
                        </ThemeIcon>
                        <Text size="sm">{relationship.phoneNumber}</Text>
                    </Group>
                )}

                {/* Relationship Type */}
                {relationship.type && (
                    <Group gap="xs">
                        <ThemeIcon variant="light" color="violet" size="sm">
                            <IconUser size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                            {relationship.type}
                        </Text>
                    </Group>
                )}

                {/* Email
                {relationship.email && (
                    <Group gap="xs">
                        <ThemeIcon variant="light" color="green" size="sm">
                            <IconPhone size={14} />
                        </ThemeIcon>
                        <Text size="sm">{relationship.email}</Text>
                    </Group>
                )} */}

                {/* Address
                {relationship.address && (
                    <Group gap="xs" align="flex-start">
                        <ThemeIcon variant="light" color="orange" size="sm" mt={2}>
                            <IconUser size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.2 }}>
                            {relationship.address}
                        </Text>
                    </Group>
                )} */}
            </Stack>
        </Paper>
    );
}
