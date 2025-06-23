// 'use client';

// import { EntityPageLoading } from '@/components/EntityPageLoading';
// import { useQuery } from '@tanstack/react-query';
// import { applicantDetails } from 'app/[locale]/_api/job-seeker';
// import { useParams } from 'next/navigation';

// const Page = () => {
// const { id } = useParams<{ id: string }>();
// const { data, isLoading } = useQuery({
//     queryKey: ['applicants', id],
//     queryFn: () => applicantDetails(id),
// });
//     if (isLoading) {
//         return <EntityPageLoading />;
//     }
//     return <div>Page {JSON.stringify(data)}</div>;
// };

// export default Page;

'use client';

import type React from 'react';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Card,
    Divider,
    Flex,
    Grid,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    IconAlertCircle,
    IconCalendar,
    IconCheck,
    IconMail,
    IconPhone,
    IconShield,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
    applicantDetails,
    useDownloadProfilePicture,
} from 'app/[locale]/_api/job-seeker';
import { useParams } from 'next/navigation';

// Type definitions

// Utility functions
const formatDate = (dateString?: string) => {
    if (!dateString) {
        return 'Not provided';
    }
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return 'Invalid date';
    }
};

const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}` || 'NA';
};

const formatGender = (gender?: string) => {
    if (!gender) {
        return 'Not specified';
    }
    return gender.charAt(0) + gender.slice(1).toLowerCase();
};

const formatRole = (role: string) => {
    return role
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

// Error boundary component
const ErrorDisplay = ({ message }: { message: string }) => (
    <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Error"
        color="red"
        mb="xl"
    >
        {message}
    </Alert>
);

// Info item component
const InfoItem = ({
    label,
    value,
    icon,
}: {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <Box>
        <Text size="sm" c="dimmed" fw={500} mb={4}>
            {label}
        </Text>
        <Flex align="center" gap="xs">
            {icon}
            <Text size="sm">{value}</Text>
        </Flex>
    </Box>
);

// Main component
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function ApplicantProfile() {
    const { id } = useParams<{ id: string }>();
    const { data: applicantData, isLoading } = useQuery({
        queryKey: ['applicants', id],
        queryFn: () => applicantDetails(id),
    });
    const { data: profilePicture } = useDownloadProfilePicture(
        applicantData?.profile_picture_id ?? '',
    );

    const fullName = [
        applicantData?.firstName,
        applicantData?.middleName,
        applicantData?.lastName,
    ]
        .filter(Boolean)
        .join(' ');

    if (isLoading) {
        return <EntityPageLoading />;
    }
    return (
        <Box>
            {/* Header Section */}
            <Card shadow="sm" padding="xl" radius="md" mb="xl">
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'center', sm: 'flex-start' }}
                    gap="xl"
                >
                    <Avatar
                        src={
                            profilePicture
                                ? URL.createObjectURL(profilePicture)
                                : undefined
                        }
                        size={100}
                        radius={100}
                        style={{ cursor: 'pointer' }}
                    />

                    <Box style={{ flex: 1 }}>
                        <Flex
                            direction={{ base: 'column', sm: 'row' }}
                            justify="space-between"
                            align={{ base: 'center', sm: 'flex-start' }}
                            gap="md"
                            mb="md"
                        >
                            <Box ta={{ base: 'center', sm: 'left' }}>
                                <Title order={1} size="h2" mb="xs">
                                    {fullName}
                                </Title>
                                {applicantData?.title && (
                                    <Text size="lg" c="dimmed">
                                        {applicantData?.title}
                                    </Text>
                                )}
                            </Box>
                        </Flex>

                        <Group gap="xs">
                            <Badge
                                color={
                                    applicantData?.isActive ? 'green' : 'gray'
                                }
                                variant="light"
                            >
                                {applicantData?.isActive
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                        </Group>
                    </Box>
                </Flex>
            </Card>

            <Grid>
                {/* Personal Information */}
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" h="100%">
                        <Group gap="xs" mb="md">
                            <IconUser size="1.2rem" />
                            <Title order={3}>Personal Information</Title>
                        </Group>

                        <Stack gap="md">
                            <Grid>
                                <Grid.Col span={6}>
                                    <InfoItem
                                        label="First Name"
                                        value={
                                            applicantData?.firstName ||
                                            'Not provided'
                                        }
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <InfoItem
                                        label="Last Name"
                                        value={
                                            applicantData?.lastName ||
                                            'Not provided'
                                        }
                                    />
                                </Grid.Col>
                            </Grid>

                            {applicantData?.middleName && (
                                <InfoItem
                                    label="Middle Name"
                                    value={applicantData?.middleName}
                                />
                            )}

                            <Divider />

                            <Grid>
                                <Grid.Col span={6}>
                                    <InfoItem
                                        label="Gender"
                                        value={formatGender(
                                            applicantData?.gender,
                                        )}
                                    />
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <InfoItem
                                        label="Birth Date"
                                        value={formatDate(
                                            applicantData?.birthDate,
                                        )}
                                        icon={<IconCalendar size="1rem" />}
                                    />
                                </Grid.Col>
                            </Grid>

                            {applicantData?.marriageStatus && (
                                <InfoItem
                                    label="Marital Status"
                                    value={applicantData?.marriageStatus}
                                />
                            )}
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Contact Information */}
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" h="100%">
                        <Group gap="xs" mb="md">
                            <IconPhone size="1.2rem" />
                            <Title order={3}>Contact Information</Title>
                        </Group>

                        <Stack gap="md">
                            <Box>
                                <Text size="sm" c="dimmed" fw={500} mb={4}>
                                    Email Address
                                </Text>
                                <Flex align="center" gap="xs" mb="xs">
                                    <IconMail size="1rem" />
                                    <Text size="sm">
                                        {applicantData?.__user__?.email ||
                                            'Not provided'}
                                    </Text>
                                </Flex>
                                {applicantData?.__user__ && (
                                    <Badge
                                        color={
                                            applicantData?.__user__
                                                .email_confirmed
                                                ? 'green'
                                                : 'red'
                                        }
                                        variant="light"
                                        size="xs"
                                        leftSection={
                                            applicantData?.__user__
                                                .email_confirmed ? (
                                                <IconCheck size="0.8rem" />
                                            ) : (
                                                <IconX size="0.8rem" />
                                            )
                                        }
                                    >
                                        {applicantData?.__user__.email_confirmed
                                            ? 'Verified'
                                            : 'Unverified'}
                                    </Badge>
                                )}
                            </Box>

                            <InfoItem
                                label="Phone Number"
                                value={
                                    applicantData?.phoneNumber || 'Not provided'
                                }
                                icon={<IconPhone size="1rem" />}
                            />

                            {applicantData?.__user__?.userName && (
                                <InfoItem
                                    label="Username"
                                    value={applicantData?.__user__.userName}
                                />
                            )}
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Account Information */}
                <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Card shadow="sm" padding="lg" radius="md" h="100%">
                        <Group gap="xs" mb="md">
                            <IconShield size="1.2rem" />
                            <Title order={3}>Account Information</Title>
                        </Group>

                        <Stack gap="md">
                            <Box>
                                <Text size="sm" c="dimmed" fw={500} mb={4}>
                                    Account Status
                                </Text>
                                <Group gap="xs">
                                    <Badge
                                        color={
                                            applicantData?.isActive
                                                ? 'green'
                                                : 'gray'
                                        }
                                        variant="light"
                                    >
                                        {applicantData?.isActive
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </Group>
                            </Box>

                            <InfoItem
                                label="Member Since"
                                value={formatDate(applicantData?.createdAt)}
                            />

                            {applicantData?.__user__?.note && (
                                <InfoItem
                                    label="Notes"
                                    value={applicantData?.__user__.note}
                                />
                            )}
                        </Stack>
                    </Card>
                </Grid.Col>
            </Grid>
        </Box>
    );
}
