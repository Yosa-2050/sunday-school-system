'use client';

import {
    ActionIcon,
    Button,
    Checkbox,
    FileButton,
    Group,
    Loader,
    Menu,
    Modal,
    Stack,
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
import type { CalendarYearResponse } from 'app/[locale]/_api/admin/fetch-programs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchProfilePage from '../../_components/profile-forms/search';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import type { UserResponse } from '../students/schemas/type';
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
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [selectedProfiles, setSelectedProfiles] = useState<
        (UserResponse & { checked: boolean })[]
    >([]);

    const router = useRouter();

    const handleAssignTeachers = async () => {
        if (!(programId && calendarYearId)) {
            return;
        }
        const memberIds = selectedProfiles
            .filter((p) => p.checked)
            .map((p) => p.id);

        try {
            await createTeacherApi({
                calendarYearId,
                memberIds,
            });
            setSelectedProfiles([]);
            setCreateTeacherModalOpened(false);
            handleFetchTeachers();
        } catch (error) {
            //handle error
        }
    };

    useEffect(() => {
        if (!calendarYearId) {
            setTeachers([]);
        }
    }, [calendarYearId]);

    // Fetch teachers manually (on button click)
    const handleFetchTeachers = async () => {
        if (!calendarYearId) {
            return;
        }
        try {
            setLoadingTeachers(true);
            const data = await fetchTeacherApi(calendarYearId);
            setTeachers(data);
        } finally {
            setLoadingTeachers(false);
        }
    };

    const handleTeacherCreated = () => {
        setCreateTeacherModalOpened(false);
        handleFetchTeachers(); // Refresh the list
    };

    const toggleCheckbox = (id: string) => {
        setSelectedProfiles((prev) =>
            prev.map((p) =>
                p.profile.id === id ? { ...p, checked: !p.checked } : p,
            ),
        );
    };

    const handleSelectProfile = (profile: UserResponse) => {
        setSelectedProfiles((prev) => {
            if (prev.some((p) => p.profile.id === profile.profile.id)) {
                return prev;
            }
            return [
                ...prev,
                { ...profile, checked: true, position: undefined },
            ];
        });
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
                <ProgramAndCalendarSelector
                    onChange={({
                        programId,
                        calenderYearId,
                        calenderYearName,
                    }) => {
                        setProgramId(programId);
                        setCalendarYear(calenderYearName);
                        setCalendarYearId(calenderYearId);
                    }}
                />
            </Group>

            {/* Import Button */}
            <Group mb="md" justify="space-between">
                <Text fw={500}> Teacher Management</Text>
                <Group>
                    <Button variant="light" onClick={handleFetchTeachers}>
                        Load Teachers
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setCreateTeacherModalOpened(true)}
                        disabled={!programId}
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

            <Modal
                opened={createTeacherModalOpened}
                onClose={() => {
                    setCreateTeacherModalOpened(false);
                    // resetForm;
                }}
                size="lg"
                centered
            >
                <Text> Assign Teacher</Text>
                <SearchProfilePage onSelect={handleSelectProfile} />
                {selectedProfiles.length > 0 && (
                    <Stack mt="md">
                        {selectedProfiles.map((profile) => (
                            <Group key={profile.profile.id} align="center">
                                <Checkbox
                                    key={profile.profile.id}
                                    checked={profile.checked}
                                    onChange={() =>
                                        toggleCheckbox(profile.profile.id)
                                    }
                                    label={`${profile.profile.firstName} ${profile.profile.lastName}`}
                                />
                            </Group>
                        ))}
                    </Stack>
                )}
                {selectedProfiles.some((p) => p.checked) && (
                    <Button mt="md" onClick={handleAssignTeachers}>
                        Assign Teacher
                    </Button>
                )}
            </Modal>
        </div>
    );
}
