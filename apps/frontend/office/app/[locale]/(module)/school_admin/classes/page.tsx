"use client";

import {
  ActionIcon,
  Button,
  Center,
  Collapse,
  Divider,
  Group,
  Menu,
  Paper,
  Table,
  Text,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronRight,
  IconDots,
  IconPencil,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useState } from "react";
import { ClassDrawer } from "./create/components/ClassDrawer";
import { ProgramAndCalendarSelector } from "./create/components/programAndCalendar";
import {
  type GetClass,
  fetchClassesApi,
} from "./create/components/schema/fetchClassesDetail";

export default function ClassPage() {
  const [calendarYear, setCalendarYear] = useState<string | null>(null);
  const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);
  const [classes, setClasses] = useState<GetClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<GetClass | null>(null);

  // Fetch classes when calendar year changes
  const fetchClasses = async (calenderId: string) => {
    setClasses([]);
    if (!calenderId) {
      return;
    }
    try {
      setLoadingClasses(true);
      const data = await fetchClassesApi(calenderId);
      setClasses(data);
    } catch (err) {
      //console.error('Failed to fetch classes', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const toggleRow = (id: string) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rows = classes.map((item) => (
    <>
      <Table.Tr key={item.id}>
        {/* Collapse toggle cell */}
        <Table.Td w={40}>
          {item.sections && item.sections.length > 0 ? (
            <ActionIcon variant="subtle" onClick={() => toggleRow(item.id)}>
              {openRows[item.id] ? (
                <IconChevronDown size={18} />
              ) : (
                <IconChevronRight size={18} />
              )}
            </ActionIcon>
          ) : null}
        </Table.Td>

        <Table.Td>{item.name}</Table.Td>
        <Table.Td>{item.root.name}</Table.Td>
        <Table.Td c={item.isActive ? "green" : "red"}>
          {item.isActive ? "Active" : "Inactive"}
        </Table.Td>
        <Table.Td>
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <Button
                variant="light"
                size="xs"
                leftSection={<IconDots size={16} />}
              >
                Actions
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {/* <Menu.Item leftSection={<IconPlus size={16} />}>
                                Add Section
                            </Menu.Item> */}
              <Menu.Item
                leftSection={<IconPencil size={16} />}
                onClick={() => {
                  setDrawerMode("edit");
                  setSelectedClass(item);
                  setDrawerOpened(true);
                }}
              >
                Edit Class
              </Menu.Item>
              <Menu.Item color="red" leftSection={<IconX size={16} />}>
                Inactivate Class
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>

      {/* Sections collapse */}
      {item.sections && item.sections.length > 0 && (
        <Table.Tr>
          <Table.Td colSpan={5} style={{ padding: 0, border: "none" }}>
            <Collapse in={!!openRows[item.id]}>
              <Table withColumnBorders striped highlightOnHover>
                <Table.Tbody>
                  {item.sections?.map((section) => (
                    <Table.Tr key={section.id}>
                      <Table.Td w={40} />
                      <Table.Td>{section.name}</Table.Td>
                      <Table.Td>{item.root.name}</Table.Td>
                      <Table.Td c={section.isActive ? "green" : "red"}>
                        {section.isActive ? "Active" : "Inactive"}
                      </Table.Td>
                      <Table.Td>
                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <Button
                              variant="light"
                              size="xs"
                              leftSection={<IconDots size={16} />}
                            />
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconPencil size={16} />}>
                              Edit Section
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={16} />}
                            >
                              Inactivate Section
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Collapse>
          </Table.Td>
        </Table.Tr>
      )}
    </>
  ));

  return (
    <div>
      <ProgramAndCalendarSelector
        onChange={({ programId, calenderYearId, calenderYearName }) => {
          setProgramId(programId);
          setCalendarYear(calenderYearName);
          setCalendarYearId(calenderYearId);
          fetchClasses(calenderYearId || "");
        }}
      />
      <Paper shadow="xs" p={{ base: "md", sm: "lg" }} radius="md" withBorder>
        <Group
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
          mb="md"
        >
          <Button
            onClick={() => {
              setDrawerMode("create");
              setSelectedClass(null);
              setDrawerOpened(true);
            }}
          >
            + Add Class
          </Button>
          <ClassDrawer
            opened={drawerOpened}
            programId={programId}
            mode={drawerMode}
            calendarId={calendarYearId}
            selectedClass={selectedClass}
            onClose={() => {
              setDrawerOpened(false);
              fetchClasses(calendarYearId || "");
            }}
          />
        </Group>
        {/* <Paper shadow="xs" p={{ base: 'md', sm: 'lg' }} radius="md" withBorder> */}
        <Table withColumnBorders striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40} />
              <Table.Th>Class Name</Table.Th>
              <Table.Th>Root Class</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!calendarYearId ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="xl">
                    <Text ta="center" c="dimmed">
                      Select program to view class&apos;s
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : classes.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Center py="xl">
                    <Text ta="center" c="dimmed">
                      No class found in this program
                    </Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </div>
  );
}
