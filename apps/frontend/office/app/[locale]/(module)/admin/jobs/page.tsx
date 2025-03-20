"use client";

import { useRouter } from "@/i18n/routing";
import {
  Badge,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableScrollContainer,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  PER_PAGE,
  entityParamSchema,
  entityParamSerializer,
  logger,
} from "@shega/shared";
import { EntityFilter, EntityPagination, EntitySearch } from "@shega/ui";
import { IconDotsVertical, IconDownload, IconEye } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchJobsAdmin } from "app/[locale]/_api/admin/fetch-jobs";
import { exportSelectedJobs } from "app/[locale]/_api/organizations/export-selected-jobs";
import parse from "html-react-parser";
import { useTranslations } from "next-intl";
import { parseAsJson, useQueryState } from "nuqs";
import { useCallback, useState } from "react";

interface Organization {
  id: string;
  name: string;
  isActive: boolean;
}

interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  salaryFrom: number;
  salaryTo: number;
  status: string;
  orgName: string;
  postedBy: {
    employee: {
      profile: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

const JobsList = () => {
  const router = useRouter();
  const t = useTranslations("jobsListPage");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selection, setSelection] = useState<string[]>([]);

  const [entityParams] = useQueryState(
    "jobs",
    parseAsJson(entityParamSchema.parse).withDefault({
      p: 1,
      pp: PER_PAGE,
    })
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", entityParamSerializer(entityParams)],
    queryFn: () => fetchJobsAdmin(entityParamSerializer(entityParams)),
  });
  const exportToCsv = useCallback((list: string[]) => {
    if (!list || list.length === 0) {
      alert("No data available to export");
      return;
    }

    // Convert rows to CSV with proper quoting
    const csvContent = list
      .map((row) =>
        row
          .split(",")
          .map((v) => `"${v.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportMutation = useMutation({
    mutationKey: ["exports"],
    mutationFn: exportSelectedJobs,
    onSuccess: (list) => {
      exportToCsv(list);
    },
    onError: (error) => {
      logger.log(error);
      notifications.show({
        title: "Export Users",
        message: "Something went wrong while exporting selected Organization",
        color: "red",
      });
    },
  });

  const jobs = data?.data || [];

  if (isLoading) {
    return <LoadingOverlay visible={true} h="100vh" />;
  }

  if (error) {
    return <Text color="red">Error loading jobs</Text>;
  }

  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === jobs.length
        ? []
        : jobs.map((user: Job) => user.id ?? "")
    );

  return (
    <Paper shadow="xs" p="lg" style={{ borderRadius: "10px" }}>
      <Flex align="center" justify="space-between" className="p-4">
        <Text className="font-bold text-xl">{t("title")}</Text>
      </Flex>
      <Divider my="md" />

      <Group justify="space-between" className="mb-4">
        <EntitySearch
          entity="jobs"
          placeholder={t("searchPlaceholder")}
          className="!w-[300px]"
        />
        <Group>
          <EntityFilter
            entity="jobs"
            filterOptions={[
              { value: "", label: t("allCategories") },
              { value: "FULL_TIME", label: "Full Time" },
              { value: "PART_TIME", label: "Part Time" },
              { value: "CONTRACT", label: "Contract" },
              { value: "INTERNSHIP", label: "Internship" },
            ]}
            mode="select"
            field="type"
          />
          <Button
            variant="light"
            leftSection={<IconDownload size={18} />}
            disabled={selection?.length === 0}
            onClick={() => exportMutation.mutate(selection)}
            loading={exportMutation.isPending}
          >
            {t("exportCSV")}
          </Button>
        </Group>
      </Group>

      {jobs.length === 0 ? (
        <Center h={200}>
          <Text c="dimmed" ta="center">
            You haven&apos;t posted any jobs yet.
          </Text>
        </Center>
      ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
      isMobile ? (
        <Stack>
          {jobs.map((job: Job) => (
            <Card key={job.id} shadow="sm" p="lg" radius="md" withBorder>
              <Text fw={500}>{job.title}</Text>
              <Stack>
                <div className="job-description">{parse(job.description)}</div>
              </Stack>
              <Text size="sm" c="dimmed">
                {job.type}
              </Text>
              <Text size="sm">
                Salary: ${job.salaryFrom.toLocaleString()} - $
                {job.salaryTo.toLocaleString()}
              </Text>
              <Badge color={job.status === "APPROVED" ? "green" : "yellow"}>
                {job.status}
              </Badge>
              <Text size="xs" c="dimmed">
                Posted by: {job.postedBy.employee.profile.firstName}{" "}
                {job.postedBy.employee.profile.lastName}
              </Text>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableScrollContainer minWidth={800} type="native">
          <Table striped verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === jobs.length}
                    indeterminate={
                      selection.length > 0 && selection.length !== jobs.length
                    }
                  />
                </Table.Th>
                <Table.Th>Company Name</Table.Th>
                <Table.Th>Job Title</Table.Th>
                <Table.Th>Salary</Table.Th>
                <Table.Th>Location</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {jobs.map((job: Job) => (
                <Table.Tr key={job.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selection.includes(job.id ?? "")}
                      onChange={() => toggleRow(job.id ?? "")}
                    />
                  </Table.Td>
                  <Table.Td>{job?.orgName}</Table.Td>
                  <Table.Td>{job.title}</Table.Td>

                  <Table.Td>
                    ${job.salaryFrom.toLocaleString()} - $
                    {job.salaryTo.toLocaleString()}
                  </Table.Td>
                  <Table.Td>{"Location"}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={job.status === "APPROVED" ? "green" : "yellow"}
                    >
                      {job.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Menu width={200}>
                      <Menu.Target>
                        <IconDotsVertical
                          size={18}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </Menu.Target>
                      <Menu.Dropdown>
                        <MenuItem
                          leftSection={<IconEye size={14} />}
                          onClick={() => router.push(`/admin/jobs/${job.id}`)}
                        >
                          Details
                        </MenuItem>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </TableScrollContainer>
      )}

      <EntityPagination entity="jobs" total={data?.total ?? 0} />
    </Paper>
  );
};

export default JobsList;
