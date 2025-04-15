"use client";

import { useState, useRef } from "react";
import {
  Button,
  Group,
  Stack,
  Text,
  FileButton,
  LoadingOverlay,
  Paper,
  ActionIcon,
  Alert,
  Code,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconUpload,
  IconFile,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useUploadCV } from "app/_api/profile/queries";

interface CVUploadFormProps {
  currentCV?: string;
  onCancel: () => void;
}

export default function CVUploadForm({
  currentCV,
  onCancel,
}: CVUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentCV || null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const resetRef = useRef<() => void>(null);

  const { mutate: uploadCV, isPending: isUploading } = useUploadCV();

  const handleFileSelect = (selectedFile: File | null) => {
    setError(null);
    setErrorDetails(null);

    if (!selectedFile) {
      return;
    }

    // Check file type
    if (!selectedFile.type.includes("pdf")) {
      setError("Please upload a PDF file");
      notifications.show({
        title: "Error",
        message: "Please upload a PDF file",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      notifications.show({
        title: "Error",
        message: "File size should be less than 5MB",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    setFile(selectedFile);
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreview(fileUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    setError(null);
    setErrorDetails(null);

    try {
      await uploadCV(file, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "CV uploaded successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
          onCancel();
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to upload CV. Please try again.";
          setError(errorMessage);

          // Try to get more details about the error
          if (error instanceof Error && error.message) {
            try {
              const errorObj = JSON.parse(error.message);
              if (errorObj.message) {
                setErrorDetails(errorObj.message);
              }
            } catch (e) {
              // If we can't parse it as JSON, just use the error message
              setErrorDetails(error.message);
            }
          }

          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload CV. Please try again.";
      setError(errorMessage);
      setErrorDetails(error instanceof Error ? error.message : String(error));

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleRemove = () => {
    if (file && preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setError(null);
    setErrorDetails(null);
    if (resetRef.current) {
      resetRef.current();
    }
  };

  return (
    <Stack gap="md">
      <LoadingOverlay
        visible={isUploading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {error && (
        <Alert color="red" title="Error" icon={<IconAlertCircle size={16} />}>
          <Stack gap="xs">
            <Text>{error}</Text>
            {errorDetails && (
              <Code block color="red">
                {errorDetails}
              </Code>
            )}
          </Stack>
        </Alert>
      )}

      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={500}>Selected CV</Text>
            {preview && (
              <ActionIcon
                variant="light"
                color="red"
                onClick={handleRemove}
                size="sm"
              >
                <IconTrash size={16} />
              </ActionIcon>
            )}
          </Group>

          {preview ? (
            <Group gap="xs">
              <IconFile size={20} />
              <Text size="sm" truncate>
                {file?.name || "Current CV"}
              </Text>
            </Group>
          ) : (
            <Text c="dimmed" size="sm" fs="italic">
              No CV selected
            </Text>
          )}
        </Stack>
      </Paper>

      <FileButton
        resetRef={resetRef}
        onChange={handleFileSelect}
        accept=".pdf,application/pdf"
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

      <Text size="sm" c="dimmed">
        Supported format: PDF (max 5MB)
      </Text>

      <Group justify="flex-end" mt="md">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file}
          leftSection={<IconUpload size={16} />}
          loading={isUploading}
        >
          Upload CV
        </Button>
      </Group>
    </Stack>
  );
}
