import { NumberInput, Select, Grid, Stack, Title } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";
import type { JobFormData } from "./types";
import { mapEnumToOptions } from "./utils";

interface SalaryAndCompensationProps {
  salaryFrequencyTypes: { data: Record<string, string> };
}

export const SalaryAndCompensation = ({
  salaryFrequencyTypes,
}: SalaryAndCompensationProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<JobFormData>();

  return (
    <Stack gap="xl">
      <Title order={3}>Salary and Compensation</Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="salaryFrom"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Minimum Salary"
                placeholder="Enter minimum salary"
                min={0}
                value={Number(field.value) || 0}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.salaryFrom?.message}
                required
                hideControls
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="salaryTo"
            control={control}
            render={({ field }) => (
              <NumberInput
                label="Maximum Salary"
                placeholder="Enter maximum salary"
                min={0}
                value={Number(field.value) || 0}
                onChange={(value) => field.onChange(Number(value))}
                error={errors.salaryTo?.message}
                required
                hideControls
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="salaryFrequency"
            control={control}
            render={({ field }) => (
              <Select
                label="Salary Frequency"
                placeholder="Select salary frequency"
                data={mapEnumToOptions(salaryFrequencyTypes.data)}
                value={field.value}
                onChange={field.onChange}
                error={errors.salaryFrequency?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                label="Currency"
                placeholder="Select currency"
                data={[
                  { value: "ETB", label: "Ethiopian Birr (ETB)" },
                  { value: "USD", label: "US Dollar (USD)" },
                  { value: "EUR", label: "Euro (EUR)" },
                  { value: "GBP", label: "British Pound (GBP)" },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={errors.currency?.message}
                required
              />
            )}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
