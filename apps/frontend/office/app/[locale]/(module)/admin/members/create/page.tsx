'use client';

import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import GuardianInformation from 'app/[locale]/(module)/_components/profile-forms/guardian-info';
import MandatoryProfileForm from 'app/[locale]/(module)/_components/profile-forms/mandatory-profile-info';
import OptionalProfileForm from 'app/[locale]/(module)/_components/profile-forms/optional-profile-info';
import SearchProfilePage from 'app/[locale]/(module)/_components/profile-forms/search';
import type { UserResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateMemberApi } from '../schemas/api';
import type {
    CreateMemberRequest,
    CreateRelationRequest,
} from '../schemas/type';

export default function CreateMemberPage() {
    const router = useRouter();
    const [showSearch, setShowSearch] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<UserResponse | null>(
        null,
    );

    const [formData, setFormData] = useState<CreateMemberRequest>({
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

    const handleInputChange = (
        field: keyof CreateMemberRequest,
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
        try {
            setIsLoading(true);
            setErrorMessage('');
            setSuccessMessage('');

            const res = await CreateMemberApi(formData, relationFormData);

            setSuccessMessage('Member created');
            // console.log(res);

            router.push('/admin/members');
        } catch (err) {
            setErrorMessage('Failed to create member');
            // console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div>
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

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <Text fw={600} mb="10px" size="lg" c="dark" mt="md">
                    Member Information
                </Text>
                <Divider mb="10px" />
                <MandatoryProfileForm
                    data={formData}
                    onChange={handleInputChange}
                />
                <OptionalProfileForm
                    data={formData}
                    onChange={handleInputChange}
                />
                <GuardianInformation
                    data={relationFormData}
                    onChange={handleInputChangeRelation}
                />

                {/* Action Buttons */}
                <Group justify="flex-end" mt="lg">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/members')}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        // onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {selectedProfile ? 'Assign Profile' : 'Create Profile'}
                    </Button>
                </Group>
            </form>
        </div>
    );
}
