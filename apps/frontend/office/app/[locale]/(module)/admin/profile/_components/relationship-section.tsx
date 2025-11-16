'use client';

import {
    ActionIcon,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Group,
    Modal,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCalendar,
    IconCheck,
    IconPencil,
    IconPhone,
    IconPlus,
    IconTrash,
    IconUser,
    IconX,
} from '@tabler/icons-react';

import CreateRelationModal from 'app/[locale]/(module)/school_admin/students/components/CreateRelationShip';
import type { RelationShipsResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useState } from 'react';

//  const useDeleteEducation = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: deleteEducation,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
//         },
//     });
// };

export default function RelationSection({
    relation,
}: {
    relation: RelationShipsResponse[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedRelation, setSelectedRelation] = useState<
        string | undefined
    >();
    const [viewmore, setViewMore] = useState(false);
    // const updateExperienceMutation = useUpdateExperience();
    //const deleteExperienceMutation = useDeleteEducation();
    const [currentRelation, setCurrentRelation] =
        useState<RelationShipsResponse | null>();

    const handleAddRelation = () => {
        setSelectedRelation(undefined);
        setIsModalOpen(true);
    };

    const handleEditRelation = (id: string) => {
        setSelectedRelation(id);
        setIsModalOpen(true);
    };

    const handleDeleteRelation = (id: string) => {
        try {
            //await deleteExperienceMutation.mutateAsync(id);
            notifications.show({
                title: 'Success',
                message: 'Relationship History deleted successfully',
                color: 'teal',
                icon: <IconCheck size={18} />,
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message:
                    'Failed to delete Relationship history. Please try again.',
                color: 'red',
                icon: <IconX size={18} />,
            });
        } finally {
            setDeleteConfirmOpen(false);
        }
    };

    // const selectedRelationData = relation?.find(
    //     (rel) => rel.id === selectedRelation,
    // );

    return (
        <>
            <Card withBorder radius="md" padding="lg">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <Title order={3} fw={600}>
                                Guardian
                            </Title>
                        </Group>

                        <ActionIcon
                            variant="light"
                            color="blue"
                            size="lg"
                            radius="xl"
                            onClick={handleAddRelation}
                            aria-label="Add experience"
                        >
                            <IconPlus size={18} />
                        </ActionIcon>
                    </Group>

                    <Divider />

                    {relation?.length === 0 ? (
                        <Text c="dimmed" ta="center" fs="italic">
                            No relationship history added yet.
                        </Text>
                    ) : (
                        <Stack gap="sm">
                            {relation
                                ?.slice(0, viewmore ? relation.length : 2)
                                .map((rel) => (
                                    <Card
                                        key={rel.id}
                                        withBorder
                                        radius="md"
                                        padding="md"
                                        style={{
                                            transition: 'box-shadow 200ms ease',
                                            '&:hover': {
                                                boxShadow:
                                                    'var(--mantine-shadow-md)',
                                            },
                                        }}
                                    >
                                        <Stack gap="xs">
                                            <Group
                                                justify="space-between"
                                                wrap="nowrap"
                                            >
                                                <Stack gap={2}>
                                                    <Text
                                                        fw={700}
                                                        size="xl"
                                                        style={{
                                                            letterSpacing:
                                                                '-0.5px',
                                                        }}
                                                    >
                                                        {rel.firstName}{' '}
                                                        {rel.lastName}
                                                    </Text>

                                                    <Stack gap="xs">
                                                        <Group gap="xl">
                                                            <Group gap="xs">
                                                                <Box c="gray.6">
                                                                    <IconUser
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Box>
                                                                <Text
                                                                    c="dimmed"
                                                                    size="sm"
                                                                >
                                                                    {rel.type ??
                                                                        'Not set'}
                                                                </Text>
                                                            </Group>

                                                            <Group gap="xs">
                                                                <Box c="gray.6">
                                                                    <IconCalendar
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Box>
                                                                <Text
                                                                    c="dimmed"
                                                                    size="sm"
                                                                >
                                                                    {rel.createdAt
                                                                        ? new Date(
                                                                              rel.createdAt,
                                                                          ).toLocaleDateString()
                                                                        : 'Not set'}
                                                                </Text>
                                                            </Group>

                                                            <Group gap="xs">
                                                                <Box c="gray.6">
                                                                    <IconPhone
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Box>
                                                                <Text
                                                                    c="dimmed"
                                                                    size="sm"
                                                                >
                                                                    {rel.email
                                                                        ? rel.email
                                                                        : 'Not set'}
                                                                </Text>
                                                            </Group>
                                                        </Group>
                                                    </Stack>
                                                </Stack>

                                                <Group gap="xs">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="gray"
                                                        onClick={() =>
                                                            handleEditRelation(
                                                                rel.id,
                                                            )
                                                        }
                                                        aria-label="Edit relationship"
                                                    >
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => {
                                                            setCurrentRelation(
                                                                rel,
                                                            );
                                                            setDeleteConfirmOpen(
                                                                true,
                                                            );
                                                        }}
                                                        aria-label="Delete relationship"
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                            </Group>
                                        </Stack>
                                    </Card>
                                ))}
                            {relation?.length > 2 && (
                                <Flex justify="center">
                                    <Button
                                        variant="subtle"
                                        color="blue"
                                        size="sm"
                                        onClick={() => setViewMore(!viewmore)}
                                    >
                                        {viewmore ? 'Show Less' : 'Show More'}
                                    </Button>
                                </Flex>
                            )}
                        </Stack>
                    )}
                </Stack>

                <Modal
                    opened={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={
                        <Group gap="sm">
                            {selectedRelation ? (
                                <>
                                    <IconPencil size={18} />
                                    <Text fw={600}>Edit relationship</Text>
                                </>
                            ) : (
                                <>
                                    <IconPlus size={18} />
                                    <Text fw={600}>Add relationship</Text>
                                </>
                            )}
                        </Group>
                    }
                    size="lg"
                    centered
                    radius="md"
                    overlayProps={{
                        backgroundOpacity: 0.55,
                        blur: 3,
                    }}
                >
                    <CreateRelationModal
                        studentId={'123123123'}
                        opened={isModalOpen}
                        relation={currentRelation}
                        onClose={() => setIsModalOpen(false)}
                    />
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal
                    opened={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    title="Delete Experience"
                    centered
                    radius="md"
                >
                    <Stack gap="sm">
                        <Text size="sm">
                            Are you sure you want to delete this relationship
                            history? This action cannot be undone.
                        </Text>
                        <Group justify="flex-end" mt="md">
                            <Button
                                variant="default"
                                onClick={() => setDeleteConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="red"
                                onClick={() =>
                                    currentRelation &&
                                    handleDeleteRelation(currentRelation.id)
                                }
                                leftSection={<IconTrash size={16} />}
                                //loading={deleteRelationMutation.isPending}
                            >
                                Delete
                            </Button>
                        </Group>
                    </Stack>
                </Modal>
            </Card>
        </>
    );
}
