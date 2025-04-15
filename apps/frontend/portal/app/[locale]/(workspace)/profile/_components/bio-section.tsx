"use client";

import {
  Box,
  Text,
  Textarea,
  Button,
  Stack,
  Group,
  Paper,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { useJobSeekerDetails, useUpdateBio } from "app/_api/profile/queries";
import { useState } from "react";

interface BioFormValues {
  bio: string;
}

export default function BioSection() {
  const { data: jobSeeker } = useJobSeekerDetails();
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate: updateBio } = useUpdateBio();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BioFormValues>({
    defaultValues: {
      bio: jobSeeker?.bio || "",
    },
  });

  const onSubmit = async (values: BioFormValues) => {
    setIsUpdating(true);
    try {
      await updateBio(values.bio, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Bio updated successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message:
              error instanceof Error ? error.message : "Failed to update bio",
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Paper p="md" withBorder>
      <Stack gap="md">
        <Text fw={500} size="lg">
          Bio
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Textarea
              placeholder="Write a brief description about yourself"
              minRows={4}
              error={errors.bio?.message}
              {...register("bio")}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={isUpdating}>
                Save Bio
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
