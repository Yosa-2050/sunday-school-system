import { useState } from 'react';
import { Button, FileButton, Group, Select, Text, Modal, List } from '@mantine/core';
import { useAuth } from '@shega/ui';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { RoleEnum } from 'node_modules/@shega/shared/src/types/role';
import { showError, showSuccess } from 'utilities/notification';
import { useActiveSelection } from 'utilities/utilities';
import { uploadFileApi } from '../../school_admin/students/schemas/api';
import type { StudentResponse } from '../../school_admin/students/schemas/type';

interface Section {
    id: string;
    name: string;
}

interface ClassItem {
    id: string;
    name: string;
    sections?: Section[];
}

interface StudentControlsProps {
    classes: ClassItem[];
    selectedClass: string | null;
    selectedSection: string | null;
    students: StudentResponse[];
    studentsCount?: number;
    disableAction?: boolean;
    onClassChange: (value: string | null) => void;
    onSectionChange: (value: string | null) => void;
    onLoadStudents: () => void;
    onPrint: () => void;
}

export function StudentControls({
    classes,
    selectedClass,
    selectedSection,
    studentsCount,
    onClassChange,
    onSectionChange,
    onLoadStudents,
    onPrint,
}: StudentControlsProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    
    const SelectedClassId = useActiveSelection(selectedSection, selectedClass);
    const router = useRouter();

    const { user } = useAuth();
    const disableAction =
        !selectedClass ||
        (!!classes.find((c) => c.id === selectedClass)?.sections?.length &&
            !selectedSection);

    const handleImport = async (file: File | null) => {
        if (!(file && selectedClass)) {
            return;
        }

        setIsImporting(true);
        setImportErrors([]);

        try {
            await uploadFileApi(`/student/import/${SelectedClassId}`, file);
            showSuccess('Students uploaded successfully');
            onLoadStudents();
        } catch (error: any) {
            if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
                setImportErrors(error.errors);
                setShowErrorModal(true);
            } else {
                showError(error.message || 'Failed to upload students');
            }
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <>
            {/* Class & Section Selection */}
            <Group mb="md">
                <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={onClassChange}
                    data={classes.map((c) => ({ value: c.id, label: c.name }))}
                />
                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Select
                        placeholder="Select Section"
                        value={selectedSection}
                        onChange={onSectionChange}
                        data={
                            classes
                                .find((c) => c.id === selectedClass)
                                ?.sections?.map((s) => ({
                                    value: s.id,
                                    label: s.name,
                                })) ?? []
                        }
                    />
                ) : null}
                <Button
                    variant="light"
                    onClick={onLoadStudents}
                    disabled={disableAction}
                >
                    Load Students
                </Button>
            </Group>

            {/* Import Button */}
            <Group mb="md" justify="space-between">
                {(studentsCount ?? 0) > 0 && (
                    <Text fw={500} size="md">
                        Total Students:{studentsCount}
                    </Text>
                )}
                <Text fw={500}>{/* Students */}</Text>
                {[
                    RoleEnum.administrator,
                    RoleEnum.super_admin,
                    RoleEnum.school_admin,
                ].includes(user?.role as RoleEnum) && (
                    <Group>
                        <Button
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => onPrint()}
                            disabled={disableAction}
                        >
                            Print ID Cards
                        </Button>
                        <Button
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() =>
                                router.push(
                                    `/school_admin/students/create?class=${selectedClass}`,
                                )
                            }
                            disabled={!SelectedClassId}
                        >
                            Add New Student
                        </Button>
                        <FileButton onChange={handleImport} accept=".xlsx,.xls">
                            {(props) => (
                                <Button
                                    {...props}
                                    variant="light"
                                    size="sm"
                                    loading={isImporting}
                                    leftSection={<IconUpload size={16} />}
                                >
                                    Import from Excel
                                </Button>
                            )}
                        </FileButton>
                    </Group>
                )}
            </Group>

            <Modal
                opened={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Import Validation Errors"
                centered
            >
                <Text c="red" mb="md">The following errors were found in the uploaded Excel file:</Text>
                <List size="sm" spacing="xs">
                    {importErrors.map((err, idx) => (
                        <List.Item key={idx}>{err}</List.Item>
                    ))}
                </List>
                <Group justify="right" mt="md">
                    <Button onClick={() => setShowErrorModal(false)}>Close</Button>
                </Group>
            </Modal>
        </>
    );
}
