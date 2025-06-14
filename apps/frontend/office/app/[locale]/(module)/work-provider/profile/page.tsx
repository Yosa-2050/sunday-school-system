'use client';

import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Loader,
    Modal,
    NumberInput,
    Select,
    Text,
    TextInput,
    Textarea,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { logger } from '@shega/shared';
import { IconAt, IconEdit, IconMapPin } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from 'app/[locale]/_api/job-details';
import {
    type Category,
    type Contact,
    type LocationData,
    type Organization,
    getOrganizationById,
} from 'app/[locale]/_api/organizations/get-organizationbyId';
import {
    type UpdateLocationPayload,
    updateContactInfo,
    updateLocation,
    updateOrganization,
} from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import UploadFile from './components/UploadFile';

// Types
type FormDataType = Partial<Organization & UpdateLocationPayload>;

function UserProfile() {
    const [opened, { open, close }] = useDisclosure(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [editingSection, setEditingSection] = useState<string | null>(null);

    const organizationId = getCookie('organization_id')?.toString();
    const [formData, setFormData] = useState<FormDataType>({});

    const { data: organization, isLoading: orgLoading } =
        useQuery<Organization>({
            queryKey: ['organization_id', organizationId],
            queryFn: async () =>
                await getOrganizationById(organizationId ?? ''),
            enabled: !!organizationId,
        });

    const { data: categories = [], isLoading: categoriesLoading } = useQuery<
        Category[]
    >({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    useEffect(() => {
        if (organization) {
            setFormData(organization);
        }
    }, [organization]);

    const handleChange = (
        field: keyof FormDataType,
        value:
            | string
            | boolean
            | number
            | Contact[]
            | { locationData: LocationData }[]
            // biome-ignore lint/complexity/noBannedTypes: <explanation>
            | { locationData: {} }[],
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!(organizationId && formData)) {
            return;
        }

        try {
            if (editingSection === 'location') {
                const locationData = formData.locations?.[0]?.locationData;

                if (!locationData) {
                    logger.error('Missing location data');
                    return;
                }

                const payload: UpdateLocationPayload = {
                    ...locationData,
                    village: 'string',
                    addressType: 'string',
                    addressText: 'string',
                    latitude: 'string',
                    longitude: 'string',
                    isPreferred: true,
                };

                await updateLocation(organizationId, payload);
            } else {
                await updateOrganization(organizationId, formData);
                close();
            }
        } catch (error) {
            logger.error('Error during update:', error);
        } finally {
            setEditingSection(null);
            setIsEditingLocation(false);
        }
    };

    const buildContactPayload = () => {
        const contacts = formData.contacts || [];

        const mapType = (type: string): string => {
            switch (type) {
                case 'Mobile':
                    return 'Mobile';
                case 'Email':
                    return 'Communication';
                case 'Home':
                    return 'Default';
                default:
                    return type;
            }
        };

        const getByType = (frontendType: string) =>
            contacts
                .filter((c) => c.type === frontendType && c.value)
                .map((c) => ({
                    value: c.value,
                    isPreferred: c.isPreferred ?? true,
                    type: mapType(frontendType),
                }));

        return {
            phoneNumbers: getByType('Mobile'),
            emailAddress: getByType('Email'),
            otherAddress: getByType('Home'),
        };
    };

    const handleSubmits = async () => {
        if (!(organizationId && formData)) {
            return;
        }

        try {
            const contactPayload = buildContactPayload();
            await updateContactInfo(organizationId, contactPayload);
        } catch (error) {
            logger.error('❌ Error during contact update:', error);
        }

        setIsEditing(false);
    };

    if (orgLoading || !formData) {
        return (
            <Container size="md" mt="lg">
                <Loader size="sm" />
                <Text mt="sm">Loading organization data...</Text>
            </Container>
        );
    }
    return (
        <Container size="md" mt="lg">
            <Modal
                opened={opened}
                onClose={close}
                title="Edit Organization"
                size="lg"
            >
                <Title order={4} mb="xs">
                    General Info
                </Title>
                <Divider mb="sm" />
                <TextInput
                    label="Registration Number"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                        handleChange(
                            'registrationNumber',
                            e.currentTarget.value,
                        )
                    }
                    required
                />
                <TextInput
                    label="Display Name"
                    value={formData.displayName}
                    onChange={(e) =>
                        handleChange('displayName', e.currentTarget.value)
                    }
                    mt="sm"
                />
                <TextInput
                    label="Type"
                    value={formData.type}
                    onChange={(e) =>
                        handleChange('type', e.currentTarget.value)
                    }
                    mt="sm"
                />
                <Select
                    label="Sector"
                    placeholder="Select sector"
                    value={formData.sectorId}
                    onChange={(value) => handleChange('sectorId', value ?? '')}
                    data={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                    }))}
                    mt="sm"
                    disabled={categoriesLoading}
                />
                <NumberInput
                    label="Year Founded"
                    value={formData.yearFounded}
                    onChange={(value) => {
                        const intValue = Number.parseInt(value as string) || 0;
                        handleChange('yearFounded', intValue);
                    }}
                    // onChange={(value) => handleChange("yearFounded", value || 0)}
                    mt="sm"
                />
                <Select
                    label="Company Size"
                    value={formData.companySize}
                    onChange={(value) =>
                        handleChange('companySize', value ?? '')
                    }
                    data={[
                        '1-10',
                        '11-50',
                        '51-200',
                        '201-500',
                        '500+',
                        'Small-sized: 10 to 49 employees',
                    ]}
                    mt="sm"
                />

                <Title order={4} mt="xl" mb="xs">
                    Description
                </Title>
                <Divider mb="sm" />
                <Textarea
                    label="Description"
                    value={formData.description}
                    onChange={(e) =>
                        handleChange('description', e.currentTarget.value)
                    }
                    mt="sm"
                />

                <Group justify="flex-end" mt="lg">
                    <Button variant="outline" onClick={close}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Save</Button>
                </Group>
            </Modal>
            <Card withBorder radius="md" padding="xl" shadow="sm">
                {/* Header Section */}
                <Group justify="space-between" align="start">
                    <Group align="center">
                        <Avatar
                            src={
                                formData.logoUrl || 'https://placehold.co/80x80'
                            }
                            size={80}
                            radius="xl"
                        />
                        <Box>
                            <Title order={3} fw={600}>
                                {formData.displayName}
                            </Title>
                            <Group gap="xs" mt={4}>
                                <ThemeIcon
                                    size="sm"
                                    variant="light"
                                    color="gray"
                                >
                                    <IconMapPin size={14} />
                                </ThemeIcon>
                                <Text size="sm" color="dimmed">
                                    Founded: {formData.yearFounded || 'N/A'}
                                </Text>
                            </Group>
                            <Group gap="xs" mt={4}>
                                <ThemeIcon
                                    size="sm"
                                    variant="light"
                                    color="gray"
                                >
                                    <IconAt size={14} />
                                </ThemeIcon>
                                <Text size="sm" color="dimmed">
                                    Type: {formData.type || 'N/A'}
                                </Text>
                            </Group>
                        </Box>
                    </Group>

                    <Button
                        variant="light"
                        leftSection={<IconEdit size={16} />}
                        onClick={open}
                    >
                        Edit
                    </Button>
                </Group>

                {/* Tags */}
                <Group mt="md" gap="xs">
                    <Badge color="blue" variant="light">
                        {formData.displayName}
                    </Badge>
                    <Badge color="gray" variant="outline">
                        Reg No: {formData.registrationNumber}
                    </Badge>
                </Group>

                {/* Sector Section */}
                <Box mt="xl">
                    <Title order={5} mb="xs" fw={600}>
                        Sector(s)
                    </Title>
                    {/* {skills?.length > 0 ? (
            <Group gap="xs" wrap="wrap">
              {skills.map((skill) => (
                <Badge key={skill} variant="light" color="gray">
                  {skill}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text size="sm" color="dimmed">
              No sectors listed.
            </Text>
          )} */}
                    <Badge variant="light" color="gray">
                        {formData.sector?.name}
                    </Badge>
                </Box>

                {/* Description */}
                <Box mt="xl">
                    <Title order={5} mb="xs" fw={600}>
                        Description
                    </Title>
                    <Card withBorder radius="sm" padding="md" bg="gray.0">
                        <Text size="sm" color="dimmed" lh={1.6}>
                            {formData.description || 'No description provided.'}
                        </Text>
                    </Card>
                </Box>
            </Card>

            {/* Contact + Location Info Card */}
            <Card withBorder radius="md" padding="lg" shadow="sm" mt="xl">
                {/* Contact Info Section */}
                <Box>
                    <Group justify="space-between" align="center" mb="xs">
                        <Title order={6}>Contact Information</Title>
                        <Button
                            size="xs"
                            variant={isEditing ? 'filled' : 'light'}
                            leftSection={<IconEdit size={14} />}
                            onClick={() => setIsEditing((prev) => !prev)}
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </Button>
                    </Group>
                    <Divider mb="md" />
                    <Group wrap="wrap" gap="md">
                        {[
                            {
                                label: 'Phone',
                                type: 'Mobile',
                                placeholder: '+251912345678',
                            },
                            {
                                label: 'Email',
                                type: 'Email',
                                placeholder: 'example@email.com',
                            },
                            {
                                label: 'Other Address',
                                type: 'Home',
                                placeholder: '123 Main Street, City',
                            },
                        ].map(({ label, type: _type, placeholder }) => {
                            const index =
                                formData.contacts?.findIndex(
                                    ({ type }) => type === _type,
                                ) ?? -1;
                            const value =
                                index >= 0
                                    ? formData?.contacts?.[index]?.value
                                    : '';

                            return (
                                <Box
                                    key={_type}
                                    p="md"
                                    w={{ base: '100%', sm: '48%', md: '30%' }}
                                >
                                    <Text size="xs" color="dimmed" mb={4}>
                                        {label}
                                    </Text>

                                    {isEditing ? (
                                        <TextInput
                                            placeholder={placeholder}
                                            value={value}
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(formData.contacts ||
                                                        []),
                                                ];
                                                if (index >= 0) {
                                                    updated[index] = {
                                                        ...updated[index],
                                                        value: e.currentTarget
                                                            .value,
                                                    };
                                                } else {
                                                    updated.push({
                                                        type: _type,
                                                        value: e.currentTarget
                                                            .value,
                                                        isPreferred: false,
                                                    });
                                                }
                                                handleChange(
                                                    'contacts',
                                                    updated,
                                                );
                                            }}
                                        />
                                    ) : (
                                        <Text fw={400}>{value || '-'}</Text>
                                    )}
                                </Box>
                            );
                        })}
                    </Group>

                    {isEditing && (
                        <Group justify="flex-end" mt="lg">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleSubmits();
                                    setIsEditing(false);
                                }}
                            >
                                Save Changes
                            </Button>
                        </Group>
                    )}
                </Box>

                {/* Location Info Section */}
                <Box mt="xl">
                    <Group justify="space-between" align="center" mb="xs">
                        <Title order={6}>Location Details</Title>

                        <Button
                            size="xs"
                            variant={isEditingLocation ? 'filled' : 'light'}
                            leftSection={<IconEdit size={14} />}
                            onClick={() => {
                                setIsEditingLocation((prev) => !prev);
                                setEditingSection('location');
                            }}
                        >
                            {isEditingLocation ? 'Save' : 'Edit'}
                        </Button>
                    </Group>
                    <Divider mb="md" />
                    <Group gap="md" wrap="wrap">
                        {[
                            'country',
                            'region',
                            'city',
                            'subcity',
                            'woreda',
                            'houseNumber',
                        ].map((field) => {
                            const value =
                                formData.locations?.[0]?.locationData?.[
                                    field
                                ] || '';

                            return (
                                <Box
                                    key={field}
                                    w={{ base: '100%', sm: '45%', md: '30%' }}
                                >
                                    <Text size="xs" c="dimmed">
                                        {field.charAt(0).toUpperCase() +
                                            field.slice(1)}
                                    </Text>

                                    {isEditingLocation ? (
                                        <TextInput
                                            value={value}
                                            onChange={(e) => {
                                                const currentLocations =
                                                    formData.locations?.length
                                                        ? [
                                                              ...formData.locations,
                                                          ]
                                                        : [
                                                              {
                                                                  locationData:
                                                                      {},
                                                              },
                                                          ];

                                                if (!currentLocations[0]) {
                                                    currentLocations[0] = {
                                                        locationData: {},
                                                    };
                                                }
                                                if (
                                                    !currentLocations[0]
                                                        .locationData
                                                ) {
                                                    currentLocations[0].locationData =
                                                        {};
                                                }

                                                const _locations =
                                                    currentLocations[0]
                                                        .locationData as LocationData;
                                                _locations[
                                                    field as keyof LocationData
                                                ] = e.currentTarget.value;

                                                handleChange(
                                                    'locations',
                                                    currentLocations,
                                                );
                                            }}
                                            placeholder={`Enter ${field}`}
                                        />
                                    ) : (
                                        <Text fw={400}>{value || '-'}</Text>
                                    )}
                                </Box>
                            );
                        })}
                    </Group>

                    {isEditingLocation && (
                        <Group justify="flex-end" mt="lg">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditingLocation(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    handleSubmit();
                                    setIsEditingLocation(false);
                                }}
                            >
                                Save Changes
                            </Button>
                        </Group>
                    )}
                </Box>
            </Card>

            {organizationId && <UploadFile orgId={organizationId} />}
        </Container>
    );
}

export default UserProfile;
