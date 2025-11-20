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
import CreateProfileModal from '../students/components/create-profile.modal';
import { createTeacherApi, fetchTeacherApi } from './schema/api';
import type { TeacherResponse } from './schema/type';

export default function TeacherPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );
    const [loadingYears, setLoadingYears] = useState(true);
    const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [createTeacherModalOpened, setCreateTeacherModalOpened] =
        useState(false);

    const router = useRouter();

    // Fetch calendar years
    useEffect(() => {
        const getCalendarYears = async () => {
            try {
                setLoadingYears(true);
                const data: CalendarYearResponse[] =
                    await fetchCalendarYearsSchoolAdmin('');
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

    // Fetch teachers manually (on button click)
    const handleFetchTeachers = async () => {
        try {
            setLoadingTeachers(true);
            const data = await fetchTeacherApi();
            setTeachers(data);
        } finally {
            setLoadingTeachers(false);
        }
    };

    const handleTeacherCreated = () => {
        setCreateTeacherModalOpened(false);
        handleFetchTeachers(); // Refresh the list
    };

    const rows = teachers.map((teacher) => (
        <Table.Tr key={teacher.id}>
            <Table.Td>
                {teacher.firstName} {teacher.lastName}
            </Table.Td>
            <Table.Td>{teacher.email}</Table.Td>
            <Table.Td>{teacher.isActive ? 'Active' : 'Inactive'}</Table.Td>
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
                                    `/school_admin/teachers/${teacher.id}`,
                                )
                            }
                        >
                            View Details
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            component={Link}
                            href={`/teachers/${teacher.id}/edit`}
                        >
                            Edit Teacher
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            leftSection={<IconX size={16} />}
                            color="red"
                            onClick={() => {
                                // Add your delete/inactivate logic here
                            }}
                        >
                            {teacher.isActive ? 'Deactivate' : 'Activate'}
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

            {/* Load Teachers Button */}
            <Group mb="md" justify="space-between">
                <Text fw={500}>Teachers</Text>
                <Button
                    variant="light"
                    onClick={handleFetchTeachers}
                    leftSection={<IconPlus size={16} />}
                >
                    Load Teachers
                </Button>
            </Group>

            {/* Import Button */}
            <Group mb="md" justify="space-between">
                <Text fw={500}>Teacher Management</Text>
                <Group>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setCreateTeacherModalOpened(true)}
                    >
                        Add New Teacher
                    </Button>
                    {/* biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation> */}
                    <FileButton onChange={() => {}} accept=".xlsx,.xls">
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

            {/* Teacher Table */}
            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Full Name</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loadingTeachers ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Loader size="sm" />
                            </Table.Td>
                        </Table.Tr>
                        // biome-ignore lint/nursery/noNestedTernary: <explanation>
                    ) : teachers.length === 0 ? (
                        <Table.Tr>
                            <Table.Td
                                colSpan={6}
                                style={{ textAlign: 'center' }}
                            >
                                No teachers found. Click "Load Teachers" to
                                fetch teachers.
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>

            {/* Create Teacher Modal */}
            <CreateProfileModal
                opened={createTeacherModalOpened}
                onClose={() => {
                    setCreateTeacherModalOpened(false);
                    handleFetchTeachers();
                }}
                onCreated={handleTeacherCreated}
                mutationFn={({ profileId, data }) =>
                    createTeacherApi({ profileId, data })
                }
                title="Add Teacher"
                type="Teacher"
            />
        </div>
    );
}
