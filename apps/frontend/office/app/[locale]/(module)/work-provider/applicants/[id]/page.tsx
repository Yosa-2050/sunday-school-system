'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Grid,
    Group,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Timeline,
    Title,
} from '@mantine/core';
import { COOKIE_ACCESS_TOKEN } from '@shega/shared';
import {
    IconAward,
    IconBriefcase,
    IconBuilding,
    IconCalendar,
    IconCheck,
    IconFileText,
    IconMail,
    IconPhone,
    IconSchool,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import {
    applicantDetails,
    useDownloadProfilePicture,
    useShortLIstMutation,
    useShortRejectedMutation,
} from 'app/[locale]/_api/job-seeker';
import { getCookie } from 'cookies-next';
import { useParams } from 'next/navigation';
import type React from 'react';

const formatDate = (dateString?: string) => {
    if (!dateString) {
        return 'Present';
    }
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

const calculateAge = (birthDate?: string) => {
    if (!birthDate) {
        return null;
    }
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    return age;
};

const formatWorkType = (type?: string) => {
    if (!type) {
        return '';
    }
    return type
        .replace('_', ' ')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
};

const formatWorkPlace = (workPlace?: string) => {
    if (!workPlace) {
        return '';
    }
    return workPlace
        .replace('_', ' ')
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase());
};

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

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function ApplicantProfile() {
    const { id } = useParams<{ id: string }>();
    const { data: applicantData, isLoading } = useQuery({
        queryKey: ['applicants', id],
        queryFn: () => applicantDetails(id),
    });
    const { data: profilePicture } = useDownloadProfilePicture(
        applicantData?.profile?.profile_picture_id ?? '',
    );
    const { data, isFetching } = useQuery({
        queryKey: ['cv', applicantData?.cv],
        queryFn: async () => {
            const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/document/${applicantData?.cv}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        accept: '*/*',
                    },
                },
            );
            if (!response.ok) {
                throw new Error('Failed to download document');
            }
            return response.blob();
        },
        enabled: !!applicantData?.cv,
    });

    const { mutate: shortlistMutation, isPending: isShortlisting } =
        useShortLIstMutation(id);
    const { mutate: rejectMutation, isPending: isRejecting } =
        useShortRejectedMutation(id);

    if (isLoading) {
        return <EntityPageLoading />;
    }

    if (!applicantData) {
        return (
            <Box ta="center" py="xl">
                <Text>Applicant not found</Text>
            </Box>
        );
    }

    const fullName = [
        applicantData.profile?.firstName,
        applicantData.profile?.middleName,
        applicantData.profile?.lastName,
    ]
        .filter(Boolean)
        .join(' ');

    const age = calculateAge(applicantData.profile?.birthDate);

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
                        size={120}
                        radius={120}
                    >
                        {!profilePicture &&
                            getInitials(
                                applicantData.profile?.firstName,
                                applicantData.profile?.lastName,
                            )}
                    </Avatar>

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
                                {applicantData.profile?.title && (
                                    <Text size="lg" c="dimmed" mb="xs">
                                        {applicantData.profile.title}
                                    </Text>
                                )}
                                {applicantData.headline && (
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        style={{ maxWidth: 500 }}
                                    >
                                        {applicantData.headline}
                                    </Text>
                                )}
                            </Box>
                            {/* {  <Flex gap="md">
                <Button loading={isShortlisting} onClick={handleShortlist} leftSection={<IconCheck size="1rem" />}>
                  Shortlist
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  onClick={handleReject}
                  loading={isRejecting}
                  leftSection={<IconX size="1rem" />}
                >
                  Reject
                </Button>
                <ActionIcon variant="outline" size="lg">
                  <IconDownload size="1.2rem" />
                </ActionIcon>
              </Flex>} */}
                        </Flex>

                        <Group gap="xs" mb="md">
                            <Badge
                                color={
                                    applicantData.isActive ? 'green' : 'gray'
                                }
                                variant="light"
                            >
                                {applicantData.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {applicantData.__user__?.email_confirmed && (
                                <Badge color="green" variant="light">
                                    <IconCheck
                                        size="0.8rem"
                                        style={{ marginRight: 4 }}
                                    />
                                    Verified Email
                                </Badge>
                            )}
                        </Group>
                    </Box>
                </Flex>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview">
                <Tabs.List>
                    <Tabs.Tab
                        value="overview"
                        leftSection={<IconUser size="0.8rem" />}
                    >
                        Overview
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="experience"
                        leftSection={<IconBriefcase size="0.8rem" />}
                    >
                        Experience
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="education"
                        leftSection={<IconSchool size="0.8rem" />}
                    >
                        Education
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="skills"
                        leftSection={<IconAward size="0.8rem" />}
                    >
                        Skills
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="documents"
                        leftSection={<IconFileText size="0.8rem" />}
                    >
                        Documents
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="cover-letter"
                        leftSection={<IconFileText size="0.8rem" />}
                    >
                        Cover Letter
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="md">
                    <Grid>
                        {/* Personal Information */}
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <Card shadow="sm" padding="lg" radius="md" h="100%">
                                <Group gap="xs" mb="md">
                                    <IconUser size="1.2rem" />
                                    <Title order={3}>
                                        Personal Information
                                    </Title>
                                </Group>

                                <Stack gap="md">
                                    <Grid>
                                        <Grid.Col span={6}>
                                            <InfoItem
                                                label="First Name"
                                                value={
                                                    applicantData.profile
                                                        ?.firstName ||
                                                    'Not provided'
                                                }
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <InfoItem
                                                label="Last Name"
                                                value={
                                                    applicantData.profile
                                                        ?.lastName ||
                                                    'Not provided'
                                                }
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    {applicantData.profile?.middleName && (
                                        <InfoItem
                                            label="Middle Name"
                                            value={
                                                applicantData.profile.middleName
                                            }
                                        />
                                    )}

                                    <Divider />

                                    <Grid>
                                        <Grid.Col span={6}>
                                            <InfoItem
                                                label="Gender"
                                                value={formatGender(
                                                    applicantData.profile
                                                        ?.gender,
                                                )}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={6}>
                                            <InfoItem
                                                label="Age"
                                                value={
                                                    age
                                                        ? `${age} years`
                                                        : 'Not specified'
                                                }
                                            />
                                        </Grid.Col>
                                    </Grid>

                                    <InfoItem
                                        label="Birth Date"
                                        value={formatDate(
                                            applicantData.profile?.birthDate,
                                        )}
                                        icon={<IconCalendar size="1rem" />}
                                    />

                                    {applicantData.profile?.marriageStatus && (
                                        <InfoItem
                                            label="Marital Status"
                                            value={
                                                applicantData.profile
                                                    .marriageStatus
                                            }
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
                                        <Text
                                            size="sm"
                                            c="dimmed"
                                            fw={500}
                                            mb={4}
                                        >
                                            Email Address
                                        </Text>
                                        <Flex align="center" gap="xs" mb="xs">
                                            <IconMail size="1rem" />
                                            <Text size="sm">
                                                {applicantData.__user__
                                                    ?.email || 'Not provided'}
                                            </Text>
                                        </Flex>
                                        {applicantData.__user__ && (
                                            <Badge
                                                color={
                                                    applicantData.__user__
                                                        .email_confirmed
                                                        ? 'green'
                                                        : 'red'
                                                }
                                                variant="light"
                                                size="xs"
                                                leftSection={
                                                    applicantData.__user__
                                                        .email_confirmed ? (
                                                        <IconCheck size="0.8rem" />
                                                    ) : (
                                                        <IconX size="0.8rem" />
                                                    )
                                                }
                                            >
                                                {applicantData.__user__
                                                    .email_confirmed
                                                    ? 'Verified'
                                                    : 'Unverified'}
                                            </Badge>
                                        )}
                                    </Box>

                                    <InfoItem
                                        label="Phone Number"
                                        value={
                                            applicantData.profile
                                                ?.phoneNumber || 'Not provided'
                                        }
                                        icon={<IconPhone size="1rem" />}
                                    />

                                    {applicantData.__user__?.userName && (
                                        <InfoItem
                                            label="Username"
                                            value={
                                                applicantData.__user__.userName
                                            }
                                        />
                                    )}

                                    <Divider />

                                    <InfoItem
                                        label="Member Since"
                                        value={formatDate(
                                            applicantData.createdAt,
                                        )}
                                        icon={<IconCalendar size="1rem" />}
                                    />
                                </Stack>
                            </Card>
                        </Grid.Col>

                        {/* Bio Section */}
                        {applicantData.bio && (
                            <Grid.Col span={12}>
                                <Card shadow="sm" padding="lg" radius="md">
                                    <Group gap="xs" mb="md">
                                        <IconFileText size="1.2rem" />
                                        <Title order={3}>
                                            Professional Bio
                                        </Title>
                                    </Group>
                                    <Text
                                        size="sm"
                                        style={{
                                            whiteSpace: 'pre-line',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {applicantData.bio}
                                    </Text>
                                </Card>
                            </Grid.Col>
                        )}
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="experience" pt="md">
                    <Card shadow="sm" padding="lg" radius="md">
                        <Group gap="xs" mb="md">
                            <IconBriefcase size="1.2rem" />
                            <Title order={3}>Work Experience</Title>
                        </Group>

                        {applicantData.experiance &&
                        applicantData.experiance.length > 0 ? (
                            <Timeline
                                active={applicantData.experiance.length}
                                bulletSize={24}
                                lineWidth={2}
                            >
                                {applicantData.experiance.map((exp) => (
                                    <Timeline.Item
                                        key={exp.id}
                                        bullet={
                                            <ThemeIcon
                                                size={24}
                                                variant="filled"
                                                radius="xl"
                                            >
                                                <IconBuilding size="0.8rem" />
                                            </ThemeIcon>
                                        }
                                        title={exp.title}
                                    >
                                        <Text c="dimmed" size="sm" mb="xs">
                                            {exp.company}
                                        </Text>
                                        <Group gap="xs" mb="xs">
                                            <Badge variant="light" size="xs">
                                                {formatWorkType(exp.type)}
                                            </Badge>
                                            <Badge variant="light" size="xs">
                                                {formatWorkPlace(exp.workPlace)}
                                            </Badge>
                                        </Group>
                                        <Text size="xs" c="dimmed">
                                            <IconCalendar
                                                size="0.8rem"
                                                style={{ marginRight: 4 }}
                                            />
                                            {formatDate(
                                                exp.startDate ?? undefined,
                                            )}{' '}
                                            -{' '}
                                            {formatDate(
                                                exp.endDate ?? undefined,
                                            )}
                                        </Text>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No work experience added yet
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="education" pt="md">
                    <Card shadow="sm" padding="lg" radius="md">
                        <Group gap="xs" mb="md">
                            <IconSchool size="1.2rem" />
                            <Title order={3}>Educational Background</Title>
                        </Group>

                        {applicantData.educationalHistory &&
                        applicantData.educationalHistory.length > 0 ? (
                            <Timeline
                                active={applicantData.educationalHistory.length}
                                bulletSize={24}
                                lineWidth={2}
                            >
                                {applicantData.educationalHistory.map((edu) => (
                                    <Timeline.Item
                                        key={edu.id}
                                        bullet={
                                            <ThemeIcon
                                                size={24}
                                                variant="filled"
                                                radius="xl"
                                                color="blue"
                                            >
                                                <IconSchool size="0.8rem" />
                                            </ThemeIcon>
                                        }
                                        title={edu.school}
                                    >
                                        <Text c="dimmed" size="sm" mb="xs">
                                            {edu.fieldOfStudy?.name} -{' '}
                                            {edu.level}
                                        </Text>
                                        <Group gap="xs" mb="xs">
                                            <Badge
                                                variant="light"
                                                size="xs"
                                                color="blue"
                                            >
                                                Grade: {edu.grade}
                                            </Badge>
                                        </Group>
                                        <Text size="xs" c="dimmed" mb="xs">
                                            <IconCalendar
                                                size="0.8rem"
                                                style={{ marginRight: 4 }}
                                            />
                                            {formatDate(edu.startDate)} -{' '}
                                            {formatDate(edu.endDate)}
                                        </Text>
                                        {edu.description && (
                                            <Text size="sm" c="dimmed">
                                                {edu.description}
                                            </Text>
                                        )}
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No educational history added yet
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="skills" pt="md">
                    <Card shadow="sm" padding="lg" radius="md">
                        <Group gap="xs" mb="md">
                            <IconAward size="1.2rem" />
                            <Title order={3}>Skills & Expertise</Title>
                        </Group>

                        {applicantData.skills &&
                        applicantData.skills.length > 0 ? (
                            <Group gap="xs">
                                {applicantData.skills.map((skill) => (
                                    <Badge
                                        key={skill.id}
                                        variant="light"
                                        size="md"
                                        radius="md"
                                    >
                                        {skill.skill}
                                    </Badge>
                                ))}
                            </Group>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No skills added yet
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="documents" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" h="100%">
                        <Group justify="space-between" mb="md">
                            <Group gap="xs">
                                <IconFileText size="1.2rem" />
                                <Title order={4}>Resume/CV</Title>
                            </Group>
                        </Group>
                        <Flex align={'center'}>
                            <Text size="sm" c="dimmed" mt={2}>
                                {applicantData.cv
                                    ? 'CV uploaded'
                                    : 'No CV uploaded'}
                            </Text>
                            <Button
                                onClick={() => {
                                    //create object url for the cv from the data
                                    if (data) {
                                        const url = URL.createObjectURL(
                                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                            data as any,
                                        );
                                        window.open(url, '_blank');
                                    }
                                }}
                                variant="transparent"
                            >
                                {isFetching
                                    ? 'Downloading CV...'
                                    : 'Preview CV'}
                            </Button>
                        </Flex>
                    </Card>
                </Tabs.Panel>
                <Tabs.Panel value="cover-letter" pt="md">
                    <Card shadow="sm" padding="lg" radius="md" h="100%">
                        <Group justify="space-between" mb="md">
                            <Group gap="xs">
                                <IconFileText size="1.2rem" />
                                <Title order={4}>Cover Letter</Title>
                            </Group>
                        </Group>
                        <Text size="sm" c="dimmed">
                            {applicantData.coverLetter
                                ? 'Cover letter available'
                                : 'No cover letter'}
                        </Text>
                        {applicantData.coverLetter && (
                            <Text size="xs" c="dimmed" mt="xs">
                                {applicantData.coverLetter}
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </Box>
    );
}
