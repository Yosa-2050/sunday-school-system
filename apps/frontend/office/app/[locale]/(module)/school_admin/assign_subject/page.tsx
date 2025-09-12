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
import { IconDots, IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { AssignmentDrawer } from './component/assignment.drawer';
import { fetchSubjectsAssignmentApi } from './schemas/api';
import type { SubjectAssignmentResponse } from './schemas/type';

// Teacher Type Enum (replace with your actual enum values)
const TeacherType = {
    FULL_TIME: 'Full Time',
    PART_TIME: 'Part Time',
    CONTRACT: 'Contract',
    VISITING: 'Visiting',
} as const;

type TeacherType = keyof typeof TeacherType;

// Main Page Component
export default function SubjectAssignmentPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [editAssignment, setEditAssignment] =
        useState<SubjectAssignmentResponse | null>(null);

    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const [subjAssignment, setSubjAssignment] = useState<
        SubjectAssignmentResponse[]
    >([]);

    const handleCreateClick = () => {
        setEditAssignment(null);
        setDrawerMode('create');
        setDrawerOpen(true);
    };

    const handleEditClick = (assignment: SubjectAssignmentResponse) => {
        setEditAssignment(assignment);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditAssignment(null);
    };

    const handleDrawerCompleted = () => {
        handleDrawerClose();
    };

    const getSelectedClassId = {
        id:
            !selectedClass ||
            (!!classes?.find((c) => c.id === selectedClass)?.sections?.length &&
                !selectedSection)
                ? null
                : (selectedSection ?? selectedClass),
    };

    // Fetch calendar years once
    useEffect(() => {
        const getCalendarYears = async () => {
            try {
                setLoadingYears(true);
                const data = await fetchCalendarYearsSchoolAdmin();
                setCalendarYears(data);
                // auto-select active year
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
            } catch (err) {
                // handle error
            }
        };

        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchAssignment = async () => {
            const selected = getSelectedClassId.id;
            if (selected) {
                try {
                    const data = await fetchSubjectsAssignmentApi(selected);
                    setSubjAssignment(data);
                } catch (err) {
                    // handle error
                }
            }
        };

        fetchAssignment();
    }, [getSelectedClassId.id]);

    const rows = subjAssignment.map((item, index) => (
        <Table.Tr key={item.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{item.subjectName}</Table.Td>
            <Table.Td>{item.subjectTitle}</Table.Td>
            <Table.Td>{item.teacherName || 'Not assigned'}</Table.Td>
            <Table.Td>
                {item.teacherType
                    ? TeacherType[item.teacherType as TeacherType] ||
                      item.teacherType
                    : '-'}
            </Table.Td>
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
                            leftSection={<IconPencil size={16} />}
                            onClick={() => handleEditClick(item)}
                        >
                            Edit
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconX size={16} />}
                        >
                            Remove
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
                <Text fw={500}>Subject Assignments</Text>
                <Button
                    onClick={handleCreateClick}
                    leftSection={<IconPlus size={16} />}
                    disabled={getSelectedClassId.id === null}
                >
                    Assign Subject
                </Button>
            </Group>

            <Group mb="md" align="flex-end">
                {/* Class Selection */}
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
                            setSubjAssignment([]);
                        }}
                        data={classes.map((c) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                        style={{ width: 200 }}
                    />
                </Box>

                {/* Section Selection (conditionally shown) */}
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

            {/* Assignment Drawer */}
            <AssignmentDrawer
                classId={selectedSection ?? selectedClass ?? ''}
                className={`${classes.find((x) => x.id === selectedClass)?.name} ${classes.find((x) => x.id === selectedClass)?.sections?.find((x) => x.id === selectedSection)?.name ?? ''} `}
                mode={drawerMode}
                assignment={editAssignment}
                opened={drawerOpen}
                onClose={handleDrawerClose}
                onCompleted={handleDrawerCompleted}
            />

            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>#</Table.Th>
                        <Table.Th>Subject</Table.Th>
                        <Table.Th>Subject Title</Table.Th>
                        <Table.Th>Teacher</Table.Th>
                        <Table.Th>Teacher Type</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {subjAssignment.length === 0 ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={7}
                                style={{ textAlign: 'center' }}
                            >
                                No subject assignments found
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
