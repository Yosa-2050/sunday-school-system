'use client';

import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Group,
    Loader,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import {
    IconBuilding,
    IconCalendar,
    IconEdit,
    IconMapPin,
} from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCategories } from 'app/[locale]/_api/job-details';
import {
    type Category,
    type Organization,
    getOrganizationById,
} from 'app/[locale]/_api/organizations/get-organizationbyId';
import type { UpdateLocationPayload } from 'app/[locale]/_api/organizations/updateOrganization';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { AddOrganizationDetail } from './components/AddOrganizationDetail';
import ContactSection from './components/ContactInformation';
import { LocationSection } from './components/LocationDetails';
import UploadFile from './components/UploadFile';

const DefaultProps = {
    registrationNumber: '',
    displayName: '',
    type: '',
    industryId: '',
    yearFounded: 0,
    companySize: '',
    description: '',
    logoUrl: '',
    sector: undefined,
    locations: [],
    contacts: [],
};

type FormDataType = Partial<Organization & UpdateLocationPayload>;

function HeaderSection({
    formData,
    open,
}: { formData: FormDataType; open: () => void }) {
    return (
        <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group align="flex-start" gap="lg">
                <Avatar
                    src={
                        formData.logoUrl ||
                        '/placeholder.svg?height=80&width=80'
                    }
                    size={80}
                    radius="md"
                    alt={`${formData.displayName} logo`}
                />
                <Stack gap="xs" flex={1}>
                    <Title order={2} fw={700}>
                        {formData.displayName}
                    </Title>
                    <Stack gap="xs">
                        <Group gap="xs" align="center">
                            <ThemeIcon
                                size="sm"
                                variant="light"
                                color="teal"
                                radius="xl"
                            >
                                <IconCalendar size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="dimmed">
                                Founded: {formData.yearFounded || 'N/A'}
                            </Text>
                        </Group>
                        <Group gap="xs" align="center">
                            <ThemeIcon
                                size="sm"
                                variant="light"
                                color="violet"
                                radius="xl"
                            >
                                <IconBuilding size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="dimmed">
                                Type: {formData.type || 'N/A'}
                            </Text>
                        </Group>
                    </Stack>
                </Stack>
            </Group>
            <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={open}
                radius="md"
            >
                Edit Profile
            </Button>
        </Group>
    );
}

function TagsSection({ formData }: { formData: FormDataType }) {
    return (
        <Group gap="xs">
            <Badge color="teal" variant="light" size="md" radius="sm">
                {formData.sector?.name || 'Unspecified Sector'}
            </Badge>
            <Badge color="gray" variant="outline" size="md" radius="sm">
                Reg No: {formData.registrationNumber}
            </Badge>
        </Group>
    );
}

function CompanyOverviewSection({ formData }: { formData: FormDataType }) {
    return (
        <Stack gap="md">
            <Group gap="xs">
                <ThemeIcon size="md" variant="light" color="violet" radius="md">
                    <IconMapPin size={18} />
                </ThemeIcon>
                <Title order={4} fw={600}>
                    Company Overview
                </Title>
            </Group>
            <Paper withBorder radius="md" p="md">
                <Text size="sm" lh={1.6}>
                    {formData.description || 'No description provided.'}
                </Text>
            </Paper>
        </Stack>
    );
}

const submitOrganizationProfile = async () => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    const response = await fetcher('/organization/submit', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return response;
};

function UserProfile() {
    const [opened, { open, close }] = useDisclosure(false);

    const organizationId = getCookie('organization_id')?.toString();
    const [formData, setFormData] = useState<FormDataType>({});

    const { data: organization, isLoading: orgLoading } =
        useQuery<Organization>({
            queryKey: ['organization_id', organizationId],
            queryFn: async () =>
                await getOrganizationById(organizationId ?? ''),
            enabled: !!organizationId,
        });
    const submitMutation = useMutation({
        mutationFn: submitOrganizationProfile,
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Profile updated successfully',
                color: 'green',
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to update profile',
                color: 'red',
            });
        },
    });
    const { contacts, locations, ...organizationDetail } =
        organization ?? DefaultProps;

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

    if (orgLoading || !formData) {
        return (
            <Box className="flex flex-col items-center justify-center h-full">
                <Loader size="sm" />
                <Text mt="sm">Loading organization data...</Text>
            </Box>
        );
    }
    return (
        <Box>
            <AddOrganizationDetail
                close={close}
                opened={opened}
                categories={categories}
                categoriesLoading={categoriesLoading}
                defaultValues={{
                    registrationNumber:
                        organizationDetail.registrationNumber ?? '',
                    displayName: organizationDetail.displayName ?? '',
                    type: organizationDetail.type ?? '',
                    industryId: organizationDetail.industryId ?? '',
                    yearFounded: organizationDetail.yearFounded ?? 0,
                    companySize: organizationDetail.companySize ?? '',
                    description: organizationDetail.description ?? '',
                }}
            />
            <Paper p="xl" shadow="sm" radius="md" withBorder>
                <Stack gap="xl">
                    {/* Header Section */}
                    <HeaderSection formData={formData} open={open} />

                    {/* Tags Section */}
                    <TagsSection formData={formData} />

                    <Divider />

                    {/* Company Overview Section */}
                    <CompanyOverviewSection formData={formData} />
                </Stack>
            </Paper>

            <ContactSection
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                workers={organization?.__employee__ ?? []}
            />

            <LocationSection
                defaultLocation={
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (organization?.locations?.[0]?.locationData as any) ?? {}
                }
            />

            {organizationId && <UploadFile orgId={organizationId} />}

            <Flex align="center" justify="flex-end" mt={'md'}>
                <Button
                    onClick={() => submitMutation.mutate()}
                    loading={submitMutation.isPending}
                >
                    Submit
                </Button>
            </Flex>
        </Box>
    );
}

export default UserProfile;
