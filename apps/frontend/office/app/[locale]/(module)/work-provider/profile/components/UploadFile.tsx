import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  Anchor,
  Button,
  Divider,
  FileInput,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDocumentById,
  getDocumentType,
} from "app/[locale]/_api/organizations/getDocumentType";
import {
  uploadDocument,
  useUploadDocument,
} from "app/[locale]/_api/organizations/upload-document";

interface UploadFileProps {
  orgId: string;
}

const UploadFile: React.FC<UploadFileProps> = ({ orgId }) => {
  const [
    uploadModalOpened,
    { open: openUploadModal, close: closeUploadModal },
  ] = useDisclosure(false);
  const queryClient = useQueryClient();

  const [uploadForm, setUploadForm] = useState<{
    documentType: string;
    file: File | null;
  }>({
    documentType: "",
    file: null,
  });

  const { data: documentTypeData = {}, isLoading: loadingTypes } = useQuery({
    queryKey: ["documentType"],
    queryFn: getDocumentType,
  });

  const { data: uploadedDocs = {} } = useQuery({
    queryKey: ["organizationDocuments", orgId],
    queryFn: () => getDocumentById(orgId),
    enabled: !!orgId,
  });

  const documentTypeOptions = Object.entries(documentTypeData?.data || {}).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  const handleUploadFormChange = (field: string, value: any) => {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  const { mutate, isPending } = useUploadDocument(
    orgId,
    uploadForm.documentType,
    uploadForm.file as File
  );
  const handleFileUpload = async () => {
    mutate();
  };

  return (
    <div className="mb-4">
      <Paper withBorder shadow="sm" radius="md" p="lg" mt="xl">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={6}>📎 Required Documents</Title>
          <Button size="xs" onClick={openUploadModal} variant="light">
            Upload Document
          </Button>
        </Group>
        <Text size="xs" c="dimmed" mb="sm">
          Upload your organization’s legal documents like Business License and
          Trade Certificate.
        </Text>
        <Divider mb="md" />

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm">Business License:</Text>
            <Text size="sm" c="dimmed">
              {uploadedDocs?.BusinessLicense ? (
                <Anchor href={uploadedDocs.BusinessLicense} target="_blank">
                  View File
                </Anchor>
              ) : (
                "Not uploaded"
              )}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Trade Certificate:</Text>
            <Text size="sm" c="dimmed">
              {uploadedDocs?.TinCertificate ? (
                <Anchor href={uploadedDocs.TinCertificate} target="_blank">
                  View File
                </Anchor>
              ) : (
                "Not uploaded"
              )}
            </Text>
          </Group>
        </Stack>
      </Paper>

      <Modal
        opened={uploadModalOpened}
        onClose={closeUploadModal}
        title="📤 Upload Document"
        size="lg"
      >
        <Stack>
          <Select
            label="Select Document Type"
            placeholder="Choose document type"
            data={documentTypeOptions}
            value={uploadForm.documentType}
            onChange={(value) => handleUploadFormChange("documentType", value)}
            disabled={loadingTypes}
            required
          />

          <FileInput
            label="Select File"
            placeholder="Upload file"
            value={uploadForm.file}
            onChange={(file) => handleUploadFormChange("file", file)}
            accept="application/pdf,image/*"
            required
          />
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button variant="outline" onClick={closeUploadModal}>
            Cancel
          </Button>
          <Button
            onClick={handleFileUpload}
            loading={isPending}
            disabled={!uploadForm.file || !uploadForm.documentType}
          >
            Upload
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default UploadFile;
