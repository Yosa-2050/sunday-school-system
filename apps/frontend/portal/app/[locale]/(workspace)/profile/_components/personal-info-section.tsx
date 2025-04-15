"use client";

import { useState } from "react";
import {
  Title,
  Text,
  Group,
  Stack,
  Button,
  TextInput,
  Grid,
  Divider,
  Card,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPencil, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import type { PersonalInfo } from "@/lib/types";
import { personalInfoSchema } from "@/lib/schemas";
import type { Profile } from "@/models/job-seeker.type";

interface PersonalInfoSectionProps {
  data: Profile;
  onUpdate: (data: PersonalInfo) => void;
}

export default function PersonalInfoSection({
  data,
  onUpdate,
}: PersonalInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: PersonalInfo) => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <Card shadow="sm" withBorder radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4} fw={600}>
            Personal Information
          </Title>
          {isEditing ? (
            <Group>
              <Button
                leftSection={<IconX size={16} />}
                variant="light"
                color="red"
                size="sm"
                radius="xl"
                onClick={() => {
                  reset(data);
                  setIsEditing(false);
                }}
                style={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                variant="filled"
                color="blue"
                size="sm"
                radius="xl"
                onClick={handleSubmit((data) => onSubmit({ ...data, id: "" }))}
                style={{
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
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
              radius="xl"
              style={{
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Group>

        <Divider />
        {isEditing ? (
          <form
            onSubmit={handleSubmit((data) => onSubmit({ ...data, id: "" }))}
          >
            <Stack gap="xl">
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
                  <Stack gap="md">
                    <TextInput
                      label="First Name"
                      placeholder="Your first name"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                    />
                    <TextInput
                      label="Middle Name"
                      placeholder="Your middle name"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("middleName")}
                      error={errors.middleName?.message}
                    />
                    <TextInput
                      label="Last Name"
                      placeholder="Your last name"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                    />
                    <TextInput
                      label="Birth Date"
                      placeholder="YYYY-MM-DD"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("birthDate")}
                      error={errors.birthDate?.message}
                    />
                    <TextInput
                      label="Gender"
                      placeholder="Your gender"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("gender")}
                      error={errors.gender?.message}
                    />
                    <TextInput
                      label="Title"
                      placeholder="Your title"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("title")}
                      error={errors.title?.message}
                    />
                    <TextInput
                      label="Phone Number"
                      placeholder="Your phone number"
                      withAsterisk
                      size="md"
                      radius="md"
                      {...register("phoneNumber")}
                      error={errors.phoneNumber?.message}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>
          </form>
        ) : (
          <Stack gap="md">
            <Group>
              <Stack gap="xs">
                <Text fw={500} size="lg">
                  {data.firstName} {data.lastName}
                </Text>
                <Text c="dimmed" size="sm">
                  {data.title}
                </Text>
                <Text c="dimmed" size="sm">
                  {data.gender}
                </Text>
                <Text c="dimmed" size="sm">
                  {data.birthDate}
                </Text>
                <Text c="dimmed" size="sm">
                  {data.phoneNumber}
                </Text>
              </Stack>
            </Group>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
