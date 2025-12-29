'use client';

import {
    ActionIcon,
    Button,
    Checkbox,
    Group,
    Menu,
    Modal,
    Select,
    Stack,
    Table,
    Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDots, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { showSuccess } from 'utilities/notification';
import SearchProfilePage from '../../_components/profile-forms/search';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import type { UserResponse } from '../students/schemas/type';
import { CreateHomeRoomApi, findClassesByCalendarId } from './schema/api';
import type { CreateHomeRoom, HomeroomAssignment } from './schema/type';

export default function HomeRoomTeacherPage() {
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [loadingHomeRoomTeachers, setLoadingHomeRoomTeachers] =
        useState(false);
    const [homerooms, setHomerooms] = useState<HomeroomAssignment[]>([]);
    const [createTeacherModalOpened, setCreateTeacherModalOpened] =
        useState(false);
    const [selectedProfiles, setSelectedProfiles] = useState<
        (UserResponse & { checked: boolean })[]
    >([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [homeroomType, setHomeroomType] = useState<string | null>(null);
    const [programUserId, setProgramUserId] = useState<string | null>(null);

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

    const handleSelectProfile = (profile: UserResponse) => {
        setSelectedProfiles((prev) => {
            if (prev.some((p) => p.profile.id === profile.profile.id)) {
                return prev;
            }
            return [...prev, { ...profile, checked: true }];
        });
    };

    const fetchClasses = async (calendarYearId: string) => {
        setClasses([]);
        setSelectedClass(null);
        try {
            const data = await fetchClassesApi(calendarYearId ?? '');
            setClasses(data);
        } catch (err) {
            // handle error
        }
    };

    const toggleCheckbox = (id: string) => {
        setSelectedProfiles((prev) =>
            prev.map((p) => {
                if (p.profile.id === id) {
                    const checked = !p.checked;

                    setProgramUserId(checked ? p.id : null);

                    return { ...p, checked };
                }
                return p;
            }),
        );
    };

    const handleAssign = async () => {
        if (!(programId || selectedClass || programUserId || !homeroomType)) {
            notifications.show({
                title: 'Missing data',
                message: 'Please select class, teacher and homeroom type',
                color: 'red',
            });
            return;
        }

        const body: CreateHomeRoom = {
            classId: selectedClass,
            memberId: programUserId,
            programId,
            type: homeroomType,
        };

        try {
            const res = await CreateHomeRoomApi(body);
            showSuccess('Home room assigned successfully!');
            setCreateTeacherModalOpened(false);
            homeRooms();
        } catch (err) {
            notifications.show({
                title: 'Error',
                message: 'Failed to assign home room teacher',
                color: 'red',
            });
        }
    };

    const rows = homerooms.map((homeroom, index) => (
        <Table.Tr key={homeroom.id}>
            <Table.Td> {index + 1}</Table.Td>
            <Table.Td>{homeroom.class?.name}</Table.Td>
            <Table.Td>
                {homeroom.member?.profile?.firstName} {''}
                {homeroom.member?.profile?.lastName}
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
                    setCalendarYearId(calenderYearId);
                    if (calenderYearId) {
                        fetchClasses(calenderYearId);
                    }
                }}
            />
            <Group mb="md" justify="space-between">
                {homerooms.length > 0 && (
                    <Text fw={500} size="md">
                        Total HomeRoom Teachers:{homerooms.length}
                    </Text>
                )}
                <Group justify="flex-end" style={{ flex: 1 }}>
                    <Button variant="light" onClick={homeRooms}>
                        Load Assigned Teachers
                    </Button>
                    <Button
                        variant="light"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => setCreateTeacherModalOpened(true)}
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
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            <Modal
                opened={createTeacherModalOpened}
                onClose={() => {
                    setCreateTeacherModalOpened(false);
                    setSelectedProfiles([]);
                    setSelectedClass(null);
                    setHomeroomType(null);
                    setProgramUserId(null);
                }}
                size="lg"
                centered
            >
                <Text> Assign Home Room Teacher</Text>
                <SearchProfilePage onSelect={handleSelectProfile} />

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
                            <Select
                                label="Class"
                                placeholder="Select class"
                                data={classes.map((cls) => ({
                                    value: cls.id,
                                    label: cls.name,
                                }))}
                                value={selectedClass}
                                onChange={(val) => {
                                    setSelectedClass(val);
                                }}
                            />
                            <Select
                                label="Homeroom Type"
                                data={[
                                    { value: 'Main', label: 'Main' },
                                    { value: 'Sub', label: 'Sub' },
                                ]}
                                value={homeroomType}
                                onChange={setHomeroomType}
                            />
                        </Group>
                    ))}
                </Stack>
                {selectedProfiles.some((p) => p.checked) && (
                    <Button
                        mt="md"
                        onClick={handleAssign}
                        disabled={!(selectedClass && homeroomType)}
                    >
                        Assign HomeRoom Teacher
                    </Button>
                )}
            </Modal>
        </div>
    );
}
