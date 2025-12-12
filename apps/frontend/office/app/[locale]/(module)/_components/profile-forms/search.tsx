'use client';

import {
    ActionIcon,
    Box,
    Button,
    Group,
    Loader,
    Table,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { searchProfilesApi } from '../../school_admin/students/schemas/api';
import type {
    CreateStudentRequest,
    UserResponse,
} from '../../school_admin/students/schemas/type';

type Props = {
    onSelect?: (profile: UserResponse) => void;
};

export default function SearchProfilePage({ onSelect }: Props) {
    const [showSearch, setShowSearch] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<UserResponse[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );

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
        if (onSelect) {
            onSelect(user);
        }
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

    return (
        <div>
            <Box p="md" className="add-student-container">
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
                                        <Table.Th>No</Table.Th>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Phone Number</Table.Th>
                                        <Table.Th>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {searchResults.map((profile, index) => (
                                        <Table.Tr key={profile.profile.id}>
                                            <Table.Td>{index + 1}</Table.Td>
                                            <Table.Td>
                                                {profile.profile.firstName ||
                                                    ''}{' '}
                                                {profile.profile.middleName ||
                                                    ''}{' '}
                                                {profile.profile.lastName || ''}
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
                    selectedProfile && (
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
                    )
                )}
            </Box>
        </div>
    );
}
