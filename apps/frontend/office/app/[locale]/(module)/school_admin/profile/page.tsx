'use client';

import {
    ActionIcon,
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    FileButton,
    Flex,
    Group,
    Loader,
    LoadingOverlay,
    Modal,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
    IconAlertCircle,
    IconBuilding,
    IconCalendar,
    IconCamera,
    IconCheck,
    IconEdit,
    IconMapPin,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';

import { COOKIE_ACCESS_TOKEN, fetcher } from '@shega/shared';
import { canSubmit, fetchCategories } from 'app/[locale]/_api/job-details';
import { useDownloadProfilePicture } from 'app/[locale]/_api/job-seeker';
import {
    type Category,
    type Organization,
    getOrganizationById,
} from 'app/[locale]/_api/organizations/get-organizationbyId';
import type { UpdateLocationPayload } from 'app/[locale]/_api/organizations/updateOrganization';
import { useUploadProfilePicture } from 'app/[locale]/_api/profile';
import { AddOrganizationDetail } from './components/AddOrganizationDetail';
import ContactSection from './components/ContactInformation';
import { LocationSection } from './components/LocationDetails';
import UploadFile from './components/UploadFile';

const DefaultProps = {
    registrationNumber: '',
    displayName: '',
    type: '',
    industryId: '',
    yearFounded: '',
    companySize: '',
    description: '',
    logoUrl: '',

    sector: undefined,
    locations: [],
    contacts: [],
};

type FormDataType = Partial<Organization & UpdateLocationPayload>;

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

function HeaderSection({
    formData,
    open,
    canUpdateProfile,
}: {
    formData: FormDataType;
    open: () => void;
    canUpdateProfile: boolean;
}) {
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const resetRef = useRef<() => void>(null);

    const { mutate: uploadProfilePicture } = useUploadProfilePicture();
    const { data: profilePicture } = useDownloadProfilePicture(
        formData?.logo ?? '',
    );

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
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
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

    const avatarSrc = profilePicture
        ? typeof profilePicture === 'string'
            ? profilePicture
            : URL.createObjectURL(profilePicture)
        : undefined;

    return (
        <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Group align="flex-start" gap="lg">
                <Stack gap="sm" align="center">
                    <Box style={{ position: 'relative' }}>
                        <Avatar
                            src={avatarSrc}
                            size={140}
                            radius={140}
                            style={{ cursor: 'pointer' }}
                            onClick={() => avatarSrc && setIsModalOpen(true)}
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
                                    color="blue"
                                    size="lg"
                                    style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 10,
                                    }}
                                >
                                    <IconCamera size={20} />
                                </ActionIcon>
                            )}
                        </FileButton>
                        {isUploading && (
                            <LoadingOverlay
                                visible
                                zIndex={1000}
                                overlayProps={{ radius: 'sm', blur: 2 }}
                                loaderProps={{ color: 'blue' }}
                            />
                        )}
                    </Box>
                </Stack>

                <Stack gap="xs" flex={1}>
                    <Title order={2} fw={700}>
                        {formData.name}
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
                    <Group>
                        <Badge
                            variant="light"
                            leftSection={<IconCheck size={12} />}
                        >
                            {formData.status}
                        </Badge>
                        <Badge
                            color={formData.isActive ? 'green' : 'red'}
                            variant="outline"
                        >
                            {formData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Stack>
            </Group>
            {canUpdateProfile && (
                <Button
                    variant="light"
                    leftSection={<IconEdit size={16} />}
                    onClick={open}
                    radius="md"
                >
                    Edit Profile
                </Button>
            )}
            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                centered
                size="lg"
            >
                {avatarSrc ? (
                    <img
                        src={avatarSrc}
                        alt="Profile Preview"
                        style={{ width: '100%' }}
                    />
                ) : (
                    <Text>No profile picture available.</Text>
                )}
            </Modal>
        </Group>
    );
}

function TagsSection({ formData }: { formData: FormDataType }) {
    return (
        <Group gap="xs">
            <Badge color="teal" variant="light" size="md" radius="sm">
                {formData.industry?.value || 'Unspecified Sector'}
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
            <Text>{formData.corporateEmail ?? ''}</Text>
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

const ApprovalType = {
    New: 'New',
    WAITINGAPPROVAL: 'WAITINGAPPROVAL',
    APPROVED: 'APPROVED',
    DECLINED: 'DECLINED',
    RETURNED: 'RETURNED',
};

function UserProfile() {
    const queryClient = useQueryClient();
    const [opened, { open, close }] = useDisclosure(false);
    const [confirmModalOpened, { open: openConfirm, close: closeConfirm }] =
        useDisclosure(false);

    const organizationId = getCookie('organization_id')?.toString();
    const [formData, setFormData] = useState<FormDataType>({});

    const { data: organization, isLoading: orgLoading } =
        useQuery<Organization>({
            queryKey: ['organization_id', organizationId],
            queryFn: async () =>
                await getOrganizationById(organizationId ?? ''),
            enabled: !!organizationId,
        });

    const canUpdateProfile =
        organization?.status === ApprovalType.New ||
        organization?.status === ApprovalType.RETURNED ||
        organization?.status === ApprovalType.APPROVED;

    const submitMutation = useMutation({
        mutationFn: submitOrganizationProfile,
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Profile Send for Approval',
                color: 'green',
            });
            closeConfirm();
            queryClient.invalidateQueries({
                queryKey: ['organization_id', organizationId],
            });
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Failed to submit profile for approval',
                color: 'red',
            });
            closeConfirm();
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

    const { data: canOrganizationSubmit } = useQuery({
        queryKey: ['can_organization_submit'],
        queryFn: canSubmit,
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
        <Box key={canUpdateProfile + (organizationId?.toString() ?? '')}>
            <AddOrganizationDetail
                close={close}
                opened={opened}
                categories={categories}
                categoriesLoading={categoriesLoading}
                defaultValues={{
                    registrationNumber:
                        organizationDetail.registrationNumber ?? '',
                    type: organizationDetail.type ?? '',
                    industryId: organizationDetail.industryId ?? '',
                    yearFounded: organizationDetail.yearFounded ?? '',
                    companySize: organizationDetail.companySize ?? '',
                    description: organizationDetail.description ?? '',
                }}
            />
            {organization?.status === ApprovalType.WAITINGAPPROVAL && (
                <Paper
                    p="sm"
                    mb="lg"
                    radius="md"
                    withBorder
                    shadow="xs"
                    style={{
                        backgroundColor: '#E6FFFA',
                        borderColor: '#38B2AC',
                    }}
                >
                    <Group>
                        <ThemeIcon color="teal" variant="light" size="lg">
                            <IconCheck size={18} />
                        </ThemeIcon>
                        <Stack gap={0}>
                            <Text fw={500} color="teal">
                                Profile submitted for approval
                            </Text>
                            <Text size="sm" c="dimmed">
                                Your organization profile is currently under
                                review by the admin team.
                            </Text>
                        </Stack>
                    </Group>
                </Paper>
            )}

            {organization?.status === 'RETURNED' &&
                organization?.notes &&
                organization?.notes.length > 0 && (
                    <Paper shadow="sm" p="lg" radius="md" withBorder mb="md">
                        <Group mb="md">
                            <ThemeIcon
                                size="lg"
                                radius="md"
                                variant="light"
                                color="orange"
                            >
                                <IconAlertCircle size={20} />
                            </ThemeIcon>
                            <Title order={3} c="orange.8">
                                Adjustment History
                            </Title>
                        </Group>
                        <Stack gap="md">
                            {organization?.notes
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime(),
                                )
                                .map((note, index) => (
                                    <Paper
                                        key={note.id}
                                        p="md"
                                        withBorder
                                        radius="sm"
                                    >
                                        <Group justify="space-between" mb="xs">
                                            <Badge
                                                color="orange"
                                                variant="light"
                                                size="sm"
                                            >
                                                Adjustment #
                                                {organization?.notes.length -
                                                    index}
                                            </Badge>
                                            <Text size="xs" c="dimmed">
                                                {formatDate(note.createdAt)}
                                            </Text>
                                        </Group>
                                        <Text size="sm" mb="xs" fw={500}>
                                            {note.type}
                                        </Text>
                                        <Text size="sm" mb="xs">
                                            {note.note}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            Requested by: {note.createdBy}
                                        </Text>
                                    </Paper>
                                ))}
                        </Stack>
                    </Paper>
                )}

            <Paper p="xl" shadow="sm" radius="md" withBorder>
                <Stack gap="xl">
                    <HeaderSection
                        formData={formData}
                        open={open}
                        canUpdateProfile={canUpdateProfile}
                    />
                    <TagsSection formData={formData} />
                    <Divider />
                    <CompanyOverviewSection formData={formData} />
                </Stack>
            </Paper>

            <ContactSection
                workers={organization?.__employee__ ?? []}
                canUpdateProfile={canUpdateProfile}
            />

            <LocationSection
                defaultLocation={organization?.locations}
                canUpdateProfile={canUpdateProfile}
            />

            {organizationId && (
                <UploadFile
                    orgId={organizationId}
                    canUpdateProfile={canUpdateProfile}
                />
            )}

            {canUpdateProfile && (
                <>
                    {canOrganizationSubmit && (
                        <CompletionStatus status={canOrganizationSubmit} />
                    )}

                    {canOrganizationSubmit?.canSubmit && (
                        <Flex align="center" justify="flex-end" mt="md">
                            <Button onClick={openConfirm}>
                                Submit for Approval
                            </Button>
                        </Flex>
                    )}

                    <Modal
                        opened={confirmModalOpened}
                        onClose={closeConfirm}
                        title="Submit Profile for Approval?"
                        centered
                    >
                        <Stack>
                            <Text>
                                Are you ready to send your organization profile
                                for admin review? You won&apos;t be able to edit
                                it while it&apos;s under review.
                            </Text>
                            <Group justify="flex-end" mt="md">
                                <Button
                                    variant="outline"
                                    onClick={closeConfirm}
                                >
                                    Edit Profile
                                </Button>
                                <Button
                                    loading={submitMutation.isPending}
                                    onClick={() => submitMutation.mutate()}
                                >
                                    Submit for Approval
                                </Button>
                            </Group>
                        </Stack>
                    </Modal>
                </>
            )}
        </Box>
    );
}

export default UserProfile;

function CompletionStatus({
    status,
}: {
    status: {
        organizationDetail: boolean;
        documents: boolean;
        contactPerson: boolean;
        location: boolean;
        canSubmit: boolean;
    };
}) {
    const items = [
        { key: 'organizationDetail', label: 'Organization Details' },
        { key: 'contactPerson', label: 'Contact Person' },
        { key: 'location', label: 'Location Details' },
        { key: 'documents', label: 'Documents' },
    ];

    return (
        <Paper withBorder p="md" radius="md" mt="lg">
            <Title order={5} mb="sm">
                Profile Completion Status
            </Title>
            <Stack gap="xs">
                {items.map(({ key, label }) => (
                    <Group key={key} justify="space-between">
                        <Text size="sm">{label}</Text>
                        {status[key as keyof typeof status] ? (
                            <Badge color="green" variant="light">
                                Completed
                            </Badge>
                        ) : (
                            <Badge color="red" variant="light">
                                Missing
                            </Badge>
                        )}
                    </Group>
                ))}
            </Stack>
            {!status.canSubmit && (
                <Text size="xs" mt="md" c="dimmed">
                    Complete all required sections before submitting your
                    profile.
                </Text>
            )}
        </Paper>
    );
}
