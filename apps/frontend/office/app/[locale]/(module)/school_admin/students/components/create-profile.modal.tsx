'use client';

import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { showError, showSuccess } from 'utilities/notification';
import type { CreateStudentRequest } from '../schemas/type';

interface CreateProfileModalProps {
    opened: boolean;
    onClose: () => void;
    onCreated: (id: string) => void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    mutationFn: (payload: any) => Promise<{ id: string }>; // inject API function
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    extraData?: Record<string, any>; // e.g. { classId }
    title?: string;
    type?: string;
}

export default function CreateProfileModal({
    opened,
    onClose,
    onCreated,
    mutationFn,
    extraData = {},
    title = 'Add New Profile',
    type = '',
}: CreateProfileModalProps) {
    const [formData, setFormData] = useState<CreateStudentRequest>({
        firstName: '',
        middleName: '',
        lastName: '',
        mothersFullName: '',
        birthDate: '',
        baptistName: '',
        gender: '',
        phoneNumber: '',
        idNumber: '',
        email: '',
    });

    const mutation = useMutation({
        mutationFn: mutationFn,
        onSuccess: (data) => {
            onCreated(data.id);
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                mothersFullName: '',
                birthDate: '',
                baptistName: '',
                gender: '',
                phoneNumber: '',
                idNumber: '',
                email: '',
            });
            showSuccess('Created Successfully');
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onError: (error: any) => {
            showError(error.message || 'Failed to create');
        },
    });

    const handleSubmit = async () => {
        try {
            await mutation.mutateAsync({ ...extraData, data: formData });
        } catch (e) {
            // error is already handled in onError
        }
    };

    const today = new Date();
    const threeYearsAgo = new Date(
        today.getFullYear() - 3,
        today.getMonth(),
        today.getDate(),
    );
    const maxDate = threeYearsAgo.toISOString().split('T')[0];

    const handleInputChange = (
        field: keyof CreateStudentRequest,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={title}
            size="lg"
            centered
        >
            <Stack>
                <Group grow>
                    <TextInput
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) =>
                            handleInputChange('firstName', e.target.value)
                        }
                        required
                    />
                    <TextInput
                        label="Middle Name"
                        value={formData.middleName}
                        onChange={(e) =>
                            handleInputChange('middleName', e.target.value)
                        }
                        required
                    />
                    <TextInput
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                            handleInputChange('lastName', e.target.value)
                        }
                        required
                    />
                </Group>

                <Group grow>
                    {type === 'Teacher' ? (
                        <TextInput
                            label="Email"
                            value={formData.email}
                            onChange={(e) =>
                                handleInputChange('email', e.target.value)
                            }
                            required={type === 'Teacher'}
                        />
                    ) : null}
                    <TextInput
                        label="ID Number"
                        value={formData.idNumber}
                        onChange={(e) =>
                            handleInputChange('idNumber', e.target.value)
                        }
                        required
                    />
                    <TextInput
                        label="Phone Number"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                            handleInputChange('phoneNumber', e.target.value)
                        }
                    />
                </Group>

                <TextInput
                    label="Mother's Full Name"
                    value={formData.mothersFullName}
                    onChange={(e) =>
                        handleInputChange('mothersFullName', e.target.value)
                    }
                />

                <Group grow>
                    <TextInput
                        label="Birth Date"
                        type="date"
                        value={formData.birthDate}
                        max={maxDate}
                        onChange={(e) =>
                            handleInputChange('birthDate', e.target.value)
                        }
                    />
                    <Select
                        label="Gender"
                        data={[
                            { value: 'MALE', label: 'Male' },
                            { value: 'FEMALE', label: 'Female' },
                        ]}
                        value={formData.gender}
                        onChange={(value) =>
                            handleInputChange('gender', value || '')
                        }
                    />
                </Group>

                <TextInput
                    label="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                />

                <TextInput
                    label="Baptist Name"
                    value={formData.baptistName}
                    onChange={(e) =>
                        handleInputChange('baptistName', e.target.value)
                    }
                />

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        loading={mutation.isPending}
                        disabled={
                            !(
                                formData.firstName &&
                                formData.lastName &&
                                formData.middleName &&
                                formData.idNumber
                            )
                        }
                    >
                        Create
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
