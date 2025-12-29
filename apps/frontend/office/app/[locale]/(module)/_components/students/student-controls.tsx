import { Button, FileButton, Group, Select, Text } from '@mantine/core';
import { IconPlus, IconUpload } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
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
    const SelectedClassId = useActiveSelection(selectedSection, selectedClass);
    const router = useRouter();

    const disableAction =
        !selectedClass ||
        (!!classes.find((c) => c.id === selectedClass)?.sections?.length &&
            !selectedSection);

    const handleImport = async (file: File | null) => {
        if (!(file && selectedClass)) {
            return;
        }

        try {
            await uploadFileApi(`/student/import/${SelectedClassId}`, file);
            showSuccess('Students uploaded successfully');
            onLoadStudents();
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (error: any) {
            showError(error.message);
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
                            >
                                Import from Excel
                            </Button>
                        )}
                    </FileButton>
                </Group>
            </Group>
        </>
    );
}
