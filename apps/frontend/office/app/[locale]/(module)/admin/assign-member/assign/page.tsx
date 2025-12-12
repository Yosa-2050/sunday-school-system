'use client';

import { PageContainer } from '@/components/PageContainer';
import {
    Button,
    Checkbox,
    Divider,
    Flex,
    Group,
    Paper,
    Select,
    Stack,
    Text,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import SearchProfilePage from 'app/[locale]/(module)/_components/profile-forms/search';
import {
    fetchDepartmentByParentId,
    fetchDepartmentsApi,
} from 'app/[locale]/(module)/school_admin/department/schemas/api';
import type { DepartmentResponse } from 'app/[locale]/(module)/school_admin/department/schemas/type';
import type { UserResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AssignDepartmentMemberApi } from '../schema/api';
import { POSITION_OPTIONS } from '../schema/type';

export default function AssignPage() {
    const router = useRouter();
    const [department, setDepartment] = useState<string | null>(null);
    const [subDepartment, setSubDepartment] = useState<string | null>(null);
    const { data: departments, isLoading: isDepartmentsLoading } = useQuery<
        DepartmentResponse[]
    >({
        queryKey: ['departments'],
        queryFn: fetchDepartmentsApi,
    });
    const [selectedProfiles, setSelectedProfiles] = useState<
        (UserResponse & { checked: boolean; position?: string })[]
    >([]);

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

    const handleSelectProfile = (profile: UserResponse) => {
        setSelectedProfiles((prev) => {
            if (prev.some((p) => p.profile.id === profile.profile.id)) {
                return prev;
            }
            return [
                ...prev,
                { ...profile, checked: true, position: undefined },
            ];
        });
    };
    const toggleCheckbox = (id: string) => {
        setSelectedProfiles((prev) =>
            prev.map((p) =>
                p.profile.id === id ? { ...p, checked: !p.checked } : p,
            ),
        );
    };

    const handleAssignMembers = async () => {
        if (!department) {
            notifications.show({
                title: 'Error',
                message: 'Please select a department',
                color: 'red',
            });
            return;
        }

        const checkedMembers = selectedProfiles.filter((p) => p.checked);

        if (!checkedMembers.length) {
            notifications.show({
                title: 'Error',
                message: 'Please select at least one member',
                color: 'red',
            });
            return;
        }

        try {
            //Todo : not efficient
            await Promise.all(
                checkedMembers.map((member) =>
                    AssignDepartmentMemberApi({
                        departmentId: department,
                        subDepartmentId: subDepartment ?? '',
                        memberId: member.id,
                        position: member.position,
                    }),
                ),
            );

            notifications.show({
                title: 'Success',
                message: `${checkedMembers.length} member(s) assigned successfully!`,
                color: 'green',
            });

            setSelectedProfiles([]);
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: 'Failed to assign members',
                color: 'red',
            });
        }
    };

    return (
        <div>
            <PageContainer className="flex flex-col gap-2.5 mt-10">
                <Paper
                    shadow="xs"
                    p="lg"
                    mt="lg"
                    style={{ borderRadius: '10px' }}
                >
                    <Flex justify="space-between" align="center" mb="md">
                        <Text className="font-bold text-lg">
                            Assign Members
                        </Text>
                    </Flex>
                    <Divider />
                    <Group className="gap-2" grow>
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
                <Paper
                    shadow="xs"
                    p="lg"
                    mt="lg"
                    style={{ borderRadius: '10px' }}
                >
                    <SearchProfilePage onSelect={handleSelectProfile} />
                    {selectedProfiles.length > 0 && (
                        <Stack mt="md">
                            {selectedProfiles.map((profile) => (
                                <Group key={profile.profile.id} align="center">
                                    <Checkbox
                                        key={profile.profile.id}
                                        checked={profile.checked}
                                        onChange={() =>
                                            toggleCheckbox(profile.profile.id)
                                        }
                                        label={`${profile.profile.firstName} ${profile.profile.lastName}`}
                                    />
                                    <Select
                                        placeholder="Select Position"
                                        data={POSITION_OPTIONS}
                                        value={profile.position || null}
                                        onChange={(value) =>
                                            setSelectedProfiles((prev) =>
                                                prev.map((p) =>
                                                    p.profile.id ===
                                                    profile.profile.id
                                                        ? {
                                                              ...p,
                                                              position:
                                                                  value ||
                                                                  undefined,
                                                          }
                                                        : p,
                                                ),
                                            )
                                        }
                                    />
                                </Group>
                            ))}
                        </Stack>
                    )}
                    {selectedProfiles.some((p) => p.checked) && (
                        <Button
                            mt="md"
                            onClick={() => {
                                handleAssignMembers();
                                router.push('/admin/assign-member');
                            }}
                        >
                            Assign Members
                        </Button>
                    )}
                </Paper>
            </PageContainer>
        </div>
    );
}
