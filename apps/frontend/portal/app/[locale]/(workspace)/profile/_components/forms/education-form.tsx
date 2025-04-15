"use client";

import { useState } from "react";
import {
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
  LoadingOverlay,
  Switch,
  Modal,
  Box,
  Divider,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconTrash, IconSchool } from "@tabler/icons-react";
import { z } from "zod";
import {
  useCreateEducation,
  useUpdateEducationalHistoryEntry,
  useDeleteEducation,
  useJobSeekerDetails,
  useEducationLevels,
  useFieldsOfStudy,
} from "app/_api/profile/queries";

const schema = z.object({
  school: z.string().min(1, "School is required"),
  level: z.string().min(1, "Level is required"),
  fieldOfStudyId: z.string().min(1, "Field of study is required"),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date is required",
  }),
  endDate: z.date().optional(),
  grade: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface EducationFormProps {
  education?: {
    id: string;
    school: string;
    level: string;
    fieldOfStudyId: string;
    startDate: string;
    endDate?: string;
    grade?: number;
    description?: string;
  };
  onCancel: () => void;
}

export default function EducationForm({
  education,
  onCancel,
}: EducationFormProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { data: jobSeeker } = useJobSeekerDetails();
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(
    education ? !education.endDate : false
  );
  const { data: fieldsOfStudy, isLoading: isLoadingFields } =
    useFieldsOfStudy();
  const { data: educationLevels, isLoading: isLoadingLevels } =
    useEducationLevels();
  const { mutate: createEducation, isPending: isCreating } =
    useCreateEducation();
  const { mutate: updateEducation, isPending: isUpdating } =
    useUpdateEducationalHistoryEntry();
  const { mutate: deleteEducation, isPending: isDeleting } =
    useDeleteEducation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      school: education?.school || "",
      level: education?.level || "",
      fieldOfStudyId: education?.fieldOfStudyId || "",
      startDate: education?.startDate
        ? new Date(education.startDate)
        : undefined,
      endDate: education?.endDate ? new Date(education.endDate) : undefined,
      grade: education?.grade || undefined,
      description: education?.description || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const formData = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: isCurrentlyStudying ? undefined : values.endDate?.toISOString(),
      grade: values.grade || undefined,
      description: values.description || undefined,
    };

    try {
      if (education) {
        updateEducation(
          { id: education.id, data: formData },
          {
            onSuccess: () => {
              notifications.show({
                title: "Success",
                message: "Education updated successfully",
                color: "teal",
                icon: <IconCheck size={18} />,
              });
              onCancel();
            },
          }
        );
      } else {
        if (!formData.endDate) {
          throw new Error("End Date is required");
        }
        createEducation(
          {
            ...formData,
            endDate: formData.endDate,
            grade: formData.grade || 0,
            description: formData.description || "",
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "Success",
                message: "Education added successfully",
                color: "teal",
                icon: <IconCheck size={18} />,
              });
              onCancel();
            },
          }
        );
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  };

  const handleDelete = async () => {
    if (!education) {
      return;
    }

    try {
      deleteEducation(education.id, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Education deleted successfully",
            color: "teal",
            icon: <IconCheck size={18} />,
          });
          onCancel();
        },
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message:
          error instanceof Error ? error.message : "Failed to delete education",
        color: "red",
        icon: <IconX size={18} />,
      });
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <LoadingOverlay
            visible={isLoadingLevels || isLoading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />

          <Group gap="sm" align="center">
            <IconSchool size={20} />
            <TextInput
              label="School"
              placeholder="Enter school name"
              {...register("school")}
              error={errors.school?.message}
              flex={1}
            />
          </Group>

          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <Select
                label="Education Level"
                placeholder="Select education level"
                data={
                  educationLevels?.map((level) => ({
                    value: level.key,
                    label: level.value,
                  })) || []
                }
                searchable
                nothingFoundMessage="No levels found"
                {...field}
                error={errors.level?.message}
              />
            )}
          />

          <Controller
            name="fieldOfStudyId"
            control={control}
            render={({ field }) => (
              <Select
                label="Field of Study"
                placeholder="Select field of study"
                data={
                  fieldsOfStudy?.map((field) => ({
                    value: field.name,
                    label: field.name,
                  })) || []
                }
                searchable
                nothingFoundMessage="No fields found"
                {...field}
                error={errors.fieldOfStudyId?.message}
              />
            )}
          />

          <Group grow>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Start Date"
                  placeholder="Select start date"
                  valueFormat="MMMM YYYY"
                  maxDate={new Date()}
                  {...field}
                  error={errors.startDate?.message}
                />
              )}
            />

            {!isCurrentlyStudying && (
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    label="End Date"
                    placeholder="Select end date"
                    valueFormat="MMMM YYYY"
                    minDate={watch("startDate")}
                    maxDate={new Date()}
                    {...field}
                    error={errors.endDate?.message}
                  />
                )}
              />
            )}
          </Group>

          <Switch
            label="Currently studying here"
            checked={isCurrentlyStudying}
            onChange={(event) =>
              setIsCurrentlyStudying(event.currentTarget.checked)
            }
          />

          <Controller
            name="grade"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Grade/Score"
                placeholder="Enter your grade (0-100)"
                min={0}
                max={100}
                suffix="%"
                clampBehavior="strict"
                {...field}
                error={errors.grade?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                label="Description"
                placeholder="Add details about your education"
                autosize
                minRows={3}
                maxRows={6}
                {...field}
                error={errors.description?.message}
              />
            )}
          />

          <Divider my="sm" />

          <Group justify="space-between">
            {education && (
              <Button
                variant="subtle"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={isLoading}
              >
                Delete Education
              </Button>
            )}

            <Group justify="flex-end" gap="sm">
              <Button variant="default" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isCreating || isUpdating}
                disabled={!isDirty && !!education}
              >
                {education ? "Update Education" : "Add Education"}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Box>

      {/* Delete confirmation modal */}
      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Education"
        centered
        radius="md"
      >
        <Stack gap="sm">
          <Text size="sm">
            Are you sure you want to delete this education entry? This action
            cannot be undone.
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
              loading={isDeleting}
              onClick={handleDelete}
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
