'use client';

import NoData from '@/components/NoData';
import {
    Button,
    Divider,
    Flex,
    LoadingOverlay,
    Modal,
    Paper,
    ScrollArea,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteSkill } from 'app/[locale]/_api/admin/delete-skill';
import { editSkills } from 'app/[locale]/_api/admin/edit-skills';
import { addSkills, fetchSkills } from 'app/[locale]/_api/job-details';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Skill {
    id: string;
    name: string;
    isActive: boolean;
}

const SkillsPage = () => {
    const t = useTranslations('skillsPage');
    const queryClient = useQueryClient();

    const [newSkillName, setNewSkillName] = useState('');
    const [modalOpened, setModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
    const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
    const [editedSkillName, setEditedSkillName] = useState('');

    const { data: skills = [], isLoading: loadingSkills } = useQuery<Skill[]>({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    const addMutation = useMutation({
        mutationFn: () => addSkills({ name: newSkillName, isActive: true }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            setModalOpened(false);
            setNewSkillName('');
        },
    });

    const editMutation = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            editSkills(id, name),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Skill updated successfully',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            queryClient.invalidateQueries({ queryKey: ['skills'] });
            setEditModalOpened(false);
            setSkillToEdit(null);
            setEditedSkillName('');
        },
        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update skill',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteSkill,
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Skill deleted successfully',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            setSkillToDelete(null);
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to delete skill',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const handleAddSkill = () => {
        addMutation.mutate();
    };

    const handleEditClick = (skill: Skill) => {
        setSkillToEdit(skill);
        setEditedSkillName(skill.name);
        setEditModalOpened(true);
    };

    const openDeleteModal = (id: string) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this skill? This action
                    cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => setSkillToDelete(null),
            onConfirm: () => {
                deleteMutation.mutate(id);
            },
        });

        setSkillToDelete(id);
    };

    if (loadingSkills) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align={'center'} justify={'space-between'}>
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button variant="filled" onClick={() => setModalOpened(true)}>
                    {t('addSkill')}
                </Button>
            </Flex>
            <Divider my="md" />

            {/* Add Skill Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={t('addSkill')}
                centered
            >
                <TextInput
                    label={t('skillName')}
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.currentTarget.value)}
                />
                <Button onClick={handleAddSkill} mt="md">
                    {t('submit')}
                </Button>
            </Modal>

            {/* Edit Skill Modal */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Skill"
                centered
            >
                <TextInput
                    label="Name"
                    value={editedSkillName}
                    onChange={(e) => setEditedSkillName(e.currentTarget.value)}
                />
                <Flex justify="end" mt="md" gap="sm">
                    <Button
                        variant="default"
                        onClick={() => {
                            setEditModalOpened(false);
                            setSkillToEdit(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (skillToEdit) {
                                const trimmed = editedSkillName.trim();
                                if (!trimmed) {
                                    notifications.show({
                                        title: 'Validation Error',
                                        message: 'Skill name cannot be empty.',
                                        color: 'red',
                                        icon: <IconX size={16} />,
                                    });
                                    return;
                                }
                                editMutation.mutate({
                                    id: skillToEdit.id,
                                    name: trimmed,
                                });
                            }
                        }}
                    >
                        Save
                    </Button>
                </Flex>
            </Modal>

            {/* Skills Table */}
            {skills.length === 0 ? (
                <NoData />
            ) : (
                <ScrollArea>
                    <Table
                        striped
                        highlightOnHover
                        withRowBorders
                        withColumnBorders
                    >
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>{t('skillName')}</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>
                                    {t('isActive')}
                                </Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>
                                    {t('actions')}
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {skills.map((skill) => (
                                <Table.Tr key={skill.id}>
                                    <Table.Td>{skill.name}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {skill.isActive ? 'Yes' : 'No'}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Button
                                            variant="light"
                                            onClick={() =>
                                                handleEditClick(skill)
                                            }
                                        >
                                            <IconEdit size={16} />
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="red"
                                            onClick={() =>
                                                openDeleteModal(skill.id)
                                            }
                                        >
                                            <IconTrash size={16} />
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            )}
        </Paper>
    );
};

export default SkillsPage;
