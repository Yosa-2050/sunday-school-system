import { Card, Stack, Text, Title } from '@mantine/core';

export const ApplicationTips = () => {
    return (
        <Card hidden>
            <Stack gap="sm">
                <Title order={4}>Application Tips</Title>
                <Stack gap="xs">
                    <Text size="xs" fw={500}>
                        Highlight Relevant Skills
                    </Text>
                    <Text size="xs" color="dimmed">
                        Make sure your resume emphasizes your experience with
                        React, TypeScript, and front-end development.
                    </Text>
                </Stack>
                <Stack gap="xs">
                    <Text size="xs" fw={500}>
                        Personalize Your Application
                    </Text>
                    <Text size="xs" color="dimmed">
                        Add a cover letter explaining why you&pos;re a good fit
                        for TechCorp specifically.
                    </Text>
                </Stack>
                <Stack gap="xs">
                    <Text size="xs" fw={500}>
                        Follow Up
                    </Text>
                    <Text size="xs" color="dimmed">
                        If you don&pos;t hear back within 7 days, consider a
                        polite follow-up.
                    </Text>
                </Stack>
            </Stack>
        </Card>
    );
};
