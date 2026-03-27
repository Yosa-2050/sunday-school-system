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
import {
    deleteRelationshipApi,
    fetchRelationshipsApi,
} from 'app/[locale]/(module)/school_admin/students/schemas/api';
import type { RelationShipsResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useParams } from 'next/navigation';
import router from 'next/router';
import { useState } from 'react';
import { fetchMembersIdApi } from '../../schemas/api';

export default function MembersEditPage() {
    const params = useParams();
    const memberId = params.id as string;
    const [editMode, setEditMode] = useState(false);
    const [relationshipModalOpened, setRelationshipModalOpened] =
        useState(false);
    //TODO: will change it to member the response type
    const [editingRelationship, setEditingRelationship] =
        useState<RelationShipsResponse | null>(null);
    const queryClient = useQueryClient();

    const {
        data: member,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['member', memberId],
        queryFn: () => fetchMembersIdApi(memberId),
        enabled: !!memberId,
    });

    if (isLoading) {
        return <Loader />;
    }

    if (error || !member) {
        return <Text color="red">Failed to load member</Text>;
    }
    const deleteRelationshipMutation = useMutation({
        mutationFn: deleteRelationshipApi,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['student-relationships', memberId],
            });
        },
    });

    const handleDeleteRelationship = (relationshipId: string) => {
        deleteRelationshipMutation.mutate(relationshipId);
    };

    const { data: relationships, isLoading: loadingRelationships } = useQuery({
        queryKey: ['student-relationships', memberId],
        queryFn: () => fetchRelationshipsApi(memberId),
        enabled: !!memberId,
    });

    return (
        <Box>
            <Paper p="xl" shadow="sm" radius="md" withBorder>
                <Group align="flex-start" gap="lg">
                    <Avatar size={100} radius="xl">
                        <IconUser size={40} />
                    </Avatar>
                    <Box>
                        <Title order={2} fw={700}>
                            {member.profile?.firstName}{' '}
                            {member.profile?.middleName}
                        </Title>
                        <Group mt="md">
                            <Badge
                                color={member.isActive ? 'green' : 'red'}
                                variant="light"
                            >
                                {member.isActive ? 'Active' : 'Inactive'}
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
                <Divider mb="xl" />
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
                                                        member.profile
                                                            ?.firstName
                                                    }
                                                    size="xs"
                                                />
                                                <TextInput
                                                    placeholder="Last Name"
                                                    defaultValue={
                                                        member.profile?.lastName
                                                    }
                                                    size="xs"
                                                />
                                            </Group>
                                        ) : (
                                            <Text>
                                                {member.profile?.firstName}{' '}
                                                {member.profile?.lastName}
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
                                                    member.profile?.birthDate?.split(
                                                        'T',
                                                    )[0]
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {member.profile?.birthDate
                                                    ? new Date(
                                                          member.profile
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
                                                    member.profile?.gender
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {member.profile?.gender ||
                                                    'Not specified'}
                                            </Text>
                                        )}
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>
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
                                                    member.profile
                                                        ?.phoneNumber ||
                                                    undefined
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {member.profile?.phoneNumber ||
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
                                                    member.profile?.firstName
                                                }
                                                size="xs"
                                            />
                                        ) : (
                                            <Text>
                                                {member.profile?.firstName ||
                                                    'No email provided'}
                                            </Text>
                                        )}
                                    </Box>
                                </Group>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Paper>
            <Paper p="md" withBorder radius="md" mt="xl">
                <Group justify="space-between" mb="md">
                    <Title order={4}>Emergency Contacts & Relationships</Title>
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
        </Box>
    );
}
