'use client';

import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Grid,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import {
    IconCalendar,
    IconEdit,
    IconId,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PrintIdModal, type StudentForPrint } from '../components/PrintIdModal';
import { RelationshipList } from '../components/RelationshipList';
import { fetchStudentsIdApi } from '../schemas/api';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;
    const [printModalOpened, setPrintModalOpened] = useState(false);

    const {
        data: student,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['student', studentId],
        queryFn: () => fetchStudentsIdApi(studentId),
        enabled: !!studentId,
    });

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center h-64">
                <Loader size="lg" />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Box className="flex items-center justify-center h-64">
                <Text c="red">Failed to load student details</Text>
            </Box>
        );
    }

    // Prepare student data for printing
    const studentForPrint: StudentForPrint = {
        id: student?.id || '',
        idNumber: student?.idNumber || '',
        firstName: student?.profile?.firstName || '',
        lastName: student?.profile?.lastName || '',
        phoneNumber: student?.profile?.phoneNumber || '',
        className: student?.class.name || '',
        // You might need to adjust these based on your relationship data structure
        emergencyContact: 'Parent Name', // Replace with actual emergency contact
        emergencyPhone: '123-456-7890', // Replace with actual emergency phone
        //photoUrl: student?.profile?.profile_picture_id,     // Add photoUrl to your StudentResponse if needed
    };

    return (
        <Box>
            <Paper p="xl" shadow="sm" radius="md" withBorder>
                {/* Header */}
                <Group justify="space-between" align="flex-start" mb="xl">
                    <Group align="flex-start" gap="lg">
                        <Avatar size={100} radius="xl">
                            <IconUser size={40} />
                        </Avatar>
                        <Box>
                            <Title order={2} fw={700}>
                                {student.profile?.firstName}{' '}
                                {student.profile?.middleName}
                            </Title>
                            <Text c="dimmed" mt={5}>
                                {student.idNumber}
                            </Text>
                            <Group mt="md">
                                <Badge
                                    color={student.isActive ? 'green' : 'red'}
                                    variant="light"
                                >
                                    {student.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {/* TODO: Section name */}
                                <Badge color="blue" variant="outline">
                                    {student.class?.name || 'No Class'}
                                </Badge>
                            </Group>
                        </Box>
                    </Group>

                    <Group>
                        {/* Print ID Button - ADD THIS */}
                        <Button
                            variant="light"
                            color="blue"
                            leftSection={<IconId size={16} />}
                            onClick={() => setPrintModalOpened(true)}
                        >
                            Print ID
                        </Button>
                        <Button
                            variant="light"
                            color="orange"
                            leftSection={<IconEdit size={16} />}
                            component={Link}
                            href={`/students/${studentId}/edit`}
                        >
                            Edit Student
                        </Button>
                        <Button
                            variant="light"
                            color="gray"
                            leftSection={<IconX size={16} />}
                            onClick={() => router.back()}
                        >
                            Back to List
                        </Button>
                    </Group>
                </Group>

                <Divider mb="xl" />

                {/* Print ID Modal */}
                <PrintIdModal
                    opened={printModalOpened}
                    onClose={() => setPrintModalOpened(false)}
                    student={studentForPrint}
                />

                {/* Personal Information */}
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder radius="md">
                            <Title order={4} mb="md">
                                Personal Information
                            </Title>
                            <Stack gap="md">
                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="blue"
                                        size="md"
                                    >
                                        <IconUser size={16} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            Full Name
                                        </Text>
                                        <Text>
                                            {student.profile?.firstName}{' '}
                                            {student.profile?.lastName}
                                        </Text>
                                    </Box>
                                </Group>

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="grape"
                                        size="md"
                                    >
                                        <IconCalendar size={16} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            Date of Birth
                                        </Text>
                                        <Text>
                                            {student.profile?.birthDate
                                                ? new Date(
                                                      student.profile
                                                          ?.birthDate,
                                                  ).toLocaleDateString()
                                                : 'Not specified'}
                                        </Text>
                                    </Box>
                                </Group>

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="pink"
                                        size="md"
                                    >
                                        <IconUser size={16} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            Gender
                                        </Text>
                                        <Text>
                                            {student.profile?.gender ||
                                                'Not specified'}
                                        </Text>
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    {/* Contact Information */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder radius="md">
                            <Title order={4} mb="md">
                                Contact Information
                            </Title>
                            <Stack gap="md">
                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="green"
                                        size="md"
                                    >
                                        <IconMail size={16} />
                                    </ThemeIcon>
                                    {/* <Box>
                                        <Text size="sm" c="dimmed">
                                            Email
                                        </Text>
                                        <Text>{student.email || 'No email provided'}</Text>
                                    </Box> */}
                                </Group>

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="cyan"
                                        size="md"
                                    >
                                        <IconPhone size={16} />
                                    </ThemeIcon>
                                    <Box>
                                        <Text size="sm" c="dimmed">
                                            Phone
                                        </Text>
                                        <Text>
                                            {student.profile?.phoneNumber ||
                                                'No phone provided'}
                                        </Text>
                                    </Box>
                                </Group>

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="orange"
                                        size="md"
                                    >
                                        <IconMapPin size={16} />
                                    </ThemeIcon>
                                    {/* <Box>
                                        <Text size="sm" c="dimmed">
                                            Address
                                        </Text>
                                        <Text>{student.address || 'No address provided'}</Text>
                                    </Box> */}
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>

                {/* Academic Information */}
                <Paper p="md" withBorder radius="md" mt="xl">
                    <Title order={4} mb="md">
                        Academic Information
                    </Title>
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Group>
                                <ThemeIcon
                                    variant="light"
                                    color="violet"
                                    size="md"
                                >
                                    <IconUser size={16} />
                                </ThemeIcon>
                                <Box>
                                    <Text size="sm" c="dimmed">
                                        Class
                                    </Text>
                                    <Text>
                                        {student.class.name || 'Not assigned'}
                                    </Text>
                                </Box>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Group>
                                <ThemeIcon
                                    variant="light"
                                    color="indigo"
                                    size="md"
                                >
                                    <IconUser size={16} />
                                </ThemeIcon>
                                {/* <Box>
                                    <Text size="sm" c="dimmed">
                                        Section
                                    </Text>
                                    <Text>{student.sectionName || 'Not assigned'}</Text>
                                </Box> */}
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Group>
                                <ThemeIcon
                                    variant="light"
                                    color="teal"
                                    size="md"
                                >
                                    <IconCalendar size={16} />
                                </ThemeIcon>
                                {/* <Box>
                                    <Text size="sm" c="dimmed">
                                        Enrollment Date
                                    </Text>
                                    <Text>
                                        {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'Not specified'}
                                    </Text>
                                </Box> */}
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Paper>

                {/* Relationships Section - Using the reusable component */}
                <Paper p="md" withBorder radius="md" mt="xl">
                    <RelationshipList
                        profileId={student.profile.id}
                        title="Emergency Contacts & Relationships"
                        emptyMessage="No emergency contacts found for this student"
                    />
                </Paper>
            </Paper>
        </Box>
    );
}
