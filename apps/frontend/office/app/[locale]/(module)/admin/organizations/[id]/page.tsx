'use client';
import { useOrganizationDetail } from '@/hooks/organization-detail';
import {
    Anchor,
    Badge,
    Box,
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
import { fetcher } from '@shega/shared';
import {
    IconBuilding,
    IconBuildingStore,
    IconCalendar,
    IconCheck,
    IconClock,
    IconMail,
    IconMapPin,
    IconPhone,
    IconUsers,
    IconWorld,
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import type { Organization } from '../../../../../../model/OrganizationDetail';
import DeclineModal from '../_components/DeclineModal';

const OrganizationDetails = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { id } = useParams<{ id: string }>();
    const { data: organizationData } = useQuery({
        queryKey: ['job', id],
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
    const {
        approveOrganizationMutation,
        isApprovingOrganization,
        declineOrganizationMutation,
        isDecliningOrganization,
    } = useOrganizationDetail({ id });
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'green';
            case 'PENDING':
                return 'yellow';
            case 'REJECTED':
                return 'red';
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
        organizationData?.contacts?.reduce(
            (acc: typeof organizationData.contacts, contact) => {
                const key = `${contact.contactType}-${contact.value}`;
                if (!acc.find((c) => `${c.contactType}-${c.value}` === key)) {
                    acc.push(contact);
                }
                return acc;
            },
            [] as typeof organizationData.contacts,
        ) ?? [];

    return (
        <Stack gap="lg">
            <Paper shadow="sm" p={'lg'} radius="md" withBorder>
                <Group justify="space-between" mb="md">
                    <Group>
                        <ThemeIcon size="xl" radius="md" variant="light">
                            <IconBuilding size={24} />
                        </ThemeIcon>
                        <div>
                            <Title order={2}>
                                {organizationData?.displayName}
                            </Title>
                            <Text size="sm" c="dimmed">
                                {organizationData?.name} •{' '}
                                {organizationData?.registrationNumber}
                            </Text>
                        </div>
                    </Group>
                    <Group>
                        <Badge
                            color={getStatusColor(
                                organizationData?.status ?? '',
                            )}
                            variant="light"
                            leftSection={<IconCheck size={12} />}
                        >
                            {organizationData?.status}
                        </Badge>
                        <Badge
                            color={organizationData?.isActive ? 'green' : 'red'}
                            variant="outline"
                        >
                            {organizationData?.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </Group>
                </Group>

                <Text mb="md">{organizationData?.description}</Text>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconBuildingStore size={16} />
                            <Text size="sm">
                                <strong>Type:</strong> {organizationData?.type}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconCalendar size={16} />
                            <Text size="sm">
                                <strong>Founded:</strong>{' '}
                                {organizationData?.yearFounded}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconUsers size={16} />
                            <Text size="sm">
                                <strong>Size:</strong>{' '}
                                {organizationData?.companySize}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Group gap="xs">
                            <IconClock size={16} />
                            <Text size="sm">
                                <strong>Created:</strong>{' '}
                                {formatDate(organizationData?.createdAt ?? '')}
                            </Text>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>

            <Grid>
                {/* Sector Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Sector Information
                        </Title>
                        <Stack gap="sm">
                            <Text>
                                <strong>Name:</strong>{' '}
                                {organizationData?.sector.name}
                            </Text>
                            <Text>
                                <strong>Type:</strong>{' '}
                                {organizationData?.sector.isRoot
                                    ? 'Root Sector'
                                    : 'Sub Sector'}
                            </Text>
                            <Text size="xs" c="dimmed">
                                Created:{' '}
                                {formatDate(
                                    organizationData?.sector?.createdAt ?? '',
                                )}
                            </Text>
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Contact Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Contact Information
                        </Title>
                        <Stack gap="sm">
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
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Location Information */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Paper shadow="sm" p="lg" radius="md" withBorder h="100%">
                        <Title order={4} mb="md">
                            Location Information
                        </Title>
                        {organizationData?.locations.map((location) => (
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
                                        {location.locationData.subcity}
                                    </Text>
                                    <Text size="sm">
                                        <strong>Woreda:</strong>{' '}
                                        {location.locationData.woreda}
                                    </Text>
                                    <Text size="sm">
                                        <strong>House Number:</strong>{' '}
                                        {location.locationData.houseNumber}
                                    </Text>
                                </Stack>
                            </Paper>
                        ))}
                    </Paper>
                </Grid.Col>
            </Grid>

            <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                    Additional Information
                </Title>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text>
                            <strong>Created By:</strong>{' '}
                            {organizationData?.createdBy}
                        </Text>
                    </Grid.Col>
                    {organizationData?.note && (
                        <Grid.Col span={12}>
                            <Text>
                                <strong>Note:</strong> {organizationData?.note}
                            </Text>
                        </Grid.Col>
                    )}
                </Grid>
            </Paper>

            {organizationData?.status === 'New' && (
                <Box className="flex items-center justify-end gap-2.5" p={'lg'}>
                    <Button
                        c={'red.8'}
                        bg={'red.3'}
                        onClick={open}
                        disabled={isApprovingOrganization}
                    >
                        Decline
                    </Button>
                    <Button
                        onClick={() => approveOrganizationMutation()}
                        loading={isApprovingOrganization}
                    >
                        Approve
                    </Button>
                </Box>
            )}
            <Modal
                opened={opened}
                onClose={close}
                title="Decline Reason"
                centered
                size="md"
            >
                <DeclineModal close={close} />
            </Modal>
        </Stack>
    );
};

export default OrganizationDetails;
