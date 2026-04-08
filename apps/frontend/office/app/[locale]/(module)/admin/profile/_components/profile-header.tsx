/* eslint-disable @next/next/no-img-element */
'use client';

import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Card,
    FileButton,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { IconCamera, IconCheck, IconPencil, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ProfileResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useDownloadProfilePicture } from 'app/[locale]/_api/job-seeker';
import { useUploadProfilePicture } from 'app/[locale]/_api/profile';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ProfileHeaderProps {
    data: ProfileResponse;
    headline: string;
}

function InfoItem({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <Box>
            <Text size="sm" c="dimmed">
                {label}
            </Text>
            <Text fw={600}>{value || '-'}</Text>
        </Box>
    );
}

export const downloadProfilePicture = async (id: string): Promise<Blob> => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${id}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                accept: '*/*',
            },
        },
    );

    if (!response.ok) {
        throw new Error('Failed to download profile picture');
    }

    return response.blob();
};

export const updateHeadline = async (headline: string): Promise<void> => {
    await fetcher<void>('/job-seeker/detail', {
        method: 'PATCH',
        headers: { accept: '*/*' },
        body: JSON.stringify({ headline }),
    });
};

export const useUpdateHeadline = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateHeadline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobSeekerDetails'] });
        },
    });
};

export default function ProfileHeader({ data, headline }: ProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const resetRef = useRef<() => void>(null);

    const { mutate: uploadProfilePicture } = useUploadProfilePicture();
    const queryClient = useQueryClient();
    const { data: profilePicture } = useDownloadProfilePicture(
        data.profile_picture_id ?? '',
    );
    const [profileData, setProfileData] = useState(data);
    const [formData, setFormData] = useState({
        firstName: data.firstName || '',
        middleName: data.middleName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        gender: data.gender || '',
        marriageStatus: data.marriageStatus || '',
        baptistName: data.baptistName || '',
        birthDate: data.birthDate || '',
        mothersFullName: data.mothersFullName || '',
        guardianPhone: data.relation?.[0]?.phoneNumber || '',
        guardianGender: data.relation?.[0]?.gender || '',
    });

    const updateProfileMutation = useMutation({
        mutationFn: async () =>
            fetcher(`/profile/${data.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    firstName: formData.firstName,
                    middleName: formData.middleName,
                    lastName: formData.lastName,
                    phoneNumber: formData.phoneNumber,
                    email: formData.email,
                    gender: formData.gender,
                    marriageStatus: formData.marriageStatus,
                    baptistName: formData.baptistName,
                    birthDate: formData.birthDate,
                    mothersFullName: formData.mothersFullName,
                }),
            }),
        onSuccess: () => {
            setProfileData((prev) => ({
                ...prev,
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                gender: formData.gender,
                marriageStatus: formData.marriageStatus,
                baptistName: formData.baptistName,
                birthDate: formData.birthDate,
                mothersFullName: formData.mothersFullName,
                relation: prev.relation?.length
                    ? prev.relation.map((item, index) =>
                          index === 0
                              ? {
                                    ...item,
                                    phoneNumber: formData.guardianPhone,
                                    gender: formData.guardianGender,
                                }
                              : item,
                      )
                    : prev.relation,
            }));
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['student'] });
            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
                icon: <IconCheck size={16} />,
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update profile',
                color: 'red',
                icon: <IconX size={16} />,
            });
        },
    });

    const fullName = [
        profileData.firstName,
        profileData.middleName,
        profileData.lastName,
    ]
        .filter(Boolean)
        .join(' ');

    const handleFileSelect = async (file: File | null) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            notifications.show({
                title: 'Error',
                message: 'Please upload an image file',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            notifications.show({
                title: 'Error',
                message: 'File size should be less than 5MB',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        setIsUploading(true);
        try {
            await uploadProfilePicture(file, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Profile picture updated successfully',
                        color: 'green',
                        icon: <IconCheck size={16} />,
                    });
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update profile picture',
                        color: 'red',
                        icon: <IconX size={16} />,
                    });
                },
            });
        } finally {
            setIsUploading(false);
            resetRef.current?.();
        }
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleCancel = () => {
        setFormData({
            firstName: profileData.firstName || '',
            middleName: profileData.middleName || '',
            lastName: profileData.lastName || '',
            phoneNumber: profileData.phoneNumber || '',
            email: profileData.email || '',
            gender: profileData.gender || '',
            marriageStatus: profileData.marriageStatus || '',
            baptistName: profileData.baptistName || '',
            birthDate: profileData.birthDate || '',
            mothersFullName: profileData.mothersFullName || '',
            guardianPhone: profileData.relation?.[0]?.phoneNumber || '',
            guardianGender: profileData.relation?.[0]?.gender || '',
        });
        setIsEditing(false);
    };

    return (
        <>
            <Box px={{ base: 'sm', md: 'md' }} py="md">
                <Card radius="lg" shadow="sm" p={0}>
                    <Box pos="relative">
                        <Box
                            h={180}
                            style={{
                                background:
                                    'linear-gradient(180deg, rgba(13,64,73,0.2) 0%, rgba(13,64,73,0.6) 100%)',
                            }}
                        />

                        <Box
                            style={{
                                position: 'absolute',
                                bottom: -70,
                                left: 24,
                            }}
                        >
                            <Box pos="relative">
                                <Avatar
                                    src={
                                        profilePicture
                                            ? URL.createObjectURL(profilePicture)
                                            : undefined
                                    }
                                    size={140}
                                    radius="xl"
                                    alt={`${data.firstName}'s profile`}
                                    style={{
                                        border: '1px solid #f8c100',
                                        cursor: 'pointer',
                                    }}
                                    color="#0d4049"
                                    onClick={() => setIsModalOpen(true)}
                                />

                                <FileButton
                                    resetRef={resetRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                >
                                    {(props) => (
                                        <ActionIcon
                                            {...props}
                                            variant="filled"
                                            color="dark"
                                            radius="xl"
                                            size="lg"
                                            style={{
                                                position: 'absolute',
                                                right: 8,
                                                bottom: 8,
                                            }}
                                        >
                                            <IconCamera size={18} />
                                        </ActionIcon>
                                    )}
                                </FileButton>

                                <LoadingOverlay
                                    visible={isUploading}
                                    zIndex={1000}
                                    overlayProps={{
                                        radius: 'sm',
                                        blur: 2,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box mt={80} p="lg">
                        <Paper withBorder radius="lg" p="lg">
                            <Stack>
                                <Group justify="space-between" align="flex-start">
                                    <Stack gap={4}>
                                        <Text fw={700} size="lg">
                                            Personal Information
                                        </Text>
                                    </Stack>

                                    {!isEditing ? (
                                        <Button
                                            size="sm"
                                            variant="filled"
                                            styles={{
                                                root: {
                                                    borderRadius: 10,
                                                    backgroundColor:
                                                        'rgb(13 64 73)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'rgb(10 50 60)',
                                                        color:
                                                            'rgb(248 193 0)',
                                                    },
                                                },
                                            }}
                                            leftSection={<IconPencil size={16} />}
                                            ml="auto"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                    ) : (
                                        <Group>
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                color="rgb(248 193 0)"
                                                style={{
                                                    borderRadius: 10,
                                                    color: 'rgb(13, 64, 73)',
                                                }}
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="filled"
                                                styles={{
                                                    root: {
                                                        borderRadius: 10,
                                                        backgroundColor:
                                                            'rgb(13 64 73)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                'rgb(10 50 60)',
                                                            color:
                                                                'rgb(248 193 0)',
                                                        },
                                                    },
                                                }}
                                                onClick={() =>
                                                    updateProfileMutation.mutate()
                                                }
                                                loading={
                                                    updateProfileMutation.isPending
                                                }
                                            >
                                                Save
                                            </Button>
                                        </Group>
                                    )}
                                </Group>

                                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                                    {isEditing ? (
                                        <>
                                            <TextInput
                                                label="First Name"
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'firstName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Middle Name"
                                                value={formData.middleName}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'middleName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Last Name"
                                                value={formData.lastName}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'lastName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Phone"
                                                value={formData.phoneNumber}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'phoneNumber',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'email',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Select
                                                label="Gender"
                                                value={formData.gender}
                                                onChange={(value) =>
                                                    handleChange(
                                                        'gender',
                                                        value || '',
                                                    )
                                                }
                                                data={[
                                                    {
                                                        value: 'MALE',
                                                        label: 'Male',
                                                    },
                                                    {
                                                        value: 'FEMALE',
                                                        label: 'Female',
                                                    },
                                                ]}
                                            />
                                            <TextInput
                                                label="Marriage"
                                                value={formData.marriageStatus}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'marriageStatus',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Baptist"
                                                value={formData.baptistName}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'baptistName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Birth"
                                                value={formData.birthDate}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'birthDate',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem
                                                label="Full Name"
                                                value={fullName}
                                            />
                                            <InfoItem
                                                label="Phone"
                                                value={profileData.phoneNumber}
                                            />
                                            <InfoItem
                                                label="Email"
                                                value={profileData.email}
                                            />
                                            <InfoItem
                                                label="Gender"
                                                value={profileData.gender}
                                            />
                                            <InfoItem
                                                label="Marriage"
                                                value={
                                                    profileData.marriageStatus
                                                }
                                            />
                                            <InfoItem
                                                label="Baptist"
                                                value={profileData.baptistName}
                                            />
                                            <InfoItem
                                                label="Birth"
                                                value={profileData.birthDate}
                                            />
                                        </>
                                    )}
                                </SimpleGrid>
                            </Stack>
                        </Paper>

                        <Paper withBorder radius="lg" p="lg" mt="xl">
                            <Stack>
                                <Text fw={700} size="lg">
                                    Guardian Information
                                </Text>

                                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                                    {isEditing ? (
                                        <>
                                            <TextInput
                                                label="Name"
                                                value={formData.mothersFullName}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'mothersFullName',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                label="Phone"
                                                value={formData.guardianPhone}
                                                onChange={(e) =>
                                                    handleChange(
                                                        'guardianPhone',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <Select
                                                label="Gender"
                                                value={formData.guardianGender}
                                                onChange={(value) =>
                                                    handleChange(
                                                        'guardianGender',
                                                        value || '',
                                                    )
                                                }
                                                data={[
                                                    {
                                                        value: 'MALE',
                                                        label: 'Male',
                                                    },
                                                    {
                                                        value: 'FEMALE',
                                                        label: 'Female',
                                                    },
                                                ]}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem
                                                label="Name"
                                                value={
                                                    profileData.mothersFullName
                                                }
                                            />
                                            <InfoItem
                                                label="Phone"
                                                value={
                                                    profileData.relation?.[0]
                                                        ?.phoneNumber
                                                }
                                            />
                                            <InfoItem
                                                label="Gender"
                                                value={
                                                    profileData.relation?.[0]
                                                        ?.gender
                                                }
                                            />
                                        </>
                                    )}
                                </SimpleGrid>
                            </Stack>
                        </Paper>
                    </Box>
                </Card>
            </Box>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                centered
                size="auto"
                withCloseButton
                styles={{
                    content: {
                        maxWidth: 800,
                        width: '100%',
                    },
                }}
                padding="md"
                title={
                    <Text size="lg" fw={500}>
                        Profile Picture
                    </Text>
                }
            >
                {profilePicture && (
                    <Box style={{ textAlign: 'center' }}>
                        <Image
                            src={URL.createObjectURL(profilePicture)}
                            alt="Profile Picture"
                            width={800}
                            height={800}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                )}
            </Modal>
        </>
    );
}
