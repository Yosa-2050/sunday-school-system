import { useState } from 'react';
import {
    Button,
    FileButton,
    Group,
    List,
    Loader,
    Modal,
    Select,
    Stack,
    Text,
} from '@mantine/core';
import { useAuth } from '@shega/ui';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { RoleEnum } from '@shega/shared';
import { showError } from 'utilities/notification';
import { useActiveSelection } from 'utilities/utilities';
import { ImportStudentModal } from '../../school_admin/students/components/import-modal';
import { previewStudentImportApi } from '../../school_admin/students/schemas/api';
import type { ImportStudentRow } from '../../school_admin/students/schemas/type';

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
    studentsCount?: number;
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
    const [isPreparingImportPreview, setIsPreparingImportPreview] = useState(false);
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [importPreviewData, setImportPreviewData] = useState<ImportStudentRow[]>([]);
    const [showImportPreviewModal, setShowImportPreviewModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showImportSavingModal, setShowImportSavingModal] = useState(false);
    
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

        setIsPreparingImportPreview(true);
        setImportErrors([]);

        try {
            const previewData = await previewStudentImportApi(file);
            if (!previewData.length) {
                showError('No students found in the selected file');
                return;
            }

            setImportPreviewData(previewData);
            setShowImportPreviewModal(true);
        } catch (error: any) {
            if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
                setImportErrors(error.errors);
                setShowErrorModal(true);
            } else {
                showError(error.message || 'Failed to upload students');
            }
        } finally {
            setIsPreparingImportPreview(false);
        }
    };

    return (
        <>
            {/* Class & Section Selection */}
            <Group mb="md" justify="flex-start" align="flex-end">
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
            <Group mb="md" justify="flex-end">
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
                                    leftSection={<IconUpload size={16} />}
                                    disabled={
                                        !SelectedClassId ||
                                        isPreparingImportPreview ||
                                        showImportSavingModal
                                    }
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

            <ImportStudentModal
                opened={showImportPreviewModal}
                onClose={() => {
                    setShowImportPreviewModal(false);
                    setImportPreviewData([]);
                }}
                classId={SelectedClassId}
                data={importPreviewData}
                refreshStudentTable={onLoadStudents}
                onSavingChange={setShowImportSavingModal}
            />
            <Modal
                opened={isPreparingImportPreview}
                onClose={() => {}}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                centered
            >
                <Stack align="center" gap="md" py="md">
                    <Loader size="lg" />
                    <Text fw={500}>Preparing import preview...</Text>
                    <Text size="sm" c="dimmed">
                        Please wait while the file is being processed.
                    </Text>
                </Stack>
            </Modal>

            <Modal
                opened={showImportSavingModal}
                onClose={() => {}}
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                centered
            >
                <Stack align="center" gap="md" py="md">
                    <Loader size="lg" />
                    <Text fw={500}>Saving imported students...</Text>
                    <Text size="sm" c="dimmed">
                        Please wait while the student table is updated.
                    </Text>
                </Stack>
            </Modal>
        </>
    );
}
