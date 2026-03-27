'use client';

import { Box, Pagination, Text } from '@mantine/core';
import { PER_PAGE, entityParamSchema } from '@shega/shared';
import { parseAsJson, useQueryState } from 'nuqs';
import { cn } from '../utilities/cn';

type EntityPaginationProps = {
    total: number;
    entity: string;
    perPage?: number;
    hideCounter?: boolean;
    customParam?: string;
    defaultSorting?: any;
};

export function EntityPagination({
    total,
    entity,
    perPage = PER_PAGE,
    hideCounter = false,
    defaultSorting,
}: EntityPaginationProps) {
    const [entityParams, setEntityParams] = useQueryState(
        entity,
        parseAsJson(entityParamSchema.parse).withDefault({}),
    );
    const currentPage = entityParams.p || 1;
    const createPageURL = (pageNumber: number | string) => {
        setEntityParams({
            ...(defaultSorting ?? {}),
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
                'flex items-center mt-6',
                hideCounter ? 'justify-center' : 'justify-between',
            )}
        >
            <Box className="px-2">
                <Text fz="xs">
                    {from} to {to} of {total} results
                </Text>
            </Box>
            {total >= perPage ? (
                <Pagination
                    size={'xs'}
                    total={totalPages}
                    value={currentPage}
                    onChange={createPageURL}
                />
            ) : null}
        </Box>
    );
}
