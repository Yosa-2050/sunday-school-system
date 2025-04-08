"use client";

import NoData from "@/components/NoData";
import {
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  Modal,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react"; // Importing icons
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
} from "app/[locale]/_api/job-details";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Category {
  id: string;
  isActive: boolean;
  name: string;
  isRoot: boolean;
  hasChild: boolean;
}

const CategoriesPage = () => {
  const t = useTranslations("categoriesPage");
  const queryClient = useQueryClient();
  const [newRegionName, setNewRegionName] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const { data: categories = [], isLoading: loadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addMutation = useMutation({
    mutationFn: () => addCategory({ name: newRegionName, isActive: true }),
    mutationKey: ["regions"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setModalOpened(false);
      setNewRegionName("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(),
    mutationKey: ["deleteCategory"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      setCategoryToDelete(null);
    },
  });

  const handleAddRegion = () => {
    addMutation.mutate();
  };

  const openDeleteModal = (id: string) => {
    setCategoryToDelete(id);
    modals.openConfirmModal({
      title: "Please confirm your action",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => setCategoryToDelete(null),
      onConfirm: () => {
        if (categoryToDelete) {
          deleteMutation.mutate(categoryToDelete);
        }
      },
    });
  };

  if (loadingCategories) {
    return <LoadingOverlay visible={true} h={"100%"} />;
  }

  return (
    <Paper shadow="xs" p="lg" style={{ borderRadius: "10px" }}>
      <Flex align={"center"} justify={"space-between"}>
        <Text className="font-bold text-xl">{t("title")}</Text>
        <Button variant="filled" onClick={() => setModalOpened(true)}>
          {t("addCategory")}
        </Button>
      </Flex>
      <Divider my="md" />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={t("addCategory")}
        centered
      >
        <TextInput
          label={t("categoryName")}
          value={newRegionName}
          onChange={(event) => setNewRegionName(event.currentTarget.value)}
        />
        <Button onClick={handleAddRegion} mt="md">
          {t("submit")}
        </Button>
      </Modal>

      {categories.length === 0 ? (
        <NoData />
      ) : (
        <ScrollArea>
          <Table striped highlightOnHover withRowBorders withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: "left" }}>
                  {t("categoryName")}
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  {t("isActive")}
                </Table.Th>
                <Table.Th style={{ textAlign: "center" }}>
                  {t("actions")}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {categories.map((category) => (
                <Table.Tr key={category.id}>
                  <Table.Td>{category.name}</Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    {category.isActive ? "Yes" : "No"}
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center" }}>
                    <Button
                      variant="light"
                      onClick={() => console.log(`Edit ${category.id}`)}
                    >
                      <IconEdit size={16} />
                    </Button>
                    <Button
                      variant="light"
                      color="red"
                      onClick={() => openDeleteModal(category.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}
    </Paper>
  );
};

export default CategoriesPage;
