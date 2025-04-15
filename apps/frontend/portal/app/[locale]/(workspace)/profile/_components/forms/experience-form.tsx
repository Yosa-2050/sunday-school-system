"use client";

import { useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  Textarea,
  Switch,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Experience } from "@/lib/types";
import {
  experienceSchema,
  type ExperienceFormValues,
} from "./experience-schema";
import {
  useCountries,
  useRegions,
  useCities,
  useWorkplaceTypes,
  useEmploymentTypes,
} from "app/_api/profile/location";

interface ExperienceFormProps {
  experience?: Experience | null;
  onSubmit: (experience: Experience) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
  isLoading = false,
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: experience?.title || "",
      company: experience?.company || "",
      startDate: experience?.startDate || new Date().toISOString(),
      endDate: experience?.endDate || "",
      type: experience?.type || "full-time",
      countryId: experience?.countryId || "",
      stateId: experience?.stateId || "",
      cityId: experience?.cityId || "",
      workPlace: experience?.workPlace || "",
      description: experience?.description || "",
      currentlyWorking: experience?.currentlyWorking,
    },
  });

  // Watch form fields
  const isCurrentlyWorking = watch("currentlyWorking");
  const selectedCountryId = watch("countryId");
  const selectedStateId = watch("stateId");

  // Fetch data using hooks
  const { data: countries = [], isLoading: isLoadingCountries } =
    useCountries();
  const selectedCountry = countries.find(
    (country) => country.id === selectedCountryId
  );
  const { data: regions = [], isLoading: isLoadingRegions } = useRegions(
    selectedCountry?.code || ""
  );
  const { data: cities = [], isLoading: isLoadingCities } = useCities(
    selectedStateId || ""
  );
  const { data: workplaceTypes = [], isLoading: isLoadingWorkplaceTypes } =
    useWorkplaceTypes();
  const { data: employmentTypes = [], isLoading: isLoadingEmploymentTypes } =
    useEmploymentTypes();

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (isCurrentlyWorking) {
      setValue("endDate", "");
    }
  }, [isCurrentlyWorking, setValue]);

  useEffect(() => {
    if (selectedCountryId !== experience?.countryId) {
      setValue("stateId", "");
      setValue("cityId", "");
    }
  }, [selectedCountryId, experience?.countryId, setValue]);

  useEffect(() => {
    if (selectedStateId !== experience?.stateId) {
      setValue("cityId", "");
    }
  }, [selectedStateId, experience?.stateId, setValue]);

  const onFormSubmit = (data: ExperienceFormValues) => {
    try {
      const id = experience?.id ?? crypto.randomUUID();
      const experienceData: Experience = {
        id,
        ...data,
        currentlyWorking: data.currentlyWorking,
      };

      onSubmit(experienceData);

      const baseMessage = "Experience";
      const actionType = experience ? "updated" : "added";
      const message = `${baseMessage} ${actionType} successfully`;

      notifications.show({
        title: "Success",
        message,
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save experience. Please try again.",
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <LoadingOverlay
        visible={
          isLoading ||
          isLoadingCountries ||
          isLoadingRegions ||
          isLoadingCities ||
          isLoadingWorkplaceTypes ||
          isLoadingEmploymentTypes
        }
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Stack gap="md">
        <TextInput
          label="Job Title"
          placeholder="e.g. Senior Software Engineer"
          required
          error={errors.title?.message}
          {...register("title")}
        />

        <TextInput
          label="Company"
          placeholder="e.g. Tech Corp Inc."
          required
          error={errors.company?.message}
          {...register("company")}
        />

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Start Date"
                  placeholder="Select start date"
                  required
                  valueFormat="YYYY-MM-DD"
                  error={errors.startDate?.message}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) =>
                    field.onChange(date?.toISOString() || "")
                  }
                />
              )}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="End Date"
                  placeholder="Select end date"
                  valueFormat="YYYY-MM-DD"
                  disabled={isCurrentlyWorking}
                  error={errors.endDate?.message}
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date: Date | null) =>
                    field.onChange(date?.toISOString() || "")
                  }
                />
              )}
            />
          </Grid.Col>
        </Grid>

        <Controller
          name="currentlyWorking"
          control={control}
          render={({ field }) => (
            <Switch
              label="I currently work here"
              checked={field.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(event.currentTarget.checked)
              }
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              label="Employment Type"
              placeholder="Select employment type"
              data={employmentTypes.map((type) => ({
                value: type.value,
                label: type.key,
              }))}
              error={errors.type?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="countryId"
          control={control}
          render={({ field }) => (
            <Select
              label="Country"
              placeholder="Select country"
              data={countries.map((country) => ({
                value: country.id,
                label: country.name,
              }))}
              error={errors.countryId?.message}
              required
              {...field}
            />
          )}
        />

        <Controller
          name="stateId"
          control={control}
          render={({ field }) => (
            <Select
              label="State/Region"
              placeholder="Select state/region"
              data={regions.map((region) => ({
                value: region.id,
                label: region.name,
              }))}
              error={errors.stateId?.message}
              required
              disabled={!selectedCountryId}
              {...field}
            />
          )}
        />

        <Controller
          name="cityId"
          control={control}
          render={({ field }) => (
            <Select
              label="City"
              placeholder="Select city"
              data={cities.map((city) => ({
                value: city.id,
                label: city.name,
              }))}
              error={errors.cityId?.message}
              required
              disabled={!selectedStateId}
              {...field}
            />
          )}
        />

        <Controller
          name="workPlace"
          control={control}
          render={({ field }) => (
            <Select
              label="Workplace"
              placeholder="Select workplace"
              data={workplaceTypes.map((type) => ({
                value: type.value,
                label: type.key,
              }))}
              error={errors.workPlace?.message}
              required
              {...field}
            />
          )}
        />

        <Textarea
          label="Description"
          placeholder="Describe your responsibilities and achievements"
          minRows={3}
          error={errors.description?.message}
          {...register("description")}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {experience ? "Update Experience" : "Add Experience"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
