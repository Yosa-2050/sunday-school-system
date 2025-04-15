"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Group,
  Stack,
  Button,
  Textarea,
  Divider,
  Card,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import type { About } from "@/lib/types";
import { aboutSchema } from "@/lib/schemas";

interface AboutSectionProps {
  data: About;
  onUpdate: (data: About) => void;
}

export default function AboutSection({ data, onUpdate }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<About>({
    resolver: zodResolver(aboutSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: About) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <Card shadow="sm" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>About</Title>
          {isEditing ? (
            <Group>
              <Button
                leftSection={<IconX size={16} />}
                variant="light"
                color="red"
                size="sm"
                onClick={() => {
                  reset(data);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                variant="light"
                color="blue"
                size="sm"
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Group>
          ) : (
            <Button
              leftSection={<IconPencil size={16} />}
              variant="light"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </Group>

        <Divider />

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              placeholder="Tell us about yourself..."
              minRows={5}
              autosize
              {...register("bio")}
              error={errors.bio?.message}
            />
          </form>
        ) : (
          <Text style={{ whiteSpace: "pre-wrap" }}>
            {data.bio || "No bio provided. Click edit to add your bio."}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
