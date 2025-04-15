"use client";

import { Text, Textarea, Button, Stack, Group, Paper } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import {
  useJobSeekerDetails,
  useUpdateCoverLetter,
} from "app/_api/profile/queries";
import { useState } from "react";

interface CoverLetterFormValues {
  coverLetter: string;
}

export default function CoverLetterSection() {
  const { data: jobSeeker } = useJobSeekerDetails();
  const [isUpdating, setIsUpdating] = useState(false);
  const { mutate: updateCoverLetter } = useUpdateCoverLetter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    defaultValues: {
      coverLetter: jobSeeker?.coverLetter || "",
    },
  });

  const onSubmit = async (values: CoverLetterFormValues) => {
    setIsUpdating(true);
    try {
      await updateCoverLetter(values.coverLetter, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Cover letter updated successfully",
            color: "green",
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message:
              error instanceof Error
                ? error.message
                : "Failed to update cover letter",
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
          Cover Letter
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md">
            <Textarea
              placeholder="Write your cover letter"
              minRows={6}
              error={errors.coverLetter?.message}
              {...register("coverLetter")}
            />
            <Group justify="flex-end">
              <Button type="submit" loading={isUpdating}>
                Save Cover Letter
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
