import {
    Anchor,
    Badge,
    Button,
    Card,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconBuilding,
    IconCurrencyDollar,
    IconMapPin,
} from '@tabler/icons-react';

export const SimilarJobs = () => {
    return (
        <Card hidden={true}>
            <Stack gap="sm">
                <Title order={4}>Similar Jobs</Title>
                {[1, 2, 3].map((job) => (
                    <Stack
                        key={job}
                        gap={4}
                        pb="sm"
                        style={{
                            borderBottom: '1px solid #eee',
                        }}
                    >
                        <Anchor size="xs">
                            {job === 1
                                ? 'Frontend Developer' : 
                                  job === 2
                                  ? 'UI Engineer' : 
                                  'React Developer'}
                        </Anchor>
                        <Group gap="xs">
                            <IconBuilding size={14} color="gray" />
                            <Text size="xs" color="dimmed">
                                {job === 1
                                    ? 'WebSolutions Ltd.' :
                                      job === 2
                                      ? 'DesignHub Inc.'
                                      : 'AppWorks Co.'}
                            </Text>
                        </Group>
                        <Group gap="sm" wrap="wrap">
                            <Group gap={4}>
                                <IconMapPin size={14} color="gray" />
                                <Text size="xs" color="dimmed">
                                    {job === 1
                                        ? 'Remote' :
                                          job === 2
                                          ? 'New York, NY'
                                          : 'Austin, TX'}
                                </Text>
                            </Group>
                            <Group gap={4}>
                                <IconCurrencyDollar size={14} color="gray" />
                                <Text size="xs" color="dimmed">
                                    {job === 1
                                        ? '$90-120K' :
                                          job === 2
                                          ? '$100-130K'
                                          : '$110-140K'}
                                </Text>
                            </Group>
                        </Group>
                        <Badge variant="outline" size="xs">
                            90% match
                        </Badge>
                    </Stack>
                ))}
                <Button variant="outline" fullWidth size="xs" hidden>
                    View more jobs
                </Button>
            </Stack>
        </Card>
    );
};
