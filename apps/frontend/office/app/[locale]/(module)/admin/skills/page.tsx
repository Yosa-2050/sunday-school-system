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
import { IconEdit, IconTrash } from '@tabler/icons-react'; // Importing icons
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    addSkills,
    deleteCategory,
    fetchSkills,
} from 'app/[locale]/_api/job-details';
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
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

    const { data: skills = [], isLoading: loadingSkills } = useQuery<Skill[]>({
        queryKey: ['skills'],
        queryFn: fetchSkills,
    });

    const addMutation = useMutation({
        mutationFn: () => addSkills({ name: newSkillName, isActive: true }),
        mutationKey: ['skills'],
        onSuccess: () => {
            queryClient.invalidateQueries(['skills']);
            setModalOpened(false);
            setNewSkillName('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        mutationKey: ['deleteSkill'],
        onSuccess: () => {
            queryClient.invalidateQueries(['skills']);
            setSkillToDelete(null);
        },
    });

    const handleAddSkill = () => {
        addMutation.mutate();
    };

    const openDeleteModal = (id: string) => {
        setSkillToDelete(id);
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
                if (skillToDelete) {
                    deleteMutation.mutate(skillToDelete);
                }
            },
        });
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

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={t('addSkill')}
                centered
            >
                <TextInput
                    label={t('skillName')}
                    value={newSkillName}
                    onChange={(event) =>
                        setNewSkillName(event.currentTarget.value)
                    }
                />
                <Button onClick={handleAddSkill} mt="md">
                    {t('submit')}
                </Button>
            </Modal>

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
                                <Table.Th style={{ textAlign: 'left' }}>
                                    {t('skillName')}
                                </Table.Th>
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
                                                console.log(`Edit ${skill.id}`)
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
