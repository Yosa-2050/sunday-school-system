"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  LoadingOverlay,
  Text,
  Box,
  Pill,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconPlus } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateSkills } from "app/_api/profile/queries";

const skillsSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

interface SkillsFormProps {
  initialSkills?: string[];
  onCancel: () => void;
}

export default function SkillsForm({
  initialSkills = [],
  onCancel,
}: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [currentSkill, setCurrentSkill] = useState("");
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
  });

  const { mutate: updateSkills, isPending: isUpdating } = useUpdateSkills();

  const handleAddSkill = () => {
    if (currentSkill.trim() && !pendingSkills.includes(currentSkill.trim())) {
      setPendingSkills([...pendingSkills, currentSkill.trim()]);
      setCurrentSkill("");
      reset();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const onFormSubmit = () => {
    try {
      const newSkills = [...skills, ...pendingSkills];
      updateSkills(newSkills, {
        onSuccess: () => {
          setSkills(newSkills);
          setPendingSkills([]);
          setCurrentSkill("");
          reset();
          notifications.show({
            title: "Success",
            message: "Skills updated successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to update skills. Please try again.",
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update skills. Please try again.",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    updateSkills(updatedSkills, {
      onSuccess: () => {
        setSkills(updatedSkills);
        notifications.show({
          title: "Success",
          message: "Skill removed successfully",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: "Failed to remove skill. Please try again.",
          color: "red",
          icon: <IconX size={16} />,
        });
      },
    });
  };

  const handleRemovePendingSkill = (skillToRemove: string) => {
    setPendingSkills(pendingSkills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <LoadingOverlay
        visible={isUpdating}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack gap="md">
        <Group>
          <TextInput
            label="Add Skill"
            placeholder="Enter a skill"
            error={errors.skill?.message}
            {...register("skill")}
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleAddSkill}
            style={{ marginTop: 24 }}
          >
            Add
          </Button>
        </Group>

        {pendingSkills.length > 0 && (
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Skills to add:
            </Text>
            <Group gap="xs">
              {pendingSkills.map((skill) => (
                <Pill
                  key={skill}
                  withRemoveButton
                  onRemove={() => handleRemovePendingSkill(skill)}
                  size="lg"
                  radius="xl"
                >
                  {skill}
                </Pill>
              ))}
            </Group>
          </Box>
        )}

        <Box>
          <Text size="sm" fw={500} mb="xs">
            Your Skills
          </Text>
          <Group gap="xs">
            {skills.map((skill) => (
              <Pill
                key={skill}
                withRemoveButton
                onRemove={() => handleRemoveSkill(skill)}
                size="lg"
                radius="xl"
              >
                {skill}
              </Pill>
            ))}
          </Group>
        </Box>

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Done
          </Button>
          <Button type="submit" disabled={pendingSkills.length === 0}>
            Save Skills
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
