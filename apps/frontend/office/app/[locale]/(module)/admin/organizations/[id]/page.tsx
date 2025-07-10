'use client';

import { useOrganizationDetail } from '@/hooks/organization-detail';
import {
    Alert,
    Anchor,
    Badge,
    Button,
    Grid,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { fetcher, logger } from '@shega/shared';
import {
    IconAlertCircle,
    IconBuilding,
    IconBuildingSkyscraper,
    IconBuildingStore,
    IconCalendar,
    IconCheck,
    IconClock,
    IconGitBranch,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUser,
    IconUsers,
    IconWorld,
    IconX,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface Profile {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    firstName: string;
    middleName: string;
    lastName: string;
    mothersFullName: string | null;
    birthDate: string | null;
    dobGregorian: string | null;
    gender: string | null;
    marriageStatus: string | null;
    title: string | null;
    phoneNumber: string | null;
    profile_picture_id: string | null;
}

interface Employee {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    id_number: string | null;
    profile: Profile;
}

interface OrganizationEmployee {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    type: string;
    employee: Employee;
}

interface Contact {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    reference: string;
    type: string;
    contactType: string;
    value: string;
    isPreferred: boolean;
    referenceType: string;
}

interface Location {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    reference: string;
    isPreferred: boolean;
    referenceType: string;
    locationData: {
        country: string;
        region: string;
        city: string;
        subcity: string;
        woreda: string;
        houseNumber: string;
        subCity: string;
    };
}

interface Note {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    content: string;
    type: string;
    note: string;
}

interface Organization {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    name: string;
    registrationNumber: string;
    description: string;
    displayName: string;
    type: string;
    yearFounded: string;
    companySize: string;
    hasBranches: boolean;
    status: string;
    corporateEmail: string | null;
    industry: {
        id: string;
        createdBy: string;
        createdAt: string;
        isActive: boolean;
        code: string;
        value: string;
        description: string;
        group: string;
        subGroup: string;
    } | null;
    contacts: Contact[];
    locations: Location[];
    notes: Note[];
    __employee__: OrganizationEmployee[];
    __has_employee__: boolean;
}

// Mock DeclineModal component
const DeclineModal = ({ close }: { close: () => void }) => {
    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Please provide a reason for declining this organization request:
            </Text>
            <textarea
                style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    resize: 'vertical',
                }}
                placeholder="Enter decline reason..."
            />
            <Group justify="flex-end" gap="sm">
                <Button variant="outline" onClick={close}>
                    Cancel
                </Button>
                <Button color="red">Decline Request</Button>
            </Group>
        </Stack>
    );
};

const AdjustmentModal = ({ close }: { close: () => void }) => {
    const [adjustmentNote, setAdjustmentNote] = useState('');
    const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);
    const { id } = useParams<{ id: string }>();

    const handleAdjustmentSubmit = async () => {
        if (!adjustmentNote.trim()) {
            return;
        }

        setIsSubmittingAdjustment(true);
        try {
            await fetcher(`/organization/return/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ note: adjustmentNote }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            close();
            setAdjustmentNote('');
            // Optionally refetch the organization data or show success message
        } catch (error) {
            logger.error('Error submitting adjustment:', error);
        } finally {
            setIsSubmittingAdjustment(false);
        }
    };

    return (
        <Stack gap="md">
            <Text size="sm" c="dimmed">
                Please provide details about the adjustments needed for this
                organization request:
            </Text>
            <textarea
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    resize: 'vertical',
                }}
                placeholder="Describe the changes or adjustments needed..."
            />
            <Group justify="flex-end" gap="sm">
                <Button
                    variant="outline"
                    onClick={close}
                    disabled={isSubmittingAdjustment}
                >
                    Cancel
                </Button>
                <Button
                    color="orange"
                    onClick={handleAdjustmentSubmit}
                    loading={isSubmittingAdjustment}
                    disabled={!adjustmentNote.trim()}
                >
                    Request Adjustments
                </Button>
            </Group>
        </Stack>
    );
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
const OrganizationApproval = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [adjustmentOpened, { open: openAdjustment, close: closeAdjustment }] =
        useDisclosure(false);
    const { id } = useParams<{ id: string }>();

    const { data: organizationData } = useQuery({
        queryKey: ['organization', id],
        queryFn: async () => {
            const response: Organization = await fetcher(
                `/organization/${id}`,
                {
                    method: 'GET',
                },
            );
            return response;
        },
    });

    const { approveOrganizationMutation, isApprovingOrganization } =
        useOrganizationDetail({ id });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'green';
            case 'PENDING':
                return 'yellow';
            case 'REJECTED':
                return 'red';
            case 'RETURNED':
                return 'orange';
            case 'New':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const getContactIcon = (contactType: string) => {
        switch (contactType) {
            case 'Phone':
                return <IconPhone size={16} />;
            case 'Email':
                return <IconMail size={16} />;
            default:
                return <IconWorld size={16} />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const uniqueContacts =
        organizationData?.contacts?.reduce((acc: Contact[], contact) => {
            const key = `${contact.contactType}-${contact.value}-${contact.type}`;
            if (
                !acc.find(
                    (c) => `${c.contactType}-${c.value}-${c.type}` === key,
                )
            ) {
                acc.push(contact);
            }
            return acc;
        }, [] as Contact[]) ?? [];

    if (!organizationData) {
        return <Text>Loading organization details...</Text>;
    }

    return (
        <Stack gap="lg">
            {/* Admin Alert for Pending Approval */}
            {organizationData.status === 'WAITINGAPPROVAL' && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Approval Required"
                    color="orange"
                    variant="light"
                >
                    This organization is awaiting administrative approval.
                    Please review the details below and take appropriate action.
                </Alert>
            )}

            {organizationData.status === 'RETURNED' && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Returned for Adjustments"
                    color="orange"
                    variant="filled"
                    className="animate-pulse border-2 border-orange-500 shadow-lg"
                >
                    This organization was returned for adjustments.
                </Alert>
            )}

            {/* Main Organization Header */}
            <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Group>
                        <ThemeIcon
                            size="xl"
                            radius="md"
                            variant="light"
                            color="blue"
                        >
                            <IconBuilding size={24} />
                        </ThemeIcon>
                        <div>
                            <Title order={2}>
                                {organizationData.displayName}
                            </Title>
                            <Text size="sm" c="dimmed">
                                {organizationData.name} •{' '}
                                {organizationData.registrationNumber}
                            </Text>
                        </div>
                    </Group>
                    <Group>
                        <Badge
                            color={getStatusColor(organizationData.status)}
                            variant="light"
                            leftSection={<IconCheck size={12} />}
                        >
                            {organizationData.status}
                        </Badge>
                        <Badge
                            color={organizationData.isActive ? 'green' : 'red'}
                            variant="outline"
                        >
                            {organizationData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Group>

                <Text mb="md" c="dimmed">
                    {organizationData.description}
                </Text>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconBuildingStore size={16} />
                            <Text size="sm">
                                <strong>Type:</strong> {organizationData.type}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconCalendar size={16} />
                            <Text size="sm">
                                <strong>Founded:</strong>{' '}
                                {organizationData.yearFounded}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconUsers size={16} />
                            <Text size="sm">
                                <strong>Size:</strong>{' '}
                                {organizationData.companySize}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconClock size={16} />
                            <Text size="sm">
                                <strong>Submitted:</strong>{' '}
                                {formatDate(organizationData.createdAt)}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconGitBranch size={16} />
                            <Text size="sm">
                                <strong>Has Branches:</strong>{' '}
                                {organizationData.hasBranches ? 'Yes' : 'No'}
                            </Text>
                        </Group>
                    </Grid.Col>
                    {organizationData.industry && (
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Group gap="xs">
                                <IconBuildingSkyscraper size={16} />
                                <Text size="sm">
                                    <strong>Industry:</strong>{' '}
                                    {organizationData.industry.value}
                                </Text>
                            </Group>
                        </Grid.Col>
                    )}
                </Grid>
            </Paper>

            {/* Adjustment Notes Section - Show prominently for returned applications */}
            {organizationData.status === 'RETURNED' &&
                organizationData.notes &&
                organizationData.notes.length > 0 && (
                    <Paper shadow="sm" p="lg" radius="md" withBorder>
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
                            {organizationData.notes
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
                                                {organizationData.notes.length -
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

            <Grid>
                {/* Contact Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Contact Information
                        </Title>
                        <Stack gap="sm">
                            {organizationData.corporateEmail && (
                                <Paper p="xs" withBorder radius="sm">
                                    <Group gap="xs">
                                        <ThemeIcon
                                            size="sm"
                                            variant="light"
                                            radius="xl"
                                            color="blue"
                                        >
                                            <IconMail size={14} />
                                        </ThemeIcon>
                                        <div style={{ flex: 1 }}>
                                            <Text size="sm" fw={500}>
                                                Corporate Email
                                            </Text>
                                            <Anchor
                                                href={`mailto:${organizationData.corporateEmail}`}
                                                size="xs"
                                            >
                                                {
                                                    organizationData.corporateEmail
                                                }
                                            </Anchor>
                                        </div>
                                    </Group>
                                </Paper>
                            )}
                            {uniqueContacts.map((contact) => (
                                <Paper
                                    key={contact.id}
                                    p="xs"
                                    withBorder
                                    radius="sm"
                                >
                                    <Group gap="xs">
                                        <ThemeIcon
                                            size="sm"
                                            variant="light"
                                            radius="xl"
                                        >
                                            {getContactIcon(
                                                contact.contactType,
                                            )}
                                        </ThemeIcon>
                                        <div style={{ flex: 1 }}>
                                            <Text size="sm" fw={500}>
                                                {contact.type}{' '}
                                                {contact.contactType}
                                            </Text>
                                            {contact.contactType === 'Email' ? (
                                                <Anchor
                                                    href={`mailto:${contact.value}`}
                                                    size="xs"
                                                >
                                                    {contact.value}
                                                </Anchor>
                                                // biome-ignore lint/nursery/noNestedTernary: <explanation>
                                            ) : contact.contactType ===
                                              'Phone' ? (
                                                <Anchor
                                                    href={`tel:${contact.value}`}
                                                    size="xs"
                                                >
                                                    {contact.value}
                                                </Anchor>
                                            ) : (
                                                <Text size="xs" c="dimmed">
                                                    {contact.value}
                                                </Text>
                                            )}
                                        </div>
                                    </Group>
                                </Paper>
                            ))}
                            {uniqueContacts.length === 0 &&
                                !organizationData.corporateEmail && (
                                    <Text
                                        size="sm"
                                        c="dimmed"
                                        ta="center"
                                        py="md"
                                    >
                                        No contact information provided
                                    </Text>
                                )}
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Location Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Location Information
                        </Title>
                        {organizationData.locations.length > 0 ? (
                            <Stack gap="sm">
                                {organizationData.locations.map((location) => (
                                    <Paper
                                        key={location.id}
                                        p="sm"
                                        withBorder
                                        radius="sm"
                                    >
                                        <Group gap="xs" mb="xs">
                                            <ThemeIcon
                                                size="sm"
                                                variant="light"
                                                radius="xl"
                                            >
                                                <IconMapPin size={14} />
                                            </ThemeIcon>
                                            <Badge
                                                color={
                                                    location.isPreferred
                                                        ? 'green'
                                                        : 'gray'
                                                }
                                                variant="light"
                                                size="xs"
                                            >
                                                {location.isPreferred
                                                    ? 'Primary'
                                                    : 'Secondary'}
                                            </Badge>
                                        </Group>
                                        <Stack gap="xs">
                                            <Text size="sm">
                                                <strong>Country:</strong>{' '}
                                                {location.locationData.country}
                                            </Text>
                                            <Text size="sm">
                                                <strong>Region:</strong>{' '}
                                                {location.locationData.region}
                                            </Text>
                                            <Text size="sm">
                                                <strong>City:</strong>{' '}
                                                {location.locationData.city}
                                            </Text>
                                            <Text size="sm">
                                                <strong>Subcity:</strong>{' '}
                                                {location.locationData
                                                    .subcity ||
                                                    location.locationData
                                                        .subCity}
                                            </Text>
                                            <Text size="sm">
                                                <strong>Woreda:</strong>{' '}
                                                {location.locationData.woreda}
                                            </Text>
                                            <Text size="sm">
                                                <strong>House Number:</strong>{' '}
                                                {
                                                    location.locationData
                                                        .houseNumber
                                                }
                                            </Text>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Text size="sm" c="dimmed" ta="center" py="md">
                                No location information provided
                            </Text>
                        )}
                    </Paper>
                </Grid.Col>

                {/* Employee Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Employee Information
                        </Title>
                        {organizationData.__has_employee__ &&
                        organizationData.__employee__.length > 0 ? (
                            <Stack gap="sm">
                                {organizationData.__employee__.map(
                                    (orgEmployee) => (
                                        <Paper
                                            key={orgEmployee.id}
                                            p="sm"
                                            withBorder
                                            radius="sm"
                                        >
                                            <Group gap="xs" mb="xs">
                                                <ThemeIcon
                                                    size="sm"
                                                    variant="light"
                                                    radius="xl"
                                                >
                                                    <IconUser size={14} />
                                                </ThemeIcon>
                                                <Badge
                                                    variant="outline"
                                                    size="xs"
                                                >
                                                    {orgEmployee.type}
                                                </Badge>
                                            </Group>
                                            <Stack gap="xs">
                                                <Text size="sm" fw={500}>
                                                    {
                                                        orgEmployee.employee
                                                            .profile.firstName
                                                    }{' '}
                                                    {
                                                        orgEmployee.employee
                                                            .profile.middleName
                                                    }{' '}
                                                    {
                                                        orgEmployee.employee
                                                            .profile.lastName
                                                    }
                                                </Text>
                                                {orgEmployee.employee.profile
                                                    .title && (
                                                    <Text size="xs" c="dimmed">
                                                        {
                                                            orgEmployee.employee
                                                                .profile.title
                                                        }
                                                    </Text>
                                                )}
                                                {orgEmployee.employee.profile
                                                    .phoneNumber && (
                                                    <Text size="xs">
                                                        <strong>Phone:</strong>{' '}
                                                        {
                                                            orgEmployee.employee
                                                                .profile
                                                                .phoneNumber
                                                        }
                                                    </Text>
                                                )}
                                                {orgEmployee.employee
                                                    .id_number && (
                                                    <Text size="xs">
                                                        <strong>ID:</strong>{' '}
                                                        {
                                                            orgEmployee.employee
                                                                .id_number
                                                        }
                                                    </Text>
                                                )}
                                            </Stack>
                                        </Paper>
                                    ),
                                )}
                            </Stack>
                        ) : (
                            <Text size="sm" c="dimmed" ta="center" py="md">
                                No employee information available
                            </Text>
                        )}
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Additional Information */}
            <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                    Additional Information
                </Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text size="sm">
                            <strong>Submitted By:</strong>{' '}
                            {organizationData.createdBy}
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text size="sm">
                            <strong>Submission Date:</strong>{' '}
                            {formatDate(organizationData.createdAt)}
                        </Text>
                    </Grid.Col>
                </Grid>
            </Paper>

            {organizationData.status === 'WAITINGAPPROVAL' && (
                <Paper shadow="md" p="lg" radius="md" withBorder>
                    <Group justify="space-between" align="center">
                        <div>
                            <Text fw={500} mb="xs">
                                Administrative Action Required
                            </Text>
                            <Text size="sm" c="dimmed">
                                Review the organization details above and
                                approve, request adjustments, or decline this
                                request.
                            </Text>
                        </div>
                        <Group gap="sm">
                            <Button
                                color="red"
                                variant="outline"
                                leftSection={<IconX size={16} />}
                                onClick={open}
                                disabled={isApprovingOrganization}
                            >
                                Decline Request
                            </Button>
                            <Button
                                color="orange"
                                variant="outline"
                                leftSection={<IconAlertCircle size={16} />}
                                onClick={openAdjustment}
                                disabled={isApprovingOrganization}
                            >
                                Request Adjustments
                            </Button>
                            <Button
                                color="green"
                                leftSection={<IconCheck size={16} />}
                                onClick={() => approveOrganizationMutation()}
                                loading={isApprovingOrganization}
                            >
                                Approve Organization
                            </Button>
                        </Group>
                    </Group>
                </Paper>
            )}

            {/* Decline Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title="Decline Organization Request"
                centered
                size="md"
            >
                <DeclineModal close={close} />
            </Modal>

            {/* Adjustment Modal */}
            <Modal
                opened={adjustmentOpened}
                onClose={closeAdjustment}
                title="Request Organization Adjustments"
                centered
                size="md"
            >
                <AdjustmentModal close={closeAdjustment} />
            </Modal>
        </Stack>
    );
};

export default OrganizationApproval;
