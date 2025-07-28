'use client';

import { EntityPageLoading } from '@/components/EntityPageLoading';
import { useOrganizationDetail } from '@/hooks/organization-detail';
import {
    Alert,
    Button,
    Grid,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { fetcher } from '@shega/shared';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import type { Organization } from 'model/Organization';
import { useParams } from 'next/navigation';
import { AdjustmentModal } from '../_components/AdjustModal';
import DeclineModal from '../_components/DeclineModal';
import DocumentPreview from '../_components/OrganizationDocuments';
import { AdjustmentCollapsable } from './_components/AdjustMentCollapsable';
import { ContactInformation } from './_components/ContactInformation';
import { EmployeeInformation } from './_components/EmployeInformation';
import { LocationInformation } from './_components/LocationInformation';
import { OrganizationBasic } from './_components/OrganizationBasic';

const OrganizationApproval = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [adjustmentOpened, { open: openAdjustment, close: closeAdjustment }] =
        useDisclosure(false);
    const { id } = useParams<{ id: string }>();

    const { data: organizationData, isFetching } = useQuery({
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

    if (isFetching || !organizationData) {
        return <EntityPageLoading />;
    }
    return (
        <Stack gap="lg">
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

            <AdjustmentCollapsable organizationData={organizationData} />
            <OrganizationBasic organizationData={organizationData} />
            <DocumentPreview orgId={id} />
            <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <ContactInformation organizationData={organizationData} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <LocationInformation organizationData={organizationData} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                    <EmployeeInformation organizationData={organizationData} />
                </Grid.Col>
            </Grid>

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

            <Modal
                opened={opened}
                onClose={close}
                title="Decline Organization Request"
                centered
                size="md"
            >
                <DeclineModal close={close} />
            </Modal>

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
