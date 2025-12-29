'use client';

import { Box, Button, Group, Select, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { ProgramUser } from 'app/[locale]/_api/users/fetch-user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { showSuccess } from 'utilities/notification';
import {
    type GetClass,
    fetchClassesApi,
} from '../../classes/create/components/schema/fetchClassesDetail';
import { CreateHomeRoomApi, getUsers } from '../schema/api';
import type { CreateHomeRoom } from '../schema/type';

export default function HomeRoomAssignPage() {
    const [classId, setClassId] = useState<string | null>(null);
    const [programUserId, setProgramUserId] = useState<string | null>(null);
    const [homeroomType, setHomeroomType] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [programUser, setMembers] = useState<ProgramUser[]>([]);

    const router = useRouter();
    const params = useSearchParams();
    const calendarYearId = params.get('calendarYearId');
    const programId = params.get('programId');

    const fetchClasses = async (calenderId: string) => {
        setClasses([]);
        setSelectedClass(null);
        try {
            const data = await fetchClassesApi(calenderId ?? '');
            setClasses(data);
        } catch (err) {
            // handle error
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (calendarYearId) {
            fetchClasses(calendarYearId);
        }
    }, [calendarYearId]);

    const fetchUsers = async (programId: string) => {
        setMembers([]);
        try {
            const data = await getUsers(programId);
            setMembers(data);
        } catch (err) {
            // handle error
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (programId) {
            fetchUsers(programId);
        }
    }, [programId]);

    const handleAssign = async () => {
        // biome-ignore lint/style/useBlockStatements: <explanation>
        if (!(selectedClass && programUserId)) return;

        const body: CreateHomeRoom = {
            classId: selectedClass,
            memberId: programUserId,
            programId,
            type: homeroomType,
        };

        try {
            const res = await CreateHomeRoomApi(body);
            showSuccess('Student created successfully!');
            router.push('/school_admin/home_room_teacher');
        } catch (err) {
            notifications.show({
                title: 'Error',
                message: 'Failed to create student',
                color: 'red',
            });
        }
    };

    return (
        <Box p="md">
            <Text fw={600} size="lg" mb="md">
                Assign Homeroom Teacher
            </Text>

            {/* Class Selector */}
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

            {/* Program User Selector */}
            <Select
                label="Member"
                placeholder="Select member"
                data={programUser.map((user) => ({
                    value: user.id,
                    label: user.member?.profile?.firstName,
                }))}
                value={programUserId}
                onChange={setProgramUserId}
                mt="md"
            />

            {/* Homeroom Type */}
            <Select
                label="Homeroom Type"
                data={[
                    { value: 'Main', label: 'Main' },
                    { value: 'Sub', label: 'Sub' },
                ]}
                value={homeroomType}
                onChange={setHomeroomType}
                mt="md"
            />

            {/* Buttons */}
            <Group justify="flex-end" mt="lg">
                <Button
                    variant="outline"
                    onClick={() =>
                        router.push('/school_admin/home_room_teacher')
                    }
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleAssign}
                    disabled={!(selectedClass && programUserId)}
                >
                    Assign Homeroom
                </Button>
            </Group>
        </Box>
    );
}
