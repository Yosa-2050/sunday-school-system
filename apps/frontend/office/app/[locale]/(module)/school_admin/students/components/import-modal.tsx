'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Button,
    Checkbox,
    Group,
    Modal,
    ScrollArea,
    Table,
    Text,
} from '@mantine/core';
import { showError, showSuccess } from 'utilities/notification';
import { importStudentsFromDataApi } from '../schemas/api';
import type { ImportStudentRow } from '../schemas/type';

type ImportStudentModalProps = {
    opened: boolean;
    onClose: () => void;
    classId: string | null;
    data: ImportStudentRow[];
    refreshStudentTable: () => Promise<void> | void;
    onSavingChange?: (value: boolean) => void;
};

export function ImportStudentModal({
    opened,
    onClose,
    classId,
    data,
    refreshStudentTable,
    onSavingChange,
}: ImportStudentModalProps) {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!opened) {
            setSelectedRows([]);
            return;
        }

        setSelectedRows(data.map((_, index) => index));
    }, [data, opened]);

    const selectedData = useMemo(
        () => data.filter((_, index) => selectedRows.includes(index)),
        [data, selectedRows],
    );

    const handleSelectAll = (checked: boolean) => {
        setSelectedRows(checked ? data.map((_, index) => index) : []);
    };

    const handleSelectRow = (index: number, checked: boolean) => {
        setSelectedRows((prev) =>
            checked ? [...prev, index] : prev.filter((item) => item !== index),
        );
    };

    const handleSave = async () => {
        if (!classId) {
            showError('Please select a class before importing students');
            return;
        }

        if (selectedData.length === 0) {
            showError('Select at least one student to import');
            return;
        }

        try {
            setIsSaving(true);
            onSavingChange?.(true);
            await importStudentsFromDataApi({
                classId,
                data: selectedData,
            });
            showSuccess('Students imported successfully');
            onClose();
            await refreshStudentTable();
        } catch (error: any) {
            if (Array.isArray(error?.errors) && error.errors.length > 0) {
                showError(error.errors[0]);
            } else {
                showError(error?.message || 'Failed to import students');
            }
        } finally {
            setIsSaving(false);
            onSavingChange?.(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Confirm imported students"
            size="xl"
            centered
        >
            <Text size="sm" mb="md">
                Review the imported rows, uncheck any student you do not want to
                save, then confirm.
            </Text>

            <ScrollArea h={420}>
                <Table striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th w={60}>
                                <Checkbox
                                    color="rgb(248 193 0)"
                                    checked={
                                        data.length > 0 &&
                                        selectedRows.length === data.length
                                    }
                                    indeterminate={
                                        selectedRows.length > 0 &&
                                        selectedRows.length < data.length
                                    }
                                    onChange={(event) =>
                                        handleSelectAll(
                                            event.currentTarget.checked,
                                        )
                                    }
                                />
                            </Table.Th>
                            <Table.Th>Id Number</Table.Th>
                            <Table.Th>Full Name</Table.Th>
                            <Table.Th>Gender</Table.Th>
                            <Table.Th>Phone</Table.Th>
                            <Table.Th>Emergency Contact</Table.Th>
                            <Table.Th>Relationship</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {data.map((row, index) => (
                            <Table.Tr key={`${row.IdNumber}-${index}`}>
                                <Table.Td>
                                    <Checkbox
                                        color="rgb(13 64 73)"
                                        checked={selectedRows.includes(index)}
                                        onChange={(event) =>
                                            handleSelectRow(
                                                index,
                                                event.currentTarget.checked,
                                            )
                                        }
                                    />
                                </Table.Td>
                                <Table.Td>{row.IdNumber || '-'}</Table.Td>
                                <Table.Td>
                                    {[
                                        row.FirstName,
                                        row.MiddleName,
                                        row.LastName,
                                    ]
                                        .filter(Boolean)
                                        .join(' ') || '-'}
                                </Table.Td>
                                <Table.Td>{row.Gender || '-'}</Table.Td>
                                <Table.Td>{row.PhoneNumber || '-'}</Table.Td>
                                <Table.Td>
                                    {row.EmergencyContact || '-'}
                                </Table.Td>
                                <Table.Td>
                                    {row.RelationshipType || '-'}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </ScrollArea>

            <Group justify="space-between" mt="md">
                <Text size="sm">
                    {selectedRows.length} of {data.length} selected
                </Text>

                <Group>
                    <Button variant="default" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button loading={isSaving} onClick={handleSave}>
                       Confirm & Save 
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
}
