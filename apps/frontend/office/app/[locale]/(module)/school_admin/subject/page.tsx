'use client';

import {
    Button,
    Center,
    Divider,
    Group,
    Loader,
    Menu,
    Paper,
    Table,
    Text,
} from '@mantine/core';
import { IconDots, IconPencil, IconX } from '@tabler/icons-react';

import { useState } from 'react';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import { SubjectDrawer } from './component/SubjectDrawer';
import { fetchSubjectsApi } from './schemas/api';
import type { GetSubjectResponse } from './schemas/type';

export default function SubjectPage() {
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);

    const [subjects, setSubjects] = useState<GetSubjectResponse[]>([]);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [editSubject, setEditSubject] = useState<GetSubjectResponse | null>(
        null,
    );
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');

    // Stable fetchSubjects function
    const fetchSubjects = async (programId: string) => {
        try {
            setLoadingSubject(true);
            const data = await fetchSubjectsApi(programId);
            setSubjects(data);
        } finally {
            setLoadingSubject(false);
        }
    };

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
        fetchSubjects(programId ?? '');
        handleDrawerClose();
    };

    const rows = subjects.map((item, index) => (
        <Table.Tr key={item.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{item.name}</Table.Td>
            <Table.Td c={item.isActive ? 'green' : 'red'}>
                {item.isActive ? 'Active' : 'Inactive'}
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

            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                    fetchSubjects(programId || '');
                }}
            />
            <Paper shadow="xs" p={{ base: 'md', sm: 'lg' }} radius="md" withBorder>

            {/* Subject Drawer */}
            <SubjectDrawer
                programId={programId ?? ''}
                mode={drawerMode}
                subject={editSubject}
                opened={drawerOpen}
                onClose={handleDrawerClose}
                onCompleted={handleDrawerCompleted}
            />
              
            <Group
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}
                mb="md"
            >
                <Button onClick={handleCreateClick}>+ Add Subject</Button>
            </Group>

                
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
                                <Table.Td colSpan={4}>
                                    <Center py="xl">
                                        <Loader size="sm" />
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        ) : !calendarYearId ? (
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    <Center py="xl">
                                        <Text ta="center" c="dimmed">
                                            Select program to view subjects
                                        </Text>
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        ) : subjects.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={4}>
                                    <Center py="xl">
                                        <Text ta="center" c="dimmed">
                                            No subject found in this program
                                        </Text>
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            rows
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>
        </div>
    );
}
