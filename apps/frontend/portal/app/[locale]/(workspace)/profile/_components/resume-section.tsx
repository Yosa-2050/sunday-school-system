'use client';

import {
    ActionIcon,
    Button,
    Card,
    Divider,
    FileButton,
    Group,
    LoadingOverlay,
    Modal,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconDownload,
    IconFile,
    IconPlus,
    IconUpload,
    IconX,
} from '@tabler/icons-react';
import {
    useDownloadProfilePicture,
    useJobSeekerDetails,
    useUploadCV,
} from 'app/_api/profile/queries';
import { useState } from 'react';

export default function ResumeSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { data: jobSeeker, isLoading } = useJobSeekerDetails();
    const { mutate: uploadCV, isPending: isUploading } = useUploadCV();

    const { data: cv } = useDownloadProfilePicture(jobSeeker?.cv ?? '');

    const handleAddCV = () => {
        setIsModalOpen(true);
    };

    const handleFileSelect = (file: File | null) => {
        if (file) {
            // Check file type
            if (!file.type.includes('pdf')) {
                notifications.show({
                    title: 'Error',
                    message: 'Please upload a PDF file',
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

            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            return;
        }

        uploadCV(selectedFile, {
            onSuccess: () => {
                notifications.show({
                    title: 'Success',
                    message: 'CV uploaded successfully',
                    color: 'green',
                    icon: <IconCheck size={16} />,
                });
                setIsModalOpen(false);
                setSelectedFile(null);
            },
            onError: () => {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to upload CV. Please try again.',
                    color: 'red',
                    icon: <IconX size={16} />,
                });
            },
        });
    };

    return (
        <>
            <Card shadow="sm" withBorder>
                <Stack gap="md">
                    <Group justify="space-between">
                        <Title order={4}>Resume</Title>
                        <Button
                            leftSection={<IconPlus size={16} />}
                            variant="light"
                            size="sm"
                            onClick={handleAddCV}
                        >
                            {jobSeeker?.cv ? 'Update' : 'Add'} CV
                        </Button>
                    </Group>

                    <Divider />

                    <LoadingOverlay
                        visible={isLoading || isUploading}
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 2 }}
                    />

                    {jobSeeker?.cv ? (
                        <Group gap="md">
                            <Tooltip
                                label="Download CV"
                                withArrow
                                position="bottom"
                            >
                                <ActionIcon
                                    variant="light"
                                    size="lg"
                                    onClick={() => {
                                        if (cv) {
                                            const url = URL.createObjectURL(cv);
                                            const link =
                                                document.createElement('a');
                                            link.href = url;
                                            link.download = 'resume.pdf';
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                >
                                    <IconDownload size={20} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip
                                label="Preview CV"
                                withArrow
                                position="bottom"
                            >
                                <Group
                                    gap="xs"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        if (cv) {
                                            const url = URL.createObjectURL(cv);
                                            window.open(url, '_blank');
                                        }
                                    }}
                                >
                                    <IconFile size={20} />
                                    <Text>Preview</Text>
                                </Group>
                            </Tooltip>
                        </Group>
                    ) : (
                        <Text c="dimmed" fs="italic">
                            No CV uploaded yet.
                        </Text>
                    )}
                </Stack>
            </Card>

            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={jobSeeker?.cv ? 'Update CV' : 'Add CV'}
                size="md"
            >
                <Stack gap="md">
                    <FileButton
                        onChange={handleFileSelect}
                        accept="application/pdf"
                    >
                        {(props) => (
                            <Button
                                {...props}
                                variant="light"
                                fullWidth
                                leftSection={<IconUpload size={16} />}
                            >
                                Select CV
                            </Button>
                        )}
                    </FileButton>

                    {selectedFile && (
                        <Group gap="xs">
                            <IconFile size={20} />
                            <Text size="sm" truncate>
                                {selectedFile.name}
                            </Text>
                        </Group>
                    )}

                    <Text size="sm" c="dimmed">
                        Supported format: PDF (max 5MB)
                    </Text>

                    <Group justify="flex-end" mt="md">
                        <Button
                            variant="light"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile}
                            leftSection={<IconUpload size={16} />}
                        >
                            Upload CV
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}
