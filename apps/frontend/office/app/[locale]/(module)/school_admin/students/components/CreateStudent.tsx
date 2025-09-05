'use client';

import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { showError, showSuccess } from 'utilies/notification';
import { createStudentApi } from '../schemas/api';
import type { CreateStudentRequest } from '../schemas/type';

interface CreateStudentModalProps {
    opened: boolean;
    onClose: () => void;
    onStudentCreated: (studentId: string) => void;
    classId: string | null;
    LoadStudent: () => void;
}

export default function CreateStudentModal({
    opened,
    onClose,
    onStudentCreated,
    classId,
    LoadStudent,
}: CreateStudentModalProps) {
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
    });

    const createStudentMutation = useMutation({
        mutationFn: createStudentApi,
        onSuccess: (data) => {
            onStudentCreated(data.id);
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
            });
            showSuccess('Student Created');
        },
        onError: (error) => {
            showError(error.message);
        },
    });

    const handleSubmit = async () => {
        if (!classId) {
            return;
        }

        try {
            const studentData = {
                ...formData,
            };
            await createStudentMutation.mutateAsync({ classId, studentData });
        } catch (error) {
            //console.error('Failed to create student:', error);
        }
    };

    const handleClose = () => {
        // ✅ call parent’s LoadStudent method
        LoadStudent();
        onClose(); // close modal properly
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
            title="Add New Student"
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
                        max={maxDate} // disallows future and < 3 years
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
                        loading={createStudentMutation.isPending}
                        disabled={
                            !(
                                formData.firstName &&
                                formData.lastName &&
                                formData.idNumber &&
                                formData.middleName
                            )
                        }
                    >
                        Create Student
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
