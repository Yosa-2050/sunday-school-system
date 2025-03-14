"use client";

import NoData from "@/components/NoData";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Paper,
  Stack,
  Table,
  TableScrollContainer,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconDotsVertical, IconDownload } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  type Daum,
  fetchOrganizations,
} from "app/[locale]/_api/organizations/fetch-organizations";
import { DateTime } from "luxon";
import { useTranslations } from "next-intl";
import { parseAsJson, useQueryState } from "nuqs";
import { useState } from "react";
import { CreateOrganization } from "./_components/create-organization";
import { EntityColumn, EntityPagination, EntitySearch } from "@shega/ui";
import {
  entityParamSchema,
  entityParamSerializer,
  PER_PAGE,
} from "@shega/shared";

const OrganizationsPage = () => {
  const t = useTranslations("organizationsPage");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [entityParams] = useQueryState(
    "organizations",
    parseAsJson(entityParamSchema.parse).withDefault({
      p: 1,
      pp: PER_PAGE,
      o: [{ f: "createdAt", d: "desc" }],
    })
  );
  const [selection, setSelection] = useState<string[]>([]);
  // Fetch users using TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["organizations", entityParamSerializer(entityParams)],
    queryFn: () => fetchOrganizations(entityParamSerializer(entityParams)),
  });

  if (isLoading) {
    return <LoadingOverlay visible={true} h={"100%"} />;
  }

  if (error) {
    return <Text color="red">{t("error")}</Text>;
  }

  const organizations = data?.data ?? [];

  const toggleRow = (email: string) =>
    setSelection((current) =>
      current.includes(email)
        ? current.filter((item) => item !== email)
        : [...current, email]
    );

  const toggleAll = () =>
    setSelection((current) =>
      current.length === organizations.length
        ? []
        : organizations.map((user: Daum) => user.createdDate ?? "")
    );

  return (
    <Paper shadow="xs" p="lg" style={{ borderRadius: "10px" }}>
      <Flex align="center" justify="space-between" className="p-4">
        <Text className="font-bold text-xl">{t("title")}</Text>
        <CreateOrganization />
      </Flex>

      <Divider my="md" />

      {/* Search, Filter, Sort Controls */}
      <Group justify="space-between" className="mb-4">
        <EntitySearch
          entity="organizations"
          placeholder={t("searchPlaceholder")}
          className="!w-[300px]"
        />
        <Flex gap={"xs"} align={"center"}>
          <Button variant="primary" leftSection={<IconDownload size={18} />}>
            {t("exportCSV")}
          </Button>
        </Flex>
      </Group>

      {/* No Data State */}
      {organizations.length === 0 ? (
        <NoData />
      ) : // biome-ignore lint/nursery/noNestedTernary: <explanation>
      isMobile ? (
        <Stack>
          {organizations.map((user: Daum) => (
            <Card
              key={user.createdDate}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
            >
              <Flex justify="space-between" align="center">
                <Text fw={500}>{user.name}</Text>
              </Flex>
              <Divider my="xs" />
              <Text size="xs" c="dimmed">
                {DateTime.fromISO(user.createdDate ?? "").toFormat(
                  "yyyy-MM-dd HH:mm:ss"
                )}
              </Text>
              <Group mt="md">
                <Button variant="light" size="xs">
                  {t("table.edit")}
                </Button>
                <Button variant="light" size="xs" color="red">
                  {t("table.delete")}
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <TableScrollContainer minWidth={800} type="native">
          <Table withRowBorders withColumnBorders striped verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === organizations.length}
                    indeterminate={
                      selection.length > 0 &&
                      selection.length !== organizations.length
                    }
                  />
                </Table.Th>
                <Table.Th>{t("table.name")}</Table.Th>
                <Table.Th>{t("table.createdBy")}</Table.Th>
                <Table.Th>
                  <EntityColumn
                    entity="organizations"
                    field="createdAt"
                    label={t("table.createdAt")}
                  />
                </Table.Th>
                <Table.Th>{t("table.status")}</Table.Th>
                <Table.Th>{t("table.actions")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {organizations.map((user: Daum) => (
                <Table.Tr key={user.createdDate}>
                  <Table.Td>
                    <Checkbox
                      checked={selection.includes(user.createdDate ?? "")}
                      onChange={() => toggleRow(user.createdDate ?? "")}
                    />
                  </Table.Td>
                  <Table.Td>{user.name}</Table.Td>

                  <Table.Td>{user.createdBy}</Table.Td>
                  <Table.Td>
                    {DateTime.fromISO(user.createdDate ?? "").toFormat(
                      "yyyy-MM-dd HH:mm:ss"
                    )}
                  </Table.Td>
                  <Table.Td
                    className={
                      user.isActive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {user.isActive ? t("status.active") : t("status.inactive")}
                  </Table.Td>
                  <Table.Td>
                    <Menu width={200}>
                      <Menu.Target>
                        <IconDotsVertical size={18} />
                      </Menu.Target>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </TableScrollContainer>
      )}

      <EntityPagination entity="organizations" total={data?.total ?? 0} />
    </Paper>
  );
};

export default OrganizationsPage;
