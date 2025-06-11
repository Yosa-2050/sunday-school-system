'use client';

import { Footer } from '@/components/Footer';
import {
    Anchor,
    Badge,
    Box,
    Divider,
    Group,
    List,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconCalendar, IconMail, IconShield } from '@tabler/icons-react';

export default function PrivacyPolicy() {
    return (
        <>
            <Box className="container mx-auto mt-8">
                <Paper shadow="sm" p="xl" radius="md">
                    <Stack gap="xl">
                        {/* Header */}
                        <Box>
                            <Group
                                justify="space-between"
                                align="flex-start"
                                mb="md"
                            >
                                <Title order={1} size="h2" c="primary.7">
                                    Shega Jobs Privacy Policy
                                </Title>
                                <Badge
                                    color="primary"
                                    variant="light"
                                    size="lg"
                                >
                                    <Group gap={4}>
                                        <IconCalendar size={14} />
                                        <Text size="sm">
                                            Effective: 01/01/2025
                                        </Text>
                                    </Group>
                                </Badge>
                            </Group>
                            <Text c="dimmed" size="sm">
                                Last Updated: [Insert Date]
                            </Text>
                        </Box>

                        <Divider />

                        {/* Introduction */}
                        <Stack gap="md">
                            <Group gap="sm">
                                <IconShield
                                    size={20}
                                    color="var(--mantine-color-primary-7)"
                                />
                                <Text fw={500}>
                                    Our Commitment to Your Privacy
                                </Text>
                            </Group>
                            <Text>
                                At Shega Jobs, we are committed to protecting
                                your privacy. This Privacy Policy explains how
                                we collect, use, disclose, and safeguard your
                                information when you use our platform, whether
                                as a job seeker, an employer, mentee or Mentor.
                                By accessing or using Shega Jobs, you consent to
                                the practices described in this policy.
                            </Text>
                        </Stack>

                        {/* Section 1 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                1. Information We Collect
                            </Title>
                            <Text>
                                We collect the following types of information:
                            </Text>

                            <Stack gap="md">
                                <Box>
                                    <Title
                                        order={3}
                                        size="h4"
                                        c="primary.6"
                                        mb="sm"
                                    >
                                        A. Personal Information
                                    </Title>
                                    <List spacing="sm" size="sm">
                                        <List.Item>
                                            <Text component="span" fw={600}>
                                                For Candidates/mentee:
                                            </Text>{' '}
                                            Name, email address, phone number,
                                            resume/CV, work history, education,
                                            skills, profile photo, and job
                                            preferences.
                                        </List.Item>
                                        <List.Item>
                                            <Text component="span" fw={600}>
                                                For Employers/mentor:
                                            </Text>{' '}
                                            Company name, contact details, job
                                            postings, and payment information.
                                        </List.Item>
                                    </List>
                                </Box>

                                <Box>
                                    <Title
                                        order={3}
                                        size="h4"
                                        c="primary.6"
                                        mb="sm"
                                    >
                                        B. Usage Data
                                    </Title>
                                    <List spacing="sm" size="sm">
                                        <List.Item>
                                            IP address, browser type, device
                                            information, pages visited, and
                                            interactions with the platform.
                                        </List.Item>
                                        <List.Item>
                                            Cookies and tracking technologies.
                                        </List.Item>
                                    </List>
                                </Box>
                            </Stack>
                        </Stack>

                        {/* Section 2 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                2. How We Use Your Information
                            </Title>
                            <Text>
                                We use your data for the following purposes:
                            </Text>

                            <List spacing="sm" size="sm">
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        To Provide Services:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Match Candidates with job
                                            opportunities/mentorship programs.
                                        </List.Item>
                                        <List.Item>
                                            Help Employers/mentors find
                                            qualified applicants.
                                        </List.Item>
                                        <List.Item>
                                            Enable features like &quot;Easy
                                            Apply&quot; and interview
                                            scheduling.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        To Improve Our Platform:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Analyze usage trends to enhance
                                            functionality.
                                        </List.Item>
                                        <List.Item>
                                            Personalize job recommendations for
                                            Candidates.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        For Communication:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Send job alerts, application
                                            updates, and promotional offers (you
                                            can opt out).
                                        </List.Item>
                                        <List.Item>
                                            Respond to inquiries and provide
                                            customer support.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        For Security & Compliance:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Detect and prevent fraud, spam, or
                                            misuse.
                                        </List.Item>
                                        <List.Item>
                                            Comply with legal obligations.
                                        </List.Item>
                                    </List>
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 3 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                3. How We Share Your Information
                            </Title>
                            <Text>
                                We may share your data in the following ways:
                            </Text>

                            <List spacing="sm" size="sm">
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        With Employers/mentors:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Candidate profiles and applications
                                            are visible to Employers for
                                            recruitment purposes.
                                        </List.Item>
                                        <List.Item>
                                            Employers must use this data only
                                            for hiring-related activities.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        With Service Providers:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Trusted third parties who assist in
                                            platform operations.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        For Legal Reasons:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            If required by law.
                                        </List.Item>
                                        <List.Item>
                                            To protect our rights, safety, or
                                            the safety of others.
                                        </List.Item>
                                    </List>
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 4 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                4. Your Privacy Choices
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        Profile Visibility:
                                    </Text>{' '}
                                    Candidates can enable &quot;Private
                                    Mode&quot; to restrict profile access.
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        Opt-Out of Marketing:
                                    </Text>{' '}
                                    Unsubscribe from promotional emails via the
                                    link in each message.
                                </List.Item>
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        Access & Deletion:
                                    </Text>{' '}
                                    Request to view, update, or delete your data
                                    by contacting{' '}
                                    <Anchor
                                        href="mailto:support@shegajobs.com"
                                        c="primary.7"
                                    >
                                        support@shegajobs.com
                                    </Anchor>
                                    .
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 5 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                5. Cookies & Tracking Technologies
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>
                                    <Text component="span" fw={600}>
                                        We use cookies to:
                                    </Text>
                                    <List spacing="xs" size="sm" mt="xs">
                                        <List.Item>
                                            Remember login sessions.
                                        </List.Item>
                                        <List.Item>
                                            Analyze traffic and improve user
                                            experience.
                                        </List.Item>
                                    </List>
                                </List.Item>
                                <List.Item>
                                    You can disable cookies in browser settings,
                                    but some features may not work.
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 6 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                6. Data Security
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>
                                    We use SSL encryption, firewalls, and access
                                    controls to protect your data.
                                </List.Item>
                                <List.Item>
                                    No system is 100% secure, so we cannot
                                    guarantee absolute security.
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 7 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                7. Children&quot;s Privacy
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>
                                    Shega Jobs is not intended for users under
                                    18. We do not knowingly collect their data.
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 8 */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                8. Changes to This Policy
                            </Title>
                            <List spacing="sm" size="sm">
                                <List.Item>
                                    We may update this policy and will notify
                                    users of significant changes.
                                </List.Item>
                            </List>
                        </Stack>

                        {/* Section 10 - Contact Us */}
                        <Stack gap="md">
                            <Title order={2} size="h3" c="primary.7">
                                10. Contact Us
                            </Title>
                            <Text>
                                For questions or requests regarding your
                                privacy, email:{' '}
                                <Anchor
                                    href="mailto:support@shegajobs.com"
                                    c="primary.7"
                                >
                                    support@shegajobs.com
                                </Anchor>
                                .
                            </Text>
                        </Stack>

                        <Divider />

                        {/* Contact Information */}
                        <Paper p="md" radius="md">
                            <Title order={3} size="h4" c="primary.7" mb="sm">
                                Privacy Questions?
                            </Title>
                            <Text>
                                For questions or requests regarding your
                                privacy, please contact us:
                            </Text>
                            <Group mt="sm">
                                <IconMail size={16} />
                                <Anchor
                                    href="mailto:support@shegajobs.com"
                                    c="primary.7"
                                >
                                    support@shegajobs.com
                                </Anchor>
                            </Group>
                        </Paper>

                        {/* Footer */}
                        <Text size="sm" c="dimmed" ta="center">
                            By using Shega Jobs, you agree to this Privacy
                            Policy.
                        </Text>
                    </Stack>
                </Paper>
            </Box>
            <Footer />
        </>
    );
}
