"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Group,
  Stack,
  Button,
  Divider,
  Modal,
  Card,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconFile, IconDownload } from "@tabler/icons-react";
import { useJobSeekerDetails } from "app/_api/profile/queries";
import CVUploadForm from "./forms/cv-upload-form";

export default function CVSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: jobSeeker, isLoading } = useJobSeekerDetails();
  const cv = jobSeeker?.cv;

  const handleAddCV = () => {
    setIsModalOpen(true);
  };

  const handleDownloadCV = () => {
    if (cv) {
      window.open(cv, "_blank");
    }
  };

  return (
    <>
      <Card shadow="sm" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4}>CV</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              size="sm"
              onClick={handleAddCV}
            >
              {cv ? "Update" : "Add"} CV
            </Button>
          </Group>

          <Divider />

          <LoadingOverlay
            visible={isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          {!cv ? (
            <Text c="dimmed" fs="italic">
              No CV uploaded yet.
            </Text>
          ) : (
            <Group>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={handleDownloadCV}
                title="Download CV"
              >
                <IconDownload size={20} />
              </ActionIcon>
              <Group gap="xs">
                <IconFile size={20} />
                <Text>CV.pdf</Text>
              </Group>
            </Group>
          )}
        </Stack>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={cv ? "Update CV" : "Add CV"}
        size="md"
      >
        <CVUploadForm currentCV={cv} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
