"use client";

import { Footer } from "@/components/Footer";
import { useRouter } from "@/i18n/routing";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  List,
  LoadingOverlay,
  Paper,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
  TypographyStylesProvider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { logger } from "@shega/shared";
import { useAuth } from "@shega/ui";
import {
  IconArrowLeft,
  IconBookmark,
  IconBriefcase,
  IconBuilding,
  IconBuildingSkyscraper,
  IconCheck,
  IconCurrencyDollar,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShare,
  IconStar,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsById } from "app/_api/jobs/fetch-job-id";
import parse from "html-react-parser";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const locale = useLocale();
  const t = useTranslations("jobListing");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const { user } = useAuth();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", params.id],
    queryFn: () => {
      if (!params.id) {
        throw new Error("Job ID is required");
      }
      return fetchJobsById(params.id);
    },
    enabled: !!params.id,
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }

  if (error || !job) {
    return (
      <Container size="xl" py="xl">
        <Text color="red">Error loading job details</Text>
      </Container>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job.title,
          text: `Check out this job opportunity: ${job.title} at ${job.organization?.name}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        // Could copy to clipboard or show a modal with share options
        logger.info("Web Share API not supported in this browser");
      }
    } catch (err) {
      logger.error("Error sharing:", err);
    }
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Stack gap="xl">
          {/* Header */}
          <Card>
            <Group justify="space-between" align="flex-start">
              <Group gap="md">
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  onClick={() => router.back()}
                  radius="xl"
                >
                  <IconArrowLeft size={20} />
                </ActionIcon>
                <Stack gap={4}>
                  <Title order={2}>{job.title}</Title>
                  <Group gap="xs">
                    <Text
                      size="sm"
                      c="dimmed"
                      className="flex items-center gap-1"
                    >
                      <IconBuilding size={14} />
                      {job.organization?.name}
                    </Text>
                    <Text
                      size="sm"
                      c="dimmed"
                      className="flex items-center gap-1"
                    >
                      <IconMapPin size={14} />
                      Remote
                    </Text>
                  </Group>
                </Stack>
              </Group>
              <Group>
                <Tooltip label="Share job">
                  <ActionIcon
                    variant="light"
                    size="lg"
                    onClick={handleShare}
                    radius="xl"
                  >
                    <IconShare size={20} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={isSaved ? "Remove from saved" : "Save job"}>
                  <ActionIcon
                    variant="light"
                    color={isSaved ? "blue" : "gray"}
                    size="lg"
                    onClick={() => setIsSaved(!isSaved)}
                    radius="xl"
                  >
                    {isSaved ? (
                      <IconBookmark size={20} />
                    ) : (
                      <IconBookmark size={20} />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
          </Card>
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              {/* Job Details */}
              <Stack gap="xl">
                <Card withBorder radius="lg" padding="lg">
                  <Stack gap="md">
                    <Group gap="xs">
                      <Badge
                        color="blue"
                        variant="light"
                        leftSection={<IconBriefcase size={14} />}
                        radius="xl"
                      >
                        {job.type}
                      </Badge>
                      <Badge
                        color="teal"
                        variant="light"
                        leftSection={<IconCurrencyDollar size={14} />}
                        radius="xl"
                      >
                        {job.salaryFrom.toLocaleString()} -{" "}
                        {job.salaryTo.toLocaleString()} {job.currency}
                      </Badge>
                      <Badge
                        color="grape"
                        variant="light"
                        leftSection={<IconStar size={14} />}
                        radius="xl"
                      >
                        Any Experience
                      </Badge>
                    </Group>

                    <Divider />

                    <Stack gap="xs">
                      <Title order={4}>Job Description</Title>
                      <TypographyStylesProvider>
                        <Box className="prose prose-stone max-w-none">
                          {parse(job.description)}
                        </Box>
                      </TypographyStylesProvider>
                    </Stack>

                    <Stack gap="xs">
                      <Title order={4}>Requirements</Title>
                      <List
                        spacing="xs"
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconCheck size={16} />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>
                          5+ years of experience in software development
                        </List.Item>
                        <List.Item>
                          Strong knowledge of React and TypeScript
                        </List.Item>
                        <List.Item>
                          Experience with Node.js and Express
                        </List.Item>
                        <List.Item>Understanding of RESTful APIs</List.Item>
                        <List.Item>
                          Experience with Git and version control
                        </List.Item>
                      </List>
                    </Stack>

                    <Stack gap="xs">
                      <Title order={4}>Responsibilities</Title>
                      <List
                        spacing="xs"
                        size="sm"
                        center
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconCheck size={16} />
                          </ThemeIcon>
                        }
                      >
                        <List.Item>
                          Develop and maintain web applications
                        </List.Item>
                        <List.Item>
                          Collaborate with cross-functional teams
                        </List.Item>
                        <List.Item>Write clean, maintainable code</List.Item>
                        <List.Item>Participate in code reviews</List.Item>
                        <List.Item>
                          Contribute to technical documentation
                        </List.Item>
                      </List>
                    </Stack>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" padding="lg">
                  <Tabs defaultValue="about">
                    <Tabs.List>
                      <Tabs.Tab
                        value="about"
                        leftSection={<IconBuildingSkyscraper size={16} />}
                      >
                        About Company
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="culture"
                        leftSection={<IconUsers size={16} />}
                      >
                        Culture
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="benefits"
                        leftSection={<IconStar size={16} />}
                      >
                        Benefits
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="about" pt="md">
                      <Stack gap="md">
                        <Group gap="md">
                          <Avatar
                            size={80}
                            color="blue"
                            radius="xl"
                            className="bg-blue-50"
                          >
                            {job.organization?.name.slice(0, 2)}
                          </Avatar>
                          <Stack gap={4}>
                            <Title order={3}>{job.organization?.name}</Title>
                            <Group gap="xs">
                              <Text
                                size="sm"
                                c="dimmed"
                                className="flex items-center gap-1"
                              >
                                <IconWorld size={14} />
                                www.example.com
                              </Text>
                              <Text
                                size="sm"
                                c="dimmed"
                                className="flex items-center gap-1"
                              >
                                <IconMapPin size={14} />
                                Addis Ababa, Ethiopia
                              </Text>
                            </Group>
                          </Stack>
                        </Group>

                        <Text>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat.
                        </Text>

                        <Group gap="md">
                          <Button
                            variant="light"
                            leftSection={<IconMail size={16} />}
                            radius="md"
                          >
                            Contact
                          </Button>
                          <Button
                            variant="light"
                            leftSection={<IconPhone size={16} />}
                            radius="md"
                          >
                            Call
                          </Button>
                        </Group>
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="culture" pt="md">
                      <Stack gap="md">
                        <Text>
                          Our company culture is built on innovation,
                          collaboration, and continuous learning. We believe in
                          creating an environment where everyone can thrive and
                          contribute to our mission.
                        </Text>
                        <List
                          spacing="xs"
                          size="sm"
                          center
                          icon={
                            <ThemeIcon color="blue" size={24} radius="xl">
                              <IconCheck size={16} />
                            </ThemeIcon>
                          }
                        >
                          <List.Item>Flexible work hours</List.Item>
                          <List.Item>Remote work options</List.Item>
                          <List.Item>Regular team events</List.Item>
                          <List.Item>Professional development</List.Item>
                        </List>
                      </Stack>
                    </Tabs.Panel>

                    <Tabs.Panel value="benefits" pt="md">
                      <Stack gap="md">
                        <Text>
                          We offer competitive benefits to ensure our employees
                          are well taken care of and can focus on doing their
                          best work.
                        </Text>
                        <List
                          spacing="xs"
                          size="sm"
                          center
                          icon={
                            <ThemeIcon color="blue" size={24} radius="xl">
                              <IconCheck size={16} />
                            </ThemeIcon>
                          }
                        >
                          <List.Item>Health insurance</List.Item>
                          <List.Item>Paid time off</List.Item>
                          <List.Item>
                            Professional development allowance
                          </List.Item>
                          <List.Item>Work-from-home stipend</List.Item>
                          <List.Item>Annual bonus</List.Item>
                        </List>
                      </Stack>
                    </Tabs.Panel>
                  </Tabs>
                </Card>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              {/* Apply Card */}
              <Stack gap="md">
                <Card withBorder radius="lg" padding="lg" shadow="sm">
                  <Stack gap="md">
                    <Button
                      variant="gradient"
                      gradient={{ from: "primary", to: "cyan" }}
                      size="lg"
                      fullWidth
                      radius="md"
                      leftSection={<IconBriefcase size={18} />}
                      className="hover:scale-105 transition-transform"
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="light"
                      color="blue"
                      size="lg"
                      fullWidth
                      radius="md"
                      leftSection={<IconBookmark size={18} />}
                      className="hover:bg-blue-50 transition-colors"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      {isSaved ? "Saved" : "Save Job"}
                    </Button>
                  </Stack>
                </Card>

                <Card withBorder radius="lg" padding="lg" shadow="sm">
                  <Stack gap="md">
                    <Group
                      justify="space-between"
                      className="border-b border-b-gray-100 pb-4"
                    >
                      <Title order={4}>Similar Jobs</Title>
                      <Text
                        size="xs"
                        c="blue"
                        className="cursor-pointer hover:underline"
                      >
                        View all
                      </Text>
                    </Group>
                    <Stack gap="xs">
                      {[1, 2, 3].map((i) => (
                        <Paper
                          key={i}
                          withBorder
                          p="md"
                          radius="md"
                          className="cursor-pointer hover:shadow-md transition-all hover:border-blue-300 group"
                          onClick={() => router.push(`/jobs/${i}`)}
                        >
                          <Stack gap={8}>
                            <Text
                              fw={600}
                              size="sm"
                              lineClamp={1}
                              className="group-hover:text-blue-600 transition-colors"
                            >
                              Senior Software Engineer
                            </Text>
                            <Group gap="xs">
                              <Text
                                size="xs"
                                c="dimmed"
                                className="flex items-center gap-1"
                              >
                                <IconBuilding size={12} />
                                Tech Company
                              </Text>
                              <Text
                                size="xs"
                                c="dimmed"
                                className="flex items-center gap-1"
                              >
                                <IconMapPin size={12} />
                                Addis Ababa
                              </Text>
                            </Group>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>

      <Footer />
    </>
  );
}
