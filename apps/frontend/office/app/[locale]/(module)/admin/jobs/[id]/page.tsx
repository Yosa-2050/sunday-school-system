"use client";

import { useRouter } from "@/i18n/routing";
import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { approveJob } from "app/[locale]/_api/admin/approve-job";
import { fetchJobsAdminById } from "app/[locale]/_api/admin/fetch-jobs-by-id";
import { useParams } from "next/navigation";

interface JobDetailsResponse {
  id: string;
  isActive: boolean;
  title: string;
  description: string;
  type: string;
  salaryFrom: number;
  salaryTo: number;
  status: string;
  location: string;
  organization: {
    id: string;
    name: string;
    description: string;
  };
  postedBy: {
    employee: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

const JobDetails = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const queryClient = new QueryClient();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => await fetchJobsAdminById(jobId),
  });

  const { mutate: approveJobMutate, isPending: isApprovingJob } = useMutation({
    mutationFn: async () => await approveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      router.push("/admin/jobs");
      notifications.show({
        title: "Job Approved",
        message: "The job has been successfully approved",
        color: "green",
      });
    },

    onError: (error) => {
      notifications.show({
        title: "Error Approving Job",
        message: error.message,
        color: "red",
      });
    },
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }

  if (!job) {
    return <Text>Job not found</Text>;
  }

  return (
    <Container fluid p="xl">
      <Flex gap="xl" align="start" direction={{ base: "column", md: "row" }}>
        {/* Employer Card */}
        <Card shadow="md" p="xl" radius="lg" w={300} bg="gray.0">
          <Flex align="center" direction="column" gap="md">
            <Avatar size={90} radius="xl" src="/avatar.png" alt="Employer" />
            <Text fw={600} size="lg">
              {job.postedBy.employee.profile.firstName}{" "}
              {job.postedBy.employee.profile.lastName}
            </Text>
            <Text size="sm" color="dimmed">
              {job.organization.name}
            </Text>
            <Divider my="md" />
            <Group gap="xs">
              <IconPhone size={16} />
              <Text size="sm">+251 9 123 456 78</Text>
            </Group>
            <Group gap="xs">
              <IconMail size={16} />
              <Text size="sm" color="dimmed">
                employer@mail.com
              </Text>
            </Group>
          </Flex>
        </Card>

        {/* Job Details */}
        <Paper shadow="md" radius="lg" p="xl" flex={1}>
          <Title order={2} mb={80}>
            Job Details
          </Title>
          <Flex align={"center"} justify={"space-between"} gap={"md"}>
            <Flex direction={"column"} gap={"md"}>
              <Group>
                <Text fw={500}>Job Title:</Text>
                <Text>{job.title}</Text>
              </Group>
              <Group>
                <Text fw={500}>Employment Type:</Text>
                <Text>{job.type}</Text>
              </Group>
            </Flex>
            <Flex direction={"column"} gap={"md"}>
              <Group>
                <Text fw={500}>Salary Range:</Text>
                <Text>
                  {job.salaryFrom.toLocaleString()} -{" "}
                  {job.salaryTo.toLocaleString()} ETB
                </Text>
              </Group>
              <Group>
                <Text fw={500}>Location:</Text>
                <Text>{"job.location"}</Text>
              </Group>
            </Flex>
          </Flex>

          <Divider my="lg" />

          <Stack>
            <Text fw={600}>Full Job Description</Text>
            <div
              className="job-description"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: job.description,
              }}
            />
          </Stack>

          {job.status === "NEW" && (
            <Flex mt="xl" justify="flex-end" gap="md">
              <Button
                color="red"
                variant="light"
                size="md"
                loading={isApprovingJob}
              >
                Decline
              </Button>
              <Button
                color="green"
                size="md"
                onClick={() => approveJobMutate()}
                loading={isApprovingJob}
              >
                Approve
              </Button>
            </Flex>
          )}
        </Paper>
      </Flex>
    </Container>
  );
};

export default JobDetails;
