"use client";

import { Link, useRouter } from "@/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "@mantine/core";
import { Button, Group, Paper, Stepper, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobsAdminById } from "app/[locale]/_api/admin/fetch-jobs-by-id";
import type { JobDetailsViewProps } from "app/[locale]/_api/admin/fetch-jobs-by-id";
import { fetchEnum } from "app/[locale]/_api/enum";
import {
  fetchCategories,
  fetchCities,
  fetchCountries,
  fetchRegions,
  fetchSkills,
} from "app/[locale]/_api/job-details";
import {
  type CreateJob,
  updateJob,
} from "app/[locale]/_api/organizations/create-jobs";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApplicationDetails } from "../../jobs/create/components/ApplicationDetails";
import { JobDetails } from "../../jobs/create/components/JobDetails";
import { JobPreview } from "../../jobs/create/components/JobPreview";
import { JobRequirements } from "../../jobs/create/components/JobRequirements";
import {
  type JobDescriptionType,
  jobSchema,
} from "../../jobs/create/components/shcema/job-schema";
import type { JobFormData } from "../../jobs/create/components/types";

const getDefaultValues = (job: JobDetailsViewProps | undefined) => {
  if (!job) {
    return { isPublished: false };
  }

  return {
    title: job.title,
    description: job.description,
    type: job.type as "FULL_TIME" | "PART_TIME" | "Contract" | "Internship",
    workPlace: job.workPlace || "",
    salaryType: job.salaryType || "",
    currency: job.currency,
    salaryFrom: job.salaryFrom,
    salaryTo: job.salaryTo,
    salaryFrequency: job.salaryFrequency,
    countryId: job.country?.id || "",
    stateId: job.state?.id || "",
    cityId: job.city?.id || "",
    experianceLevel: job.experianceLevel as "ENTRY" | "MID" | "SENIOR",
    experiance: job.experiance,
    deadline: job.deadline
      ? new Date(job.deadline)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    educationalRequirment: job.educationalRequirment,
    skills: [],
    catagories: [],
    isPublished: false,
    contactEmail: "",
    applicationUrl: "",
    additionalInfo: job.notes || "",
    requirements:
      job.jobDescriptions
        ?.filter((d) => d.type === "REQUIREMENTS")
        .map((d) => d.description) || [],
    responsibilities:
      job.jobDescriptions
        ?.filter((d) => d.type === "RESPONSIBILITY")
        .map((d) => d.description) || [],
    benefits:
      job.jobDescriptions
        ?.filter((d) => d.type === "BENEFITS")
        .map((d) => d.description) || [],
    jobDescriptions: job.jobDescriptions || [],
  };
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
const DraftJobEdit = () => {
  const params = useParams();
  const jobId = params.id as string;
  const queryClient = useQueryClient();
  const [active, setActive] = useState(0);
  const router = useRouter();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobsAdminById(jobId),
  });

  const methods = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    values: job
      ? {
          title: job.title,
          description: job.description,
          type: job.type as
            | "FULL_TIME"
            | "PART_TIME"
            | "Contract"
            | "Internship",
          workPlace: job.workPlace || "",
          salaryType: job.salaryType || "",
          currency: job.currency,
          salaryFrom: job.salaryFrom,
          salaryTo: job.salaryTo,
          salaryFrequency: job.salaryFrequency,
          countryId: job.country?.id || "",
          stateId: job.state?.id || "",
          cityId: job.city?.id || "",
          experianceLevel: job.experianceLevel as "ENTRY" | "MID" | "SENIOR",
          experiance: job.experiance,
          deadline: job.deadline
            ? new Date(job.deadline)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          educationalRequirment: job.educationalRequirment,
          skills: job.jobSkills.map((skill) => skill.skill),
          catagories: job.jobCategory.map((cat) => cat.category.id),
          isPublished: false,
          contactEmail: "",
          applicationUrl: "",
          additionalInfo: job.notes || "",
          requirements:
            job.jobDescriptions
              ?.filter((d) => d.type === "REQUIREMENTS")
              .map((d) => d.description) || [],
          responsibilities:
            job.jobDescriptions
              ?.filter((d) => d.type === "RESPONSIBILITY")
              .map((d) => d.description) || [],
          benefits:
            job.jobDescriptions
              ?.filter((d) => d.type === "BENEFITS")
              .map((d) => d.description) || [],
          jobDescriptions:
            job.jobDescriptions?.map((desc) => ({
              description: desc.description,
              type: desc.type as JobDescriptionType,
            })) || [],
        }
      : undefined,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (job) {
      const defaultValues = {
        ...getDefaultValues(job),
        jobDescriptions:
          job.jobDescriptions?.map((desc) => ({
            description: desc.description,
            type: desc.type as JobDescriptionType,
          })) || [],
      };
      methods.reset(defaultValues);
    }
  }, [job, methods]);

  const { watch, trigger, control, formState } = methods;
  const { errors } = formState;

  // Define fields for each step to check for errors
  const stepFields = {
    0: [
      "title",
      "type",
      "workPlace",
      "deadline",
      "countryId",
      "stateId",
      "cityId",
      "currency",
      "salaryFrom",
      "salaryTo",
      "salaryFrequency",
    ],
    1: [
      "catagories",
      "skills",
      "experianceLevel",
      "experiance",
      "educationalRequirment",
    ],
    2: ["description", "contactEmail", "applicationUrl"],
  };

  // Check if a step has errors
  const hasStepErrors = (stepIndex: number) => {
    const fields = stepFields[stepIndex as keyof typeof stepFields];
    return fields.some((field) => errors[field as keyof typeof errors]);
  };

  // Fetch initial data using TanStack Query
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: skills = [] } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  // Fetch enums
  const { data: employmentTypes = { data: {} } } = useQuery({
    queryKey: ["employmentTypes"],
    queryFn: () => fetchEnum("EmploymentType"),
  });

  const { data: workPlaceTypes = { data: {} } } = useQuery({
    queryKey: ["workPlaceTypes"],
    queryFn: () => fetchEnum("WorkPlaceType"),
  });
  const { data: salaryTypes = { data: {} } } = useQuery({
    queryKey: ["salaryTypes"],
    queryFn: () => fetchEnum("SalaryType"),
  });

  const { data: salaryFrequencyTypes = { data: {} } } = useQuery({
    queryKey: ["salaryFrequencyTypes"],
    queryFn: () => fetchEnum("SalaryFrequencyType"),
  });

  const { data: educationalRequirmentType = { data: {} } } = useQuery({
    queryKey: ["educationalRequirmentType"],
    queryFn: () => fetchEnum("EducationalRequirmentType"),
  });

  // Fetch regions based on selected country
  const selectedCountry = watch("countryId");
  const { data: regions = [] } = useQuery({
    queryKey: ["regions", selectedCountry],
    queryFn: () => {
      if (!selectedCountry) {
        return Promise.resolve([]);
      }
      return fetchRegions(selectedCountry);
    },
    enabled: !!selectedCountry,
  });

  // Fetch cities based on selected state
  const selectedState = watch("stateId");
  const { data: cities = [] } = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => {
      if (!selectedState) {
        return Promise.resolve([]);
      }
      return fetchCities(selectedState);
    },
    enabled: !!selectedState,
  });
  const jobMutation = useMutation({
    mutationFn: (data: CreateJob) => updateJob(data, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      notifications.show({
        title: "Success",
        message: "Job posted successfully",
        color: "green",
        icon: <IconCheck size="1.1rem" />,
      });
      router.push("/work-provider/jobs");
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to post job",
        color: "red",
      });
    },
  });

  const draftMutation = useMutation({
    mutationFn: (data: CreateJob) => updateJob(data, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobDrafts"] });
      notifications.show({
        title: "Success",
        message: "Draft saved successfully",
        color: "green",
        icon: <IconCheck size="1.1rem" />,
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to save draft",
        color: "red",
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    const organizationId = getCookie("organization_id")?.toString();
    if (!organizationId) {
      notifications.show({
        title: "Error",
        message: "Organization ID is required",
        color: "red",
      });
      return;
    }

    jobMutation.mutate({
      ...data,
      organizationId: organizationId ?? "",
      isPublished: true,
      id: jobId,
    });
  };

  const onSaveDraft = () => {
    const organizationId = getCookie("organization_id")?.toString();

    if (!organizationId) {
      notifications.show({
        title: "Error",
        message: "Organization ID is required",
        color: "red",
      });
      return;
    }

    draftMutation.mutate({
      ...watch(),
      organizationId: organizationId ?? "",
    });
  };

  const nextStep = async () => {
    // If moving from the third step to the preview step, validate all fields
    if (active === 2) {
      const isValid = await trigger();

      // Manually check salary values
      const salaryFrom = methods.getValues("salaryFrom");
      const salaryTo = methods.getValues("salaryTo");
      if (salaryTo <= salaryFrom) {
        methods.setError("salaryTo", {
          type: "manual",
          message: "Salary to must be greater than salary from",
        });
        return;
      }

      if (!isValid) {
        return; // Don't proceed if validation fails
      }
    }

    // Otherwise, just move to the next step without validation
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  if (formSubmitted) {
    return (
      <Container size="xl">
        <Paper shadow="sm" p="xl" radius="md">
          <div className="text-center">
            <IconCheck size={48} className="text-green-500 mx-auto mb-4" />
            <Title order={2} mb="md">
              Job Posted Successfully!
            </Title>
            <Button
              component={Link}
              href="/work-provider/jobs"
              leftSection={<IconArrowLeft size="1.1rem" />}
            >
              Back to Jobs
            </Button>
          </div>
        </Paper>
      </Container>
    );
  }

  return (
    <FormProvider {...methods}>
      <Container size={"xl"} bg={"white"} p={"md"} className="shadow rounded">
        <Group justify="space-between" align="center" py={"lg"}>
          <Group>
            <Link href="/work-provider/draft-jobs" passHref>
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                component="a"
                color="gray"
              />
            </Link>
            <Title order={2}>Edit Draft Job</Title>
          </Group>
        </Group>

        <Stepper
          active={active}
          onStepClick={setActive}
          styles={{
            stepLabel: {
              marginTop: 10,
            },
            step: {
              "&[data-error]": {
                color: "var(--mantine-color-red-6)",
              },
            },
            stepIcon: {
              "&[data-error]": {
                backgroundColor: "var(--mantine-color-red-6)",
                borderColor: "var(--mantine-color-red-6)",
              },
            },
          }}
        >
          <Stepper.Step
            label="Job Details"
            description="Basic job information and salary"
            completedIcon={
              hasStepErrors(0) ? (
                <IconCircleX size="1.1rem" color="white" />
              ) : undefined
            }
            color={hasStepErrors(0) ? "red" : ""}
            data-error={hasStepErrors(0)}
            allowStepSelect={true}
          >
            <JobDetails
              employmentTypes={employmentTypes}
              workPlaceTypes={workPlaceTypes}
              countries={countries}
              regions={regions}
              cities={cities}
              salaryFrequencyTypes={salaryFrequencyTypes}
              salaryTypes={salaryTypes}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Requirements"
            description="Job requirements"
            completedIcon={
              hasStepErrors(0) ? (
                <IconCircleX size="1.1rem" color="white" />
              ) : undefined
            }
            color={hasStepErrors(0) ? "red" : ""}
            data-error={hasStepErrors(1)}
            allowStepSelect={true}
          >
            <JobRequirements
              categories={categories}
              skills={skills}
              educationalRequirmentTypes={educationalRequirmentType}
            />
          </Stepper.Step>

          <Stepper.Step
            label="Application"
            description="Application details"
            completedIcon={
              hasStepErrors(0) ? (
                <IconCircleX size="1.1rem" color="white" />
              ) : undefined
            }
            color={hasStepErrors(0) ? "red" : ""}
            data-error={hasStepErrors(2)}
            allowStepSelect={true}
          >
            <ApplicationDetails control={control} errors={formState.errors} />
          </Stepper.Step>

          <Stepper.Step label="Preview" description="Review job posting">
            <JobPreview formData={methods.getValues()} />
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            onClick={prevStep}
            leftSection={<IconArrowLeft size="1.1rem" />}
            disabled={active === 0}
          >
            Back
          </Button>

          <Group>
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={draftMutation.isPending}
            >
              Save as Draft
            </Button>

            {active < 3 ? (
              <Button
                onClick={nextStep}
                rightSection={<IconArrowRight size="1.1rem" />}
              >
                Next step
              </Button>
            ) : (
              <Button
                onClick={methods.handleSubmit(onSubmit)}
                loading={jobMutation.isPending}
              >
                Post Job
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </FormProvider>
  );
};

export default DraftJobEdit;
