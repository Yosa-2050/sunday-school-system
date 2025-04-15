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
  Badge,
  Box,
  rem,
} from "@mantine/core";
import { IconPlus, IconPencil, IconSchool } from "@tabler/icons-react";
import EducationForm from "./forms/education-form";
import type { Education } from "app/_api/profile/queries";

export default function EducationSection({
  education,
}: {
  education: Education[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<
    string | undefined
  >();

  const handleAddEducation = () => {
    setSelectedEducation(undefined);
    setIsModalOpen(true);
  };

  const handleEditEducation = (id: string) => {
    setSelectedEducation(id);
    setIsModalOpen(true);
  };

  const selectedEducationData = education?.find(
    (edu) => edu.id === selectedEducation
  );

  return (
    <>
      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <IconSchool size={20} />
              <Title order={3} fw={600}>
                Education
              </Title>
            </Group>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              size="sm"
              onClick={handleAddEducation}
              radius="xl"
            >
              Add Education
            </Button>
          </Group>

          <Divider />

          {education.length === 0 ? (
            <Box
              p="md"
              style={{
                borderRadius: rem(8),
                backgroundColor: "var(--mantine-color-gray-0)",
              }}
            >
              <Text c="dimmed" ta="center" fs="italic">
                No education history added yet.
              </Text>
            </Box>
          ) : (
            <Stack gap="sm">
              {education.map((edu) => (
                <Card
                  key={edu.id}
                  withBorder
                  radius="md"
                  padding="md"
                  style={{
                    transition: "box-shadow 200ms ease",
                    "&:hover": {
                      boxShadow: "var(--mantine-shadow-md)",
                    },
                  }}
                >
                  <Stack gap="xs">
                    <Group justify="space-between" wrap="nowrap">
                      <Stack gap={2}>
                        <Title order={5} fw={600} lineClamp={1}>
                          {edu.school}
                        </Title>
                        <Text size="sm" fw={500} c="dimmed">
                          {edu.level} • {edu.fieldOfStudyId}
                        </Text>
                      </Stack>
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => handleEditEducation(edu.id)}
                        leftSection={<IconPencil size={14} />}
                        radius="xl"
                      >
                        Edit
                      </Button>
                    </Group>

                    <Group gap="sm">
                      <Badge variant="light" color="blue" radius="sm">
                        {new Date(edu.startDate).toLocaleDateString()} -{" "}
                        {edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString()
                          : "Present"}
                      </Badge>
                      {edu.grade > 0 && (
                        <Badge variant="light" color="teal" radius="sm">
                          Grade: {edu.grade}%
                        </Badge>
                      )}
                    </Group>

                    {edu.description && (
                      <Text size="sm" mt="xs">
                        {edu.description}
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Group gap="sm">
            {selectedEducation ? (
              <>
                <IconPencil size={18} />
                <Text fw={600}>Edit Education</Text>
              </>
            ) : (
              <>
                <IconPlus size={18} />
                <Text fw={600}>Add Education</Text>
              </>
            )}
          </Group>
        }
        size="lg"
        centered
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <EducationForm
          education={selectedEducationData}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
