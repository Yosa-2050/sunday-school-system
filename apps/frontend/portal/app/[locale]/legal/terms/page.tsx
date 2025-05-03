'use client';

import { AppHeader } from '@/components/AppHeader';
import { Footer } from '@/components/Footer';
import { Card, Container, Divider, Stack, Text, Title } from '@mantine/core';

export default function TermsAndConditionsPage() {
    return (
        <>
            <AppHeader />
            <Container size="xl" py="xl">
                <Card withBorder shadow="sm" radius="md">
                    <Stack gap="xl">
                        <Stack gap="xs">
                            <Title order={1} fw={700}>
                                Terms and Conditions
                            </Title>
                            <Text size="sm" c="dimmed">
                                Last updated: {new Date().toLocaleDateString()}
                            </Text>
                        </Stack>

                        <Divider />

                        <Stack gap="xl">
                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    1. Acceptance of Terms
                                </Title>
                                <Text>
                                    By accessing and using ShegaJobs, you accept
                                    and agree to be bound by these Terms and
                                    Conditions. If you do not agree to these
                                    terms, please do not use our services.
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    2. User Responsibilities
                                </Title>
                                <Text>
                                    As a user of ShegaJobs, you agree to:
                                </Text>
                                <Stack gap="xs" pl="md">
                                    <Text component="li">
                                        Provide accurate and complete
                                        information
                                    </Text>
                                    <Text component="li">
                                        Maintain the confidentiality of your
                                        account
                                    </Text>
                                    <Text component="li">
                                        Use the platform for lawful purposes
                                        only
                                    </Text>
                                    <Text component="li">
                                        Not engage in any fraudulent activities
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    3. Job Applications
                                </Title>
                                <Text>
                                    When applying for jobs through our platform:
                                </Text>
                                <Stack gap="xs" pl="md">
                                    <Text component="li">
                                        You are responsible for the accuracy of
                                        your application
                                    </Text>
                                    <Text component="li">
                                        Employers may contact you directly
                                    </Text>
                                    <Text component="li">
                                        We do not guarantee job placement
                                    </Text>
                                    <Text component="li">
                                        Application decisions are made by
                                        employers
                                    </Text>
                                </Stack>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    4. Intellectual Property
                                </Title>
                                <Text>
                                    All content on ShegaJobs, including logos,
                                    text, and design elements, are protected by
                                    intellectual property laws and are the
                                    property of ShegaJobs.
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    5. Limitation of Liability
                                </Title>
                                <Text>
                                    ShegaJobs is not liable for any direct,
                                    indirect, or consequential damages resulting
                                    from the use of our platform or inability to
                                    use our services.
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    6. Changes to Terms
                                </Title>
                                <Text>
                                    We reserve the right to modify these terms
                                    at any time. Continued use of the platform
                                    after changes constitutes acceptance of the
                                    new terms.
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                <Title order={2} size="h3">
                                    7. Contact Information
                                </Title>
                                <Text>
                                    For any questions regarding these Terms and
                                    Conditions, please contact us at:
                                </Text>
                                <Text fw={500}>Email: legal@shegajobs.com</Text>
                            </Stack>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
            <Footer />
        </>
    );
}
