'use client';

import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Group,
    Loader,
    Menu,
    Modal,
    Pagination,
    Paper,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDots, IconPlus } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { showSuccess } from 'utilities/notification';
import { ProgramAndCalendarSelector } from '../classes/create/components/programAndCalendar';
import {
    type GetClass,
    fetchClassesApi,
} from '../classes/create/components/schema/fetchClassesDetail';
import {
    CreateHomeRoomApi,
    fetchMembersApi,
    findClassesByCalendarId,
} from './schema/api';
import {
    getMemberInitials,
    getMemberName,
    getMemberProfileId,
    type CreateHomeRoom,
    type HomeroomAssignment,
    type MemberListItem,
} from './schema/type';
import type {
    OrganizationMemberList,
    PaginatedResponse,
} from '../../admin/members/schemas/type';



export default function HomeRoomTeacherPage() {
    const [programId, setProgramId] = useState<string | null>(null);
    const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
    const [loadingHomeRoomTeachers, setLoadingHomeRoomTeachers] =
        useState(false);
    const [homerooms, setHomerooms] = useState<HomeroomAssignment[]>([]);
    const [createTeacherModalOpened, setCreateTeacherModalOpened] =
        useState(false);
    const [step, setStep] = useState(1);
    const [selectedMembers, setSelectedMembers] = useState<MemberListItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [homeroomType, setHomeroomType] = useState<string | null>(null);
    const [members, setMembers] = useState<MemberListItem[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [hasLoadedHomerooms, setHasLoadedHomerooms] = useState(false);

    const homeRooms = async () => {
        if (!calendarYearId) {
            return;
        }

        setLoadingHomeRoomTeachers(true);

        try {
            const data = await findClassesByCalendarId(calendarYearId);
            setHomerooms(data);
            setHasLoadedHomerooms(true);
        } finally {
            setLoadingHomeRoomTeachers(false);
        }
    };

    const fetchClasses = async (yearId: string) => {
        try {
            const data = await fetchClassesApi(yearId);
            setClasses(data);
        } catch {
            setClasses([]);
        }
    };

    const loadMembers = async () => {
        if (!createTeacherModalOpened) {
            return;
        }

        setLoadingMembers(true);

        try {
            const response = (await fetchMembersApi(
                activePage,
                limit,
                search,
            )) as PaginatedResponse<MemberListItem> & {
                totalPages?: number;
                limit?: number;
                page?: number;
            };

            setMembers(response.data ?? []);
            setTotalPages(
                response.totalPages ??
                    Math.max(
                        1,
                        Math.ceil(
                            (response.total ?? 0) /
                                Number(response.pp || response.limit || limit),
                        ),
                    ),
            );
        } catch {
            setMembers([]);
            setTotalPages(1);
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (!calendarYearId) {
            setHomerooms([]);
            setHasLoadedHomerooms(false);
            return;
        }

        fetchClasses(calendarYearId);
    }, [calendarYearId]);

    useEffect(() => {
        loadMembers();
    }, [createTeacherModalOpened, activePage, limit, search]);

    const handleSelectMember = (member: MemberListItem) => {
        const exists = selectedMembers.some((item) => item.id === member.id);

        if (exists) {
            setSelectedMembers((prev) =>
                prev.filter((item) => item.id !== member.id),
            );
            return;
        }

        setSelectedMembers((prev) => [...prev, member]);
    };

    const handleAssign = async () => {
        if (
            !selectedClass ||
            !homeroomType ||
            !programId ||
            selectedMembers.length === 0
        ) {
            notifications.show({
                color: 'red',
                message: 'Please complete all fields',
            });
            return;
        }

        try {
            setAssignLoading(true);

            await Promise.all(
                selectedMembers.map((member) => {
                    const body: CreateHomeRoom = {
                        classId: selectedClass,
                        memberId: member.id,
                        programId,
                        type: homeroomType,
                    };

                    return CreateHomeRoomApi(body);
                }),
            );

            showSuccess('Assigned Successfully');
            handleCloseModal();
            homeRooms();
        } catch {
            notifications.show({
                color: 'red',
                message: 'Assignment failed',
            });
        } finally {
            setAssignLoading(false);
        }
    };

    const handleCloseModal = () => {
        setCreateTeacherModalOpened(false);
        setStep(1);
        setSelectedMembers([]);
        setSelectedClass(null);
        setHomeroomType(null);
        setSearch('');
        setActivePage(1);
        setLimit(10);
        setMembers([]);
    };

    const assignedMemberIds = useMemo(
        () =>
            new Set(
                homerooms
                    .map((item) => item.member?.profile?.id)
                    .filter((id): id is string => Boolean(id)),
            ),
        [homerooms],
    );

    const rows = homerooms.map((homeroom, index) => (
        <Table.Tr key={homeroom.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{homeroom.class?.name}</Table.Td>
            <Table.Td>
                {homeroom.member?.profile?.firstName}{' '}
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
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <ProgramAndCalendarSelector
                onChange={({ programId, calenderYearId }) => {
                    setProgramId(programId);
                    setCalendarYearId(calenderYearId);
                    setHasLoadedHomerooms(false);
                }}
            />

            <Paper shadow="xs" p="lg" mt="md" radius="md" withBorder>
                <Group mb="md" justify="space-between">
                    {homerooms.length > 0 ? (
                        <Text fw={500} size="md">
                            Total HomeRoom Teachers: {homerooms.length}
                        </Text>
                    ) : (
                        <div />
                    )}

                    <Group justify="flex-end" style={{ flex: 1 }}>
                        <Button variant="light" onClick={homeRooms}>
                            Load Assigned Teachers
                        </Button>

                        <Button
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() => setCreateTeacherModalOpened(true)}
                            disabled={!programId || !calendarYearId}
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
                        {loadingHomeRoomTeachers ? (
                            <Table.Tr>
                                <Table.Td colSpan={5} ta="center">
                                    <Loader size="sm" />
                                </Table.Td>
                            </Table.Tr>
                        ) : !programId || !calendarYearId || !hasLoadedHomerooms ? (
                            <Table.Tr>
                                <Table.Td colSpan={5} ta="center">
                                    Select program and load assigned teacher
                                </Table.Td>
                            </Table.Tr>
                        ) : homerooms.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={5} ta="center">
                                    No teacher assigned on this program
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            rows
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>

            <Modal
                opened={createTeacherModalOpened}
                onClose={handleCloseModal}
                size="xl"
                centered
                title="Assign Home Room Teacher"
            >
                <Paper shadow="xs" p="lg" radius="md">
                    <Text fw={700} fz="xl">
                        Assign Home Room Teacher
                    </Text>
                    <Divider my="sm" />

                    {step === 1 ? (
                        <>
                            <TextInput
                                placeholder="Search member"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.currentTarget.value);
                                    setActivePage(1);
                                }}
                            />

                            <Divider my="md" />

                            <Box style={{ overflowX: 'auto' }}>
                                <Table miw={500}>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th />
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Type</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {loadingMembers ? (
                                            <Table.Tr>
                                                <Table.Td colSpan={3} ta="center">
                                                    <Loader />
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : members.length === 0 ? (
                                            <Table.Tr>
                                                <Table.Td colSpan={3} ta="center">
                                                    No members found
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : (
                                            members.map((member) => {
                                                const isSelected =
                                                    selectedMembers.some(
                                                        (item) =>
                                                            item.id === member.id,
                                                    );
                                                const profileId =
                                                    getMemberProfileId(member);
                                                const isAlreadyAssigned =
                                                    profileId
                                                        ? assignedMemberIds.has(
                                                              profileId,
                                                          )
                                                        : false;

                                                return (
                                                    <Table.Tr key={member.id}>
                                                        <Table.Td>
                                                            <Checkbox
                                                                checked={
                                                                    isSelected ||
                                                                    isAlreadyAssigned
                                                                }
                                                                onChange={() =>
                                                                    handleSelectMember(
                                                                        member,
                                                                    )
                                                                }
                                                                disabled={
                                                                    isAlreadyAssigned
                                                                }
                                                            />
                                                        </Table.Td>

                                                        <Table.Td>
                                                            <Flex
                                                                gap="sm"
                                                                align="center"
                                                                wrap="wrap"
                                                            >
                                                                <Avatar
                                                                    size="sm"
                                                                    radius="xl"
                                                                    color="rgb(13 64 73)"
                                                                >
                                                                    {getMemberInitials(
                                                                        member,
                                                                    )}
                                                                </Avatar>
                                                                <Text size="sm">
                                                                    {getMemberName(
                                                                        member,
                                                                    )}
                                                                </Text>
                                                            </Flex>
                                                        </Table.Td>

                                                        <Table.Td>
                                                            {isAlreadyAssigned
                                                                ? 'Already assigned'
                                                                : member.type || '-'}
                                                        </Table.Td>
                                                    </Table.Tr>
                                                );
                                            })
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </Box>

                            <Flex
                                justify="space-between"
                                align={{ base: 'stretch', sm: 'center' }}
                                mt="md"
                                direction={{ base: 'column', sm: 'row' }}
                                gap="md"
                            >
                                <Flex
                                    align="center"
                                    gap="sm"
                                    direction={{ base: 'column', xs: 'row' }}
                                    justify={{ base: 'center', sm: 'flex-start' }}
                                >
                                    <Select
                                        size="md"
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
                                            setActivePage(1);
                                        }}
                                        w={{ base: '100%', xs: 120 }}
                                        mr="md"
                                    />

                                    <Pagination
                                        value={activePage}
                                        onChange={setActivePage}
                                        total={totalPages}
                                        withEdges
                                        siblings={1}
                                        boundaries={1}
                                        color="rgb(13 64 73)"
                                        size="sm"
                                    />
                                </Flex>

                                <Button
                                    mt="md"
                                    variant="filled"
                                    styles={{
                                        root: {
                                            borderRadius: 10,
                                            backgroundColor: 'rgb(13 64 73)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgb(10 50 60)',
                                                color: 'rgb(248 193 0)',
                                            },
                                        },
                                    }}
                                    disabled={!selectedMembers.length}
                                    onClick={() => setStep(2)}
                                >
                                    Next ({selectedMembers.length})
                                </Button>
                            </Flex>
                        </>
                    ) : (
                        <>
                            <Stack>
                                {selectedMembers.map((member, index) => (
                                    <Flex key={member.id} gap="sm">
                                        <Text>{index + 1}.</Text>
                                        <Text>{getMemberName(member)}</Text>
                                    </Flex>
                                ))}
                            </Stack>

                            <Divider my="md" />

                            <Select
                                label="Class"
                                placeholder="Select class"
                                data={classes.map((cls) => ({
                                    value: cls.id,
                                    label: cls.name,
                                }))}
                                value={selectedClass}
                                onChange={setSelectedClass}
                            />

                            <Select
                                mt="md"
                                label="Homeroom Type"
                                placeholder="Select homeroom type"
                                data={[
                                    { value: 'Main', label: 'Main' },
                                    { value: 'Sub', label: 'Sub' },
                                ]}
                                value={homeroomType}
                                onChange={setHomeroomType}
                            />

                            <Flex
                                mt="md"
                                gap="sm"
                                justify="flex-end"
                                direction={{ base: 'column', sm: 'row' }}
                            >
                                <Button
                                    variant="filled"
                                    styles={{
                                        root: {
                                            borderRadius: 10,
                                            backgroundColor: 'rgb(13 64 73)',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgb(10 50 60)',
                                                color: 'rgb(248 193 0)',
                                            },
                                        },
                                    }}
                                    onClick={handleAssign}
                                    loading={assignLoading}
                                    disabled={!(selectedClass && homeroomType)}
                                >
                                    Assign
                                </Button>

                                <Button
                                    variant="outline"
                                    color="rgb(248 193 0)"
                                    style={{
                                        borderRadius: 10,
                                        color: 'rgb(13, 64, 73)',
                                    }}
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>
                            </Flex>
                        </>
                    )}
                </Paper>
            </Modal>
        </div>
    );
}

