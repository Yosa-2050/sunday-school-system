'use client';

import {
    Box,
    Button,
    Group,
    Loader,
    Menu,
    Select,
    Table,
    Text,
} from '@mantine/core';
import {
    IconDots,
    IconEye,
    IconPencil,
    IconPlus,
    IconX,
} from '@tabler/icons-react';
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { fetchSubjectsAssignmentApi } from '../assign_subject/schemas/api';
import type { SubjectAssignmentResponse } from '../assign_subject/schemas/type';
import type { GetClass } from '../classes/create/components/schema/fetchClassesDetail';
import { fetchClassesApi } from '../classes/create/components/schema/fetchClassesDetail';
import { TestDrawer } from './component/test.drawer';
import { FetchTestBySubjectIdApi } from './schema/api';
import type { TestResponse } from './schema/type';

export default function TestPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'delete'>(
        'create',
    );
    const router = useRouter();
    const [editTest, setEditTest] = useState<TestResponse | null>(null);

    const [classes, setClasses] = useState<GetClass[]>([]);
    const [subjects, setSubjects] = useState<SubjectAssignmentResponse[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const [tests, setTests] = useState<TestResponse[]>([]);
    const [loadingTests, setLoadingTests] = useState(false);

    // --- Drawer handlers ---
    const handleCreateClick = () => {
        setEditTest(null);
        setDrawerMode('create');
        setDrawerOpen(true);
    };

    const handleEditClick = (test: TestResponse) => {
        setEditTest(test);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    const handleDeleteClick = (test: TestResponse) => {
        setEditTest(test);
        setDrawerMode('delete');
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditTest(null);
    };

    const handleDrawerCompleted = () => {
        handleDrawerClose();
        fetchTestsData();
    };

    const getSelectedClassId = selectedSection ?? selectedClass;

    useEffect(() => {
        const getCalendarYears = async () => {
            try {
                setLoadingYears(true);
                const data = await fetchCalendarYearsSchoolAdmin();
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

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi();
                setClasses(data);
            } catch (error) {
                //showError(error.message)
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        if (!getSelectedClassId) {
            setSubjects([]);
            setSelectedSubject(null);
            return;
        }
        const fetchSubjects = async () => {
            try {
                const data =
                    await fetchSubjectsAssignmentApi(getSelectedClassId);
                setSubjects(data);
            } catch (error) {
                //showError(error?.message)
            }
        };
        fetchSubjects();
    }, [getSelectedClassId]);

    // --- Fetch tests ---
    const fetchTestsData = useCallback(async () => {
        if (!selectedSubject) {
            setTests([]);
            return;
        }

        try {
            setLoadingTests(true);
            const data = await FetchTestBySubjectIdApi(selectedSubject);
            setTests(data);
        } catch (err) {
            //console.error('Error fetching tests', err);
        } finally {
            setLoadingTests(false);
        }
    }, [selectedSubject]);

    useEffect(() => {
        fetchTestsData();
    }, [fetchTestsData]);

    // --- Table rows ---
    const rows = tests.map((test, index) => (
        <Table.Tr key={test.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{test.name}</Table.Td>
            {/* <Table.Td>{test.description}</Table.Td> */}
            <Table.Td>{test.type}</Table.Td>
            {/* <Table.Td>{test.documentId ?? '-'}</Table.Td> */}
            <Table.Td>{test.weight}</Table.Td>
            <Table.Td>{test.isGroupAssignment ? 'Yes' : 'No'}</Table.Td>
            <Table.Td>
                <Menu shadow="md" width={180}>
                    <Menu.Target>
                        <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconDots size={16} />}
                        >
                            Actions
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEye size={16} />}
                            onClick={() =>
                                router.push(`/school_admin/test/${test.id}`)
                            }
                        >
                            View Details
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconPencil size={16} />}
                            onClick={() => handleEditClick(test)}
                        >
                            Edit Test
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconX size={16} />}
                            onClick={() => handleDeleteClick(test)}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <Group mb="md">
                <Text fw={500}>Calendar Year:</Text>
                {loadingYears ? (
                    <Loader size="sm" />
                ) : (
                    <Select
                        value={calendarYear}
                        data={[calendarYear || '']}
                        disabled
                    />
                )}
            </Group>

            <Group
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
                mb="md"
            >
                <Text fw={500}>Tests</Text>
                <Button
                    onClick={handleCreateClick}
                    leftSection={<IconPlus size={16} />}
                    disabled={!selectedSubject}
                >
                    Add Test
                </Button>
            </Group>

            <Group mb="md" align="flex-end">
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select Class:
                    </Text>
                    <Select
                        placeholder="Choose class"
                        value={selectedClass}
                        onChange={(value) => {
                            setSelectedClass(value);
                            setSelectedSection(null);
                            setTests([]);
                        }}
                        data={classes.map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>
                <Box>
                    <Text size="sm" fw={500} mb={5}>
                        Select subject:
                    </Text>
                    <Select
                        placeholder="Choose subject"
                        value={selectedSubject}
                        onChange={(value) => {
                            setSelectedSubject(value);
                            setTests([]);
                        }}
                        data={subjects.map((s) => ({
                            value: s.id,
                            label: s.subjectTitle,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                {selectedClass &&
                classes.find((c) => c.id === selectedClass)?.sections
                    ?.length ? (
                    <Box>
                        <Text size="sm" fw={500} mb={5}>
                            Select Section:
                        </Text>
                        <Select
                            placeholder="Choose section"
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
                            style={{ width: 200 }}
                        />
                    </Box>
                ) : null}
            </Group>

            <TestDrawer
                subject={subjects.find((s) => s.id === selectedSubject)}
                mode={drawerMode}
                test={editTest ?? undefined}
                opened={drawerOpen}
                onClose={handleDrawerClose}
                onCompleted={handleDrawerCompleted}
            />

            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>#</Table.Th>
                        <Table.Th>Name</Table.Th>
                        {/* <Table.Th>Description</Table.Th> */}
                        <Table.Th>Type</Table.Th>
                        {/* <Table.Th>Document</Table.Th> */}
                        <Table.Th>Weight</Table.Th>
                        <Table.Th>Group</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {tests.length === 0 ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={8}
                                style={{ textAlign: 'center' }}
                            >
                                No tests found
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
