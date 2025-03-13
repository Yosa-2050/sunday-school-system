"use client";

import { Flex, Text } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { parseAsJson, useQueryState } from "nuqs";
import { entityParamSchema } from "@shega/shared";
import { cn } from "../utilities/cn";

type EntityColumnProps = {
  entity: string;
  field: string;
  label: string;
  className?: string;
};

export function EntityColumn({
  entity,
  field,
  label,
  className,
}: EntityColumnProps) {
  const [entityParams, setEntityParams] = useQueryState(
    entity,
    parseAsJson(entityParamSchema.parse)
  );

  const currentSortField = entityParams?.o?.f; // Field being sorted
  const currentSortDirection = entityParams?.o?.d; // Sort direction (asc or desc)

  const handleSortChange = () => {
    const newSortDirection =
      currentSortField === field && currentSortDirection === "asc"
        ? "desc"
        : "asc";
    setEntityParams({
      ...entityParams,
      o: { f: field, d: newSortDirection }, // Update the sort field and direction
      p: 1, // Reset to the first page when sorting changes
    });
  };

  return (
    <Flex
      align={"center"}
      justify={"space-between"}
      className={cn("cursor-pointer", className)}
      onClick={handleSortChange}
    >
      <Text>{label}</Text>
      {currentSortField === field &&
        (currentSortDirection === "asc" ? (
          <IconSortAscending size={18} className="text-primary bg-primary-2" />
        ) : (
          <IconSortDescending size={18} className="text-primary bg-primary-2" />
        ))}
    </Flex>
  );
}
