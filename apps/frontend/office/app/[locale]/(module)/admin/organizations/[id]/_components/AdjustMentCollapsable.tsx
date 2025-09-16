import {
    Badge,
    Button,
    Collapse,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import type { Organization } from 'model/Organization';
import type { JSX } from 'react';
import { formatDate } from 'utilities/format-date';

const AdjustmentCollapsable = ({
    organizationData,
}: { organizationData: Organization }) => {
    return (
        <>
            {organizationData.status === 'RETURNED' &&
                organizationData.notes &&
                organizationData.notes.length > 0 && (
                    <EntityCollapse title={'Adjustment History'}>
                        <Stack gap="md">
                            {organizationData.notes
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime(),
                                )
                                .map((note, index) => (
                                    <Paper
                                        key={note.id}
                                        p="md"
                                        withBorder
                                        radius="sm"
                                        shadow="none"
                                    >
                                        <Group justify="space-between" mb="xs">
                                            <Badge
                                                color="orange"
                                                variant="light"
                                                size="sm"
                                            >
                                                Adjustment #
                                                {organizationData.notes.length -
                                                    index}
                                            </Badge>
                                            <Text size="xs" c="dimmed">
                                                {formatDate(note.createdAt)}
                                            </Text>
                                        </Group>
                                        <Text size="sm" mb="xs" fw={500}>
                                            {note.type}
                                        </Text>
                                        <Text size="sm" mb="xs">
                                            {note.note}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Requested by: {note.createdBy}
                                        </Text>
                                    </Paper>
                                ))}
                        </Stack>
                    </EntityCollapse>
                )}
        </>
    );
};

export { AdjustmentCollapsable };

type EntityCollapseProps = {
    children: JSX.Element;
    icon?: JSX.Element;
    title: string | JSX.Element;
};

const EntityCollapse = ({
    children,
    icon = <IconAlertCircle size={20} />,
    title,
}: EntityCollapseProps) => {
    const [collapsed, { toggle }] = useDisclosure(false);
    return (
        <Paper shadow="sm" p={'xs'} radius="md" withBorder>
            <Group align="center" justify="space-between">
                <Group>
                    <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color="orange"
                    >
                        {icon}
                    </ThemeIcon>
                    <Title order={3} c="orange.8">
                        {title}
                    </Title>
                </Group>
                <Button onClick={toggle}>
                    {collapsed ? 'Collapse' : 'Expand'}
                </Button>
            </Group>
            <Collapse in={collapsed} mt={'md'}>
                {children}
            </Collapse>
        </Paper>
    );
};

export { EntityCollapse };
