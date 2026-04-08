'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Checkbox,
    Flex,
    Group,
    Input,
    Pagination,
    Paper,
    Radio,
    ScrollArea,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
} from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { IconCheck, IconPencil, IconSend, IconUsers, IconX } from '@tabler/icons-react';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import { fetchStudentsApi } from '../students/schemas/api';
import type { StudentResponse } from '../students/schemas/type';
import { getStudentInitials, getStudentName } from './schemas/type';

export default function NotificationPage() {
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    const [message, setMessage] = useState('');
    const [sendType, setSendType] = useState('all');
    const [selectedStudents, setSelectedStudents] = useState<StudentResponse[]>([]);
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const handleFetchStudents = async () => {
        if (!selectedClass) {
            setStudents([]);
            return;
        }

        try {
            setLoadingStudents(true);
            const data = await fetchStudentsApi(selectedSection ?? selectedClass);
            setStudents(data);
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        setStudents([]);
        setClasses([]);

        if (!programId) {
            return;
        }

        const fetchClasses = async () => {
            try {
                const data = await fetchClassesApi(calendarYearId ?? '');
                setClasses(data);
            } catch (err) {
                setClasses([]);
            }
        };

        fetchClasses();
    }, [calendarYearId, programId]);

    useEffect(() => {
        setStudents([]);
        setSelectedStudents([]);
        setPage(1);
    }, [selectedClass, selectedSection]);

    const filteredStudents = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return students;
        }

        return students.filter((student) => {
            const fullName = getStudentName(student).toLowerCase();
            return (
                fullName.includes(query) ||
                student.idNumber.toLowerCase().includes(query)
            );
        });
    }, [search, students]);

    const total = filteredStudents.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paginatedStudents = filteredStudents.slice(
        (page - 1) * limit,
        page * limit,
    );

    useEffect(() => {
        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    const isSelected = (studentId: string) =>
        selectedStudents.some((student) => student.id === studentId);

    const handleToggleStudent = (student: StudentResponse) => {
        setSelectedStudents((prev) =>
            prev.some((selected) => selected.id === student.id)
                ? prev.filter((selected) => selected.id !== student.id)
                : [...prev, student],
        );
    };

    const handleSelectShown = () => {
        setSelectedStudents((prev) => {
            const selectedIds = new Set(prev.map((student) => student.id));
            const next = [...prev];

            paginatedStudents.forEach((student) => {
                if (!selectedIds.has(student.id)) {
                    next.push(student);
                }
            });

            return next;
        });
    };

    const handleClearAll = () => {
        setSelectedStudents([]);
    };

    const handleRemoveSelected = (studentId: string) => {
        setSelectedStudents((prev) =>
            prev.filter((student) => student.id !== studentId),
        );
    };

    const handleSearch = async () => {
        setSearchLoading(true);
        setPage(1);
        setTimeout(() => setSearchLoading(false), 150);
    };

    return (
        <Box>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                    setSelectedClass(null);
                    setSelectedSection(null);
                    setClasses([]);
                    setStudents([]);
                    setSelectedStudents([]);
                }}
            />

            <Paper shadow="sm" p="md" mb="md">
                <Stack gap="md" mb="lg">
                    <Group justify="space-between" align="end">
                        <div>
                            <Text fw={600} size="lg">
                                Student Notification
                            </Text>
                            <Text size="sm" c="dimmed">
                                {'Select a program and class to begin'}
                            </Text>
                        </div>

                        <Badge variant="outline" color="#0d4049">
                           Total:{students.length} Students Loaded
                        </Badge>
                    </Group>

                    <Group align="end">
                        <Select
                            label="Class"
                            placeholder="Choose class"
                            value={selectedClass}
                            onChange={setSelectedClass}
                            data={classes.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}
                            w={{ base: '100%', sm: 280 }}
                        />

                        <Button
                            color="#0d4049"
                            onClick={handleFetchStudents}
                            loading={loadingStudents}
                            disabled={!selectedClass}
                        >
                            Load Students
                        </Button>
                    </Group>
                </Stack>

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    <Stack gap="lg">
                        <Paper withBorder p="xl" radius="md" shadow="sm">
                            <Group mb="md">
                                <ActionIcon variant="light" color="blue" radius="md" size="lg">
                                    <IconPencil size={18} color="#0d4049" />
                                </ActionIcon>
                                <Text fw={600} size="lg">
                                    Message
                                </Text>
                            </Group>

                            <Textarea
                                placeholder="Write your notification message here..."
                                minRows={10}
                                radius="md"
                                autosize
                                maxLength={1000}
                                value={message}
                                onChange={(event) => setMessage(event.currentTarget.value)}
                            />
                        </Paper>

                        <Paper withBorder p="xl" radius="md" shadow="sm">
                            <Group mb="md">
                                <ActionIcon variant="light" color="blue" radius="md" size="lg">
                                    <IconSend size={18} color="#0d4049" />
                                </ActionIcon>
                                <Text fw={600} size="lg">
                                    Send Options
                                </Text>
                            </Group>

                            <Radio.Group value={sendType} onChange={setSendType}>
                                <Stack gap="sm">
                                    <Paper
                                        withBorder
                                        p="md"
                                        radius="md"
                                        style={{
                                            borderColor:
                                                sendType === 'all' ? '#0d4049' : undefined,
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Group>
                                                <IconUsers size={20} color="#0d4049" />
                                                <div>
                                                    <Text fw={500} size="sm">
                                                        Send to All Students
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {students.length} loaded students will receive this
                                                    </Text>
                                                </div>
                                            </Group>
                                            <Radio value="all" color="#0d4049" />
                                        </Group>
                                    </Paper>

                                    <Paper
                                        withBorder
                                        p="md"
                                        radius="md"
                                        style={{
                                            borderColor:
                                                sendType === 'selected' ? '#0d4049' : undefined,
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Group>
                                                <IconUsers size={20} color="gray" />
                                                <div>
                                                    <Text fw={500} size="sm">
                                                        Send to Selected Students
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {selectedStudents.length} students selected
                                                    </Text>
                                                </div>
                                            </Group>
                                            <Radio value="selected" color="#0d4049" />
                                        </Group>
                                    </Paper>
                                </Stack>
                            </Radio.Group>

                            <Button
                                fullWidth
                                size="md"
                                mt="xl"
                                radius="xl"
                                color="#0d4049"
                                variant="filled"
                                disabled={
                                    !message.trim() ||
                                    students.length === 0 ||
                                    (sendType === 'selected' &&
                                        selectedStudents.length === 0)
                                }
                            >
                                {sendType === 'all'
                                    ? `Send to All ${students.length} Students`
                                    : `Send to ${selectedStudents.length} Selected Students`}
                            </Button>
                        </Paper>
                    </Stack>

                    <Paper withBorder p="xl" radius="md" shadow="sm">
                        <Group justify="space-between" mb="md">
                            <Group>
                                <ActionIcon variant="light" color="#0d4049" radius="md" size="lg">
                                    <IconUsers size={18} />
                                </ActionIcon>
                                <Text fw={600} size="lg">
                                    List of Students
                                </Text>
                            </Group>
                            <Group gap="xs">
                                <Badge
                                    variant="outline"
                                    color="rgb(248 193 0)"
                                    style={{
                                        borderRadius: 10,
                                        color: 'rgb(13, 64, 73)',
                                    }}
                                >
                                    TOTAL: {total} students
                                </Badge>
                                <Badge color="#0d4049" variant="filled">
                                    {selectedStudents.length} SELECTED
                                </Badge>
                            </Group>
                        </Group>

                        <Group mb="md" align="end">
                            <Input
                                type="search"
                                placeholder="Search by name or ID"
                                value={search}
                                onChange={(event) => setSearch(event.currentTarget.value)}
                                style={{ flex: 1 }}
                                radius="md"
                                size="sm"
                                rightSection={
                                    search.length > 0 && !searchLoading ? (
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            onClick={() => setSearch('')}
                                            aria-label="Clear search"
                                            size={24}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <IconX size={16} />
                                        </ActionIcon>
                                    ) : null
                                }
                            />

                            <Button
                                variant="outline"
                                color="rgb(248 193 0)"
                                style={{
                                    borderRadius: 10,
                                    color: 'rgb(13, 64, 73)',
                                }}
                                size="sm"
                                loading={searchLoading}
                                onClick={handleSearch}
                            >
                                search
                            </Button>
                        </Group>

                        <Group justify="space-between" mb="xs">
                            <Text size="sm" c="#0d4049">
                                All {total} students
                            </Text>
                            <Group gap="sm">
                                <Text
                                    size="sm"
                                    c="#0d4049"
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleSelectShown}
                                >
                                    Select shown
                                </Text>
                                <Text
                                    size="sm"
                                    c="red"
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleClearAll}
                                >
                                    Clear all
                                </Text>
                            </Group>
                        </Group>

                        <Group gap="xs" mb="md">
                            {selectedStudents.length > 0 ? (
                                selectedStudents.map((student) => (
                                    <Badge
                                        key={student.id}
                                        variant="outline"
                                        color="#0d4049"
                                        rightSection={
                                            <IconX
                                                size={10}
                                                color="red"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleRemoveSelected(student.id)}
                                            />
                                        }
                                        radius="sm"
                                        tt="none"
                                    >
                                        {getStudentName(student)}
                                    </Badge>
                                ))
                            ) : (
                                <Text size="xs" c="dimmed" ta="center">
                                    No selected students
                                </Text>
                            )}
                        </Group>

                        <ScrollArea h={400} offsetScrollbars>
                            <Stack gap={0}>
                                {paginatedStudents.length > 0 ? (
                                    paginatedStudents.map((student) => {
                                        const studentSelected = isSelected(student.id);

                                        return (
                                            <Group
                                                key={student.id}
                                                justify="space-between"
                                                p="sm"
                                                style={{
                                                    backgroundColor: studentSelected
                                                        ? 'var(--mantine-color-blue-light)'
                                                        : 'transparent',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleToggleStudent(student)}
                                            >
                                                <Group wrap="nowrap">
                                                    <Checkbox
                                                        checked={studentSelected}
                                                        onChange={() => handleToggleStudent(student)}
                                                        onClick={(event) => event.stopPropagation()}
                                                        color="#0d4049"
                                                    />
                                                    <Avatar color="#0d4049" radius="sm" size="sm">
                                                        {getStudentInitials(student)}
                                                    </Avatar>
                                                    <div>
                                                        <Text size="sm" fw={500}>
                                                            {getStudentName(student)}
                                                        </Text>
                                                        <Text size="xs" c="dimmed">
                                                            {student.idNumber || '-'}
                                                        </Text>
                                                        <Text size="xs" c="dimmed">
                                                            {student.gender || '-'}
                                                        </Text>
                                                    </div>
                                                </Group>
                                                {studentSelected ? (
                                                    <IconCheck size={16} color="blue" />
                                                ) : null}
                                            </Group>
                                        );
                                    })
                                ) : (
                                    <Text size="sm" c="dimmed" ta="center" py="md">
                                        {loadingStudents
                                            ? 'Loading students...'
                                            : 'No students found'}
                                    </Text>
                                )}
                            </Stack>
                        </ScrollArea>

                        <Flex align="center" mt="md" gap="md" wrap="wrap">
                            <Select
                                value={limit.toString()}
                                data={[
                                    { value: '5', label: '5 / page' },
                                    { value: '10', label: '10 / page' },
                                    { value: '20', label: '20 / page' },
                                    { value: '50', label: '50 / page' },
                                    { value: '100', label: '100 / page' },
                                ]}
                                onChange={(value) => {
                                    if (!value) {
                                        return;
                                    }

                                    setLimit(Number(value));
                                    setPage(1);
                                }}
                                w={120}
                            />

                            <Pagination
                                value={page}
                                onChange={setPage}
                                total={totalPages}
                                withEdges
                                siblings={1}
                                boundaries={1}
                                color="rgb(13 64 73)"
                            />
                        </Flex>
                    </Paper>
                </SimpleGrid>
            </Paper>
        </Box>
    );
}


