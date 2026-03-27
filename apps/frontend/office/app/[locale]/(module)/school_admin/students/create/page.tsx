'use client';

import {
    ActionIcon,
    Box,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch, IconX } from '@tabler/icons-react';
import GuardianInformation from 'app/[locale]/(module)/_components/profile-forms/guardian-info';
import MandatoryProfileForm from 'app/[locale]/(module)/_components/profile-forms/mandatory-profile-info';
import OptionalProfileForm from 'app/[locale]/(module)/_components/profile-forms/optional-profile-info';
import SearchProfilePage from 'app/[locale]/(module)/_components/profile-forms/search';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { showSuccess } from 'utilities/notification';
import { createStudentApi } from '../schemas/api';
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
            gender: '',
            email: '',
            isParent: false,
            isEmergency: false,
        });

    const [type, setType] = useState<'Student' | 'Teacher'>('Student');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );
    const [showSearch, setShowSearch] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
    };

    const handleInputChange = (
        field: keyof CreateStudentRequest,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleInputChangeRelation = (
        field: keyof CreateRelationRequest,
        value: string | boolean,
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

    const validateForm = () => {
        if (!formData.firstName?.trim()) {
            return false;
        }
        if (!formData.lastName?.trim()) {
            return false;
        }
        if (!formData.gender?.trim()) {
            return false;
        }
        if (!formData.birthDate?.trim()) {
            return false;
        }

        if (!relationFormData.firstName?.trim()) {
            return false;
        }
        if (!relationFormData.lastName?.trim()) {
            return false;
        }
        if (!relationFormData.phoneNumber?.trim()) {
            return false;
        }
        if (!relationFormData.gender?.trim()) {
            return false;
        }

        return true;
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
                <Button
                    variant="outline"
                    leftSection={<IconSearch size={16} />}
                    mb="md"
                    onClick={() => setShowSearch(true)}
                >
                    Search Existing Profiles
                </Button>
                <Modal
                    opened={showSearch}
                    onClose={() => setShowSearch(false)}
                    title={'Search Profile'}
                    centered
                    size="xl"
                    styles={{
                        content: {
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        },
                    }}
                >
                    <SearchProfilePage />
                </Modal>
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

                    {/* Form Fields */}
                    <form>
                        <Stack gap="sm">
                            <MandatoryProfileForm
                                data={formData}
                                onChange={handleInputChange}
                            />

                            <OptionalProfileForm
                                data={formData}
                                onChange={handleInputChange}
                            />

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
                        </Stack>

                        <GuardianInformation
                            data={relationFormData}
                            onChange={handleInputChangeRelation}
                        />
                    </form>
                </>

                {/* Action Buttons */}
                <Group justify="flex-end" mt="lg">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/school_admin/students')}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !validateForm()}
                    >
                        {selectedProfile ? 'Assign Profile' : 'Create Profile'}
                    </Button>
                </Group>
            </Box>
        </div>
    );
}
