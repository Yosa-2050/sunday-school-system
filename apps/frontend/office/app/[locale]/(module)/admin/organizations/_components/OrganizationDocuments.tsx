'use client';

import {
    ActionIcon,
    Box,
    Card,
    Group,
    Image,
    Loader,
    Modal,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
    Tooltip,
    rem,
} from '@mantine/core';
import { COOKIE_ACCESS_TOKEN, logger } from '@shega/shared';
import { IconDownload, IconEye, IconFileText } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getOrganizationDocumentsById } from 'app/[locale]/_api/organizations/getDocumentType';
import { getCookie } from 'cookies-next';
import { useState } from 'react';

interface DocumentPreviewProps {
    orgId: string;
}

export interface DocumentData {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
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
            headers: { Authorization: `Bearer ${token}`, accept: '*/*' },
        },
    );
    if (!response.ok) {
        throw new Error('Failed to download document');
    }
    return response.blob();
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ orgId }) => {
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewFileName, setPreviewFileName] = useState('');
    const [previewFileType, setPreviewFileType] = useState('');
    const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

    const { data } = useQuery<DocumentData[]>({
        queryKey: ['organizationDocuments', orgId],
        queryFn: () => getOrganizationDocumentsById(orgId),
        enabled: !!orgId,
    });

    const uploadedDocs = Array.isArray(data) ? data : [];

    const getUploadedDoc = (docType: string) =>
        uploadedDocs.find((doc) => doc.docType === docType) || null;

    const formatFileSize = (bytes: number): string => {
        if (!bytes) {
            return '-';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
    };

    const handleFilePreview = async (docData: DocumentData) => {
        try {
            setLoadingDocId(docData.id);
            const blob = await downloadDocument(docData.id);
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewFileName(docData.fileName);
            setPreviewFileType(docData.fileType);
            setPreviewModalOpen(true);
        } catch (error) {
            logger.error('Preview failed:', error);
        } finally {
            setLoadingDocId(null);
        }
    };

    const handleFileDownload = async (docData: DocumentData) => {
        try {
            setLoadingDocId(docData.id);
            const blob = await downloadDocument(docData.id);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = docData.fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            logger.error('Download failed:', error);
        } finally {
            setLoadingDocId(null);
        }
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

    return (
        <Stack>
            <Paper p="xs">
                <Title size="md">Documents</Title>
            </Paper>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {REQUIRED_DOCUMENTS.map((doc) => {
                    const uploadedDoc = getUploadedDoc(doc.code);
                    const isUploaded = !!uploadedDoc;

                    return (
                        <Card
                            key={doc.code}
                            withBorder
                            radius="md"
                            p="md"
                            style={{ transition: 'box-shadow 0.2s ease' }}
                        >
                            <Group justify="space-between" mb="xs">
                                <Group gap="xs">
                                    <IconFileText size={18} />
                                    <Text fw={600}>{doc.label}</Text>
                                </Group>
                            </Group>

                            {isUploaded ? (
                                <Group justify="space-between" mt="xs">
                                    <Box>
                                        <Text size="sm" truncate maw={160}>
                                            {uploadedDoc.fileName}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {formatFileSize(
                                                uploadedDoc.fileSize,
                                            )}
                                        </Text>
                                    </Box>
                                    <Group gap="xs">
                                        {loadingDocId === uploadedDoc.id ? (
                                            <Loader size="sm" />
                                        ) : (
                                            <>
                                                <Tooltip label="View Document">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="blue"
                                                        onClick={() =>
                                                            handleFilePreview(
                                                                uploadedDoc,
                                                            )
                                                        }
                                                    >
                                                        <IconEye size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Download">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="teal"
                                                        onClick={() =>
                                                            handleFileDownload(
                                                                uploadedDoc,
                                                            )
                                                        }
                                                    >
                                                        <IconDownload
                                                            size={16}
                                                        />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </>
                                        )}
                                    </Group>
                                </Group>
                            ) : (
                                <Text size="sm" c="dimmed" mt="xs">
                                    No file uploaded
                                </Text>
                            )}
                        </Card>
                    );
                })}
            </SimpleGrid>

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
                            src={previewUrl}
                            alt="Preview"
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
                                    Preview not available
                                </Text>
                            </Stack>
                        )}
                </Box>
            </Modal>
        </Stack>
    );
};

export default DocumentPreview;
