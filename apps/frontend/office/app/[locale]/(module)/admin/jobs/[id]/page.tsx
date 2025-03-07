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
import { IconMail, IconPhone } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import parse from "html-react-parser";

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

const dummyJobDetails: JobDetailsResponse = {
  id: "1",
  isActive: true,
  title: "Senior UI/UX Designer",
  description: `<html><p style="font-size: 16px; line-height: 1.6; color: #333;">
  We are seeking an experienced <strong>Senior UI/UX Designer</strong> to join our team. 
  The ideal candidate will have a strong background in user-centered design principles, 
  excellent problem-solving skills, and a keen eye for aesthetics and usability.
</p>

<h3 style="color: #2c3e50; margin-top: 20px;">Responsibilities:</h3>
<ul style="padding-left: 20px; color: #555; font-size: 15px;">
  <li>Lead the design process from concept to final implementation.</li>
  <li>Collaborate with product managers and developers to create intuitive user experiences.</li>
  <li>Conduct user research, usability testing, and gather feedback for design improvements.</li>
  <li>Design wireframes, prototypes, and high-fidelity UI elements using Figma, Sketch, or Adobe XD.</li>
  <li>Ensure brand consistency across all digital platforms.</li>
  <li>Stay updated with the latest UI/UX trends and best practices.</li>
</ul>

<h3 style="color: #2c3e50; margin-top: 20px;">Requirements:</h3>
<ul style="padding-left: 20px; color: #555; font-size: 15px;">
  <li>Bachelor’s degree in Design, Human-Computer Interaction, or a related field.</li>
  <li>5+ years of experience in UI/UX design.</li>
  <li>Proficiency in Figma, Sketch, Adobe XD, and other design tools.</li>
  <li>Strong understanding of front-end technologies (HTML, CSS, JavaScript) is a plus.</li>
  <li>Excellent communication and teamwork skills.</li>
  <li>Ability to work in a fast-paced and agile environment.</li>
</ul>

<h3 style="color: #2c3e50; margin-top: 20px;">Benefits:</h3>
<ul style="padding-left: 20px; color: #555; font-size: 15px;">
  <li>Competitive salary and performance-based bonuses.</li>
  <li>Flexible work hours and remote work options.</li>
  <li>Health insurance and wellness benefits.</li>
  <li>Opportunities for career growth and professional development.</li>
</ul>

<p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 20px;">
  If you’re passionate about crafting beautiful and intuitive user experiences, 
  we’d love to hear from you! Apply today and be part of our innovative team.
</p>
</html>`,
  type: "Full Time | Remote",
  salaryFrom: 11000,
  salaryTo: 60000,
  status: "PENDING",
  location: "London, England",
  organization: {
    id: "org1",
    name: "Private Comp",
    description: "A leading digital agency",
  },
  postedBy: {
    employee: {
      profile: {
        firstName: "Test",
        lastName: "Employer",
      },
    },
  },
};

const JobDetails = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => Promise.resolve(dummyJobDetails),
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
                <Text>{job.location}</Text>
              </Group>
            </Flex>
          </Flex>

          <Divider my="lg" />

          <Stack>
            <Text fw={600}>Full Job Description</Text>
            <div className="job-description">{parse(job.description)}</div>
          </Stack>

          <Flex mt="xl" justify="flex-end" gap="md">
            <Button color="red" variant="light" size="md">
              Decline
            </Button>
            <Button color="green" size="md">
              Approve
            </Button>
          </Flex>
        </Paper>
      </Flex>
    </Container>
  );
};

export default JobDetails;
