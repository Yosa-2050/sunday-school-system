"use client";

import {
  Text,
  Textarea,
  Button,
  Stack,
  Group,
  Card,
  Divider,
  Title,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconDeviceFloppy,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
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
  const [expanded, setExpanded] = useState(false);
  const { data: jobSeeker } = useJobSeekerDetails();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateCoverLetter } = useUpdateCoverLetter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CoverLetterFormValues>({
    defaultValues: {
      coverLetter: jobSeeker?.coverLetter || "",
    },
  });

  const onSubmit = async (values: CoverLetterFormValues) => {
    setIsEditing(true);
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
      setIsEditing(false);
    }
  };

  return (
    <Card shadow="sm" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Cover Letter</Title>
          {isEditing ? (
            <Group>
              <Button
                leftSection={<IconX size={16} />}
                variant="light"
                color="red"
                size="sm"
                onClick={() => {
                  reset({ coverLetter: jobSeeker?.coverLetter ?? "" });
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
              {...register("coverLetter")}
              error={errors.coverLetter?.message}
            />
          </form>
        ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
        jobSeeker?.coverLetter ? (
          <>
            <Text
              style={{ whiteSpace: "pre-wrap" }}
              className={expanded ? "" : "line-clamp-4"}
            >
              {jobSeeker.coverLetter}
            </Text>
            {jobSeeker.coverLetter.length > 200 && (
              <Box mt="xs">
                <Text
                  component="a"
                  href="#"
                  size="sm"
                  c="blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setExpanded(!expanded);
                  }}
                >
                  {expanded ? "Show less" : "Read more"}
                </Text>
              </Box>
            )}
          </>
        ) : (
          <Text style={{ whiteSpace: "pre-wrap" }}>
            No cover letter provided. Click edit to add your cover letter.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
