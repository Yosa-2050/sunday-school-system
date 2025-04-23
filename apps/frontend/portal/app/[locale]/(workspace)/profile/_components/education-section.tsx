'use client';

import {
    ActionIcon,
    Badge,
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
    rem,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconPencil,
    IconPlus,
    IconSchool,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { type Education, useDeleteEducation } from 'app/_api/profile/queries';
import { useState } from 'react';
import EducationForm from './forms/education-form';

export default function EducationSection({
    education,
}: {
    education: Education[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [selectedEducation, setSelectedEducation] = useState<
        string | undefined
    >();
    const [viewmore, setViewMore] = useState(false);
    // const updateExperienceMutation = useUpdateExperience();
    const deleteExperienceMutation = useDeleteEducation();
    const [currentEducation, setCurrentEducation] =
        useState<Education | null>();

    const handleAddEducation = () => {
        setSelectedEducation(undefined);
        setIsModalOpen(true);
    };

    const handleEditEducation = (id: string) => {
        setSelectedEducation(id);
        setIsModalOpen(true);
    };

    const handleDeleteExperience = async (id: string) => {
        try {
            await deleteExperienceMutation.mutateAsync(id);
            notifications.show({
                title: 'Success',
                message: 'Experience deleted successfully',
                color: 'teal',
                icon: <IconCheck size={18} />,
            });
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete experience. Please try again.',
                color: 'red',
                icon: <IconX size={18} />,
            });
        } finally {
            setDeleteConfirmOpen(false);
        }
    };

    const selectedEducationData = education?.find(
        (edu) => edu.id === selectedEducation,
    );

    return (
        <>
            <Card withBorder radius="md" padding="lg">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <IconSchool size={20} />
                            <Title order={3} fw={600}>
                                Education
                            </Title>
                        </Group>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            variant="light"
                            size="sm"
                            onClick={handleAddEducation}
                            radius="xl"
                        >
                            Add Education
                        </Button>
                    </Group>

                    <Divider />

                    {education?.length === 0 ? (
                        <Box
                            p="md"
                            style={{
                                borderRadius: rem(8),
                                backgroundColor: 'var(--mantine-color-gray-0)',
                            }}
                        >
                            <Text c="dimmed" ta="center" fs="italic">
                                No education history added yet.
                            </Text>
                        </Box>
                    ) : (
                        <Stack gap="sm">
                            {education
                                ?.slice(0, viewmore ? education?.length : 2)
                                .map((edu) => (
                                    <Card
                                        key={edu.id}
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
                                                    <Title
                                                        order={5}
                                                        fw={600}
                                                        lineClamp={1}
                                                    >
                                                        {edu.school}
                                                    </Title>
                                                    <Text
                                                        size="sm"
                                                        fw={500}
                                                        c="dimmed"
                                                    >
                                                        {edu.level} •{' '}
                                                        {edu.fieldOfStudyId}
                                                    </Text>
                                                </Stack>
                                                <Group gap="xs">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="gray"
                                                        onClick={() =>
                                                            handleEditEducation(
                                                                edu.id,
                                                            )
                                                        }
                                                        aria-label="Edit experience"
                                                    >
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => {
                                                            setCurrentEducation(
                                                                edu,
                                                            );
                                                            setDeleteConfirmOpen(
                                                                true,
                                                            );
                                                        }}
                                                        aria-label="Delete experience"
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Group>
                                            </Group>

                                            <Group gap="sm">
                                                <Badge
                                                    variant="light"
                                                    color="blue"
                                                    radius="sm"
                                                >
                                                    {new Date(
                                                        edu.startDate,
                                                    ).toLocaleDateString()}{' '}
                                                    -{' '}
                                                    {edu.endDate
                                                        ? new Date(
                                                              edu.endDate,
                                                          ).toLocaleDateString()
                                                        : 'Present'}
                                                </Badge>
                                                {edu.grade > 0 && (
                                                    <Badge
                                                        variant="light"
                                                        color="teal"
                                                        radius="sm"
                                                    >
                                                        Grade: {edu.grade}%
                                                    </Badge>
                                                )}
                                            </Group>

                                            {edu.description && (
                                                <Text size="sm" mt="xs">
                                                    {edu.description}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Card>
                                ))}
                            {education?.length > 2 && (
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
            </Card>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    <Group gap="sm">
                        {selectedEducation ? (
                            <>
                                <IconPencil size={18} />
                                <Text fw={600}>Edit Education</Text>
                            </>
                        ) : (
                            <>
                                <IconPlus size={18} />
                                <Text fw={600}>Add Education</Text>
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
                <EducationForm
                    education={selectedEducationData}
                    onCancel={() => setIsModalOpen(false)}
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
                        Are you sure you want to delete this education history?
                        This action cannot be undone.
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
                                currentEducation &&
                                handleDeleteExperience(currentEducation.id)
                            }
                            leftSection={<IconTrash size={16} />}
                            loading={deleteExperienceMutation.isPending}
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
