'use client';

import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    Container,
    Group,
    Loader,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAt, IconEdit, IconMapPin } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
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
import { ContactSection } from './components/ContactInformation';
import { LocationSection } from './components/LocationDetails';
import UploadFile from './components/UploadFile';

type FormDataType = Partial<Organization & UpdateLocationPayload>;

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
            <Container size="md" mt="lg">
                <Loader size="sm" />
                <Text mt="sm">Loading organization data...</Text>
            </Container>
        );
    }
    return (
        <Container size="md" mt="lg">
            <AddOrganizationDetail
                close={close}
                opened={opened}
                categories={categories}
                categoriesLoading={categoriesLoading}
            />
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
                <ContactSection
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    contactsFromServer={(organization?.contacts as any) ?? []}
                />

                <LocationSection
                    defaultLocation={
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (organization?.locations?.[0]?.locationData as any) ??
                        {}
                    }
                />
            </Card>

            {organizationId && <UploadFile orgId={organizationId} />}
        </Container>
    );
}

export default UserProfile;
