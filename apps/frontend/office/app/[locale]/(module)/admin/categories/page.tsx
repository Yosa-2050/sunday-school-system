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
import { IconCheck, IconEdit, IconTrash, IconX } from '@tabler/icons-react'; // Importing icons
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCatrgoriesData } from 'app/[locale]/_api/admin/delete-skill';
import { editCategories } from 'app/[locale]/_api/admin/edit-categories';
import { addCategory, fetchCategories } from 'app/[locale]/_api/job-details';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface Category {
    id: string;
    isActive: boolean;
    name: string;
    isRoot: boolean;
    hasChild: boolean;
}

const CategoriesPage = () => {
    const t = useTranslations('categoriesPage');
    const queryClient = useQueryClient();
    const [newRegionName, setNewRegionName] = useState('');
    const [modalOpened, setModalOpened] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(
        null,
    );

    const { data: categories = [], isLoading: loadingCategories } = useQuery<
        Category[]
    >({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const addMutation = useMutation({
        mutationFn: () => addCategory({ name: newRegionName, isActive: true }),
        mutationKey: ['regions'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setModalOpened(false);
            setNewRegionName('');
        },
    });

    const editMutation = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            editCategories(id, name),

        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Category updated successfully',
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setEditModalOpened(false);
            setCategoryToEdit(null);
            setEditedCategoryName('');
        },

        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to update category',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteCatrgoriesData(id),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Categories deleted successfully',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setCategoryToDelete(null);
        },

        onError: (error: Error) => {
            notifications.show({
                title: 'Error',
                message: error.message || 'Failed to delete category',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const handleAddRegion = () => {
        addMutation.mutate();
    };

    const [editModalOpened, setEditModalOpened] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');

    const handleEditClick = (category: Category) => {
        setCategoryToEdit(category);
        setEditedCategoryName(category.name);
        setEditModalOpened(true);
    };

    const openDeleteModal = (id: string) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this category? This action
                    cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onCancel: () => setCategoryToDelete(null),
            onConfirm: () => {
                deleteMutation.mutate(id);
            },
        });
        setCategoryToDelete(id);
    };

    if (loadingCategories) {
        return <LoadingOverlay visible={true} h={'100%'} />;
    }

    return (
        <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
            <Flex align={'center'} justify={'space-between'}>
                <Text className="font-bold text-xl">{t('title')}</Text>
                <Button variant="filled" onClick={() => setModalOpened(true)}>
                    {t('addCategory')}
                </Button>
            </Flex>
            <Divider my="md" />

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={t('addCategory')}
                centered
            >
                <TextInput
                    label={t('categoryName')}
                    value={newRegionName}
                    onChange={(event) =>
                        setNewRegionName(event.currentTarget.value)
                    }
                />
                <Button onClick={handleAddRegion} mt="md">
                    {t('submit')}
                </Button>
            </Modal>

            {categories.length === 0 ? (
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
                                    {t('categoryName')}
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
                            {categories.map((category) => (
                                <Table.Tr key={category.id}>
                                    <Table.Td>{category.name}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        {category.isActive ? 'Yes' : 'No'}
                                    </Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>
                                        <Button
                                            variant="light"
                                            //   onClick={() => console.log(`Edit ${category.id}`)}
                                            onClick={() =>
                                                handleEditClick(category)
                                            }
                                        >
                                            <IconEdit size={16} />
                                        </Button>
                                        <Button
                                            variant="light"
                                            color="red"
                                            onClick={() =>
                                                openDeleteModal(category.id)
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
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title="Edit Category"
                centered
            >
                <TextInput
                    label="Name"
                    value={editedCategoryName}
                    onChange={(e) =>
                        setEditedCategoryName(e.currentTarget.value)
                    }
                />

                <Flex justify="end" mt="md" gap="sm">
                    <Button
                        variant="default"
                        onClick={() => {
                            setEditModalOpened(false);
                            setCategoryToEdit(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (categoryToEdit) {
                                const trimmedName = editedCategoryName.trim();

                                if (!trimmedName) {
                                    notifications.show({
                                        title: 'Validation Error',
                                        message:
                                            'Category name cannot be empty.',
                                        color: 'red',
                                        icon: <IconX size={16} />,
                                    });
                                    return;
                                }

                                editMutation.mutate({
                                    id: categoryToEdit.id,
                                    name: trimmedName,
                                });
                            }
                        }}
                    >
                        Save
                    </Button>
                </Flex>
            </Modal>
        </Paper>
    );
};

export default CategoriesPage;
