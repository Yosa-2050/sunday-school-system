'use client';

import { Box, Button, Group, Select, Text } from '@mantine/core';
import type { Users } from 'app/[locale]/_api/users/fetch-user';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    type GetClass,
    fetchClassesApi,
} from '../../classes/create/components/schema/fetchClassesDetail';
import { getUsers } from '../schema/api';

export default function HomeRoomAssignPage() {
    const [classId, setClassId] = useState<string | null>(null);
    const [teacherId, setTeacherId] = useState<string | null>(null);
    const [homeroomType, setHomeroomType] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [classes, setClasses] = useState<GetClass[]>([]);
    const [members, setMembers] = useState<Users[]>([]);

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

            {/* Teacher Selector */}
            <Select
                label="Teacher"
                placeholder="Select teacher"
                // data={[
                //      { value: "1", label: "Teacher 1" },
                //     { value: "2", label: "Teacher 2" },
                // ]}
                data={members.map((cls) => ({
                    value: cls.id,
                    label: cls.firstName,
                }))}
                value={teacherId}
                onChange={setTeacherId}
                mt="md"
            />

            {/* Homeroom Type */}
            <Select
                label="Homeroom Type"
                data={[
                    { value: 'HEAD_TEACHER', label: 'Head Teacher' },
                    { value: 'ASSISTANT_TEACHER', label: 'Assistant Teacher' },
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
                <Button>Assign Homeroom</Button>
            </Group>
        </Box>
    );
}
