/* eslint-disable @next/next/no-img-element */
'use client';

import type { PersonalInfo } from '@/lib/types';
import {
    ActionIcon,
    Avatar,
    Box,
    Button,
    Card,
    Container,
    FileButton,
    Flex,
    Group,
    LoadingOverlay,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    Transition,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCamera, IconCheck, IconPencil, IconX } from '@tabler/icons-react';
import {
    useDownloadProfilePicture,
    useUpdateHeadline,
    // useDownloadProfilePicture,
    useUploadProfilePicture,
} from 'app/_api/profile/queries';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ProfileHeaderProps {
    data: PersonalInfo;
    headline: string;
}

export default function ProfileHeader({ data, headline }: ProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingHeadline, setIsEditingHeadline] = useState(false);
    const resetRef = useRef<() => void>(null);
    const { mutate: uploadProfilePicture } = useUploadProfilePicture();
    const { data: profilePicture } = useDownloadProfilePicture(
        data.profile_picture_id,
    );

    const handleFileSelect = async (file: File | null) => {
        if (!file) {
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            notifications.show({
                title: 'Error',
                message: 'Please upload an image file',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            notifications.show({
                title: 'Error',
                message: 'File size should be less than 5MB',
                color: 'red',
                icon: <IconX size={16} />,
            });
            return;
        }

        setIsUploading(true);
        try {
            await uploadProfilePicture(file, {
                onSuccess: () => {
                    notifications.show({
                        title: 'Success',
                        message: 'Profile picture updated successfully',
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
                                : 'Failed to update profile picture',
                        color: 'red',
                        icon: <IconX size={16} />,
                    });
                },
            });
        } finally {
            setIsUploading(false);
            if (resetRef.current) {
                resetRef.current();
            }
        }
    };

    const { mutate: updateHeadline } = useUpdateHeadline();
    const [headlinedata, setHeadlinedata] = useState(headline);

    const handleHeadlineUpdate = async () => {
        await updateHeadline(headlinedata, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'Headline updated successfully',
                    color: 'green',
                    icon: <IconCheck size={16} />,
                });
                setIsEditingHeadline(false);
            },
            onError: (error) => {
                notifications.show({
                    title: 'Error',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Failed to update headline',
                    color: 'red',
                    icon: <IconX size={16} />,
                });
            },
        });
    };

    return (
        <Container size="xl" style={{ position: 'relative', height: '100%' }}>
            <Card mih={'500px'} p={0}>
                <Box>
                    <Box
                        style={{
                            height: 320,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                        }}
                    >
                        <Box
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                    'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)',
                            }}
                        />
                        <Transition
                            mounted={true}
                            transition="slide-up"
                            duration={400}
                        >
                            {(styles) => (
                                <Paper
                                    shadow="md"
                                    p={0}
                                    style={{
                                        ...styles,
                                        position: 'absolute',
                                        bottom: -60,
                                        left: 20,
                                        borderRadius: '50%',
                                        background: 'white',
                                    }}
                                >
                                    <Box style={{ position: 'relative' }}>
                                        <Modal
                                            opened={isModalOpen}
                                            onClose={() =>
                                                setIsModalOpen(false)
                                            }
                                            size="auto"
                                            centered
                                            padding="md"
                                            styles={{
                                                content: {
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    maxWidth: '90vw',
                                                    maxHeight: '90vh',
                                                },
                                            }}
                                        >
                                            <Modal.Header>
                                                <Text size="lg" fw={500}>
                                                    Profile Picture
                                                </Text>
                                            </Modal.Header>
                                            <Modal.Content
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {profilePicture && (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            profilePicture,
                                                        )}
                                                        alt="Profile Picture"
                                                        width={1000}
                                                        height={1000}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            maxWidth: '800px',
                                                            maxHeight: '800px',
                                                            borderRadius: '8px',
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                    />
                                                )}
                                            </Modal.Content>
                                        </Modal>
                                        <Avatar
                                            src={
                                                profilePicture
                                                    ? URL.createObjectURL(
                                                          profilePicture,
                                                      )
                                                    : undefined
                                            }
                                            size={180}
                                            radius={180}
                                            style={{ cursor: 'pointer' }}
                                            alt={`${data.firstName}'s profile`}
                                            onClick={() => setIsModalOpen(true)}
                                        />
                                        <FileButton
                                            resetRef={resetRef}
                                            onChange={handleFileSelect}
                                            accept="image/*"
                                        >
                                            {(props) => (
                                                <ActionIcon
                                                    {...props}
                                                    variant="filled"
                                                    color="blue"
                                                    size="lg"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 10,
                                                        right: 10,
                                                    }}
                                                >
                                                    <IconCamera size={20} />
                                                </ActionIcon>
                                            )}
                                        </FileButton>
                                        <LoadingOverlay
                                            visible={isUploading}
                                            zIndex={1000}
                                            overlayProps={{
                                                radius: 'sm',
                                                blur: 2,
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            )}
                        </Transition>
                    </Box>
                </Box>
                <Flex
                    justify="space-between"
                    align="flex-start"
                    direction={'column'}
                    mt={60}
                    p={'lg'}
                >
                    <Stack gap="xs">
                        <Transition
                            mounted={true}
                            transition="fade"
                            duration={400}
                        >
                            {(styles) => (
                                <Group gap="xs" style={styles}>
                                    <Text fz={32} fw={700} lh={1.2}>
                                        {data.firstName}
                                    </Text>
                                    {data.middleName && (
                                        <Text fz={32} fw={700} lh={1.2}>
                                            {data.middleName}
                                        </Text>
                                    )}
                                    <Text fz={32} fw={700} lh={1.2}>
                                        {data.lastName}
                                    </Text>
                                </Group>
                            )}
                        </Transition>
                    </Stack>
                    <Text c={'dimmed'}>
                        {isEditingHeadline ? (
                            <Group>
                                <TextInput
                                    value={headlinedata}
                                    onChange={(e) =>
                                        setHeadlinedata(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleHeadlineUpdate();
                                        } else if (e.key === 'Escape') {
                                            setIsEditingHeadline(false);
                                            setHeadlinedata(headline);
                                        }
                                    }}
                                    onBlur={handleHeadlineUpdate}
                                    autoFocus
                                    placeholder="Add a headline"
                                    size="sm"
                                    style={{ minWidth: '700px' }}
                                />
                                <Button
                                    size="sm"
                                    onClick={handleHeadlineUpdate}
                                >
                                    Save
                                </Button>
                            </Group>
                        ) : (
                            <Group align="center">
                                <Text c="primary" className="cursor-pointer">
                                    {headline || 'Add a headline'}
                                </Text>
                                <Button
                                    mt={4}
                                    leftSection={<IconPencil size={16} />}
                                    size="sm"
                                    variant="light"
                                    className="cursor-pointer"
                                    onClick={() => setIsEditingHeadline(true)}
                                >
                                    Edit
                                </Button>
                            </Group>
                        )}
                    </Text>
                    <Flex mt={'sm'} gap={'md'} hidden>
                        <Text c={'dimmed'}>Addis Ababa, Ethiopia</Text>
                        <Text c="primary" className="cursor-pointer">
                            Contact Info
                        </Text>
                    </Flex>
                </Flex>
            </Card>
        </Container>
    );
}
