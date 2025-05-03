'use client';

import { AppHeader } from '@/components/AppHeader';
import { Footer } from '@/components/Footer';
import { Card, Container, Divider, Stack, Text, Title } from '@mantine/core';

export default function PrivacyPolicyPage() {
    return (
        <>
            <AppHeader />
            <Container size="xl" py="xl">
                <Card withBorder shadow="sm" radius="md">
                    <Stack gap="xl">
                        <Stack gap="xs">
                            <Title order={1} fw={700}>
                                Privacy Policy
                            </Title>
                            <Text size="sm" c="dimmed">
                                Last updated: {new Date().toLocaleDateString()}
                            </Text>
                        </Stack>

                        <Divider />

                        <Stack gap="xl">
                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    1. Information We Collect
                                </Title>
                                <Text>
                                    We collect information that you provide
                                    directly to us, including:
                                </Text>
                                <Stack gap="xs" pl="md">
                                    <Text component="li">
                                        Personal information (name, email, phone
                                        number)
                                    </Text>
                                    <Text component="li">
                                        Professional information (resume, work
                                        history, skills)
                                    </Text>
                                    <Text component="li">
                                        Application data (job preferences, cover
                                        letters)
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    2. How We Use Your Information
                                </Title>
                                <Text>
                                    We use the collected information to:
                                </Text>
                                <Stack gap="xs" pl="md">
                                    <Text component="li">
                                        Process and manage your job applications
                                    </Text>
                                    <Text component="li">
                                        Match you with relevant job
                                        opportunities
                                    </Text>
                                    <Text component="li">
                                        Improve our services and user experience
                                    </Text>
                                    <Text component="li">
                                        Communicate with you about your
                                        applications
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    3. Data Security
                                </Title>
                                <Text>
                                    We implement appropriate security measures
                                    to protect your personal information.
                                    However, no method of transmission over the
                                    internet is 100% secure.
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    4. Your Rights
                                </Title>
                                <Text>You have the right to:</Text>
                                <Stack gap="xs" pl="md">
                                    <Text component="li">
                                        Access your personal information
                                    </Text>
                                    <Text component="li">
                                        Correct inaccurate information
                                    </Text>
                                    <Text component="li">
                                        Request deletion of your data
                                    </Text>
                                    <Text component="li">
                                        Opt-out of communications
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    5. Contact Us
                                </Title>
                                <Text>
                                    If you have any questions about this Privacy
                                    Policy, please contact us at:
                                </Text>
                                <Text fw={500}>
                                    Email: privacy@shegajobs.com
                                </Text>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
            <Footer />
        </>
    );
}
