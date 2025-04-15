"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Group,
  Stack,
  Card,
  ActionIcon,
  Modal,
  Avatar,
  Box,
  Flex,
  Button,
  Badge,
  rem,
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import type { Experience } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ExperienceForm from "./forms/experience-form";
import {
  useAddExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "app/_api/profile/experience";

interface ExperienceSectionProps {
  experiences: Experience[];
  onUpdate?: (data: Experience[]) => void;
}

export default function ExperienceSection({
  experiences = [], // Using sample data as default
  onUpdate,
}: ExperienceSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const addExperienceMutation = useAddExperience();
  const updateExperienceMutation = useUpdateExperience();
  const deleteExperienceMutation = useDeleteExperience();

  const handleAddExperience = () => {
    setCurrentExperience(null);
    setIsModalOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperienceMutation.mutateAsync(id);
      notifications.show({
        title: "Success",
        message: "Experience deleted successfully",
        color: "teal",
        icon: <IconCheck size={18} />,
      });
      if (onUpdate) {
        onUpdate(experiences.filter((exp) => exp.id !== id));
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete experience. Please try again.",
        color: "red",
        icon: <IconX size={18} />,
      });
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handleSaveExperience = async (experience: Experience) => {
    try {
      if (currentExperience) {
        await updateExperienceMutation.mutateAsync({
          id: experience.id,
          payload: experience,
        });
        notifications.show({
          title: "Success",
          message: "Experience updated successfully",
          color: "teal",
          icon: <IconCheck size={18} />,
        });
      } else {
        await addExperienceMutation.mutateAsync(experience);
        notifications.show({
          title: "Success",
          message: "Experience added successfully",
          color: "teal",
          icon: <IconCheck size={18} />,
        });
      }

      setIsModalOpen(false);
      if (onUpdate) {
        onUpdate([...experiences, experience]);
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save experience. Please try again.",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  };

  const formatDuration = (
    startDate: string,
    endDate?: string,
    currentlyWorking?: boolean
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  ): string => {
    const start = new Date(startDate);
    const end = currentlyWorking
      ? new Date()
      : // biome-ignore lint/nursery/noNestedTernary: <explanation>
        endDate
        ? new Date(endDate)
        : null;

    if (!end) {
      return "";
    }

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let duration = "";
    if (years > 0) {
      duration += `${years} yr${years > 1 ? "s" : ""} `;
    }
    if (remainingMonths > 0) {
      duration += `${remainingMonths} mo${remainingMonths > 1 ? "s" : ""}`;
    }

    return duration ? `· ${duration.trim()}` : "";
  };

  const getWorkTypeBadge = (type: string, workPlace: string) => {
    const typeMap: Record<string, string> = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACT: "Contract",
      INTERNSHIP: "Internship",
    };

    const placeMap: Record<string, string> = {
      REMOTE: "Remote",
      HYBRID: "Hybrid",
      ON_SITE: "On-site",
    };

    return (
      <Group gap="xs">
        <Badge variant="light" color="blue" radius="sm">
          {typeMap[type] || type}
        </Badge>
        <Badge variant="light" color="teal" radius="sm">
          {placeMap[workPlace] || workPlace}
        </Badge>
      </Group>
    );
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Flex justify="space-between" align="center" mb="md">
        <Group gap="sm">
          <Title order={3} fw={600}>
            Work Experience
          </Title>
          <Badge variant="light" color="gray" radius="sm">
            {experiences.length}
          </Badge>
        </Group>
        <ActionIcon
          variant="light"
          color="blue"
          size="lg"
          radius="xl"
          onClick={handleAddExperience}
          aria-label="Add experience"
        >
          <IconPlus size={18} />
        </ActionIcon>
      </Flex>

      {experiences.length === 0 ? (
        <Box
          p="xl"
          style={{
            borderRadius: rem(8),
            backgroundColor: "var(--mantine-color-gray-0)",
          }}
        >
          <Text c="dimmed" ta="center" fs="italic">
            No work experience added yet
          </Text>
        </Box>
      ) : (
        <Stack gap="xl">
          {experiences.map((experience) => (
            <Box key={experience.id}>
              <Card withBorder radius="md" p="md">
                <Group align="flex-start" wrap="nowrap">
                  <Avatar size={48} radius="sm" color="blue" variant="light">
                    {experience.company.charAt(0)}
                  </Avatar>

                  <Box style={{ flex: 1 }}>
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={4}>
                        <Title order={5} fw={600}>
                          {experience.title}
                        </Title>
                        <Text fw={500} c="blue">
                          {experience.company}
                        </Text>
                        {getWorkTypeBadge(
                          experience.type,
                          experience.workPlace
                        )}
                      </Stack>

                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditExperience(experience)}
                          aria-label="Edit experience"
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => setDeleteConfirmOpen(true)}
                          aria-label="Delete experience"
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Group>

                    <Text size="sm" c="dimmed" mt="xs">
                      {formatDate(experience.startDate)} -{" "}
                      {formatDate(experience.endDate || "")}
                      {formatDuration(experience.startDate, experience.endDate)}
                    </Text>

                    {experience.description && (
                      <Text size="sm" mt="sm">
                        {experience.description}
                      </Text>
                    )}

                    {experience.skills && experience.skills.length > 0 && (
                      <Group gap="xs" mt="sm">
                        {experience.skills.map((skill) => (
                          <Badge key={skill} variant="outline" radius="sm">
                            {skill}
                          </Badge>
                        ))}
                      </Group>
                    )}
                  </Box>
                </Group>
              </Card>
            </Box>
          ))}
        </Stack>
      )}

      {/* Add/Edit Experience Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <Group gap="sm">
            {currentExperience ? (
              <>
                <IconPencil size={18} />
                <Text fw={600}>Edit Experience</Text>
              </>
            ) : (
              <>
                <IconPlus size={18} />
                <Text fw={600}>Add Experience</Text>
              </>
            )}
          </Group>
        }
        size="lg"
        radius="md"
        centered
      >
        <ExperienceForm
          experience={currentExperience || undefined}
          onSubmit={handleSaveExperience}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Experience"
        centered
        radius="md"
      >
        <Stack gap="sm">
          <Text size="sm">
            Are you sure you want to delete this experience? This action cannot
            be undone.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={() =>
                currentExperience &&
                handleDeleteExperience(currentExperience.id)
              }
              leftSection={<IconTrash size={16} />}
              loading={deleteExperienceMutation.isPending}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}
