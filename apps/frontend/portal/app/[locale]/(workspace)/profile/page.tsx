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

    const handleUpdateSection = (section: keyof ProfileData, data: any) => {
        setLocalProfileData((prev) => ({
            ...prev,
            [section]: data,
        }));
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
                            <Flex
                                gap={'md'}
                                align={'flex-start'}
                                className="flex-col md:flex-row"
                            >
                                <Stack
                                    gap="xs"
                                    style={{
                                        ...styles,
                                    }}
                                    className="flex-1"
                                    px={{ base: 'sm', md: 0 }}
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

                                    {/* //TODO: Please fix this */}
                                    <EducationSection
                                        education={
                                            displayData.educationalHistory ??
                                            displayData.__educationalHistory__
                                        }
                                    />
                                </Stack>
                                <Stack
                                    className=""
                                    gap="xs"
                                    px={{ base: 'sm', md: 0 }}
                                >
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
