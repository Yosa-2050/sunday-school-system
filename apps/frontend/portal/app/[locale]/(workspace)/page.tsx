"use client";

import { redirect, useRouter } from "@/i18n/routing";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Drawer,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import {
  useDebouncedCallback,
  useDebouncedValue,
  useMediaQuery,
} from "@mantine/hooks";
import {
  entityParamSchema,
  entityParamSerializer,
  PER_PAGE,
} from "@shega/shared";
import { EntityPagination, useAuth } from "@shega/ui";
import {
  IconBriefcase,
  IconCurrencyDollar,
  IconFilter,
  IconMapPin,
  IconSearch,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "app/_api/jobs/fetch-jobs";
import { useLocale, useTranslations } from "next-intl";
import { parseAsJson, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

// Types
interface JobFilters {
  location: string;
  jobType: string;
  salaryRange: string;
  experienceLevel: string;
  keyword: string;
}

interface Job {
  id: number;
  title: string;
  organization: { name: string };
  type: string;
  salaryTo: string;
  description: string;
  createdAt: string;
}

export default function HomePage() {
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("jobListing");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [entityParams, setEntityParams] = useQueryState(
    "job-seeker-jbs",
    parseAsJson(entityParamSchema.parse)
  );

  const handleSearch = useDebouncedCallback((term: string | null) => {
    if (term) {
      setEntityParams({ ...entityParams, p: 1, s: term });
    } else {
      const updatedParams = { ...entityParams };
      updatedParams.s = undefined;
      setEntityParams({ ...updatedParams, p: 1 });
    }
  }, 300);
  const [filters, setFilters] = useState<JobFilters>({
    location: "",
    jobType: "",
    salaryRange: "",
    experienceLevel: "",
    keyword: "",
  });
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!user) {
      redirect({ href: "/auth/login", locale });
    }
  }, [user, locale]);

  return (
    <>
      <div className="relative">
        <div
          className="py-12 md:py-20 bg-cover bg-center relative h-[70vh]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <Container size="xl" className="relative z-10">
            <Stack gap="lg" className="max-w-xl mt-20">
              <Title className="text-4xl md:text-6xl font-bold text-white">
                Find The Job That Fits Your Life
              </Title>
              <Text size="lg" c="gray.2">
                Shega Jobs makes finding your ideal career simple and fast.
                Browse diverse job listings and kickstart your professional
                journey today.
              </Text>
            </Stack>

            <Group
              gap="sm"
              mt="lg"
              className="max-w-5xl bg-white rounded-lg p-2 shadow-lg border-none"
            >
              <TextInput
                size="lg"
                placeholder="Job title, keywords or organization"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    keyword: e.target.value,
                  })
                }
                leftSection={<IconSearch size={24} />}
                className="flex-1 p-2"
                styles={{
                  input: {
                    border: "none", // Target the input element directly
                  },
                }}
              />
              <Select
                size="lg"
                placeholder="All Location"
                data={[]}
                value={filters.location}
                onChange={(value) =>
                  setFilters({
                    ...filters,
                    location: value || "",
                  })
                }
                leftSection={<IconMapPin size={24} />}
                className="flex-1 p-2"
                styles={{
                  input: {
                    border: "none", // Target the input element directly
                  },
                }}
              />
              <Button
                size="lg"
                className="border-none"
                onClick={() => handleSearch(filters.keyword)}
              >
                Find Jobs
              </Button>
            </Group>

            {/* <Group gap="sm" mt="md">
              {[
                "Designer",
                "Developer",
                "Tester",
                "Writing",
                "Project Manager",
              ].map((keyword) => (
                <Anchor
                  key={keyword}
                  href="#"
                  className="text-gray-200 hover:text-white text-sm"
                >
                  {keyword}
                </Anchor>
              ))}
            </Group> */}
          </Container>
        </div>
      </div>

      <Container size="xl" mt="md">
        <Title className="text-2xl font-bold my-4" c="dimmed">
          Recent Jobs
        </Title>
        <Divider mb={"md"} />
        <Grid className="mt-3">
          <Grid.Col span={{ base: 12 }}>
            {isMobile && (
              <Button
                fullWidth
                leftSection={<IconFilter size={18} />}
                onClick={() => setOpened(true)}
                mb="md"
              >
                Filter Jobs
              </Button>
            )}
            <JobList filters={filters} />
          </Grid.Col>
        </Grid>
      </Container>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Filter Jobs"
        position="right"
        size="sm"
        padding="md"
      >
        <JobFilterSidebar filters={filters} onFilterChange={setFilters} />
      </Drawer>
    </>
  );
}

// Components
function JobList({ filters }: { filters: JobFilters }) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [limit] = useQueryState("limit", { defaultValue: "10" });
  const [debouncedSearch] = useDebouncedValue(searchQuery, 500);

  const [entityParams, setEntityParams] = useQueryState(
    "job-seeker-jbs",
    parseAsJson(entityParamSchema.parse).withDefault({
      p: 1,
      pp: PER_PAGE,
    })
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["job-seeker-jbs", entityParamSerializer(entityParams)],
    queryFn: () => fetchJobs(entityParamSerializer(entityParams)),
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }
  if (error) {
    return <Text color="red">Error loading jobs</Text>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data?.data.map((job) => (
        <Card
          key={job.id}
          withBorder
          radius="md"
          shadow="sm"
          padding={isMobile ? "sm" : "lg"}
          className="hover:shadow-md transition-shadow"
        >
          <Group justify="space-between" align="flex-start">
            <Group gap="sm">
              <Avatar size={isMobile ? "sm" : "lg"} color="blue" radius="xl">
                {job.organization?.name.slice(0, 2)}
              </Avatar>
              <div>
                <Title
                  order={isMobile ? 5 : 4}
                  className="font-semibold line-clamp-1 hover:text-blue-600 cursor-pointer"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                >
                  {job.title}
                </Title>
                <Text size="sm" c="dimmed" className="line-clamp-1">
                  {job.organization?.name}
                </Text>
              </div>
            </Group>
          </Group>

          <Group mt="sm" gap="xs">
            <Badge
              color="green"
              variant="light"
              leftSection={<IconBriefcase size={14} />}
            >
              {job.type}
            </Badge>
            <Badge
              color="teal"
              variant="light"
              leftSection={<IconCurrencyDollar size={14} />}
            >
              {job.salaryTo ? `Up to ${job.salaryTo}` : "N/A"}
            </Badge>
          </Group>

          <TypographyStylesProvider mt="md">
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: job.description,
              }}
              className="line-clamp-2 text-sm"
            />
          </TypographyStylesProvider>

          <Divider my="sm" />

          <Flex
            justify={job.createdAt ? "space-between" : "flex-end"}
            align="center"
          >
            {job.createdAt && (
              <Text size="xs" c="dimmed">
                {job.createdAt}
              </Text>
            )}
            <Button
              variant="filled"
              size={isMobile ? "sm" : "md"}
              fullWidth={isMobile}
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              Details
            </Button>
          </Flex>
        </Card>
      ))}
      <EntityPagination entity="job-seeker-jbs" total={data?.total ?? 0} />
    </div>
  );
}
function JobFilterSidebar({
  filters,
  onFilterChange,
}: {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
}) {
  const t = useTranslations("jobListing");

  return (
    <Paper p="md" radius="lg" shadow="sm" className="sticky top-4">
      <Title order={4} mb="md" fw={600}>
        {t("filterLabel")}
      </Title>
      <Stack gap="md">
        <TextInput
          label={t("location")}
          value={filters.location}
          onChange={(e) =>
            onFilterChange({ ...filters, location: e.target.value })
          }
          placeholder="Enter location"
          leftSection={<IconMapPin size={16} />}
        />
        <TextInput
          label={t("jobType")}
          value={filters.jobType}
          onChange={(e) =>
            onFilterChange({ ...filters, jobType: e.target.value })
          }
          placeholder="Job type"
          leftSection={<IconBriefcase size={16} />}
        />
        <TextInput
          label={t("salaryRange")}
          value={filters.salaryRange}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              salaryRange: e.target.value,
            })
          }
          placeholder="Salary range"
          leftSection={<IconCurrencyDollar size={16} />}
        />
        <Button
          variant="light"
          fullWidth
          onClick={() =>
            onFilterChange({
              location: "",
              jobType: "",
              salaryRange: "",
              experienceLevel: "",
              keyword: "",
            })
          }
        >
          {t("resetFilters")}
        </Button>
      </Stack>
    </Paper>
  );
}
