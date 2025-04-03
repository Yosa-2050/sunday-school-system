import { Grid, TextInput, Text, Divider } from "@mantine/core";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { JobFormData } from "./types";
import { MemoizedRichTextEditor } from "./MemoizedRichTextEditor";

interface ApplicationDetailsProps {
  control: Control<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const ApplicationDetails = ({
  control,
  errors,
}: ApplicationDetailsProps) => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Text fw={500} size="lg" mb="xs">
          Application Details
        </Text>
        <Divider mb="md" />
      </Grid.Col>

      <Grid.Col span={{ base: 12 }}>
        <Controller
          name="contactEmail"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Contact Email"
              placeholder="Email for applications"
              {...field}
              error={errors.contactEmail?.message}
              description="Optional: Provide an email for applicants to contact you directly"
            />
          )}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12 }}>
        <Controller
          name="applicationUrl"
          control={control}
          render={({ field }) => (
            <TextInput
              label="Application URL"
              placeholder="URL for applications"
              {...field}
              error={errors.applicationUrl?.message}
              description="Optional: External URL where candidates can apply"
            />
          )}
        />
      </Grid.Col>

      <Grid.Col span={12} mt="md">
        <Text fw={500} size="lg" mb="xs">
          Job Description
        </Text>
        <Divider mb="md" />
      </Grid.Col>

      <Grid.Col span={{ base: 12 }}>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <MemoizedRichTextEditor
              field={field}
              error={errors.description ?? { message: "", type: "error" }}
              label="Job Description"
              placeholder="Detailed job description"
            />
          )}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12 }}>
        <Controller
          control={control}
          name="additionalInfo"
          render={({ field }) => (
            <MemoizedRichTextEditor
              field={field}
              error={errors.additionalInfo ?? { message: "", type: "error" }}
              label="Additional Information"
              placeholder="Any additional information about the job"
            />
          )}
        />
      </Grid.Col>
    </Grid>
  );
};
