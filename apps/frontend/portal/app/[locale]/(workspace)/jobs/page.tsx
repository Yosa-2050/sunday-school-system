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
  Checkbox,
  Chip,
  Container,
  Drawer,
  Grid,
  Group,
  LoadingOverlay,
  Paper,
  RangeSlider,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  TypographyStylesProvider,
} from "@mantine/core";
import { useDebouncedCallback, useMediaQuery } from "@mantine/hooks";
import {
  PER_PAGE,
  entityParamSchema,
  entityParamSerializer,
} from "@shega/shared";
import { EntityPagination, useAuth } from "@shega/ui";
import {
  IconAdjustments,
  IconBookmark,
  IconBriefcase,
  IconBuilding,
  IconClock,
  IconCurrencyDollar,
  IconFilter,
  IconMapPin,
  IconSearch,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "app/_api/jobs/fetch-jobs";
import parse from "html-react-parser";
import { useLocale, useTranslations } from "next-intl";
import { parseAsJson, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

// Types
interface JobFilters {
  location: string;
  jobType: string[];
  salaryRange: [number, number];
  experienceLevel: string[];
  keyword: string;
}

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid Level",
  "Senior",
  "Lead",
  "Manager",
];

const LOCATIONS = [
  "Addis Ababa",
  "Remote",
  "Dire Dawa",
  "Hawassa",
  "Gondar",
  "Mekelle",
  "Adama",
  "Jimma",
  "Bahir Dar",
  "Other",
];

export default function JobsPage() {
  const { user } = useAuth();
  const locale = useLocale();
  const t = useTranslations("jobListing");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const [entityParams, setEntityParams] = useQueryState(
    "job-seeker-jbs",
    parseAsJson(entityParamSchema.parse).withDefault({
      p: 1,
      pp: PER_PAGE,
    })
  );

  const [filters, setFilters] = useState<JobFilters>({
    location: "",
    jobType: [],
    salaryRange: [0, 100000],
    experienceLevel: [],
    keyword: "",
  });

  const [opened, setOpened] = useState(false);

  const handleSearch = useDebouncedCallback((term: string | null) => {
    if (term) {
      setEntityParams({ ...entityParams, p: 1, s: term });
    } else {
      const updatedParams = { ...entityParams };
      updatedParams.s = undefined;
      setEntityParams({ ...updatedParams, p: 1 });
    }
  }, 300);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

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

  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === "salaryRange") {
      return value[0] > 0 || value[1] < 100000;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== "";
  }).length;

  const handleJobTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(value)
        ? prev.jobType.filter((type) => type !== value)
        : [...prev.jobType, value],
    }));
  };

  const handleExperienceLevelChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      experienceLevel: prev.experienceLevel.includes(value)
        ? prev.experienceLevel.filter((level) => level !== value)
        : [...prev.experienceLevel, value],
    }));
  };

  const resetFilters = () => {
    setFilters({
      location: "",
      jobType: [],
      salaryRange: [0, 100000],
      experienceLevel: [],
      keyword: "",
    });
  };

  return (
    <>
      <Container size="xl" py="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper p="md" radius="lg" shadow="sm" className="sticky top-4">
              <Group justify="space-between" align="center" mb="md">
                <Group gap="xs">
                  <IconAdjustments size={20} />
                  <Title order={4} fw={600}>
                    {t("filterLabel")}
                  </Title>
                </Group>
                {activeFilters > 0 && (
                  <Tooltip label="Clear all filters">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={resetFilters}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>

              <ScrollArea h={isMobile ? 400 : 700}>
                <Stack gap="md">
                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      {t("keyword")}
                    </Text>
                    <TextInput
                      value={filters.keyword}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          keyword: e.target.value,
                        })
                      }
                      placeholder="Search jobs..."
                      leftSection={<IconSearch size={16} />}
                      radius="md"
                    />
                  </Box>

                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      {t("location")}
                    </Text>
                    <Select
                      value={filters.location}
                      onChange={(value) =>
                        setFilters({
                          ...filters,
                          location: value || "",
                        })
                      }
                      placeholder="Select location"
                      data={LOCATIONS}
                      leftSection={<IconMapPin size={16} />}
                      radius="md"
                      searchable
                      clearable
                    />
                  </Box>

                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      {t("jobType")}
                    </Text>
                    <Stack gap="xs">
                      {JOB_TYPES.map((type) => (
                        <Checkbox
                          key={type}
                          label={type}
                          checked={filters.jobType.includes(type)}
                          onChange={() => handleJobTypeChange(type)}
                          radius="md"
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Text size="sm" fw={500} mb="xs">
                      {t("experienceLevel")}
                    </Text>
                    <Stack gap="xs">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <Checkbox
                          key={level}
                          label={level}
                          checked={filters.experienceLevel.includes(level)}
                          onChange={() => handleExperienceLevelChange(level)}
                          radius="md"
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500}>
                        {t("salaryRange")}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {filters.salaryRange[0].toLocaleString()} -{" "}
                        {filters.salaryRange[1].toLocaleString()} ETB
                      </Text>
                    </Group>
                    <RangeSlider
                      value={filters.salaryRange}
                      onChange={(value) =>
                        setFilters({
                          ...filters,
                          salaryRange: value as [number, number],
                        })
                      }
                      min={0}
                      max={100000}
                      step={1000}
                      radius="md"
                      marks={[
                        { value: 0, label: "0" },
                        { value: 25000, label: "25K" },
                        { value: 50000, label: "50K" },
                        { value: 75000, label: "75K" },
                        {
                          value: 100000,
                          label: "100K+",
                        },
                      ]}
                    />
                  </Box>
                </Stack>
              </ScrollArea>

              <Button
                variant="filled"
                fullWidth
                mt="md"
                onClick={() => handleSearch(filters.keyword)}
                radius="md"
              >
                Apply Filters
              </Button>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack gap="md">
              <Card className="flex items-center space-between w-full">
                <Title order={2}>{t("jobListings")}</Title>
                <Box className="md:hidden">
                  <Drawer
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title={t("filterJobs")}
                    position="left"
                    size="sm"
                    padding="md"
                  >
                    <Box py="md">
                      <Title order={3} mb="lg">
                        {t("filters")}
                      </Title>
                      <JobFilterSidebar
                        filters={filters}
                        onFilterChange={setFilters}
                        onJobTypeChange={handleJobTypeChange}
                        onExperienceLevelChange={handleExperienceLevelChange}
                        onReset={resetFilters}
                      />
                    </Box>
                  </Drawer>
                  <Button
                    leftSection={<IconFilter size={18} />}
                    onClick={() => setOpened(true)}
                    radius="md"
                    variant="outline"
                    fullWidth
                  >
                    {t("filterJobs")}
                  </Button>
                </Box>
              </Card>

              {activeFilters > 0 && (
                <Group gap="xs" wrap="wrap">
                  {filters.keyword && (
                    <Chip
                      checked
                      variant="light"
                      radius="xl"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          keyword: "",
                        })
                      }
                    >
                      Keyword: {filters.keyword}
                    </Chip>
                  )}
                  {filters.location && (
                    <Chip
                      checked
                      variant="light"
                      radius="xl"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          location: "",
                        })
                      }
                    >
                      Location: {filters.location}
                    </Chip>
                  )}
                  {filters.jobType.length > 0 && (
                    <Chip
                      checked
                      variant="light"
                      radius="xl"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          jobType: [],
                        })
                      }
                    >
                      Job Types: {filters.jobType.length}
                    </Chip>
                  )}
                  {filters.experienceLevel.length > 0 && (
                    <Chip
                      checked
                      variant="light"
                      radius="xl"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          experienceLevel: [],
                        })
                      }
                    >
                      Experience: {filters.experienceLevel.length}
                    </Chip>
                  )}
                  {(filters.salaryRange[0] > 0 ||
                    filters.salaryRange[1] < 100000) && (
                    <Chip
                      checked
                      variant="light"
                      radius="xl"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          salaryRange: [0, 100000],
                        })
                      }
                    >
                      Salary: {filters.salaryRange[0].toLocaleString()} -{" "}
                      {filters.salaryRange[1].toLocaleString()} ETB
                    </Chip>
                  )}
                </Group>
              )}

              <div className="grid grid-cols-1 gap-4">
                {data?.data.map((job) => (
                  <div
                    key={job.id}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {/* Featured badge */}
                    {job.id === "1" && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center">
                          <IconStar size={14} className="mr-1" />
                          Featured
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                            <Avatar
                              size="md"
                              color="purple"
                              radius="md"
                              className="object-contain"
                            >
                              {job.organization?.name.slice(0, 2)}
                            </Avatar>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div>
                              <Text
                                component="h3"
                                size="lg"
                                fw={600}
                                className="text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
                                onClick={() => router.push(`/jobs/${job.id}`)}
                              >
                                {job.title}
                              </Text>
                              <Text
                                size="sm"
                                fw={500}
                                c="dimmed"
                                className="mt-1"
                              >
                                {job.organization?.name}
                              </Text>
                            </div>
                            <div className="mt-2 md:mt-0 text-sm text-gray-500 flex items-center">
                              <IconClock
                                size={16}
                                className="mr-1 text-purple-500"
                              />
                              <Text size="sm">{job.createdAt}</Text>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-y-2">
                            <div className="flex items-center text-sm text-gray-500 mr-4">
                              <IconMapPin
                                size={16}
                                className="mr-1 text-purple-500"
                              />
                              <Text size="sm">Remote</Text>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mr-4">
                              <IconBriefcase
                                size={16}
                                className="mr-1 text-purple-500"
                              />
                              <Text size="sm">{job.type}</Text>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <IconCurrencyDollar
                                size={16}
                                className="mr-1 text-purple-500"
                              />
                              <Text size="sm">
                                {job.salaryFrom.toLocaleString()} -{" "}
                                {job.salaryTo.toLocaleString()} {job.currency}
                              </Text>
                            </div>
                          </div>

                          <Group gap="xs" mt="md">
                            <Badge color="purple" variant="light" radius="sm">
                              {job.experienceLevel || "Any Experience"}
                            </Badge>
                          </Group>

                          <Box mt="md">
                            <TypographyStylesProvider>
                              <Text
                                size="sm"
                                lineClamp={2}
                                className="text-gray-600"
                              >
                                {parse(job.description)}
                              </Text>
                            </TypographyStylesProvider>
                          </Box>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              variant="gradient"
                              gradient={{ from: "primary", to: "blue" }}
                              radius="md"
                              onClick={() => router.push(`/jobs/${job.id}`)}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              color="purple"
                              radius="md"
                            >
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              color="gray"
                              radius="md"
                              leftSection={<IconBookmark size={16} />}
                              className="ml-auto"
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom border with gradient */}
                    <div className="h-1 w-full bg-gradient-to-r from-primary to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                ))}
              </div>

              <EntityPagination
                entity="job-seeker-jbs"
                total={data?.total ?? 0}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

function JobFilterSidebar({
  filters,
  onFilterChange,
  onJobTypeChange,
  onExperienceLevelChange,
  onReset,
}: {
  filters: JobFilters;
  onFilterChange: (filters: JobFilters) => void;
  onJobTypeChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations("jobListing");

  return (
    <ScrollArea h={500} scrollbarSize={6}>
      <Stack gap="lg" p="xs">
        <Paper p="md" radius="md" withBorder>
          <Text size="sm" fw={600} mb="sm" c="blue.7">
            {t("keyword")}
          </Text>
          <TextInput
            value={filters.keyword}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                keyword: e.target.value,
              })
            }
            placeholder="Search jobs..."
            leftSection={<IconSearch size={16} stroke={1.5} />}
            radius="md"
            size="sm"
          />
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Text size="sm" fw={600} mb="sm" c="blue.7">
            {t("location")}
          </Text>
          <Select
            value={filters.location}
            onChange={(value) =>
              onFilterChange({
                ...filters,
                location: value || "",
              })
            }
            placeholder="Select location"
            data={LOCATIONS}
            leftSection={<IconMapPin size={16} stroke={1.5} />}
            radius="md"
            searchable
            clearable
            size="sm"
          />
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Text size="sm" fw={600} mb="sm" c="blue.7">
            {t("jobType")}
          </Text>
          <Group gap="xs" wrap="wrap">
            {JOB_TYPES.map((type) => (
              <Chip
                key={type}
                checked={filters.jobType.includes(type)}
                onChange={() => onJobTypeChange(type)}
                radius="md"
                variant="filled"
                color={filters.jobType.includes(type) ? "blue" : "gray"}
                size="sm"
              >
                {type}
              </Chip>
            ))}
          </Group>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Text size="sm" fw={600} mb="sm" c="blue.7">
            {t("experienceLevel")}
          </Text>
          <Group gap="xs" wrap="wrap">
            {EXPERIENCE_LEVELS.map((level) => (
              <Chip
                key={level}
                checked={filters.experienceLevel.includes(level)}
                onChange={() => onExperienceLevelChange(level)}
                radius="md"
                variant="filled"
                color={
                  filters.experienceLevel.includes(level) ? "blue" : "gray"
                }
                size="sm"
              >
                {level}
              </Chip>
            ))}
          </Group>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between" mb="sm">
            <Text size="sm" fw={600} c="blue.7">
              {t("salaryRange")}
            </Text>
            <Badge radius="sm" color="blue">
              {filters.salaryRange[0].toLocaleString()} -{" "}
              {filters.salaryRange[1].toLocaleString()} ETB
            </Badge>
          </Group>
          <RangeSlider
            value={filters.salaryRange}
            onChange={(value) =>
              onFilterChange({
                ...filters,
                salaryRange: value as [number, number],
              })
            }
            min={0}
            max={100000}
            step={1000}
            radius="md"
            color="blue"
            marks={[
              { value: 0, label: "0" },
              { value: 25000, label: "25K" },
              { value: 50000, label: "50K" },
              { value: 75000, label: "75K" },
              { value: 100000, label: "100K+" },
            ]}
          />
        </Paper>

        <Group mt="md" gap="sm">
          <Button
            variant="filled"
            fullWidth
            onClick={() => onFilterChange(filters)}
            radius="md"
            color="blue"
            leftSection={<IconFilter size={16} />}
          >
            {t("applyFilters")}
          </Button>
          <Button
            variant="light"
            fullWidth
            onClick={onReset}
            radius="md"
            color="gray"
            leftSection={<IconX size={16} />}
          >
            {t("resetFilters")}
          </Button>
        </Group>
      </Stack>
    </ScrollArea>
  );
}
