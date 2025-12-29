'use client';

import { PageContainer } from '@/components/PageContainer';
import {
    ActionIcon,
    Button,
    Divider,
    Flex,
    Group,
    Menu,
    Paper,
    Table,
    Text,
} from '@mantine/core';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { EntityFilter } from '@shega/ui';
import {
    IconDots,
    IconDownload,
    IconEye,
    IconPlus,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { parseAsJson, useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { fetchMembersApi } from './schemas/api';
import type { OrganizationMemberList } from './schemas/type';

export default function MembersPage() {
    const [members, setMembers] = useState<OrganizationMemberList[]>([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [entityParams] = useQueryState(
        'members',
        parseAsJson(entityParamSchema.parse).withDefault({
            p: 1,
            pp: PER_PAGE,
        }),
    );

    useEffect(() => {
        const fetchMember = async () => {
            setLoading(true);
            setErrorMessage('');
            try {
                const data = await fetchMembersApi();
                setMembers(data);
            } catch (err) {
                setErrorMessage('Failed to fetch members');
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, []);

    const rows = members.map((member, index) => (
        <Table.Tr key={member.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>
                {member.profile.firstName} {member.profile.middleName}{' '}
                {member.profile.lastName}
            </Table.Td>
            <Table.Td>{member.profile.gender}</Table.Td>
            <Table.Td>{member.type ?? '-'}</Table.Td>
            {/* <Table.Td>{member.isActive ? 'Active' : 'Inactive'}</Table.Td> */}
            <Table.Td
                className={member.isActive ? 'text-green-600' : 'text-red-600'}
            >
                {member.isActive ? 'Active' : 'InActive'}
            </Table.Td>
            <Table.Td>
                <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconEye size={16} />}
                            onClick={() =>
                                router.push(`/admin/members/${member.id}`)
                            }
                        >
                            View Details
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                            leftSection={<IconX size={16} />}
                            color="red"
                            onClick={() => {
                                // will Add your delete/inactivate logic here
                            }}
                        >
                            {member.isActive ? 'Deactivate' : 'Activate'}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <div>
            <PageContainer className="flex flex-col gap-2.5">
                {/* Header */}
                <Paper
                    p={{ base: 'sm', md: 'md' }}
                    style={{ borderRadius: '10px' }}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        className="p-1 md:p-4"
                    >
                        <Text className="font-bold text-md md:text-xl">
                            List of Members
                        </Text>
                        <Group className="gap-2">
                            <Button
                                onClick={() =>
                                    router.push('/admin/members/create')
                                }
                            >
                                <IconPlus size={12} /> Add Member
                            </Button>
                        </Group>
                    </Flex>
                    <Divider my="md" />

                    {/* <div className="mb-4"> */}
                    <Group justify="space-between" className="mb-4">
                        <Flex
                            gap={'xs'}
                            align={'center'}
                            className="flex-col md:flex-row"
                        >
                            <EntityFilter
                                entity="members"
                                className="!w-[300px]"
                                filterOptions={[
                                    { label: 'All', value: '' },
                                    { label: 'New', value: 'New' },
                                ]}
                                mode="select"
                                field="status"
                            />
                            <Button
                                variant="light"
                                leftSection={<IconDownload size={18} />}
                            >
                                ImportCSV
                            </Button>
                            <Button
                                variant="light"
                                leftSection={<IconUpload size={18} />}
                            >
                                ExportCSV
                            </Button>
                        </Flex>
                    </Group>
                    {/* </div> */}
                </Paper>

                <Paper p="lg" style={{ borderRadius: '10px' }}>
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Gender</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>status</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>

                    {/* <EntityPagination entity="members" total={data?.total ?? 0} /> */}
                </Paper>
            </PageContainer>
        </div>
    );
}
