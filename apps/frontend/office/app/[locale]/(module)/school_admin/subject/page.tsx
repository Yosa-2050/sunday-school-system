'use client';

import {
    Button,
    Group,
    Loader,
    Menu,
    Select,
    Table,
    Text,
} from '@mantine/core';
import { IconDots, IconPencil, IconX } from '@tabler/icons-react';
import {
    type CalendarYearResponse,
    fetchCalendarYearsSchoolAdmin,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useCallback, useEffect, useState } from 'react';
import { SubjectDrawer } from './component/SubjectDrawer';
import { fetchSubjectsApi } from './schemas/api';
import type { GetSubjectResponse } from './schemas/type';

export default function SubjectPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);

    const [subjects, setSubjects] = useState<GetSubjectResponse[]>([]);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [editSubject, setEditSubject] = useState<GetSubjectResponse | null>(
        null,
    );
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');

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

    // Stable fetchSubjects function
    const fetchSubjects = useCallback(async () => {
        try {
            setLoadingSubject(true);
            const data = await fetchSubjectsApi();
            setSubjects(data);
        } finally {
            setLoadingSubject(false);
        }
    }, []);

    // Fetch subjects when calendar year changes
    useEffect(() => {
        if (!calendarYear) {
            return;
        }
        fetchSubjects();
    }, [calendarYear, fetchSubjects]);

    const handleEditClick = (subject: GetSubjectResponse) => {
        setEditSubject(subject);
        setDrawerMode('edit');
        setDrawerOpen(true);
    };

    const handleCreateClick = () => {
        setEditSubject(null);
        setDrawerMode('create');
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setEditSubject(null);
    };

    const handleDrawerCompleted = () => {
        fetchSubjects();
        handleDrawerClose();
    };

    const rows = subjects.map((item, index) => (
        <Table.Tr key={item.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td>{item.isActive ? 'Active' : 'Inactive'}</Table.Td>
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
                            Edit Subject
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconX size={16} />}
                        >
                            Inactivate Subject
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
                <Text fw={500}>Subjects</Text>
                <Button onClick={handleCreateClick}>+ Add Subject</Button>
            </Group>

            {/* Subject Drawer */}
            <SubjectDrawer
                mode={drawerMode}
                subject={editSubject}
                opened={drawerOpen}
                onClose={handleDrawerClose}
                onCompleted={handleDrawerCompleted}
            />

            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40}>#</Table.Th>
                        <Table.Th>Subject Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loadingSubject ? (
                        <Table.Tr>
                            <Table.Td colSpan={4} className="text-center">
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
