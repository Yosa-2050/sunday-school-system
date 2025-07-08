'use client';

import {
    Button,
    Card,
    Divider,
    Flex,
    Group,
    LoadingOverlay,
    Stack,
    Text,
} from '@mantine/core';
import type { Daum } from 'app/[locale]/_api/organizations/fetch-organizations';
import { DateTime } from 'luxon';

interface OrganizationsMobileProps {
    organizations: Daum[];
    isLoading: boolean;
    onActivate: (user: { id: string; name: string }) => void;
    onDeactivate: (user: { id: string; name: string }) => void;
    t: (key: string) => string;
}

export const OrganizationsMobile = ({
    organizations,
    isLoading,
    onActivate,
    onDeactivate,
    t,
}: OrganizationsMobileProps) => {
    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                {organizations.map((user: Daum) => (
                    <Card
                        key={user.createdDate}
                        shadow="sm"
                        p="lg"
                        radius="md"
                        withBorder
                    >
                        <Flex justify="space-between" align="center">
                            <Text fw={500}>{user.name}</Text>
                        </Flex>
                        <Divider my="xs" />
                        <Text size="xs" c="dimmed">
                            {DateTime.fromISO(user.createdDate ?? '').toFormat(
                                'yyyy-MM-dd HH:mm:ss',
                            )}
                        </Text>
                        <Group mt="md">
                            <Button variant="light" size="xs">
                                {t('table.edit')}
                            </Button>
                            {user.isActive ? (
                                <Button
                                    variant="light"
                                    size="xs"
                                    color="red"
                                    onClick={() =>
                                        onDeactivate({
                                            id: user.id,
                                            name: user.name,
                                        })
                                    }
                                >
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    variant="light"
                                    size="xs"
                                    onClick={() =>
                                        onActivate({
                                            id: user.id,
                                            name: user.name,
                                        })
                                    }
                                >
                                    Activate
                                </Button>
                            )}
                        </Group>
                    </Card>
                ))}
            </Stack>
        </div>
    );
};
