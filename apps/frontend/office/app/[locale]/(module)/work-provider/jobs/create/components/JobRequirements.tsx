import { Grid, MultiSelect, NumberInput, Select, Stack } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import type { JobFormData } from "./types";
import { mapEnumToOptions } from "./utils";

interface JobRequirementsProps {
  categories: { id: string; name: string }[];
  skills: { id: string; name: string }[];
  educationalRequirmentTypes: { data: Record<string, string> };
}

export const JobRequirements = ({
  categories,
  skills,
  educationalRequirmentTypes,
}: JobRequirementsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();

  return (
    <Stack gap="xl">
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="catagories"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Categories"
                placeholder="Select categories"
                data={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                value={field.value}
                onChange={field.onChange}
                error={errors.catagories?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="skills"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Skills"
                placeholder="Select skills"
                data={skills.map((skill) => ({
                  value: skill.name,
                  label: skill.name,
                }))}
                value={field.value}
                onChange={field.onChange}
                error={errors.skills?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="experianceLevel"
            control={control}
            render={({ field }) => (
              <Select
                label="Experience Level"
                placeholder="Select experience level"
                data={[
                  { value: "ENTRY", label: "Entry Level" },
                  { value: "MID", label: "Mid Level" },
                  { value: "SENIOR", label: "Senior Level" },
                  { value: "EXPERT", label: "Expert Level" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.experianceLevel?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="experiance"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Years of Experience"
                placeholder="Enter years of experience"
                min={0}
                value={Number(field.value) || 0}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.experiance?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="educationalRequirment"
            control={control}
            render={({ field }) => (
              <Select
                label="Educational Requirement"
                placeholder="Select educational requirement"
                data={mapEnumToOptions(educationalRequirmentTypes.data)}
                value={field.value}
                onChange={field.onChange}
                error={errors.educationalRequirment?.message}
                required
              />
            )}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
