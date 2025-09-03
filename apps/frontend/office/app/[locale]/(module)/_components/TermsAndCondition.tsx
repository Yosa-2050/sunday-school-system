'use client';

import {
    Anchor,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Group,
    List,
    Paper,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { IconCalendar, IconMail } from '@tabler/icons-react';

export function TermsAndConditions({
    updateTerms,
    close,
}: { updateTerms?: (value: boolean) => void; close?: () => void }) {
    return (
        <Box className="container mx-auto mt-8">
            <Paper shadow="sm" p={{ base: 'sm', md: 'md' }} radius="md">
                <Stack gap="xl">
                    {/* Header */}
                    <Box>
                        <Group
                            justify="space-between"
                            align="flex-start"
                            mb="md"
                        >
                            <Title order={1} size="h2" fw={600}>
                                Herani Sunday School Management System Terms and
                                Conditions
                            </Title>
                            <Badge color="primary" variant="light" size="lg">
                                <Group gap={4}>
                                    <IconCalendar size={14} />
                                    <Text size="sm">Effective: 01/01/2025</Text>
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
                        <Text>
                            Welcome to Herani Sunday School Management System!
                            These Terms and Conditions govern your use of our
                            platform, whether as a job seeker, an employer,
                            mentee or mentor. By accessing or using Herani
                            Sunday School Management System, you agree to comply
                            with these Terms.
                        </Text>
                    </Stack>

                    {/* Section 1 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            1. Account Registration and Management
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Eligibility:
                                </Text>{' '}
                                You must be at least 18 years old or the legal
                                age of majority to register.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Accuracy:
                                </Text>{' '}
                                You agree to provide accurate, current, and
                                complete information during registration and to
                                update such information as necessary.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Security:
                                </Text>{' '}
                                You are responsible for maintaining the
                                confidentiality of your login credentials and
                                for all activities under your account. Notify us
                                immediately at{' '}
                                <Anchor
                                    href="mailto:support@shegajobs.com"
                                    fw={600}
                                >
                                    support@shegajobs.com
                                </Anchor>{' '}
                                of any unauthorized use.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Termination:
                                </Text>{' '}
                                Herani Sunday School Management System reserves
                                the right to suspend or terminate accounts for
                                violations of these Terms or any fraudulent,
                                abusive, or illegal activity.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 2 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            2. Job Seekers (or Mentee)
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Profile Integrity:
                                </Text>{' '}
                                Your profile must truthfully represent your
                                qualifications, experience, and skills.
                                Misrepresentation may result in account
                                termination.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Applications:
                                </Text>{' '}
                                Applying for jobs does not guarantee employment.
                                Employers are solely responsible for hiring
                                decisions, and Herani Sunday School Management
                                System is not liable for any employment
                                outcomes.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Private Mode:
                                </Text>{' '}
                                Enabling &quot;Private Mode&quot; allows you to
                                restrict profile visibility to selected
                                employers. However, some features may be limited
                                in this mode.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 3 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            3. Employers (or Mentor)
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Job Postings:
                                </Text>
                                <List spacing="xs" size="sm" mt="xs" pl={20}>
                                    <List.Item>
                                        Free job postings are subject to time
                                        limits and may be removed after
                                        expiration. Premium features require
                                        payment and are subject to additional
                                        terms.
                                    </List.Item>
                                    <List.Item>
                                        All postings must comply with applicable
                                        laws, including non-discrimination and
                                        labor regulations. Herani Sunday School
                                        Management System may remove postings
                                        that violate these standards.
                                    </List.Item>
                                </List>
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Candidate Data:
                                </Text>{' '}
                                Information provided by candidates (e.g.,
                                resumes, contact details) may only be used for
                                legitimate recruitment purposes. Unauthorized
                                sharing, selling, or misuse of candidate data is
                                strictly prohibited.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Screening Tools:
                                </Text>{' '}
                                Employers may use pre-screening questions or
                                assessments but must adhere to fair hiring
                                practices and applicable laws.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 4 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            4. Privacy and Data Security
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Data Protection:
                                </Text>{' '}
                                Herani Sunday School Management System employs
                                SSL encryption and other security measures to
                                protect your data.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    CV Privacy:
                                </Text>{' '}
                                Candidates can set their CVs to
                                &quot;Private&quot; to control visibility.
                                Employers accessing candidate data must handle
                                it confidentially and lawfully.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Reporting Violations:
                                </Text>{' '}
                                Report fake job postings, scams, or suspicious
                                activity to{' '}
                                <Anchor
                                    href="mailto:support@shegajobs.com"
                                    fw={600}
                                >
                                    support@shegajobs.com
                                </Anchor>
                                . Herani Sunday School Management System will
                                investigate and take appropriate action.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 5 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            5. Intellectual Property
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Ownership:
                                </Text>{' '}
                                All content, trademarks, logos, and materials on
                                Herani Sunday School Management System are owned
                                by or licensed to us. Unauthorized use,
                                reproduction, or distribution is prohibited.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    User Content:
                                </Text>{' '}
                                By posting job listings, resumes, or other
                                content, you grant Herani Sunday School
                                Management System a non-exclusive, worldwide
                                license to display and distribute such content
                                for platform purposes.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 6 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            6. Disclaimers and Limitations
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    No Warranty:
                                </Text>{' '}
                                Herani Sunday School Management System is
                                provided &quot;as is&quot; without warranties of
                                any kind. We do not guarantee job placements,
                                uninterrupted service, or accuracy of job
                                postings.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Liability:
                                </Text>{' '}
                                To the fullest extent permitted by law, Shega
                                Jobs is not liable for any direct, indirect, or
                                consequential damages arising from platform use,
                                including but not limited to:
                                <List spacing="xs" size="sm" mt="xs" pl={20}>
                                    <List.Item>
                                        Employer hiring practices or decisions.
                                    </List.Item>
                                    <List.Item>
                                        Technical issues, downtime, or data
                                        loss.
                                    </List.Item>
                                    <List.Item>
                                        Misuse of candidate or employer
                                        information by third parties.
                                    </List.Item>
                                </List>
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 7 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            7. Modifications
                        </Title>
                        <Text>
                            Herani Sunday School Management System may update
                            these Terms at any time. We will notify users of
                            significant changes via email or platform
                            notifications. Continued use after changes
                            constitutes acceptance.
                        </Text>
                    </Stack>

                    {/* Section 8 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            8. Governing Law and Dispute Resolution
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                These Terms are governed by the laws of FDRE.
                            </List.Item>
                            <List.Item>
                                Disputes will be resolved through binding
                                arbitration in Ethiopia, waiving the right to
                                class actions or jury trials.
                            </List.Item>
                        </List>
                    </Stack>

                    {/* Section 9 */}
                    <Stack gap="md">
                        <Title order={2} size="h3" fw={600}>
                            9. Miscellaneous
                        </Title>
                        <List spacing="sm" size="sm" pl={20}>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Entire Agreement:
                                </Text>{' '}
                                These Terms constitute the entire agreement
                                between you and Herani Sunday School Management
                                System.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Severability:
                                </Text>{' '}
                                If any provision is deemed invalid, the
                                remaining Terms remain enforceable.
                            </List.Item>
                            <List.Item>
                                <Text component="span" fw={600}>
                                    Contact:
                                </Text>{' '}
                                For questions or concerns, email{' '}
                                <Anchor
                                    href="mailto:support@shegajobs.com"
                                    fw={600}
                                >
                                    support@shegajobs.com
                                </Anchor>
                                .
                            </List.Item>
                        </List>
                    </Stack>

                    <Divider />

                    {/* Contact Information */}
                    <Paper p="md" radius="md">
                        <Title order={3} size="h4" fw={600} mb="sm">
                            Contact Information
                        </Title>
                        <Text>
                            For questions about these Terms and Conditions,
                            please contact us:
                        </Text>
                        <Group mt="sm">
                            <IconMail size={16} />
                            <Anchor
                                href="mailto:support@shegajobs.com"
                                fw={600}
                            >
                                support@shegajobs.com
                            </Anchor>
                        </Group>
                    </Paper>

                    {/* Footer */}
                    <Text size="sm" c="dimmed" ta="center">
                        By using Herani Sunday School Management System, you
                        acknowledge that you have read, understood, and agreed
                        to these Terms and Conditions.
                    </Text>

                    {updateTerms && close && (
                        <Flex
                            align="center"
                            justify="flex-end"
                            mt="xl"
                            wrap="wrap"
                            gap={'md'}
                        >
                            <Button onClick={close} bg={'red.4'}>
                                Decline
                            </Button>
                            <Button
                                onClick={() => {
                                    updateTerms(true);
                                    close();
                                }}
                            >
                                Accept
                            </Button>
                        </Flex>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
}
