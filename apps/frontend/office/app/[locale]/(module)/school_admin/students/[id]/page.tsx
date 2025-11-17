'use client';

import { Box, Button, Group, Loader, Text } from '@mantine/core';
import { IconId, IconX } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import PersonalInfoSection from 'app/[locale]/(module)/admin/profile/_components/personal-info-section';
import ProfileHeader from 'app/[locale]/(module)/admin/profile/_components/profile-header';
import RelationSection from 'app/[locale]/(module)/admin/profile/_components/relationship-section';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PrintIdModal } from '../components/PrintIdModal';
import { fetchStudentsIdApi } from '../schemas/api';
import type { ProfileResponse, StudentForPrint } from '../schemas/type';

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;
    const [printModalOpened, setPrintModalOpened] = useState(false);

    const {
        data: student,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['student', studentId],
        queryFn: () => fetchStudentsIdApi(studentId),
        enabled: !!studentId,
    });

    if (isLoading) {
        return (
            <Box className="flex items-center justify-center h-64">
                <Loader size="lg" />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Box className="flex items-center justify-center h-64">
                <Text c="red">Failed to load student details</Text>
            </Box>
        );
    }

    // Prepare student data for printing
    const studentForPrint: StudentForPrint = {
        id: student?.id || '',
        idNumber: student?.idNumber || '',
        firstName: student?.profile?.firstName || '',
        lastName: student?.profile?.lastName || '',
        phoneNumber: student?.profile?.phoneNumber || '',
        className: student?.class.name || '',
        // You might need to adjust these based on your relationship data structure
        emergencyContact: 'Parent Name', // Replace with actual emergency contact
        emergencyPhone: '123-456-7890', // Replace with actual emergency phone
        //photoUrl: student?.profile?.profile_picture_id,     // Add photoUrl to your StudentResponse if needed
    };

    function handleUpdateSection(arg0: string, data: ProfileResponse): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Box>
            <Group>
                {/* Print ID Button - ADD THIS */}
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
            <ProfileHeader data={student.profile} headline={'ghf ghfh'} />
            <PersonalInfoSection
                data={student.profile}
                onUpdate={(data) => handleUpdateSection('profile', data)}
            />

            {/* Print ID Modal */}
            <PrintIdModal
                opened={printModalOpened}
                onClose={() => setPrintModalOpened(false)}
                students={[studentForPrint]}
            />
            <RelationSection relation={student.profile.relation} />
        </Box>
    );
}
