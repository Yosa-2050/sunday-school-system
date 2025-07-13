'use client';

import type { ProfileData } from '@/lib/types';
import {
    AppShell,
    Box,
    Center,
    Flex,
    Loader,
    Paper,
    Stack,
    Text,
    Transition,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useJobSeekerDetails } from 'app/_api/profile/queries';
import { useState } from 'react';
import AboutSection from './_components/about-section';
import EducationSection from './_components/education-section';
import ExperienceSection from './_components/experience-section';
import PersonalInfoSection from './_components/personal-info-section';
import ProfileHeader from './_components/profile-header';
import ResumeSection from './_components/resume-section';
import SkillsSection from './_components/skills-section';

const initialProfileData: ProfileData = {
    id: '',
    isActive: true,
    bio: {
        bio: '',
    },
    cv: '',
    headline: '',
    coverLetter: '',
    experiance: [],
    __experiance__: [],
    educationalHistory: [],
    __educationalHistory__: [],
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
};

export default function ProfilePage() {
    const { data: jobSeekerData, isLoading, error } = useJobSeekerDetails();
    const [localProfileData, setLocalProfileData] =
        useState<ProfileData>(initialProfileData);

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
            <ProfileHeader
                data={displayData.profile}
                headline={displayData.headline}
            />
            <Paper
                withBorder={false}
                py="xl"
                style={{
                    minHeight: 'calc(100vh - 200px)',
                }}
            >
                <Box className="container mx-auto px-0">
                    <Transition
                        mounted={true}
                        transition="fade"
                        duration={400}
                        timingFunction="ease"
                    >
                        {(styles) => (
                            <Flex gap={'md'} align={'flex-start'}>
                                <Stack
                                    gap="xs"
                                    style={{
                                        ...styles,
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
                                        data={
                                            {
                                                bio: displayData.bio || '',
                                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                            } as any
                                        }
                                        onUpdate={(data) =>
                                            handleUpdateSection('bio', data.bio)
                                        }
                                    />

                                    <ExperienceSection
                                        experiences={
                                            displayData.experiance ??
                                            displayData.__experiance__
                                        }
                                        onUpdate={(data) =>
                                            handleUpdateSection(
                                                'experiance',
                                                data,
                                            )
                                        }
                                    />

                                    <EducationSection
                                        education={
                                            displayData.educationalHistory ??
                                            displayData.__educationalHistory__
                                        }
                                    />
                                </Stack>
                                <Stack maw={'450px'} w={'450px'}>
                                    <SkillsSection
                                        skills={displayData.skills}
                                    />

                                    <ResumeSection />
                                </Stack>
                            </Flex>
                        )}
                    </Transition>
                </Box>
            </Paper>
        </AppShell>
    );
}
