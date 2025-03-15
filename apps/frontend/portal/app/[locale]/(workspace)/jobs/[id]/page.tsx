"use client";

import {
  Avatar,
  Box,
  Card,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsById } from "app/_api/jobs/fetch-job-id";
import parse from "html-react-parser";
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
  const jobId = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobsById(jobId),
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }

  if (!job) {
    return <Text>Job not found</Text>;
  }

  return (
    <Box className="container mx-auto mt-12">
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
            <div className="job-description">{parse(job.description)}</div>
          </Stack>
        </Paper>
      </Flex>
    </Box>
  );
};

export default JobDetails;
