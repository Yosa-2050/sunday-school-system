'use client';

import {
  Button,
  Divider,
  FileInput,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconEye, IconFileText } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocumentById } from 'app/[locale]/_api/organizations/getDocumentType';
import { useUploadDocument } from 'app/[locale]/_api/organizations/upload-document';
import { useState } from 'react';

interface UploadFileProps {
  orgId: string;
}

const REQUIRED_DOCUMENTS = [
  { code: 'BusinessLicense', label: 'Business License' },
  { code: 'TinCertificate', label: 'Tin Certificate' },
  { code: 'Payroll', label: 'Payroll' },
  { code: 'ProofOfAddress', label: 'Proof of Address' },
];

const UploadFile: React.FC<UploadFileProps> = ({ orgId }) => {
  const queryClient = useQueryClient();

  const [uploadForm, setUploadForm] = useState<{
    [key: string]: File | null;
  }>({});

  const [selectedDocType, setSelectedDocType] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const { data: uploadedDocs = {} } = useQuery({
    queryKey: ['organizationDocuments', orgId],
    queryFn: () => getDocumentById(orgId),
    enabled: !!orgId,
  });

  const handleUploadFormChange = (docType: string, file: File | null) => {
    setUploadForm((prev) => ({ ...prev, [docType]: file }));
  };

  const { mutate: uploadDocument, isPending } = useUploadDocument(
    orgId,
    selectedDocType || '',
    selectedDocType ? uploadForm[selectedDocType] as File : null
  );

  const handleFileUpload = async (docType: string) => {
    setSelectedDocType(docType);
    uploadDocument(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['organizationDocuments', orgId] });
        setUploadForm((prev) => ({ ...prev, [docType]: null }));
      },
    });
  };

  const handleFilePreview = (file: File | null) => {
    if (!file) { return; }
    setPreviewFile(file);
    setPreviewModalOpen(true);
  };

  const renderFilePreviewButton = (file: File | null) => {
    if (!file) { return null; }

    return (
      <Button
        size="xs"
        variant="light"
        color="gray"
        onClick={() => handleFilePreview(file)}
      >
        Preview File
      </Button>
    );
  };

  const renderDocumentRow = (doc: { code: string; label: string }) => {
    const isUploaded = !!uploadedDocs?.[doc.code];
    const file = uploadForm[doc.code] || null;

    return (
      <Paper withBorder shadow="sm" p="md" radius="md" key={doc.code}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={2} w="30%">
            <Text fw={600}>{doc.label}</Text>
            <Text size="xs" c="red">
              Mandatory field
            </Text>
          </Stack>

          <Stack w="40%" gap="xs">
            <FileInput
              value={file}
              onChange={(file) => handleUploadFormChange(doc.code, file)}
              placeholder="Choose file"
              accept="application/pdf,image/*"
              required
            />
            {renderFilePreviewButton(file)}
          </Stack>

          <Group gap="xs">
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleFileUpload(doc.code)}
              loading={selectedDocType === doc.code && isPending}
              disabled={!file}
            >
              {isUploaded ? 'Update' : 'Upload'}
            </Button>

            {isUploaded && (
              <Button
                size="xs"
                variant="light"
                color="blue"
                leftSection={<IconEye size={16} />}
                component="a"
                target="_blank"
                href={uploadedDocs[doc.code]}
              >
                View
              </Button>
            )}
          </Group>
        </Group>
      </Paper>
    );
  };

  return (
    <div className="mb-4">
      <Paper withBorder shadow="sm" radius="md" p="lg" mt="xl">
        <Title order={6} mb="xs">
          Verification Documents
        </Title>
        <Text size="xs" c="dimmed" mb="sm">
          Upload your organization’s legal documents like Business License,
          Trade Certificate, and others. All are mandatory.
        </Text>
        <Divider mb="md" />
        <Stack gap="md">
          {REQUIRED_DOCUMENTS.map(renderDocumentRow)}
        </Stack>
      </Paper>

      {/* Preview Modal */}
      <Modal
        opened={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewFile(null);
        }}
        title="Document Preview"
        size="xl"
        centered
      >
        {previewFile?.type.startsWith('image/') && (
          <Image
            src={URL.createObjectURL(previewFile)}
            alt="Image Preview"
            radius="md"
            fit="contain"
            maw="100%"
          />
        )}

        {previewFile && previewFile.type === 'application/pdf' && (
          <iframe
            src={URL.createObjectURL(previewFile)}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: 'none' }}
          />
        )}

        {!previewFile?.type.startsWith('image/') &&
          previewFile?.type !== 'application/pdf' && (
            <Group gap="xs" mt="md">
              <IconFileText size={20} />
              <Text size="sm">{previewFile?.name}</Text>
            </Group>
          )}
      </Modal>
    </div>
  );
};

export default UploadFile;
