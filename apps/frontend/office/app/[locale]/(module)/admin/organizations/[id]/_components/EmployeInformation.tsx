import {
    Badge,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import type { Organization } from 'model/Organization';

const EmployeeInformation = ({
    organizationData,
}: { organizationData: Organization }) => {
    return (
        <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
            <Title order={4} mb="md">
                Employee Information
            </Title>
            {organizationData.__has_employee__ &&
            organizationData.__employee__.length > 0 ? (
                <Stack gap="sm">
                    {organizationData.__employee__.map((orgEmployee) => (
                        <Paper
                            key={orgEmployee.id}
                            p="sm"
                            withBorder
                            radius="sm"
                        >
                            <Group gap="xs" mb="xs">
                                <ThemeIcon
                                    size="sm"
                                    variant="light"
                                    radius="xl"
                                >
                                    <IconUser size={14} />
                                </ThemeIcon>
                                <Badge variant="outline" size="xs">
                                    {orgEmployee.type}
                                </Badge>
                            </Group>
                            <Stack gap="xs">
                                <Text size="sm" fw={500}>
                                    {orgEmployee.employee.profile.firstName}{' '}
                                    {orgEmployee.employee.profile.middleName}{' '}
                                    {orgEmployee.employee.profile.lastName}
                                </Text>
                                {orgEmployee.employee.profile.title && (
                                    <Text size="xs" c="dimmed">
                                        {orgEmployee.employee.profile.title}
                                    </Text>
                                )}
                                {orgEmployee.employee.profile.phoneNumber && (
                                    <Text size="xs">
                                        <strong>Phone:</strong>{' '}
                                        {
                                            orgEmployee.employee.profile
                                                .phoneNumber
                                        }
                                    </Text>
                                )}
                                {orgEmployee.employee.id_number && (
                                    <Text size="xs">
                                        <strong>ID:</strong>{' '}
                                        {orgEmployee.employee.id_number}
                                    </Text>
                                )}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                    No employee information available
                </Text>
            )}
        </Paper>
    );
};

export { EmployeeInformation };
