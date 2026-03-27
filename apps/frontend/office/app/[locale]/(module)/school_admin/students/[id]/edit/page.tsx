'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Grid,
    Group,
    Loader,
    Menu,
    Modal,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    Title,
} from '@mantine/core';
import {
    IconCalendar,
    IconEdit,
    IconMail,
    IconPhone,
    IconPlus,
    IconTrash,
    IconUser,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    deleteRelationshipApi,
    fetchRelationshipsApi,
    fetchStudentsIdApi,
    updateStudentApi,
} from '../../schemas/api';
import type { RelationShipsResponse } from '../../schemas/type';

export default function StudentEditPage() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const studentId = params.id as string;
    const [editMode, setEditMode] = useState(false);
    const [relationshipModalOpened, setRelationshipModalOpened] =
        useState(false);
    const [editingRelationship, setEditingRelationship] =
        useState<RelationShipsResponse | null>(null);

    const {
        data: student,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['student', studentId],
        queryFn: () => fetchStudentsIdApi(studentId),
        enabled: !!studentId,
    });

    const { data: relationships, isLoading: loadingRelationships } = useQuery({
        queryKey: ['student-relationships', studentId],
        queryFn: () => fetchRelationshipsApi(studentId),
        enabled: !!studentId,
    });

    const updateStudentMutation = useMutation({
        mutationFn: updateStudentApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['student', studentId] });
            setEditMode(false);
        },
    });

    const deleteRelationshipMutation = useMutation({
        mutationFn: deleteRelationshipApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['student-relationships', studentId],
            });
        },
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

    const handleSave = async (formData: FormData) => {
        // Implement your save logic here
        await updateStudentMutation.mutateAsync({ studentId, data: formData });
    };

    const handleDeleteRelationship = (relationshipId: string) => {
        deleteRelationshipMutation.mutate(relationshipId);
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
                                <Badge color="blue" variant="outline">
                                    {student.class?.name || 'No Class'}
                                </Badge>
                            </Group>
                        </Box>
                    </Group>

                    <Group>
                        <Button
                            variant={editMode ? 'filled' : 'light'}
                            color={editMode ? 'green' : 'blue'}
                            leftSection={<IconEdit size={16} />}
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? 'Save Changes' : 'Edit Student'}
                        </Button>
                        <Button
                            variant="light"
                            color="gray"
                            leftSection={<IconX size={16} />}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Group>

                <Divider mb="xl" />

                {/* Personal Information */}
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder radius="md">
                            <Group justify="space-between" mb="md">
                                <Title order={4}>Personal Information</Title>
                                {editMode && (
                                    <ActionIcon variant="subtle" color="blue">
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                )}
                            </Group>
                            <Stack gap="md">
                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="blue"
                                        size="md"
                                    >
                                        <IconUser size={16} />
                                    </ThemeIcon>
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" c="dimmed">
                                            Full Name
                                        </Text>
                                        {editMode ? (
                                            <Group gap="xs">
                                                <TextInput
                                                    placeholder="First Name"
                                                    defaultValue={
                                                        student.profile
                                                            ?.firstName
                                                    }
                                                    size="xs"
                                                />
                                                <TextInput
                                                    placeholder="Last Name"
                                                    defaultValue={
                                                        student.profile
                                                            ?.lastName
                                                    }
                                                    size="xs"
                                                />
                                            </Group>
                                        ) : (
                                            <Text>
                                                {student.profile?.firstName}{' '}
                                                {student.profile?.lastName}
                                            </Text>
                                        )}
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
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" c="dimmed">
                                            Date of Birth
                                        </Text>
                                        {editMode ? (
                                            <TextInput
                                                type="date"
                                                defaultValue={
                                                    student.profile?.birthDate?.split(
                                                        'T',
                                                    )[0]
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {student.profile?.birthDate
                                                    ? new Date(
                                                          student.profile
                                                              .birthDate,
                                                      ).toLocaleDateString()
                                                    : 'Not specified'}
                                            </Text>
                                        )}
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
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" c="dimmed">
                                            Gender
                                        </Text>
                                        {editMode ? (
                                            <Select
                                                data={[
                                                    {
                                                        value: 'MALE',
                                                        label: 'Male',
                                                    },
                                                    {
                                                        value: 'FEMALE',
                                                        label: 'Female',
                                                    },
                                                    {
                                                        value: 'OTHER',
                                                        label: 'Other',
                                                    },
                                                ]}
                                                defaultValue={
                                                    student.profile?.gender
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {student.profile?.gender ||
                                                    'Not specified'}
                                            </Text>
                                        )}
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>

                    {/* Contact Information */}
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper p="md" withBorder radius="md">
                            <Group justify="space-between" mb="md">
                                <Title order={4}>Contact Information</Title>
                                {editMode && (
                                    <ActionIcon variant="subtle" color="blue">
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                )}
                            </Group>
                            <Stack gap="md">
                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="cyan"
                                        size="md"
                                    >
                                        <IconPhone size={16} />
                                    </ThemeIcon>
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" c="dimmed">
                                            Phone
                                        </Text>
                                        {editMode ? (
                                            <TextInput
                                                placeholder="Phone Number"
                                                defaultValue={
                                                    student.profile
                                                        ?.phoneNumber ||
                                                    undefined
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {student.profile?.phoneNumber ||
                                                    'No phone provided'}
                                            </Text>
                                        )}
                                    </Box>
                                </Group>

                                <Group>
                                    <ThemeIcon
                                        variant="light"
                                        color="green"
                                        size="md"
                                    >
                                        <IconMail size={16} />
                                    </ThemeIcon>
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" c="dimmed">
                                            Email
                                        </Text>
                                        {editMode ? (
                                            <TextInput
                                                type="email"
                                                placeholder="Email"
                                                defaultValue={
                                                    student.profile?.firstName
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {student.profile?.firstName ||
                                                    'No email provided'}
                                            </Text>
                                        )}
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>

                {/* Academic Information (Read-only) */}
                <Paper p="md" withBorder radius="md" mt="xl">
                    <Title order={4} mb="md">
                        Academic Information
                    </Title>
                    <Text size="sm" c="dimmed" mb="md">
                        Contact administrator to change academic information
                    </Text>
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
                    </Grid>
                </Paper>

                {/* Relationships Section */}
                <Paper p="md" withBorder radius="md" mt="xl">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>
                            Emergency Contacts & Relationships
                        </Title>
                        <Button
                            variant="light"
                            size="sm"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setRelationshipModalOpened(true)}
                        >
                            Add Relationship
                        </Button>
                    </Group>

                    {loadingRelationships ? (
                        <Loader size="sm" />
                    ) : relationships?.length === 0 ? (
                        <Text c="dimmed">No emergency contacts found</Text>
                    ) : (
                        <Stack gap="md">
                            {relationships?.map((relationship) => (
                                <Paper key={relationship.id} p="md" withBorder>
                                    <Group justify="space-between">
                                        <Box>
                                            <Text fw={500}>
                                                {relationship.firstName}{' '}
                                                {relationship.lastName}
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                {relationship.type} •{' '}
                                                {relationship.phoneNumber}
                                            </Text>
                                            {relationship.baptistName && (
                                                <Badge
                                                    color="blue"
                                                    variant="light"
                                                    size="xs"
                                                >
                                                    {relationship.baptistName}
                                                </Badge>
                                            )}
                                        </Box>
                                        <Menu position="bottom-end">
                                            <Menu.Target>
                                                <ActionIcon variant="subtle">
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    leftSection={
                                                        <IconEdit size={16} />
                                                    }
                                                    onClick={() => {
                                                        setEditingRelationship(
                                                            relationship,
                                                        );
                                                        setRelationshipModalOpened(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </Menu.Item>
                                                <Menu.Item
                                                    leftSection={
                                                        <IconTrash size={16} />
                                                    }
                                                    color="red"
                                                    onClick={() =>
                                                        handleDeleteRelationship(
                                                            relationship.id,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Paper>

                {/* Relationship Modal */}
                <Modal
                    opened={relationshipModalOpened}
                    onClose={() => {
                        setRelationshipModalOpened(false);
                        setEditingRelationship(null);
                    }}
                    title={
                        editingRelationship
                            ? 'Edit Relationship'
                            : 'Add Relationship'
                    }
                >
                    {/* Add your relationship form here */}
                    <Text>Relationship form will go here</Text>
                </Modal>
            </Paper>
        </Box>
    );
}
