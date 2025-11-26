'use client';

import { PageContainer, PageTitle } from '@/components/PageContainer';
import { useRouter } from '@/i18n/routing';
import {
    // Badge,
    Button,
    Card,
    Center,
    Group,
    Paper,
    Select,
    Stack,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth } from '@shega/ui';
import { IconEye } from '@tabler/icons-react';
import {
    type ProgramResponse,
    fetchPrograms,
    fetchProgramsForOrg,
} from 'app/[locale]/_api/admin/fetch-programs';
import { fetchOrganizationsUsingGet } from 'app/[locale]/_api/organizations/fetch-organizations';
import type { Organization } from 'model/Organization';
// import parse from 'html-react-parser';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CreateProgramDrawer } from './_components/create-program.drawer';

const programList = () => {
    const router = useRouter();
    const t = useTranslations('programsPage');
    const isMobile = useMediaQuery('(max-width: 768px)');

    const [selectedOrganization, setSelectedOrganization] = useState<
        string | null
    >(null);
    const [organization, setOrganization] = useState<Organization[]>([]);
    const [programs, setProgram] = useState<ProgramResponse[]>([]);

    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'super_admin') {
            const fetchOrganization = async () => {
                try {
                    const data = await fetchOrganizationsUsingGet();
                    setOrganization(data);
                } catch (err) {
                    // handle error
                }
            };

            fetchOrganization();
        }
    }, [user]);

    useEffect(() => {
        handleFetchPrograms('');
    }, []);

    const handleFetchPrograms = async (org: string | null) => {
        if (user?.role === 'super_admin') {
            if (!org) {
                return;
            }

            setProgram([]);

            try {
                //setLoadingStudents(true);
                const data = await fetchPrograms(org);
                setProgram(data);
            } finally {
                //setLoadingStudents(false);
            }
        } else {
            try {
                //setLoadingStudents(true);
                const data = await fetchProgramsForOrg();
                setProgram(data);
            } finally {
                //setLoadingStudents(false);
            }
        }
    };

    // if (isLoading) {
    //     return <LoadingOverlay visible={true} h="100vh" />;
    // }

    // if (error) {
    //     return <Text color="red">Error loading Programs</Text>;
    // }

    return (
        <PageContainer className="flex flex-col gap-2.5">
            <Paper shadow="xs" p="sm" style={{ borderRadius: '10px' }}>
                <PageTitle>List of Programs</PageTitle>

                {user?.role === 'super_admin' ? (
                    <Group justify="space-between" className="my-4">
                        <Select
                            placeholder="Select Organization"
                            value={selectedOrganization}
                            onChange={(val) => {
                                setSelectedOrganization(val);
                                handleFetchPrograms(val);
                            }}
                            data={organization.map((c) => ({
                                value: c.id,
                                label: c.name,
                            }))}
                        />
                        <CreateProgramDrawer
                            organizationId={selectedOrganization}
                            onClose={() => {
                                handleFetchPrograms(selectedOrganization);
                            }}
                        />
                    </Group>
                ) : (
                    <></>
                )}
            </Paper>
            <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                {programs.length === 0 ? (
                    <Center h={200}>
                        <Text c="dimmed" ta="center">
                            You haven&apos;t posted any jobs yet.
                        </Text>
                    </Center>
                ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
                isMobile ? (
                    <Stack>
                        {programs.map((program) => (
                            <Card
                                key={program.id}
                                shadow="sm"
                                p="lg"
                                radius="md"
                                withBorder
                            >
                                <Text fw={500}>{program.name}</Text>
                            </Card>
                        ))}
                    </Stack>
                ) : (
                    <TableScrollContainer minWidth={800} type="native">
                        <Table striped>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Program Title</Table.Th>
                                    <Table.Th>Created By</Table.Th>
                                    <Table.Th>Created At</Table.Th>
                                    <Table.Th>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {programs.map((program, index) => (
                                    <Table.Tr key={program.id}>
                                        <Table.Td
                                            style={{ maxWidth: '400px' }}
                                            title={program.name}
                                        >
                                            {program.name.length > 100
                                                ? `${program.name.substring(0, 100)}...`
                                                : program.name}
                                        </Table.Td>
                                        <Table.Td>{program.createdBy}</Table.Td>
                                        <Table.Td>{program.createdAt}</Table.Td>
                                        <Table.Td>
                                            <Button
                                                variant="transparent"
                                                className="py-0 my-0"
                                                leftSection={
                                                    <IconEye size={14} />
                                                }
                                                onClick={() =>
                                                    router.push(
                                                        `programs/${program.id}`,
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </TableScrollContainer>
                )}

                {/* <EntityPagination
                    entity="mentorships"
                    total={data?.total ?? 0}
                /> */}
            </Paper>
        </PageContainer>
    );
};

export default programList;
