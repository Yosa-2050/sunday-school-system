import {
    Avatar,
    Button,
    Card,
    Divider,
    Group,
    Rating,
    Stack,
    Text,
    Title,
} from '@mantine/core';

export const OrganizationDetails = ({
    organizationName,
}: { organizationName: string }) => {
    return (
        <Card>
            <Stack gap="sm">
                <Title order={4}>Organization Details</Title>
                <Group gap="md" wrap="nowrap">
                    <Avatar
                        radius="md"
                        src="/placeholder.svg"
                        alt="Company Logo"
                    />
                    <Stack gap={0}>
                        <Title order={4}>{organizationName}</Title>
                        <Text size="xs" color="dimmed">
                            Technology · 500-1000 employees · Founded 2010
                        </Text>
                        <Group gap="xs" mt={4}>
                            <Rating
                                value={4.5}
                                fractions={2}
                                readOnly
                                size="xs"
                            />
                            <Text size="xs" color="dimmed">
                                4.5 (126 reviews)
                            </Text>
                        </Group>
                    </Stack>
                </Group>

                <Divider my="sm" />

                <Button variant="outline" fullWidth size="xs" hidden>
                    View company profile
                </Button>
            </Stack>
        </Card>
    );
};
