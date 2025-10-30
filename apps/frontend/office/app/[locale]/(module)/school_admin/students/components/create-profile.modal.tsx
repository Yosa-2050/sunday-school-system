'use client';

import {
    ActionIcon,
    Box,
    Button,
    Group,
    Loader,
    Modal,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { showError, showSuccess } from 'utilities/notification';
import { searchProfilesApi } from '../schemas/api';
import type { CreateStudentRequest, UserResponse } from '../schemas/type';

interface CreateProfileModalProps {
    opened: boolean;
    onClose: () => void;
    onCreated: (id: string) => void;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    mutationFn: (payload: any) => Promise<{ id: string }>;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    extraData?: Record<string, any>;
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

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const mutation = useMutation({
        mutationFn: mutationFn,
        onSuccess: (data) => {
            onCreated(data.id);
            resetForm();
            showSuccess(
                selectedProfile
                    ? 'Profile assigned successfully'
                    : 'Created Successfully',
            );
        },
        onError: (error: Error) => {
            showError(error.message || 'Failed to create');
        },
    });

    const resetForm = () => {
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
        setSearchTerm('');
        setSearchResults([]);
        setSelectedProfile(null);
        setShowSearch(false);
        setIsSearching(false);
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (opened) {
            resetForm();
        }
    }, [opened]);

    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) {
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchProfilesApi(searchTerm);
            setSearchResults(results);
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (error: any) {
            showError(error.message || 'Failed to search profiles');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectProfile = (user: UserResponse) => {
        setSelectedProfile(user);
        // Pre-fill the form with the selected profile data
        setFormData({
            firstName: user?.profile?.firstName || undefined,
            middleName: user.profile.middleName || '',
            lastName: user.profile.lastName,
            mothersFullName: user.profile.mothersFullName || '',
            birthDate: user.profile.birthDate || '',
            baptistName: user.profile.baptistName || '',
            gender: user.profile.gender || '',
            phoneNumber: user.profile.phoneNumber || '',
            email: user?.email || '',
        });
        setShowSearch(false);
    };

    const handleClearSelection = () => {
        setSelectedProfile(null);
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
    };

    const handleSubmit = async () => {
        try {
            const payload = selectedProfile
                ? {
                      ...extraData,
                      profileId: selectedProfile.profile.id,
                      data: formData,
                  }
                : { ...extraData, data: formData };

            await mutation.mutateAsync(payload);
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
            onClose={() => {
                onClose;
                resetForm;
            }}
            title={title}
            size="lg"
            centered
        >
            <Stack>
                {/* Search Section */}
                {showSearch ? (
                    <Box>
                        <Text size="sm" fw={500} mb="sm">
                            Search for existing profiles
                        </Text>
                        <Group mb="md">
                            <TextInput
                                placeholder="Search by name, email, or ID number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ flex: 1 }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <Button
                                onClick={handleSearch}
                                loading={isSearching}
                                leftSection={<IconSearch size={16} />}
                                disabled={searchTerm.trim().length < 2}
                            >
                                Search
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowSearch(false)}
                            >
                                Cancel
                            </Button>
                        </Group>

                        {isSearching && <Loader />}

                        {searchResults.length > 0 && (
                            <Box>
                                <Text size="sm" fw={500} mb="sm">
                                    Search Results
                                </Text>
                                <Table striped withColumnBorders>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Name</Table.Th>
                                            <Table.Th>Email</Table.Th>
                                            <Table.Th>ID Number</Table.Th>
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {searchResults.map((profile) => (
                                            <Table.Tr key={profile.profile.id}>
                                                <Table.Td>
                                                    {profile.profile.firstName}{' '}
                                                    {profile.profile.middleName}{' '}
                                                    {profile.profile.lastName}
                                                </Table.Td>
                                                <Table.Td>
                                                    {profile.email || '-'}
                                                </Table.Td>
                                                <Table.Td>
                                                    {profile.profile
                                                        .phoneNumber || '-'}
                                                </Table.Td>
                                                <Table.Td>
                                                    <ActionIcon
                                                        color="blue"
                                                        onClick={() =>
                                                            handleSelectProfile(
                                                                profile,
                                                            )
                                                        }
                                                    >
                                                        <IconCheck size={16} />
                                                    </ActionIcon>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        )}

                        {searchResults.length === 0 &&
                            searchTerm &&
                            !isSearching && (
                                <Text size="sm" c="dimmed" ta="center">
                                    No profiles found. Try a different search
                                    term.
                                </Text>
                            )}
                    </Box>
                ) : (
                    <>
                        {/* Profile Selection Info */}
                        {selectedProfile && (
                            <Box
                                p="sm"
                                bg="blue.0"
                                style={{ borderRadius: '4px' }}
                            >
                                <Group justify="space-between">
                                    <Text size="sm">
                                        Using existing profile:{' '}
                                        <strong>
                                            {selectedProfile.profile?.firstName}{' '}
                                            {selectedProfile.profile?.lastName}
                                        </strong>
                                    </Text>
                                    <ActionIcon
                                        variant="subtle"
                                        color="red"
                                        size="sm"
                                        onClick={handleClearSelection}
                                    >
                                        <IconX size={16} />
                                    </ActionIcon>
                                </Group>
                            </Box>
                        )}

                        {/* Search Button */}
                        {!selectedProfile && (
                            <Button
                                variant="outline"
                                onClick={() => setShowSearch(true)}
                                leftSection={<IconSearch size={16} />}
                                mb="md"
                            >
                                Search Existing Profiles
                            </Button>
                        )}

                        {/* Form Fields */}
                        <Group grow>
                            <TextInput
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) =>
                                    handleInputChange(
                                        'firstName',
                                        e.target.value,
                                    )
                                }
                                required
                                disabled={!!selectedProfile}
                            />
                            <TextInput
                                label="Middle Name"
                                value={formData.middleName}
                                onChange={(e) =>
                                    handleInputChange(
                                        'middleName',
                                        e.target.value,
                                    )
                                }
                                required
                                disabled={!!selectedProfile}
                            />
                            <TextInput
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) =>
                                    handleInputChange(
                                        'lastName',
                                        e.target.value,
                                    )
                                }
                                required
                                disabled={!!selectedProfile}
                            />
                        </Group>

                        <Group grow>
                            {type === 'Teacher' ? (
                                <TextInput
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    required={type === 'Teacher'}
                                    disabled={!!selectedProfile}
                                />
                            ) : null}

                            <TextInput
                                label="Phone Number"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    handleInputChange(
                                        'phoneNumber',
                                        e.target.value,
                                    )
                                }
                                disabled={!!selectedProfile}
                            />
                        </Group>

                        <TextInput
                            label="Mother's Full Name"
                            value={formData.mothersFullName}
                            onChange={(e) =>
                                handleInputChange(
                                    'mothersFullName',
                                    e.target.value,
                                )
                            }
                            disabled={!!selectedProfile}
                        />

                        <Group grow>
                            <TextInput
                                label="Birth Date"
                                type="date"
                                value={formData.birthDate}
                                max={maxDate}
                                onChange={(e) =>
                                    handleInputChange(
                                        'birthDate',
                                        e.target.value,
                                    )
                                }
                                disabled={!!selectedProfile}
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
                                disabled={!!selectedProfile}
                            />

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
                                    handleInputChange(
                                        'baptistName',
                                        e.target.value,
                                    )
                                }
                                disabled={!!selectedProfile}
                            />
                        </Group>

                        {type === 'Student' ? (
                            <TextInput
                                label="ID Number"
                                value={formData.idNumber}
                                onChange={(e) =>
                                    handleInputChange(
                                        'idNumber',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                        ) : null}
                    </>
                )}

                {/* Action Buttons */}
                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        loading={mutation.isPending}
                        disabled={
                            !(
                                showSearch ||
                                (formData.firstName &&
                                    formData.lastName &&
                                    formData.middleName &&
                                    (formData.idNumber || type === 'Teacher'))
                            )
                        }
                    >
                        {selectedProfile ? 'Assign Profile' : 'Create Profile'}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
