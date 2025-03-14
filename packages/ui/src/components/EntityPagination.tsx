"use client";

import { Box, Pagination } from "@mantine/core";
import { PER_PAGE, entityParamSchema } from "@shega/shared";
import { cn } from "../utilities/cn";
import { parseAsJson, useQueryState } from "nuqs";

type EntityPaginationProps = {
  total: number;
  entity: string;
  perPage?: number;
  hideCounter?: boolean;
  customParam?: string;
};

export function EntityPagination({
  total,
  entity,
  perPage = PER_PAGE,
  hideCounter = false,
}: EntityPaginationProps) {
  const [entityParams, setEntityParams] = useQueryState(
    entity,
    parseAsJson(entityParamSchema.parse).withDefault({
      p: 1,
      pp: perPage,
    })
  );

  const currentPage = entityParams.p || 1;
  const createPageURL = (pageNumber: number | string) => {
    setEntityParams({
      ...entityParams,
      p: Number.parseInt(pageNumber.toString()),
      pp: perPage,
    });
  };

  const totalPages = Math.ceil(total / perPage);
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      className={cn(
        "flex items-center mt-6",
        hideCounter ? "justify-center" : "justify-between"
      )}
    >
      <Box className="px-2">
        {from} to {to} of {total} results
      </Box>
      {total >= perPage ? (
        <Pagination
          size="sm"
          total={totalPages}
          value={currentPage}
          onChange={createPageURL}
        />
      ) : null}
    </Box>
  );
}
