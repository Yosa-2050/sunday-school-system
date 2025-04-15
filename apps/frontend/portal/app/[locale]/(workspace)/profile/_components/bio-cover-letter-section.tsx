'use client';

import {
    Button,
    Group,
    LoadingOverlay,
    Paper,
    Stack,
    Text,
    Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
    useJobSeekerDetails,
    useUpdateBio,
    useUpdateCoverLetter,
} from 'app/_api/profile/queries';
import { useState } from 'react';

export default function BioCoverLetterSection() {
    const { data: jobSeeker, isLoading } = useJobSeekerDetails();
    const [isUpdatingBio, setIsUpdatingBio] = useState(false);
    const [isUpdatingCoverLetter, setIsUpdatingCoverLetter] = useState(false);
    const { mutate: updateBio } = useUpdateBio();
    const { mutate: updateCoverLetter } = useUpdateCoverLetter();

    const bioForm = useForm({
        initialValues: {
            bio: jobSeeker?.bio || '',
        },
    });

    const coverLetterForm = useForm({
        initialValues: {
            coverLetter: jobSeeker?.coverLetter || '',
        },
    });

    const handleBioSubmit = async (values: { bio: string }) => {
        setIsUpdatingBio(true);
        try {
            await updateBio(values.bio, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Bio updated successfully',
                        color: 'green',
                        icon: <IconCheck size={16} />,
                    });
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update bio',
                        color: 'red',
                        icon: <IconX size={16} />,
                    });
                },
            });
        } finally {
            setIsUpdatingBio(false);
        }
    };

    const handleCoverLetterSubmit = async (values: { coverLetter: string }) => {
        setIsUpdatingCoverLetter(true);
        try {
            await updateCoverLetter(values.coverLetter, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Cover letter updated successfully',
                        color: 'green',
                        icon: <IconCheck size={16} />,
                    });
                },
                onError: (error) => {
                    notifications.show({
                        title: 'Error',
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Failed to update cover letter',
                        color: 'red',
                        icon: <IconX size={16} />,
                    });
                },
            });
        } finally {
            setIsUpdatingCoverLetter(false);
        }
    };

    if (isLoading) {
        return <LoadingOverlay visible={true} />;
    }

    return (
        <Stack gap="md">
            <Paper p="md" withBorder>
                <Stack gap="md">
                    <Text fw={500} size="lg">
                        Bio
                    </Text>
                    <form onSubmit={bioForm.onSubmit(handleBioSubmit)}>
                        <Stack gap="md">
                            <Textarea
                                placeholder="Write a brief description about yourself"
                                minRows={4}
                                {...bioForm.getInputProps('bio')}
                            />
                            <Group justify="flex-end">
                                <Button type="submit" loading={isUpdatingBio}>
                                    Save Bio
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Paper>

            <Paper p="md" withBorder>
                <Stack gap="md">
                    <Text fw={500} size="lg">
                        Cover Letter
                    </Text>
                    <form
                        onSubmit={coverLetterForm.onSubmit(
                            handleCoverLetterSubmit,
                        )}
                    >
                        <Stack gap="md">
                            <Textarea
                                placeholder="Write your cover letter"
                                minRows={6}
                                {...coverLetterForm.getInputProps(
                                    'coverLetter',
                                )}
                            />
                            <Group justify="flex-end">
                                <Button
                                    type="submit"
                                    loading={isUpdatingCoverLetter}
                                >
                                    Save Cover Letter
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Stack>
    );
}
