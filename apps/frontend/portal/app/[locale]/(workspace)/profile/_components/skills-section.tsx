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
  Pill,
  Box,
  Card,
  Flex,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import SkillsForm from "./forms/skills-form";
import type { Skill } from "@/lib/types";

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSkills = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card shadow="sm" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={4}>Skills</Title>
            <Button
              leftSection={<IconPlus size={16} />}
              variant="light"
              size="sm"
              onClick={handleAddSkills}
            >
              Add
            </Button>
          </Group>

          <Divider />

          {skills.length === 0 ? (
            <Text c="dimmed" fs="italic">
              No skills added yet.
            </Text>
          ) : (
            <Box>
              <Flex gap="xs" wrap={"wrap"}>
                {skills.map((skill) => (
                  <Pill key={skill.id} size="lg" radius="xl">
                    {skill.skill}
                  </Pill>
                ))}
              </Flex>
            </Box>
          )}
        </Stack>
      </Card>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manage Skills"
        size="md"
      >
        <SkillsForm
          initialSkills={skills.map((skill) => skill.skill)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
}
