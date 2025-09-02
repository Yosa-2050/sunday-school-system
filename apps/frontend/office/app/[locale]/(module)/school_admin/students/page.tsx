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
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi, importStudentsApi } from './schemas/api';
import type { StudentResponse } from './schemas/type';

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

    // Fetch classes (one-time load, since year is fixed/disabled)
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

    // Fetch students manually (on button click)
    const handleFetchStudents = async () => {
        if (!selectedClass) {
            return;
        }

        setStudents([]);

        try {
            setLoadingStudents(true);
            const data = await fetchStudentsApi(
                selectedSection ?? selectedClass,
            );
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
            await importStudentsApi(file, selectedSection ?? selectedClass);
            await handleFetchStudents(); // refresh students after import
        } catch (err) {
            // handle error
        }
    };
    const router = useRouter();

    const rows = students.map((student) => (
        <Table.Tr key={student.id}>
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
                            href={`/students/${student.id}/edit`}
                        >
                            Edit Student
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            leftSection={<IconX size={16} />}
                            color="red"
                            onClick={() => {
                                // Add your delete/inactivate logic here
                                //console.log("Delete student:", student.id);
                            }}
                        >
                            {student.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

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
                        setSelectedSection(null); // reset section when class changes
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
                    disabled={
                        !selectedClass || // no class selected
                        (!!classes?.find((c) => c.id === selectedClass)
                            ?.sections?.length &&
                            !selectedSection) // class has sections but section not chosen
                    }
                >
                    Load Students
                </Button>
            </Group>

            {/* Import Button */}
            <Group mb="md" justify="space-between">
                <Text fw={500}>Students</Text>
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

            {/* Student Table */}
            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
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
        </div>
    );
}
