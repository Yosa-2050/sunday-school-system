'use client';

import { PageContainer } from '@/components/PageContainer';
import {
    Button,
    Center,
    Divider,
    Flex,
    Group,
    Paper,
    Select,
    Table,
    TableScrollContainer,
    Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDepartmentsApi } from '../../school_admin/department/schemas/api';
import { fetchDepartmentByParentId } from '../../school_admin/department/schemas/api';
import type { DepartmentResponse } from '../../school_admin/department/schemas/type';
import { fetchAssignedMembersByDepartment } from './schema/api';
import type { DepartmentMemberResponse } from './schema/type';

export default function AssignMembersPage() {
    const router = useRouter();
    const [department, setDepartment] = useState<string | null>(null);
    const [subDepartment, setSubDepartment] = useState<string | null>(null);
    const [departmentMembers, setDepartmentMembers] = useState<
        DepartmentMemberResponse[]
    >([]);

    const { data: departments, isLoading: isDepartmentsLoading } = useQuery<
        DepartmentResponse[]
    >({
        queryKey: ['departments'],
        queryFn: fetchDepartmentsApi,
    });

    const { data: subDepartments, isLoading: isSubDepartmentsLoading } =
        useQuery<DepartmentResponse[]>({
            queryKey: ['subDepartments', department],
            queryFn: () =>
                department ? fetchDepartmentByParentId(department) : [],
            enabled: !!department,
        });

    const departmentOptions =
        departments?.map((dept) => ({
            value: dept.id,
            label: dept.name,
        })) || [];

    const subDepartmentOptions =
        subDepartments?.map((subDept) => ({
            value: subDept.id,
            label: subDept.name,
        })) || [];

    useEffect(() => {
        if (!department) {
            setDepartmentMembers([]);
            return;
        }
        fetchAssignedMembersByDepartment(department, subDepartment ?? '')
            .then((res) => {
                return setDepartmentMembers(
                    res as unknown as DepartmentMemberResponse[],
                );
            })
            .catch(() => setDepartmentMembers([]));
    }, [department, subDepartment]);

    return (
        <div>
            <PageContainer className="flex flex-col gap-2.5 mt-10">
                <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                    <Flex
                        align="center"
                        justify="space-between"
                        className="p-1 md:p-4"
                    >
                        <Text className="font-bold text-md md:text-xl">
                            Assign Members to Departments page
                        </Text>

                        <Button
                            mt="md"
                            onClick={() =>
                                router.push('/admin/assign-member/assign')
                            }
                        >
                            Assign Members
                        </Button>
                    </Flex>
                    <Divider my="md" />
                    <Group className="gap-2">
                        <Select
                            label="Department"
                            placeholder="Select Department"
                            value={department}
                            onChange={(val) => {
                                setDepartment(val);
                                setSubDepartment(null);
                            }}
                            data={departmentOptions}
                            searchable
                            disabled={isDepartmentsLoading}
                        />
                        <Select
                            label="Sub Department"
                            placeholder="Select Sub Department"
                            value={subDepartment}
                            onChange={setSubDepartment}
                            data={subDepartmentOptions}
                            searchable
                            nothingFoundMessage="No Sub-Departments"
                            disabled={!department || isSubDepartmentsLoading}
                        />
                    </Group>
                </Paper>
                <Paper shadow="xs" p="lg" style={{ borderRadius: '10px' }}>
                    <Group>
                        {departmentMembers.length === 0 ? (
                            <Center h={200}>
                                <Text c="dimmed">
                                    No members assigned yet for this department.
                                </Text>
                            </Center>
                        ) : (
                            <TableScrollContainer minWidth={800} type="native">
                                <Table striped>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>Department Name</Table.Th>
                                            <Table.Th>Member Name</Table.Th>
                                            <Table.Th>Position </Table.Th>
                                            <Table.Th>Start Date</Table.Th>
                                            <Table.Th>End Date</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {departmentMembers.map((m) => (
                                            <Table.Tr
                                                key={
                                                    m.departmentName +
                                                    m.memberName
                                                }
                                            >
                                                <Table.Td>
                                                    {m.departmentName}
                                                </Table.Td>
                                                <Table.Td>
                                                    {m.memberName}
                                                </Table.Td>
                                                <Table.Td>
                                                    {m.position}
                                                </Table.Td>
                                                <Table.Td>
                                                    {m.startDate || '-'}
                                                </Table.Td>
                                                <Table.Td>
                                                    {m.endDate || '-'}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </TableScrollContainer>
                        )}
                    </Group>
                </Paper>
            </PageContainer>
        </div>
    );
}
