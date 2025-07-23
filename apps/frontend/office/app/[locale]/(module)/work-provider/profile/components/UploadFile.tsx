'use client';

import {
    ActionIcon,
    Badge,
    Box,
    Button,
    FileInput,
    Group,
    Image,
    Modal,
    Paper,
    Stack,
    Table,
    Text,
    Tooltip,
    rem,
} from '@mantine/core';
import { COOKIE_ACCESS_TOKEN, logger } from '@shega/shared';
import {
    IconAlertCircle,
    IconCheck,
    IconEye,
    IconFileText,
    IconReplace,
    IconUpload,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocumentById } from 'app/[locale]/_api/organizations/getDocumentType';
import { useUploadDocument } from 'app/[locale]/_api/organizations/upload-document';
import { getCookie } from 'cookies-next';
import type React from 'react';
import { useState } from 'react';

interface UploadFileProps {
    orgId: string;
    canUpdateProfile: boolean;
}

export interface DocumentData {
    id: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    referenceId: string;
    docType: string;
}

const REQUIRED_DOCUMENTS = [
    { code: 'BusinessLicense', label: 'Business License' },
    { code: 'TinCertificate', label: 'TIN Certificate' },
    { code: 'Payroll', label: 'Payroll Records' },
    { code: 'ProofOfAddress', label: 'Proof of Address' },
];

export const downloadDocument = async (id: string): Promise<Blob> => {
    const token = getCookie(COOKIE_ACCESS_TOKEN)?.toString();
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/document/${id}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                accept: '*/*',
            },
        },
    );
    if (!response.ok) {
        throw new Error('Failed to download document');
    }
    return response.blob();
};

const UploadFile: React.FC<UploadFileProps> = ({ orgId, canUpdateProfile }) => {
    const queryClient = useQueryClient();
    const [uploadForm, setUploadForm] = useState<{
        [key: string]: File | null;
    }>({});
    const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState<string>('');
    const [previewFileType, setPreviewFileType] = useState<string>('');

    const { data } = useQuery<DocumentData[]>({
        queryKey: ['organizationDocuments', orgId],
        queryFn: async () => {
            const result = await getDocumentById(orgId);
            return Array.isArray(result) ? result : [result];
        },
        enabled: !!orgId,
    });
    const uploadedDocs: DocumentData[] = Array.isArray(data) ? data : [];

    const handleUploadFormChange = (docType: string, file: File | null) => {
        setUploadForm((prev) => ({ ...prev, [docType]: file }));
    };

    const { mutate: uploadDocument, isPending } = useUploadDocument(orgId);

    const handleFileUpload = async (docType: string) => {
        const file = uploadForm[docType] as File | undefined;
        if (!file) {
            return;
        }

        setSelectedDocType(docType);
        uploadDocument(
            { file, docType },
            {
                onSuccess: () => {
                    setUploadForm((prev) => ({ ...prev, [docType]: null }));
                },
            },
        );
    };

    const handleFilePreview = async (docData: DocumentData) => {
        try {
            const blob = await downloadDocument(docData.id);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewFileName(docData.fileName);
            setPreviewFileType(docData.fileType);
            setPreviewModalOpen(true);
        } catch (error) {
            logger.error('Failed to preview file:', error);
        }
    };

    const handleLocalFilePreview = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPreviewFileName(file.name);
        setPreviewFileType(file.type);
        setPreviewModalOpen(true);
    };

    const closePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewModalOpen(false);
        setPreviewUrl(null);
        setPreviewFileName('');
        setPreviewFileType('');
    };

    const getUploadedDoc = (docType: string): DocumentData | null => {
        return (
            uploadedDocs.find((doc: DocumentData) => doc.docType === docType) ||
            null
        );
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
    };

    const completedDocs = uploadedDocs.length;
    const totalDocs = REQUIRED_DOCUMENTS.length;

    // Extracted button rendering to reduce complexity
    function renderUploadButton({
        isUploading,
        isUploaded,
        localFile,
        handleFileUpload,
        docCode,
    }: {
        isUploading: boolean;
        isUploaded: boolean;
        localFile: File | null | undefined;
        handleFileUpload: (docCode: string) => void;
        docCode: string;
    }) {
        let buttonLabel = 'Upload';
        if (isUploading) {
            buttonLabel = '...';
        } else if (isUploaded) {
            buttonLabel = 'Replace';
        }
        return (
            <Button
                size="xs"
                onClick={() => handleFileUpload(docCode)}
                disabled={!localFile || isUploading}
                loading={isUploading}
                leftSection={
                    isUploaded ? (
                        <IconReplace size={12} />
                    ) : (
                        <IconUpload size={12} />
                    )
                }
                variant={isUploaded ? 'light' : 'filled'}
            >
                {buttonLabel}
            </Button>
        );
    }

    const rows = REQUIRED_DOCUMENTS.map((doc) => {
        const uploadedDoc = getUploadedDoc(doc.code);
        const localFile = uploadForm[doc.code];
        const isUploaded = !!uploadedDoc;
        const isUploading = selectedDocType === doc.code && isPending;

        return (
            <Table.Tr key={doc.code}>
                {/* Document Name & Status */}
                <Table.Td>
                    <Group gap="xs">
                        <IconFileText size={16} />
                        <Box>
                            <Text size="sm" fw={500}>
                                {doc.label}
                            </Text>
                            <Badge
                                size="xs"
                                color={isUploaded ? 'green' : 'orange'}
                                variant="light"
                                leftSection={
                                    isUploaded ? (
                                        <IconCheck
                                            style={{
                                                width: rem(10),
                                                height: rem(10),
                                            }}
                                        />
                                    ) : (
                                        <IconAlertCircle
                                            style={{
                                                width: rem(10),
                                                height: rem(10),
                                            }}
                                        />
                                    )
                                }
                            >
                                {isUploaded ? 'Uploaded' : 'Required'}
                            </Badge>
                        </Box>
                    </Group>
                </Table.Td>

                {/* Current File */}
                <Table.Td>
                    {isUploaded ? (
                        <Group gap="xs">
                            <Box>
                                <Text size="xs" truncate maw={150}>
                                    {uploadedDoc.fileName}
                                </Text>
                                <Text size="xs" c="dimmed">
                                    {formatFileSize(uploadedDoc.fileSize)}
                                </Text>
                            </Box>
                            <Tooltip label="View">
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    onClick={() =>
                                        handleFilePreview(uploadedDoc)
                                    }
                                >
                                    <IconEye size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    ) : (
                        <Text size="xs" c="dimmed">
                            No file uploaded
                        </Text>
                    )}
                </Table.Td>

                {/* File Input */}
                <Table.Td>
                    <FileInput
                        value={localFile}
                        onChange={(file) =>
                            handleUploadFormChange(doc.code, file)
                        }
                        placeholder={
                            canUpdateProfile ? 'Choose file' : 'Not allowed'
                        }
                        accept="application/pdf,image/*"
                        size="xs"
                        w={200}
                        clearable={canUpdateProfile}
                        disabled={!canUpdateProfile}
                        rightSection={
                            localFile && (
                                <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    onClick={() =>
                                        handleLocalFilePreview(localFile)
                                    }
                                >
                                    <IconEye size={12} />
                                </ActionIcon>
                            )
                        }
                    />
                </Table.Td>

                {/* Actions */}
                <Table.Td>
                    <Group gap="xs">
                        {canUpdateProfile &&
                            renderUploadButton({
                                isUploading:
                                    selectedDocType === doc.code && isPending,
                                isUploaded,
                                localFile,
                                handleFileUpload,
                                docCode: doc.code,
                            })}
                    </Group>
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Stack gap="md" mt={'md'}>
            <Paper withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Document Type</Table.Th>
                            <Table.Th>Current File</Table.Th>
                            <Table.Th>Select New File</Table.Th>
                            <Table.Th>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Paper>

            {/* Preview Modal */}
            <Modal
                opened={previewModalOpen}
                onClose={closePreview}
                title={
                    <Group gap="sm">
                        <IconFileText size={16} />
                        <Text size="sm" fw={500}>
                            {previewFileName}
                        </Text>
                    </Group>
                }
                size="xl"
                centered
            >
                <Box mih={400}>
                    {previewFileType?.startsWith('image/') && previewUrl && (
                        <Image
                            src={previewUrl || '/placeholder.svg'}
                            alt="Document Preview"
                            radius="md"
                            fit="contain"
                            mah={600}
                        />
                    )}
                    {previewFileType === 'application/pdf' && previewUrl && (
                        <iframe
                            src={previewUrl}
                            title="PDF Preview"
                            width="100%"
                            height="600px"
                            style={{ border: 'none', borderRadius: rem(8) }}
                        />
                    )}
                    {!previewFileType?.startsWith('image/') &&
                        previewFileType !== 'application/pdf' && (
                            <Stack
                                align="center"
                                justify="center"
                                h={400}
                                gap="md"
                            >
                                <IconFileText
                                    size={48}
                                    color="var(--mantine-color-gray-5)"
                                />
                                <Text ta="center" c="dimmed" size="sm">
                                    Preview not available for this file type
                                </Text>
                                <Text size="xs" ta="center" c="dimmed">
                                    {previewFileName}
                                </Text>
                            </Stack>
                        )}
                </Box>
            </Modal>
        </Stack>
    );
};

export default UploadFile;
