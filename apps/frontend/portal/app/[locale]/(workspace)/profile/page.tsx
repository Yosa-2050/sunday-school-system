'use client';

import type { ProfileData } from '@/lib/types';
import {
    AppShell,
    Box,
    Center,
    Container,
    Flex,
    Loader,
    Stack,
    Text,
    Transition,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useJobSeekerDetails } from 'app/_api/profile/queries';
import { useState } from 'react';
import AboutSection from './_components/about-section';
import CoverLetterSection from './_components/cover-letter-section';
import EducationSection from './_components/education-section';
import ExperienceSection from './_components/experience-section';
import PersonalInfoSection from './_components/personal-info-section';
import ProfileHeader from './_components/profile-header';
import ResumeSection from './_components/resume-section';
import SkillsSection from './_components/skills-section';

export default function ProfilePage() {
    const { data: jobSeekerData, isLoading, error } = useJobSeekerDetails();
    const [localProfileData, setLocalProfileData] = useState<ProfileData>({
        id: '',
        isActive: true,
        bio: {
            bio: '',
        },
        cv: '',
        coverLetter: '',
        experiance: [],
        educationalHistory: [],
        skills: [],
        profile: {
            id: '',
            firstName: 'John',
            middleName: '',
            lastName: 'Doe',
            birthDate: '',
            gender: '',
            title: '',
            phoneNumber: '+1 (555) 123-4567',
            profile_picture_id: '',
        },
    });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleUpdateSection = (section: keyof ProfileData, data: any) => {
        setLocalProfileData((prev) => ({
            ...prev,
            [section]: data,
        }));

        notifications.show({
            title: 'Success',
            message: 'Your profile has been updated successfully',
            color: 'teal',
            icon: <IconCheck size={16} />,
        });
    };

    if (isLoading) {
        return (
            <AppShell>
                <Center h="100vh">
                    <Loader size="xl" />
                </Center>
            </AppShell>
        );
    }

    if (error) {
        return (
            <AppShell>
                <Center h="100vh">
                    <Text c="red" size="lg">
                        Error loading profile data. Please try again later.
                    </Text>
                </Center>
            </AppShell>
        );
    }

    const displayData = jobSeekerData || localProfileData;

    return (
        <AppShell>
            <ProfileHeader data={displayData.profile} />
            <Box
                bg="gray.0"
                py="xl"
                style={{
                    minHeight: 'calc(100vh - 200px)',
                    background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
                }}
            >
                <Container size="xl">
                    <Transition
                        mounted={true}
                        transition="fade"
                        duration={400}
                        timingFunction="ease"
                    >
                        {(styles) => (
                            <Flex>
                                <Stack
                                    gap="xs"
                                    style={{
                                        ...styles,
                                        padding: '1rem',
                                    }}
                                    className="flex-1"
                                >
                                    <PersonalInfoSection
                                        data={displayData.profile}
                                        onUpdate={(data) =>
                                            handleUpdateSection('profile', data)
                                        }
                                    />
                                    <AboutSection
                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                        data={
                                            {
                                                bio: displayData.bio || '',
                                            } as any
                                        }
                                        onUpdate={(data) =>
                                            handleUpdateSection('bio', data.bio)
                                        }
                                    />

                                    <ExperienceSection
                                        experiences={displayData.experiance}
                                        onUpdate={(data) =>
                                            handleUpdateSection(
                                                'experiance',
                                                data,
                                            )
                                        }
                                    />

                                    <EducationSection
                                        education={
                                            displayData.educationalHistory
                                        }
                                    />

                                    <CoverLetterSection />
                                </Stack>
                                <Stack className="mt-4" maw={'450px'}>
                                    <SkillsSection
                                        skills={displayData.skills}
                                    />

                                    <ResumeSection />
                                </Stack>
                            </Flex>
                        )}
                    </Transition>
                </Container>
            </Box>
        </AppShell>
    );
}
