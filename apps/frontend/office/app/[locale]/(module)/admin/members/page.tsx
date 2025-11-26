'use client';

import { PageContainer } from '@/components/PageContainer';
import {
    Button,
    Divider,
    Flex,
    Group,
    Paper,
    Table,
    Text,
} from '@mantine/core';
import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';

export default function MembersPage() {
    const members = [
        {
            id: 1,
            name: 'John Doe',
            department: 'Engineering',
            createdBy: 'Admin',
            createdAt: '2025-01-12',
        },
        {
            id: 2,
            name: 'Sarah Smith',
            department: 'Finance',
            createdBy: 'System',
            createdAt: '2025-02-03',
        },
        {
            id: 3,
            name: 'Michael King',
            department: 'HR',
            createdBy: 'Admin',
            createdAt: '2025-03-22',
        },
    ];

    const rows = members.map((member, index) => (
        <Table.Tr key={member.id}>
            <Table.Td>{index + 1}</Table.Td>
            <Table.Td>{member.name}</Table.Td>
            <Table.Td>{member.department}</Table.Td>
            <Table.Td>{member.createdBy}</Table.Td>
            <Table.Td>{member.createdAt}</Table.Td>
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

                        <Button>
                            <IconPlus size={12} /> Add Member
                        </Button>
                    </Flex>
                    <Divider my="md" />

                    <Group justify="space-between" className="mb-4">
                        <Flex
                            gap={'xs'}
                            align={'center'}
                            className="flex-col md:flex-row"
                        >
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
                </Paper>

                <Paper p="lg" style={{ borderRadius: '10px' }}>
                    <Table striped highlightOnHover withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>No</Table.Th>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Department</Table.Th>
                                <Table.Th>Created By</Table.Th>
                                <Table.Th>Created At</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Paper>
            </PageContainer>
        </div>
    );
}
