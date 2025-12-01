'use client';

import { Group, TextInput } from '@mantine/core';
import { useState } from 'react';
import type {
    CreateStudentRequest,
    UserResponse,
} from '../../school_admin/students/schemas/type';

export default function OptionalProfileForm({
    data,
    onChange,
}: {
    data: CreateStudentRequest;
    onChange: (field: keyof CreateStudentRequest, value: string) => void;
}) {
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );

    const today = new Date();
    const threeYearsAgo = new Date(
        today.getFullYear() - 3,
        today.getMonth(),
        today.getDate(),
    );
    const maxDate = threeYearsAgo.toISOString().split('T')[0];

    return (
        <div>
            <TextInput
                label="Mother's Full Name"
                value={data.mothersFullName}
                onChange={(e) => onChange('mothersFullName', e.target.value)}
                disabled={!!selectedProfile}
            />
            <Group grow>
                <TextInput
                    label="Birth Date"
                    type="date"
                    value={data.birthDate}
                    max={maxDate}
                    onChange={(e) => onChange('birthDate', e.target.value)}
                    disabled={!!selectedProfile}
                />
                <TextInput
                    label="Baptist Name"
                    value={data.baptistName}
                    onChange={(e) => onChange('baptistName', e.target.value)}
                    disabled={!!selectedProfile}
                />
            </Group>
        </div>
    );
}
