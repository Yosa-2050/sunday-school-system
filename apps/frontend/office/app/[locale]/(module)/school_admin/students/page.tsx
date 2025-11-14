'use client';

import {
    ActionIcon,
    Button,
    FileButton,
    Group,
    Loader,
    Menu,
    Select,
    Table,
    Text,
} from '@mantine/core';
import {
    IconDots,
    IconEdit,
    IconEye,
    IconPlus,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showError, showSuccess } from 'utilities/notification';
import { useActiveSelection } from 'utilities/utilities';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import CreateRelationModal from './components/CreateRelationShip';
import { PrintIdModal } from './components/PrintIdModal';
import { fetchStudentsApi, uploadFileApi } from './schemas/api';
import type { StudentForPrint, StudentResponse } from './schemas/type';

export default function StudentPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [createStudentModalOpened, setCreateStudentModalOpened] =
        useState(false);

    const [createRelationModalOpened, setCreateRelationModalOpened] =
        useState(false);
    const [newStudentId, setNewStudentId] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<StudentForPrint[]>(
        [],
    );
    const [printModalOpen, setPrintModalOpen] = useState(false);

    const router = useRouter();

    const SelectedClassId = useActiveSelection(selectedSection, selectedClass);
    // Function to handle batch printing
    const handleBatchPrint = (studentsToPrint: StudentResponse[]) => {
        setSelectedStudents(studentsToPrint);
        setPrintModalOpen(true);
    };
    // Fetch calendar years
    useEffect(() => {
        const getCalendarYears = async () => {
            try {
                setLoadingYears(true);
                const data: CalendarYearResponse[] =
                    await fetchCalendarYearsSchoolAdmin();
                setCalendarYears(data);
                const active = data.find((y) => y.isActive);
                if (active) {
                    setCalendarYear(active.name);
                }
            } finally {
                setLoadingYears(false);
            }
        };

        getCalendarYears();
    }, []);

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi();
                setClasses(data);
            } catch (err) {
                // handle error
            }
        };

        fetchClasses();
    }, []);

    const handleFetchStudents = async () => {
        if (!selectedClass) {
            return;
        }

        setStudents([]);

        try {
            setLoadingStudents(true);
            const data = await fetchStudentsApi(SelectedClassId ?? '');
            setStudents(data);
        } finally {
            setLoadingStudents(false);
        }
    };

    // Upload excel and import students
    const handleImport = async (file: File | null) => {
        if (!(file && selectedClass)) {
            return;
        }

        try {
            await uploadFileApi(`/student/import/${SelectedClassId}`, file);
            showSuccess('Students uploaded successfully');
            await handleFetchStudents();
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (error: any) {
            showError(error.message);
        }
    };

    const handleStudentCreated = (studentId: string) => {
        setNewStudentId(studentId);
        setCreateStudentModalOpened(false);
        setCreateRelationModalOpened(true);
        handleFetchStudents(); // Refresh the list
    };

    const rows = students.map((student, index) => (
        <Table.Tr key={student.id}>
            <Table.Td className="text-center">{index + 1}</Table.Td>
            <Table.Td>{student.idNumber}</Table.Td>
            <Table.Td>
                {student.firstName} {student.lastName}
            </Table.Td>
            <Table.Td>{student.isActive ? 'Active' : 'Inactive'}</Table.Td>
            <Table.Td>
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEye size={16} />}
                            onClick={() =>
                                router.push(
                                    `/school_admin/students/${student.id}`,
                                )
                            }
                        >
                            View Details
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            component={Link}
                            href={'/school_admin/students/create'}
                        >
                            Edit Student
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            leftSection={<IconX size={16} />}
                            color="red"
                            onClick={() => {
                                // Add your delete/inactivate logic here
                            }}
                        >
                            {student.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    const disableAction =
        !selectedClass ||
        (!!classes?.find((c) => c.id === selectedClass)?.sections?.length &&
            !selectedSection);
    return (
        <div>
            {/* Calendar Year */}
            <Group mb="md">
                <Text fw={500}>Calendar Year:</Text>
                {loadingYears ? (
                    <Loader size="sm" />
                ) : (
                    <Select
                        value={calendarYear}
                        data={calendarYears.map((y) => ({
                            value: y.name,
                            label: y.name,
                        }))}
                        disabled
                        onChange={setCalendarYear}
                    />
                )}
            </Group>

            {/* Class & Section Selection */}
            <Group mb="md">
                <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={(val) => {
                        setSelectedClass(val);
                        setSelectedSection(null);
                    }}
                    data={classes.map((c) => ({ value: c.id, label: c.name }))}
                />
                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Select
                        placeholder="Select Section"
                        value={selectedSection}
                        onChange={setSelectedSection}
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
                    onClick={handleFetchStudents}
                    disabled={disableAction}
                >
                    Load Students
                </Button>
            </Group>

            {/* Import Button */}
            <Group mb="md" justify="space-between">
                {students.length > 0 && (
                    <Text fw={500} size="md">
                        Total Students:{students.length}
                    </Text>
                )}
                {/* the below text is used to make the buttons fixed on the right side  */}
                <Text fw={500}>{/* Students */}</Text>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => handleBatchPrint(students)} // or all students
                        disabled={disableAction}
                    >
                        Print ID Cards
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() =>
                            router.push('/school_admin/students/create')
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

            {/* Student Table */}
            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>No</Table.Th>
                        <Table.Th>Id Number</Table.Th>
                        <Table.Th>Full Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loadingStudents ? (
                        <Table.Tr>
                            <Table.Td colSpan={4}>
                                <Loader size="sm" />
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* Modals
            <CreateProfileModal
                opened={createStudentModalOpened}
                onClose={() => {
                    setCreateStudentModalOpened(false);
                    handleFetchStudents();
                }}
                onCreated={handleStudentCreated}
                mutationFn={({ SelectedClassId, data }) =>
                    createStudentApi({
                        classId: SelectedClassId,
                        studentData: data,
                    })
                }
                extraData={{ SelectedClassId }}
                title="Add Student"
            /> */}

            <CreateRelationModal
                opened={createRelationModalOpened}
                onClose={() => setCreateRelationModalOpened(false)}
                studentId={newStudentId}
            />
            {/* <CreateStudentPage /> */}

            <PrintIdModal
                opened={printModalOpen}
                onClose={() => setPrintModalOpen(false)}
                students={selectedStudents}
            />
        </div>
    );
}
