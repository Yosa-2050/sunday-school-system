'use client';

import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Divider,
    Group,
    Loader,
    Select,
    Stack,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { showSuccess } from 'utilities/notification';
import { createStudentApi, searchProfilesApi } from '../schemas/api';
import type {
    CreateRelationRequest,
    CreateStudentRequest,
    UserResponse,
} from '../schemas/type';

export default function CreateStudentPage() {
    const router = useRouter();
    const params = useSearchParams();
    //const searchParams = useSearchParams();
    //const classId = params?.classId? '' as string : '';
    // const classId = '353dff16-278d-4704-8b81-50c48f208dab';

    const classId = params?.get('class');

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

    const [relationFormData, setRelationFormData] =
        useState<CreateRelationRequest>({
            firstName: '',
            middleName: '',
            lastName: '',
            phoneNumber: '',
            type: '',
            email: '',
            isParent: false,
            isEmergency: false,
        });

    const [type, setType] = useState<'Student' | 'Teacher'>('Student');

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSearch = async () => {
        if (searchTerm.trim().length < 2) {
            return;
        }
        setIsSearching(true);
        try {
            const results = await searchProfilesApi(searchTerm);
            setSearchResults(results);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to search profiles',
                color: 'red',
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectProfile = (user: UserResponse) => {
        setSelectedProfile(user);
        // Pre-fill the form with the selected profile data
        setFormData({
            firstName: user?.profile?.firstName || '',
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

    const handleInputChange = (
        field: keyof CreateStudentRequest,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChangeRelation = (
        field: keyof CreateRelationRequest,
        value: string,
    ) => {
        setRelationFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setSuccessMessage('created');
        setIsLoading(true);

        try {
            const payload = selectedProfile
                ? {
                      ...formData,
                      profileId: selectedProfile.profile.id,
                      relationship: relationFormData,
                  }
                : { ...formData, relationship: relationFormData };
            await createStudentApi({ classId, studentData: payload });
            showSuccess('Student created successfully!');
            router.push('/school_admin/students');
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to create student',
                color: 'red',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const today = new Date();
    const threeYearsAgo = new Date(
        today.getFullYear() - 3,
        today.getMonth(),
        today.getDate(),
    );
    const maxDate = threeYearsAgo.toISOString().split('T')[0];

    return (
        <div>
            <Box p="md" className="add-student-container">
                {/* <Button variant="outline" onClick={() => router.push('/school_admin/students')}>
              Back to Students
        </Button> */}
                <Text fw={600} mb="md" size="lg" c="dark">
                    Add New Student
                </Text>

                {/* Search Section */}
                {showSearch ? (
                    <>
                        <Group mb="md" align="flex-end" wrap="nowrap">
                            <TextInput
                                placeholder="Search by name, email, or ID number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ flex: 1 }}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSearch()
                                }
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

                        {searchResults.length > 0 ? (
                            <Table striped withColumnBorders highlightOnHover>
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
                                                {profile.profile.phoneNumber ||
                                                    '-'}
                                            </Table.Td>
                                            <Table.Td>
                                                <ActionIcon
                                                    color="teal"
                                                    variant="light"
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
                        ) : (
                            searchTerm &&
                            !isSearching && (
                                <Text size="sm" c="dimmed" ta="center" mt="md">
                                    No profiles found. Try a different search
                                    term.
                                </Text>
                            )
                        )}
                    </>
                ) : (
                    <>
                        {/* Selected Profile Info */}
                        {selectedProfile && (
                            <Box
                                p="sm"
                                bg="blue.0"
                                style={{ borderRadius: '6px' }}
                                mb="md"
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
                                leftSection={<IconSearch size={16} />}
                                mb="md"
                                onClick={() => setShowSearch(true)}
                            >
                                Search Existing Profiles
                            </Button>
                        )}

                        {/* Form Fields */}
                        <Stack gap="sm">
                            <Group grow>
                                <TextInput
                                    label="First Name"
                                    placeholder="Enter first name"
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
                                    placeholder="Enter middle name"
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
                                    placeholder="Enter last name"
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
                                <TextInput
                                    label="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    disabled={!!selectedProfile}
                                />

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
                                    onChange={(v) =>
                                        handleInputChange('gender', v || '')
                                    }
                                    disabled={!!selectedProfile}
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

                            {type === 'Student' && (
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
                            )}
                        </Stack>
                        <Stack>
                            <>
                                <Text
                                    fw={600}
                                    mb="3px"
                                    size="lg"
                                    c="dark"
                                    mt="md"
                                >
                                    Guardian Information
                                </Text>
                                <Divider />

                                <Group grow>
                                    <TextInput
                                        label="First Name"
                                        placeholder="Enter first name"
                                        value={relationFormData.firstName}
                                        onChange={(e) =>
                                            handleInputChangeRelation(
                                                'firstName',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        disabled={!!selectedProfile}
                                    />
                                    <TextInput
                                        label="Middle Name"
                                        placeholder="Enter middle name"
                                        value={relationFormData.middleName}
                                        onChange={(e) =>
                                            handleInputChangeRelation(
                                                'middleName',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        disabled={!!selectedProfile}
                                    />
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        value={relationFormData.lastName}
                                        onChange={(e) =>
                                            handleInputChangeRelation(
                                                'lastName',
                                                e.target.value,
                                            )
                                        }
                                        required
                                        disabled={!!selectedProfile}
                                    />
                                </Group>

                                <Group grow>
                                    <TextInput
                                        label="Email"
                                        value={relationFormData.email}
                                        onChange={(e) =>
                                            handleInputChangeRelation(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        disabled={!!selectedProfile}
                                    />

                                    <TextInput
                                        label="Phone Number"
                                        value={relationFormData.phoneNumber}
                                        onChange={(e) =>
                                            handleInputChangeRelation(
                                                'phoneNumber',
                                                e.target.value,
                                            )
                                        }
                                        disabled={!!selectedProfile}
                                    />
                                </Group>

                                <TextInput
                                    label="Relationship Type"
                                    placeholder="e.g., Parent, Guardian, Sibling"
                                    value={relationFormData.type}
                                    onChange={(e) =>
                                        setRelationFormData({
                                            ...relationFormData,
                                            type: e.target.value,
                                        })
                                    }
                                />

                                <Group>
                                    <Checkbox
                                        label="Is Emergency Contact"
                                        checked={relationFormData.isEmergency}
                                        onChange={(e) =>
                                            setRelationFormData({
                                                ...relationFormData,
                                                isEmergency: e.target.checked,
                                            })
                                        }
                                    />
                                    <Checkbox
                                        label="Is Parent"
                                        checked={relationFormData.isParent}
                                        onChange={(e) =>
                                            setRelationFormData({
                                                ...relationFormData,
                                                isParent: e.target.checked,
                                            })
                                        }
                                    />
                                </Group>
                            </>
                        </Stack>
                    </>
                )}

                {/* Action Buttons */}
                <Group justify="flex-end" mt="lg">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/school_admin/students')}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {selectedProfile ? 'Assign Profile' : 'Create Profile'}
                    </Button>
                </Group>
            </Box>
        </div>
    );
}
