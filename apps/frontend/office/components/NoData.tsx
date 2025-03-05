import { Button, Center, Image, Stack, Text } from '@mantine/core';
import { IconMoodSad } from '@tabler/icons-react';

interface NoDataProps {
    title?: string;
    message?: string;
    actionText?: string;
    onActionClick?: () => void;
}

export default function NoData({
    title = 'No Data Available',
    message = 'There is nothing to display here.',
    actionText,
    onActionClick,
}: NoDataProps) {
    return (
        <Center style={{ height: '100%', width: '100%' }}>
            <Stack align="center" gap="md">
                <Image
                    src="/empty.svg" // Replace with an actual image or illustration
                    alt="No data"
                    width={150}
                    height={150}
                    style={{ opacity: 0.7 }}
                />
                <Text size="xl" fw={600} c="dimmed">
                    {title}
                </Text>
                <Text size="sm" c="gray.6">
                    {message}
                </Text>
                {actionText && onActionClick && (
                    <Button
                        onClick={onActionClick}
                        leftSection={<IconMoodSad size={18} />}
                    >
                        {actionText}
                    </Button>
                )}
            </Stack>
        </Center>
    );
}
