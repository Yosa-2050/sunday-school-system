'use client';

import { Group, Select, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import type {
    CreateStudentRequest,
    UserResponse,
} from '../../school_admin/students/schemas/type';

export default function MandatoryProfileForm({
    data,
    onChange,
}: {
    data: CreateStudentRequest;
    onChange: (field: keyof CreateStudentRequest, value: string) => void;
}) {
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );

    return (
        <Stack gap="sm">
            <Group grow>
                <TextInput
                    label="First Name"
                    placeholder="Enter first name"
                    value={data.firstName}
                    onChange={(e) => onChange('firstName', e.target.value)}
                    required
                    disabled={!!selectedProfile}
                />
                <TextInput
                    label="Middle Name"
                    placeholder="Enter middle name"
                    value={data.middleName}
                    onChange={(e) => onChange('middleName', e.target.value)}
                    required
                    disabled={!!selectedProfile}
                />
                <TextInput
                    label="Last Name"
                    placeholder="Enter last name"
                    value={data.lastName}
                    onChange={(e) => onChange('lastName', e.target.value)}
                    required
                    disabled={!!selectedProfile}
                />
            </Group>

            <Group grow>
                <TextInput
                    label="Email"
                    value={data.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    disabled={!!selectedProfile}
                />

                <TextInput
                    label="Phone Number"
                    value={data.phoneNumber}
                    onChange={(e) => onChange('phoneNumber', e.target.value)}
                    disabled={!!selectedProfile}
                    required
                />
                <Select
                    label="Gender"
                    data={[
                        { value: 'MALE', label: 'Male' },
                        { value: 'FEMALE', label: 'Female' },
                    ]}
                    value={data.gender}
                    onChange={(v) => onChange('gender', v || '')}
                    disabled={!!selectedProfile}
                    required
                />
            </Group>
        </Stack>
    );
}
