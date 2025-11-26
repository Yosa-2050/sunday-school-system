'use client';

import { ActionIcon, Button, Group, Menu, Table, Text } from '@mantine/core';
import { IconDots, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import { findClassesByCalendarId } from './schema/api';
import type { HomeroomAssignment } from './schema/type';

export default function HomeRoomTeacherPage() {
    const router = useRouter();
    const [calendarYear, setCalendarYear] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [programId, setProgramId] = useState<string | null>(null);
    const [loadingHomeRoomTeachers, setLoadingHomeRoomTeachers] =
        useState(false);
    const [homerooms, setHomerooms] = useState<HomeroomAssignment[]>([]);

    const homeRooms = async () => {
        if (!calendarYearId) {
            return;
        }
        setLoadingHomeRoomTeachers(true);
        try {
            const data = await findClassesByCalendarId(calendarYearId);
            setHomerooms(data);
        } catch (err) {
            //error
        } finally {
            setLoadingHomeRoomTeachers(false);
        }
    };

    const rows = homerooms.map((homeroom, index) => (
        <Table.Tr key={homeroom.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{homeroom.class?.name}</Table.Td>
            <Table.Td>
                {homeroom.programUser?.member?.profile?.firstName}{' '}
                {homeroom.programUser?.member?.profile?.lastName}
            </Table.Td>
            <Table.Td>{homeroom.type}</Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <ActionIcon variant="subtle">
                            <IconDots size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={16} />}>
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
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId, calenderYearName }) => {
                    setProgramId(programId);
                    setCalendarYear(calenderYearName);
                    setCalendarYearId(calenderYearId);
                }}
            />

            <Group mb="md" justify="space-between">
                {homerooms.length > 0 && (
                    <Text fw={500} size="md">
                        Total HomeRoom Teachers:{homerooms.length}
                    </Text>
                )}
                <Group>
                    <Button variant="light" onClick={homeRooms}>
                        Load Assigned Teachers
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() =>
                            router.push(
                                `/school_admin/home_room_teacher/create?calendarYearId=${calendarYearId}&programId=${programId}`,
                                //passed programId bc to fetch the class based on the selected programId
                            )
                        }
                        disabled={!programId}
                    >
                        Assign Home Room Teacher
                    </Button>
                </Group>
            </Group>

            <Table withColumnBorders striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>No</Table.Th>
                        <Table.Th>Class</Table.Th>
                        <Table.Th>Teacher</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {/* {loadingHomeRoomTeachers ? (
                        <Table.Tr>
                            <Table.Td colSpan={4}>
                                <Loader size="sm" />
                            </Table.Td>
                        </Table.Tr>
                    ) : ( */}
                    {rows}
                    {/* )} */}
                </Table.Tbody>
            </Table>
        </div>
    );
}
