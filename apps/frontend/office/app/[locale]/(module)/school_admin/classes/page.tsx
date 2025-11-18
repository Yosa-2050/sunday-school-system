'use client';

import {
    ActionIcon,
    Button,
    Collapse,
    Group,
    Loader,
    Menu,
    Select,
    Table,
    Text,
} from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconDots,
    IconPencil,
    IconPlus,
    IconX,
} from '@tabler/icons-react';
import {
    type CalendarYearResponse,
    type ProgramResponse,
    fetchCalendarYearsSchoolAdmin,
    fetchProgramsForOrg,
} from 'app/[locale]/_api/admin/fetch-programs';
import { useEffect, useState } from 'react';
import { CreateClassDrawer } from './create/components/CreateClassDrawer';
import {
    type GetClass,
    fetchClassesApi,
} from './create/components/schema/fetchClassesDetail';

export default function ClassPage() {
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);

    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYears, setCalendarYears] = useState<CalendarYearResponse[]>(
        [],
    );

    const [programs, setPrograms] = useState<ProgramResponse[]>([]);
    const [loadingYears, setLoadingYears] = useState(true);

    const [classes, setClasses] = useState<GetClass[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(false);

    const [openRows, setOpenRows] = useState<Record<string, boolean>>({});

    // Fetch calendar years
    useEffect(() => {
        const getPrograms = async () => {
            try {
                setLoadingYears(true);
                const data: ProgramResponse[] = await fetchProgramsForOrg();
                setPrograms(data);
            } catch (err) {
                //console.error('Failed to fetch calendar years', err);
            } finally {
                setLoadingYears(false);
            }
        };

        getPrograms();
    }, []);

    // Fetch calendar years
    const getCalendarYears = async (programId: string) => {
        setCalendarYear(null);
        setClasses([]);
        try {
            setLoadingYears(true);
            const data: CalendarYearResponse[] =
                await fetchCalendarYearsSchoolAdmin(programId ?? '');
            setCalendarYears(data);
            // auto-select active year
            const active = data.find((y) => y.isActive);
            if (active) {
                setCalendarYear(active.name);
                fetchClasses(active.id);
                setCalendarYearId(active.id);
            }
        } catch (err) {
            //console.error('Failed to fetch calendar years', err);
        } finally {
            setLoadingYears(false);
        }
    };

    // Fetch classes when calendar year changes
    const fetchClasses = async (calenderId: string) => {
        setClasses([]);
        if (!calenderId) {
            return;
        }

        try {
            setLoadingClasses(true);
            const data = await fetchClassesApi(calenderId);
            setClasses(data);
        } catch (err) {
            //console.error('Failed to fetch classes', err);
        } finally {
            setLoadingClasses(false);
        }
    };

    const toggleRow = (id: string) => {
        setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const rows = classes.map((item) => (
        <>
            <Table.Tr key={item.id}>
                {/* Collapse toggle cell */}
                <Table.Td w={40}>
                    {item.sections && item.sections.length > 0 ? (
                        <ActionIcon
                            variant="subtle"
                            onClick={() => toggleRow(item.id)}
                        >
                            {openRows[item.id] ? (
                                <IconChevronDown size={18} />
                            ) : (
                                <IconChevronRight size={18} />
                            )}
                        </ActionIcon>
                    ) : null}
                </Table.Td>

                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.root.name}</Table.Td>
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
                            <Menu.Item leftSection={<IconPlus size={16} />}>
                                Add Section
                            </Menu.Item>
                            <Menu.Item leftSection={<IconPencil size={16} />}>
                                Edit Class
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                leftSection={<IconX size={16} />}
                            >
                                Inactivate Class
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Table.Td>
            </Table.Tr>

            {/* Sections collapse */}
            {item.sections && item.sections.length > 0 && (
                <Table.Tr>
                    <Table.Td
                        colSpan={5}
                        style={{ padding: 0, border: 'none' }}
                    >
                        <Collapse in={!!openRows[item.id]}>
                            <Table withColumnBorders striped highlightOnHover>
                                <Table.Tbody>
                                    {item.sections?.map((section) => (
                                        <Table.Tr key={section.id}>
                                            <Table.Td w={40} />
                                            <Table.Td>{section.name}</Table.Td>
                                            <Table.Td>
                                                {item.root.name}
                                            </Table.Td>
                                            <Table.Td>
                                                {section.isActive
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Table.Td>
                                            <Table.Td>
                                                <Menu shadow="md" width={180}>
                                                    <Menu.Target>
                                                        <Button
                                                            variant="light"
                                                            size="xs"
                                                            leftSection={
                                                                <IconDots
                                                                    size={16}
                                                                />
                                                            }
                                                        />
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            leftSection={
                                                                <IconPencil
                                                                    size={16}
                                                                />
                                                            }
                                                        >
                                                            Edit Section
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            color="red"
                                                            leftSection={
                                                                <IconX
                                                                    size={16}
                                                                />
                                                            }
                                                        >
                                                            Inactivate Section
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Collapse>
                    </Table.Td>
                </Table.Tr>
            )}
        </>
    ));

    return (
        <div>
            <Group mb="md">
                <Text fw={500}>Programs:</Text>
                <Select
                    value={programId}
                    data={
                        programs?.map((s) => ({
                            value: s.id,
                            label: s.name,
                        })) ?? []
                    }
                    onChange={(val) => {
                        setProgramId(val);
                        getCalendarYears(val ?? '');
                    }}
                />
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
                <Text fw={500}>Calendar Years</Text>
                <CreateClassDrawer
                    programId={programId}
                    calendarId={calendarYearId}
                    onClose={() => {
                        fetchClasses(calendarYear ?? '');
                    }}
                />
            </Group>

            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={40} />
                        <Table.Th>Class Name</Table.Th>
                        <Table.Th>Root Class</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </div>
    );
}
