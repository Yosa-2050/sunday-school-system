'use client';

import {
    Checkbox,
    Divider,
    Group,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import type { CreateRelationRequest } from '../../school_admin/students/schemas/type';
import MandatoryProfileForm from './mandatory-profile-info';

export default function GuardianInformation({
    data,
    onChange,
}: {
    data: CreateRelationRequest;
    onChange: (
        field: keyof CreateRelationRequest,
        value: string | boolean,
    ) => void;
}) {
    return (
        <div>
            <Stack>
                <Text fw={600} mb="3px" size="lg" c="dark" mt="md">
                    Guardian Information
                </Text>
                <Divider />
                <MandatoryProfileForm
                    data={data}
                    onChange={(field, value) => onChange(field as any, value)}
                />
                <TextInput
                    label="Relationship Type"
                    placeholder="e.g., Parent, Guardian, Sibling"
                    value={data.type}
                    // onChange={(e) =>
                    //     setRelationFormData({
                    //         ...relationFormData,
                    //         type: e.target.value,
                    //     })
                    // }
                    onChange={(e) => onChange('type', e.target.value)}
                    mb={6}
                />

                <Group>
                    <Checkbox
                        label="Is Emergency Contact"
                        checked={data.isEmergency}
                        // onChange={(e) =>
                        //     setRelationFormData({
                        //         ...relationFormData,
                        //         isEmergency: e.target.checked,
                        //     })
                        // }
                        onChange={(e) =>
                            onChange('isEmergency', e.target.checked)
                        }
                    />
                    <Checkbox
                        label="Is Parent"
                        checked={data.isParent}
                        // onChange={(e) =>
                        //     setRelationFormData({
                        //         ...relationFormData,
                        //         isParent: e.target.checked,
                        //     })
                        // }
                        onChange={(e) => onChange('isParent', e.target.checked)}
                    />
                </Group>
            </Stack>
        </div>
    );
}
