'use client';
import { Box, Button, Group } from '@mantine/core';
import { IconId, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import PersonalInfoSection from 'app/[locale]/(module)/admin/profile/_components/personal-info-section';
import type { ProfileResponse } from 'app/[locale]/(module)/school_admin/students/schemas/type';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import ProfileHeader from '../../profile/_components/profile-header';
import RelationSection from '../../profile/_components/relationship-section';
import { fetchMembersIdApi } from '../schemas/api';

export default function MemberDetailPage() {
    const router = useRouter();
    const params = useParams();
    const memberId = params.id as string;
    const [printModalOpened, setPrintModalOpened] = useState(false);

    const {
        data: member,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['member', memberId],
        queryFn: () => fetchMembersIdApi(memberId),
        enabled: !!memberId,
    });

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center h-64">
                Loading...
            </Box>
        );
    }

    if (error || !member) {
        return (
            <Box className="flex items-center justify-center h-64">
                Failed to load member details
            </Box>
        );
    }

    return (
        <Box>
            <Group>
                <Button
                    variant="light"
                    color="blue"
                    leftSection={<IconId size={16} />}
                    onClick={() => setPrintModalOpened(true)}
                >
                    Print ID
                </Button>
                <Button
                    variant="light"
                    color="gray"
                    leftSection={<IconX size={16} />}
                    onClick={() => router.back()}
                >
                    Back to List
                </Button>
            </Group>
            <ProfileHeader data={member.profile} headline={''} />
            <PersonalInfoSection
                data={member.profile}
                onUpdate={(data: ProfileResponse): void => {
                    throw new Error('Function not implemented.');
                }}
            />

            {/* <PrintIdModal
                            opened={printModalOpened}
                            onClose={() => setPrintModalOpened(false)}
                            students={[studentForPrint]}
                        /> */}
            <RelationSection relation={member.profile.relation} />
        </Box>
    );
}
