import { useCanApply } from '@/hooks/can-apply.hook';
import {
    Badge,
    Button,
    Card,
    Group,
    LoadingOverlay,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

type ApplicationProgressProps = {
    setActiveTab: (value: string) => void;
};

const CanApply = {
    cv: 'CV',
    coverLetter: 'Cover Letter',
    profilePic: 'Profile Picture',
    profile: 'Profile Information',
    education: 'Education',
    experiance: 'Experiance',
} as const;

export const ApplicationProgress = ({
    setActiveTab,
}: ApplicationProgressProps) => {
    const { canApply, isLoading } = useCanApply();
    if (isLoading) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }
    return (
        <Card>
            <Stack gap="sm">
                <Title order={4}>Application Progress</Title>
                <Stack gap="xs">
                    {Object.entries(canApply ?? {}).map(([key, value]) => {
                        if (CanApply?.[key as keyof typeof CanApply]) {
                            return (
                                <Group justify={'space-between'} key={key}>
                                    <Text size="xs">
                                        {CanApply?.[
                                            key as keyof typeof CanApply
                                        ] ?? ''}
                                    </Text>
                                    {value ? (
                                        <Badge
                                            color="green"
                                            variant="light"
                                            size="xs"
                                            leftSection={
                                                <IconCheck size={12} />
                                            }
                                        >
                                            Complete
                                        </Badge>
                                    ) : (
                                        <Badge
                                            color="orange"
                                            variant="light"
                                            size="xs"
                                        >
                                            Pending
                                        </Badge>
                                    )}
                                </Group>
                            );
                        }
                    })}
                </Stack>
                <Button
                    variant="outline"
                    fullWidth
                    size="xs"
                    onClick={() => setActiveTab('application')}
                    hidden
                >
                    Continue Application
                </Button>
            </Stack>
        </Card>
    );
};
