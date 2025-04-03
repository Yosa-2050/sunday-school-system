import { Select, TextInput, Grid, Stack, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Controller, useFormContext } from "react-hook-form";
import type { JobFormData } from "./types";
import { mapEnumToOptions } from "./utils";

interface JobDetailsProps {
  employmentTypes: { data: Record<string, string> };
  workPlaceTypes: { data: Record<string, string> };
  countries: { id: string; name: string }[];
  regions: { id: string; name: string }[];
  cities: { id: string; name: string }[];
}

export const JobDetails = ({
  employmentTypes,
  workPlaceTypes,
  countries,
  regions,
  cities,
}: JobDetailsProps) => {
  const {
    register,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<JobFormData>();

  const selectedCountry = watch("countryId");
  const selectedState = watch("stateId");

  return (
    <Stack gap="xl">
      <Title order={3}>Job Details</Title>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Job Title"
            placeholder="Enter job title"
            {...register("title")}
            error={errors.title?.message}
            required
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Employment Type"
                placeholder="Select employment type"
                data={mapEnumToOptions(employmentTypes.data)}
                value={field.value}
                onChange={(value) =>
                  field.onChange(
                    value as
                      | "FULL_TIME"
                      | "PART_TIME"
                      | "Contract"
                      | "Internship"
                  )
                }
                error={errors.type?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="workPlaceType"
            control={control}
            render={({ field }) => (
              <Select
                label="Workplace Type"
                placeholder="Select workplace type"
                data={mapEnumToOptions(workPlaceTypes.data)}
                value={field.value}
                onChange={field.onChange}
                error={errors.workPlaceType?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DateInput
                label="Application Deadline"
                placeholder="Select deadline"
                minDate={new Date()}
                valueFormat="YYYY-MM-DD"
                value={field.value}
                onChange={field.onChange}
                error={errors.deadline?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
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
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("stateId", "");
                  setValue("cityId", "");
                }}
                error={errors.countryId?.message}
                required
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
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
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue("cityId", "");
                }}
                error={errors.stateId?.message}
                required
                disabled={!selectedCountry}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 4 }}>
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
                value={field.value}
                onChange={field.onChange}
                error={errors.cityId?.message}
                required
                disabled={!selectedState}
              />
            )}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
